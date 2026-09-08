'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import type { SearchItem } from '@/app/api/search/route'

/**
 * Site-wide search modal.
 *
 * Opens from the header search button (and Cmd/Ctrl+K). Fetches the search
 * index from /api/search once (cached), then filters client-side as the user
 * types across article titles, calculators and bank routing pages — a core
 * navigation/engagement feature every major finance site has. Keyboard
 * accessible (Esc closes, arrow/enter could be added later) and closes on
 * navigation.
 */
export function SearchModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<SearchItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load the index the first time the modal opens.
  useEffect(() => {
    if (!open || items !== null) return
    setLoading(true)
    fetch('/api/search')
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems(Array.isArray(d?.items) ? d.items : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [open, items])

  // Focus the input and lock body scroll while open; Esc closes.
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const results = useMemo(() => {
    if (!items) return []
    const q = query.trim().toLowerCase()
    if (!q) return items.slice(0, 8) // show a few suggestions before typing
    const scored = items
      .map((it) => {
        const title = it.title.toLowerCase()
        const desc = (it.description ?? '').toLowerCase()
        let score = 0
        if (title.includes(q)) score += title.startsWith(q) ? 3 : 2
        if (desc.includes(q)) score += 1
        return { it, score }
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
    return scored.map((s) => s.it)
  }, [items, query])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm dark:bg-black/60"
      />
      {/* Panel */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-sm border border-hairline bg-surface shadow-lift dark:border-hairline-dark dark:bg-elevated">
        <div className="flex items-center gap-3 border-b border-hairline px-4 py-3 dark:border-hairline-dark">
          <span aria-hidden="true" className="text-ink-muted dark:text-ink-inverse-muted">
            {/* magnifier */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, calculators, banks…"
            className="w-full bg-transparent text-ink outline-none placeholder:text-ink-muted dark:text-ink-inverse dark:placeholder:text-ink-inverse-muted"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-caption font-semibold text-ink-muted hover:text-accent dark:text-ink-inverse-muted dark:hover:text-accent-light"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <p className="px-4 py-6 text-sm text-ink-muted dark:text-ink-inverse-muted">
              Loading…
            </p>
          )}
          {!loading && results.length === 0 && (
            <p className="px-4 py-6 text-sm text-ink-muted dark:text-ink-inverse-muted">
              {query.trim() ? 'No results found.' : 'Start typing to search.'}
            </p>
          )}
          {!loading &&
            results.map((r) => (
              <Link
                key={`${r.type}-${r.href}`}
                href={r.href}
                onClick={onClose}
                className="flex items-start gap-3 border-b border-hairline px-4 py-3 last:border-0 hover:bg-wash dark:border-hairline-dark dark:hover:bg-wash-dark"
              >
                <span className="mt-0.5 shrink-0 rounded-sm bg-wash px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted dark:bg-graphite dark:text-ink-inverse-muted">
                  {r.type}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink dark:text-ink-inverse">
                    {r.title}
                  </span>
                  {r.description && (
                    <span className="mt-0.5 line-clamp-1 block text-caption text-ink-muted dark:text-ink-inverse-muted">
                      {r.description}
                    </span>
                  )}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
