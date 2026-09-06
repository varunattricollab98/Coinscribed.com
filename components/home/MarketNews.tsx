'use client'

import { useEffect, useState } from 'react'

// Live market-news HEADLINE TICKER for the homepage.
//
// A single, compact auto-scrolling strip of the latest market headlines
// (marquee style). Deliberately NON-CLICKABLE: headlines are shown as a live
// "what's moving the market right now" signal, but we do NOT link out to the
// publisher — keeping readers on the site rather than sending traffic away.
// Data flows through our own `/api/market-news` route (server-side proxy,
// cached) so there is no browser CORS problem and all visitors share one cached
// upstream call. Refreshes every 5 minutes.
//
// Motion: uses the slower `animate-marquee-slow` (110s) so headlines glide by
// at a calm, readable pace, and pauses on hover so a reader can catch one.

interface NewsItem {
  id: string
  title: string
  source: string
  publishedAt: number | null
}

// Static seed shown on first paint / if the feed is briefly unavailable, so the
// strip never renders empty. Replaced the moment live headlines load.
const FALLBACK: NewsItem[] = [
  { id: 'f1', title: 'Wall Street opens higher as investors weigh the rate outlook', source: 'Markets', publishedAt: null },
  { id: 'f2', title: 'Treasury yields ease ahead of key inflation data', source: 'Markets', publishedAt: null },
  { id: 'f3', title: 'Tech shares lead gains as megacaps rally', source: 'Markets', publishedAt: null },
  { id: 'f4', title: 'Gold holds near record as investors seek safety', source: 'Markets', publishedAt: null },
  { id: 'f5', title: 'Oil steadies as traders track global supply', source: 'Markets', publishedAt: null },
  { id: 'f6', title: 'Dollar edges lower against major currencies', source: 'Markets', publishedAt: null },
]

/** "3h" / "just now" compact relative time from a ms timestamp. */
function timeAgo(ms: number | null): string {
  if (!ms) return ''
  const diff = Date.now() - ms
  if (diff < 0) return 'now'
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

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

  const renderItem = (item: NewsItem, i: number) => {
    const ago = timeAgo(item.publishedAt)
    return (
      <div
        key={`${item.id}-${i}`}
        className="flex items-center gap-3 px-7 py-3.5"
      >
        {/* Glowing pulse dot — techy "live data" cue. */}
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-light/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-light" />
        </span>
        {/* Optional recency tag in a monospace pill. */}
        {ago && (
          <span className="shrink-0 rounded-sm bg-white/10 px-1.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            {ago}
          </span>
        )}
        <span className="text-[15px] font-medium text-zinc-100">
          {item.title}
        </span>
        {/* Subtle divider dot between items. */}
        <span aria-hidden="true" className="ml-4 text-white/20">
          /
        </span>
      </div>
    )
  }

  return (
    <div className="group relative flex w-full items-stretch overflow-hidden rounded-md border border-white/10 bg-[#0b0b0d] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.5)] dark:border-white/10">
      {/* Fixed "LIVE" label on the left; always visible, does not scroll. */}
      <div className="z-10 flex shrink-0 items-center gap-2 border-r border-white/10 bg-gradient-to-r from-oxblood to-oxblood-light px-4">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          Live
        </span>
      </div>

      <div className="flex flex-1 items-center overflow-hidden whitespace-nowrap">
        {/* Slower, smoother marquee; pauses on hover so a reader can catch a
            headline; respects reduced-motion. */}
        <div className="flex min-w-full shrink-0 animate-marquee-slow items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {/* Real list, read by assistive tech. */}
          <div className="flex items-center">
            {items.map((item, i) => renderItem(item, i))}
          </div>
          {/* Duplicate list so the marquee loops seamlessly (shifts -50%).
              Hidden from assistive tech so headlines are not read twice. */}
          <div className="flex items-center" aria-hidden="true">
            {items.map((item, i) => renderItem(item, i))}
          </div>
        </div>
      </div>

      {/* Soft fades on BOTH edges so headlines dissolve in/out rather than
          getting chopped mid-word as they scroll. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[92px] w-12 bg-gradient-to-r from-[#0b0b0d] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0b0b0d] to-transparent"
      />
    </div>
  )
}
