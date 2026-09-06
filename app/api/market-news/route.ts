import { NextResponse } from 'next/server'

/**
 * Server-side proxy for live US market news headlines.
 *
 * Why a server route: news providers either require an API key that must stay
 * server-only, or (for RSS) return XML the browser can't fetch cross-origin.
 * Fetching here means one shared, cached upstream call for all visitors and no
 * key ever reaches the client.
 *
 * SOURCE STRATEGY (resilient, zero-config to start):
 *   1. If FINNHUB_API_KEY is set, use Finnhub's `/news?category=general`
 *      endpoint — clean JSON, US market coverage, generous free tier, and a
 *      reliable long-term provider.
 *   2. Otherwise fall back to Yahoo Finance's public RSS headlines, which need
 *      no key at all — so the site shows live news out of the box and simply
 *      gets richer once a key is added (set FINNHUB_API_KEY in the environment).
 *
 * Revalidated every 5 minutes: news does not need second-by-second freshness,
 * and this keeps us far inside any provider rate limit while serving a shared
 * cached payload.
 */

export const revalidate = 300

export interface NewsItem {
  id: string
  title: string
  url: string
  source: string
  /** Unix ms timestamp of publication, when known. */
  publishedAt: number | null
  /** Optional thumbnail URL. */
  image?: string
  /** Optional short summary. */
  summary?: string
}

const FINNHUB_ENDPOINT = 'https://finnhub.io/api/v1/news?category=general'

// Key-less RSS fallbacks, tried in order. Both are public US market-news feeds
// that need no API key. (Yahoo's `/rss/2.0/headline` endpoint requires a ticker
// symbol, so we use the general market feeds below instead.)
const RSS_FEEDS: { url: string; source: string }[] = [
  {
    url: 'https://finance.yahoo.com/news/rssindex',
    source: 'Yahoo Finance',
  },
  {
    // CNBC "Markets" feed.
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=20910258',
    source: 'CNBC',
  },
]

const MAX_ITEMS = 12

/** Fetch + normalize from Finnhub (used when an API key is configured). */
async function fromFinnhub(key: string): Promise<NewsItem[]> {
  const res = await fetch(`${FINNHUB_ENDPOINT}&token=${encodeURIComponent(key)}`, {
    next: { revalidate },
  })
  if (!res.ok) throw new Error(`Finnhub ${res.status}`)
  const data = (await res.json()) as Array<{
    id?: number
    headline?: string
    url?: string
    source?: string
    datetime?: number
    image?: string
    summary?: string
  }>
  if (!Array.isArray(data)) throw new Error('Finnhub: unexpected shape')

  return data
    .filter((d) => d.headline && d.url)
    .slice(0, MAX_ITEMS)
    .map((d, i) => ({
      id: String(d.id ?? `${d.url}-${i}`),
      title: d.headline!.trim(),
      url: d.url!,
      source: (d.source ?? 'Finnhub').trim(),
      // Finnhub datetime is in SECONDS.
      publishedAt: typeof d.datetime === 'number' ? d.datetime * 1000 : null,
      image: d.image || undefined,
      summary: d.summary?.trim() || undefined,
    }))
}

/** Minimal, dependency-free RSS <item> extractor. */
function fromRss(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = []
  const itemBlocks = xml.split(/<item>/i).slice(1)

  const decode = (s: string) =>
    s
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]+>/g, '') // strip any nested HTML tags (e.g. in descriptions)
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .trim()

  const pick = (block: string, tag: string): string | null => {
    const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
    const m = block.match(re)
    return m ? decode(m[1]) : null
  }

  for (const block of itemBlocks) {
    const title = pick(block, 'title')
    const link = pick(block, 'link')
    if (!title || !link) continue
    const pubDate = pick(block, 'pubDate')
    const parsed = pubDate ? Date.parse(pubDate) : NaN
    // Some feeds attach a thumbnail via <media:content url="..."> or <enclosure>.
    const media =
      block.match(/<media:content[^>]*url="([^"]+)"/i) ||
      block.match(/<enclosure[^>]*url="([^"]+)"/i)
    items.push({
      id: link,
      title,
      url: link,
      source,
      publishedAt: Number.isNaN(parsed) ? null : parsed,
      image: media?.[1],
      summary: pick(block, 'description') || undefined,
    })
    if (items.length >= MAX_ITEMS) break
  }
  return items
}

/**
 * Fetch the key-less RSS fallbacks in order and return the first feed that
 * yields items. Each feed is independently guarded so one being down does not
 * block the next.
 */
async function fromRssFeeds(): Promise<{ items: NewsItem[]; source: string }> {
  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Coinscribed/1.0)' },
        next: { revalidate },
      })
      if (!res.ok) continue
      const xml = await res.text()
      const items = fromRss(xml, feed.source)
      if (items.length > 0) return { items, source: feed.source }
    } catch {
      // Try the next feed.
    }
  }
  return { items: [], source: 'none' }
}

export async function GET() {
  const key = process.env.FINNHUB_API_KEY
  let items: NewsItem[] = []
  let source = 'none'

  // 1) Preferred: Finnhub, when a key is configured.
  if (key) {
    try {
      items = await fromFinnhub(key)
      if (items.length > 0) source = 'finnhub'
    } catch {
      // fall through to RSS
    }
  }

  // 2) Fallback: key-less RSS feeds (also used if Finnhub returned nothing).
  if (items.length === 0) {
    const rss = await fromRssFeeds()
    items = rss.items
    source = rss.source
  }

  return NextResponse.json(
    { items, source },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  )
}
