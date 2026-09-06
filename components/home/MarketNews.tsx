'use client'

import { useEffect, useState } from 'react'

// Live US market news headlines for the homepage.
//
// Data flows through our own `/api/market-news` route (server-side proxy to
// Finnhub when a key is set, else Yahoo Finance RSS — see the route for the
// strategy) so there is no browser CORS problem and all visitors share one
// cached upstream call. We refresh every 5 minutes. Until the first response
// arrives we show a lightweight skeleton; if the feed is empty or errors we
// show a graceful message rather than an empty box.

interface NewsItem {
  id: string
  title: string
  url: string
  source: string
  publishedAt: number | null
  image?: string
  summary?: string
}

/** "3h ago" / "just now" style relative time from a ms timestamp. */
function timeAgo(ms: number | null): string {
  if (!ms) return ''
  const diff = Date.now() - ms
  if (diff < 0) return 'just now'
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

type LoadState = 'loading' | 'ready' | 'empty'

export function MarketNews() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const res = await fetch('/api/market-news', { cache: 'no-store' })
        if (!res.ok) throw new Error(String(res.status))
        const data = await res.json()
        if (!active) return
        const next: NewsItem[] = Array.isArray(data?.items) ? data.items : []
        setItems(next)
        setState(next.length > 0 ? 'ready' : 'empty')
      } catch {
        if (!active) return
        // Keep any previously loaded items; only show "empty" if we have none.
        setItems((prev) => {
          setState(prev.length > 0 ? 'ready' : 'empty')
          return prev
        })
      }
    }

    load()
    const interval = setInterval(load, 300000) // 5 min
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  if (state === 'loading') {
    return (
      <div className="rule-grid grid-cols-1 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 px-5 py-4">
            <div className="h-3 w-20 animate-pulse rounded bg-ink/10 dark:bg-ink-inverse/10" />
            <div className="h-4 w-full animate-pulse rounded bg-ink/10 dark:bg-ink-inverse/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-ink/10 dark:bg-ink-inverse/10" />
          </div>
        ))}
      </div>
    )
  }

  if (state === 'empty') {
    return (
      <p className="px-5 py-8 text-center text-sm text-ink-muted dark:text-ink-inverse-muted">
        Live market headlines are taking a moment to load. Please check back
        shortly.
      </p>
    )
  }

  return (
    <div>
      <div className="rule-grid grid-cols-1 md:grid-cols-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group flex flex-col gap-1.5 px-5 py-4 transition-colors hover:bg-wash dark:hover:bg-wash-dark"
          >
            <span className="flex items-center gap-2 text-eyebrow font-semibold uppercase text-ink-muted dark:text-ink-inverse-muted">
              <span className="text-accent dark:text-accent-light">
                {item.source}
              </span>
              {item.publishedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{timeAgo(item.publishedAt)}</span>
                </>
              )}
            </span>
            <span className="font-serif text-base font-semibold leading-snug text-ink transition-colors group-hover:text-accent dark:text-ink-inverse dark:group-hover:text-accent-light">
              {item.title}
            </span>
          </a>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-2 px-5 text-caption text-ink-muted dark:text-ink-inverse-muted">
        <span className="inline-flex items-center gap-1.5 font-semibold uppercase text-up dark:text-up-light">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-up dark:bg-up-light" />
          Live
        </span>
        US market headlines, refreshed every few minutes. Links open on the
        publisher&apos;s site.
      </p>
    </div>
  )
}
