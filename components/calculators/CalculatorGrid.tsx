'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Reveal } from '@/components/motion/Reveal'
import { LineIcon } from '@/components/icons/LineIcon'
import type { CalculatorInfo } from '@/data/calculators'

/**
 * Calculators hub grid with an instant search/filter box.
 *
 * With 13+ calculators, a quick filter lets visitors jump straight to the tool
 * they want (e.g. type "credit", "roth", "auto") instead of scanning the whole
 * grid. Filters client-side across title + description; shows a friendly empty
 * state when nothing matches.
 */
export function CalculatorGrid({ calculators }: { calculators: CalculatorInfo[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return calculators
    return calculators.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    )
  }, [calculators, query])

  return (
    <>
      {/* Search / filter box */}
      <div className="relative mb-8 max-w-md">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-inverse-muted"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calculators…"
          aria-label="Search calculators"
          className="w-full rounded-sm border border-hairline bg-surface py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent/50 dark:border-hairline-dark dark:bg-elevated dark:text-ink-inverse dark:placeholder:text-ink-inverse-muted dark:focus:border-accent-light/50"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-caption font-semibold text-ink-muted hover:text-accent dark:text-ink-inverse-muted dark:hover:text-accent-light"
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-sm border border-dashed border-hairline px-6 py-12 text-center dark:border-hairline-dark">
          <p className="text-ink-body dark:text-ink-inverse-body">
            No calculators match &ldquo;{query}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((calc, i) => (
            <Reveal key={calc.href} delay={Math.min(i, 6) * 0.05}>
              <Link
                href={calc.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 motion-reduce:transform-none dark:border-hairline-dark dark:bg-elevated dark:hover:border-accent-light/40"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/0 blur-2xl transition-colors duration-300 group-hover:bg-accent/10"
                />
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-sm">
                  <LineIcon name={calc.icon} className="h-6 w-6" />
                </span>
                <h2 className="mt-5 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                  <span className="title-link">{calc.title}</span>
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                  {calc.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-eyebrow font-semibold uppercase text-accent transition-transform duration-150 group-hover:gap-2 dark:text-accent-light">
                  Open Calculator
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </>
  )
}
