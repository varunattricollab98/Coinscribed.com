'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Bank } from '@/data/banks'
import { LineIcon } from '@/components/icons/LineIcon'
import { Reveal } from '@/components/motion/Reveal'

interface BankSearchProps {
  banks: Bank[]
}

export function BankSearch({ banks }: BankSearchProps) {
  const [query, setQuery] = useState('')

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      {/* Search Input */}
      <div className="mx-auto mb-10 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search banks by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-hairline bg-surface px-4 py-3.5 pl-10 text-sm text-ink-body placeholder-ink-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-hairline-dark dark:bg-elevated dark:text-ink-inverse dark:placeholder-ink-inverse-muted dark:focus:border-accent-light"
            aria-label="Search banks"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>

      {/* Results */}
      {filteredBanks.length === 0 ? (
        <p className="text-center text-ink-muted dark:text-ink-inverse-muted">
          No banks found matching &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBanks.map((bank, i) => (
            <Reveal key={bank.slug} delay={i * 0.05}>
              <Link
                href={`/bank-routing-numbers/${bank.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 motion-reduce:transform-none dark:border-hairline-dark dark:bg-elevated dark:hover:border-accent-light/40"
              >
                {/* Soft accent glow on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/0 blur-2xl transition-colors duration-300 group-hover:bg-accent/10"
                />
                {/* Gradient icon badge */}
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-sm">
                  <LineIcon name="bank" className="h-6 w-6" />
                </span>
                <h2 className="mt-5 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                  <span className="title-link">{bank.name}</span>
                </h2>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                  {bank.description}
                </p>
                <div className="mt-5 flex items-center justify-between pt-2">
                  <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">
                    {bank.routingNumbers.length} routing number{bank.routingNumbers.length !== 1 ? 's' : ''}
                  </span>
                  <span className="inline-flex items-center gap-1 text-eyebrow font-semibold uppercase text-accent transition-transform duration-150 group-hover:gap-2 dark:text-accent-light">
                    View Details
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
