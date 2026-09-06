'use client'

import { useEffect, useState } from 'react'

// Live market-news HEADLINE TICKER for the homepage.
//
// A single, compact auto-scrolling strip of the latest market headlines
// (marquee style, like the crypto price ticker). Deliberately NON-CLICKABLE:
// headlines are shown as a live "what's moving the market right now" signal,
// but we do NOT link out to the publisher — keeping readers on the site rather
// than sending traffic away. Data flows through our own `/api/market-news`
// route (server-side proxy, cached) so there is no browser CORS problem and all
// visitors share one cached upstream call. Refreshes every 5 minutes.

interface NewsItem {
  id: string
  title: string
  source: string
  publishedAt: number | null
}

// Static seed shown on first paint / if the feed is briefly unavailable, so the
// strip never renders empty. Replaced the moment live headlines load.
const FALLBACK: NewsItem[] = [
  { id: 'f1', title: 'Wall Street opens higher as investors weigh rate outlook', source: 'Markets', publishedAt: null },
  { id: 'f2', title: 'Treasury yields ease ahead of key inflation data', source: 'Markets', publishedAt: null },
  { id: 'f3', title: 'Tech shares lead gains as megacaps rally', source: 'Markets', publishedAt: null },
  { id: 'f4', title: 'Gold holds near record as investors seek safety', source: 'Markets', publishedAt: null },
  { id: 'f5', title: 'Oil steadies as traders track global supply', source: 'Markets', publishedAt: null },
  { id: 'f6', title: 'Dollar edges lower against major currencies', source: 'Markets', publishedAt: null },
]

export function MarketNews() {
  const [items, setItems] = useState<NewsItem[]>(FALLBACK)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const res = await fetch('/api/market-news', { cache: 'no-store' })
        if (!res.ok) return // keep last good / fallback
        const data = await res.json()
        if (!active) return
        const next: NewsItem[] = Array.isArray(data?.items)
          ? data.items
              .filter((i: unknown) => {
                const it = i as { title?: unknown }
                return typeof it?.title === 'string' && it.title.length > 0
              })
              .map((i: { id?: string; title: string; source?: string; publishedAt?: number | null }) => ({
                id: i.id ?? i.title,
                title: i.title,
                source: i.source ?? 'Markets',
                publishedAt: typeof i.publishedAt === 'number' ? i.publishedAt : null,
              }))
          : []
        if (next.length > 0) setItems(next)
      } catch {
        // Network/parse error: keep last good / fallback data.
      }
    }

    load()
    const interval = setInterval(load, 300000) // 5 min
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const renderItem = (item: NewsItem, i: number) => (
    <div
      key={`${item.id}-${i}`}
      className="flex items-center gap-2.5 border-r border-white/10 px-6 py-3 text-[15px]"
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-light"
      />
      <span className="font-medium text-zinc-100">{item.title}</span>
    </div>
  )

  return (
    <div className="relative flex w-full items-stretch overflow-hidden rounded-sm border border-hairline bg-gradient-to-r from-ink via-[#1a1a1d] to-ink dark:border-hairline-dark">
      {/* Fixed label on the left; always visible, does not scroll away. */}
      <div className="z-10 flex shrink-0 items-center gap-2 border-r border-white/15 bg-oxblood px-4 dark:bg-oxblood-light">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" aria-hidden="true" />
        <span className="text-eyebrow font-bold uppercase tracking-wider text-white">
          Markets
        </span>
      </div>

      <div className="group flex flex-1 items-center overflow-hidden whitespace-nowrap">
        <div className="flex min-w-full shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {/* Real list, read by assistive tech. */}
          <div className="flex items-center">
            {items.map((item, i) => renderItem(item, i))}
          </div>
          {/* Duplicate list so the marquee loops seamlessly (animation shifts
              -50%). Hidden from assistive tech so headlines are not read twice. */}
          <div className="flex items-center" aria-hidden="true">
            {items.map((item, i) => renderItem(item, i))}
          </div>
        </div>
      </div>

      {/* Soft fade on the right edge so headlines dissolve rather than getting
          chopped mid-word as they scroll off. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent"
      />
    </div>
  )
}
