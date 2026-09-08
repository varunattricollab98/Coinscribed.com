'use client'

import { useEffect, useState } from 'react'
import type { TocHeading } from '@/lib/article-toc'

/**
 * In-article Table of Contents with jump links.
 *
 * Improves long-read UX (readers can skim/jump), boosts dwell time, and can
 * earn Google "jump to" sitelinks. On mobile it's a collapsible panel; on
 * desktop it renders inline above the body (kept simple and reliable rather
 * than a sticky sidebar, which the single-column prose layout doesn't leave
 * room for). Highlights the section currently in view.
 *
 * Only renders when there are at least 3 headings — short articles don't need a
 * contents list.
 */
export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (headings.length === 0) return
    // Highlight the heading nearest the top of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    )
    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 3) return null

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 rounded-sm border border-hairline bg-wash/60 dark:border-hairline-dark dark:bg-elevated/60"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
      >
        <span className="eyebrow-royal">On this page</span>
        {/* Chevron: hidden on desktop (list always shown), toggles on mobile. */}
        <span
          aria-hidden="true"
          className={`text-ink-muted transition-transform duration-200 dark:text-ink-inverse-muted md:hidden ${
            open ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>
      <ul
        className={`flex-col gap-1 px-5 pb-4 ${open ? 'flex' : 'hidden'} md:flex`}
      >
        {headings.map((h) => {
          const active = activeId === h.id
          return (
            <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
              <a
                href={`#${h.id}`}
                onClick={() => setOpen(false)}
                className={`block py-1 text-sm leading-snug transition-colors ${
                  active
                    ? 'font-semibold text-accent dark:text-accent-light'
                    : 'text-ink-body hover:text-accent dark:text-ink-inverse-body dark:hover:text-accent-light'
                }`}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
