'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Bank } from '@/data/banks'

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
            className="w-full border border-hairline bg-white px-4 py-3.5 pl-10 text-sm text-ink-body placeholder-ink-muted focus:border-oxblood focus:outline-none focus:ring-1 focus:ring-oxblood dark:border-hairline-dark dark:bg-elevated dark:text-ink-inverse dark:placeholder-ink-inverse-muted dark:focus:border-oxblood-light dark:focus:ring-oxblood-light"
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
        <div className="rule-grid sm:grid-cols-2 lg:grid-cols-3">
          {filteredBanks.map((bank) => (
            <Link
              key={bank.slug}
              href={`/bank-routing-numbers/${bank.slug}`}
              className="group rule-cell-hover flex flex-col px-5 py-6 sm:px-6"
            >
              <h2 className="font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                <span className="title-link">{bank.name}</span>
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                {bank.description}
              </p>
              <div className="mt-4 flex items-center justify-between pt-2">
                <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">
                  {bank.routingNumbers.length} routing number{bank.routingNumbers.length !== 1 ? 's' : ''}
                </span>
                <span className="eyebrow-accent">
                  View Details &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
