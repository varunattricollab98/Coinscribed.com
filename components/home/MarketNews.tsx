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

  // Ensure each marquee copy is wide enough to cover the viewport, otherwise a
  // short list (few live headlines) leaves a visible blank gap and the loop
  // looks like it "stops". Repeat the items until we have a comfortable count.
  const loopItems = (() => {
    if (items.length === 0) return items
    const MIN = 10
    if (items.length >= MIN) return items
    const out: NewsItem[] = []
    let n = 0
    while (out.length < MIN) {
      for (const it of items) {
        out.push({ ...it, id: `${it.id}-r${n}` })
        n++
      }
    }
    return out
  })()

  const renderItem = (item: NewsItem, i: number) => {
    const ago = timeAgo(item.publishedAt)
    return (
      <div
        key={`${item.id}-${i}`}
        className="flex items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-7 sm:py-3.5"
      >
        {/* Glowing pulse dot — techy "live data" cue. */}
        <span className="relative flex h-1.5 w-1.5 shrink-0 sm:h-2 sm:w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-light/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-light sm:h-2 sm:w-2" />
        </span>
        {/* Optional recency tag in a monospace pill. */}
        {ago && (
          <span className="shrink-0 rounded-sm bg-white/10 px-1 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-zinc-400 sm:px-1.5 sm:text-[11px]">
            {ago}
          </span>
        )}
        <span className="text-[12px] font-medium text-zinc-100 sm:text-[15px]">
          {item.title}
        </span>
        {/* Subtle divider dot between items. */}
        <span aria-hidden="true" className="ml-2 text-white/20 sm:ml-4">
          /
        </span>
      </div>
    )
  }

  return (
    <div className="group relative flex w-full items-stretch overflow-hidden rounded-md border border-white/10 bg-[#0b0b0d] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.5)] dark:border-white/10">
      {/* Fixed "LIVE" label on the left; always visible, does not scroll. */}
      <div className="z-10 flex shrink-0 items-center gap-1.5 border-r border-white/10 bg-gradient-to-r from-oxblood to-oxblood-light px-2.5 sm:gap-2 sm:px-4">
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white sm:h-2 sm:w-2" />
        </span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:text-[11px] sm:tracking-[0.18em]">
          Live
        </span>
      </div>

      <div className="flex flex-1 items-center overflow-hidden whitespace-nowrap">
        {/* Slower, smoother marquee; pauses on hover so a reader can catch a
            headline; respects reduced-motion. */}
        <div className="flex min-w-full shrink-0 animate-marquee-slow items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {/* Real list, read by assistive tech. */}
          <div className="flex items-center">
            {loopItems.map((item, i) => renderItem(item, i))}
          </div>
          {/* Duplicate list so the marquee loops seamlessly (shifts -50%).
              Hidden from assistive tech so headlines are not read twice. */}
          <div className="flex items-center" aria-hidden="true">
            {loopItems.map((item, i) => renderItem(item, i))}
          </div>
        </div>
      </div>

      {/* Soft fades on BOTH edges so headlines dissolve in/out rather than
          getting chopped mid-word as they scroll. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[68px] w-8 bg-gradient-to-r from-[#0b0b0d] to-transparent sm:left-[92px] sm:w-12"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0b0b0d] to-transparent sm:w-16"
      />
    </div>
  )
}
