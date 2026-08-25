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
            className="w-full rounded-xl border border-brand-border-gray bg-white px-4 py-3.5 pl-10 text-sm text-brand-dark-gray shadow-card placeholder-brand-light-gray-text focus:border-teal-primary focus:outline-none focus:ring-2 focus:ring-teal-primary/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500 dark:focus:border-teal-medium dark:focus:ring-teal-medium/20"
            aria-label="Search banks"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-light-gray-text"
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
        <p className="text-center text-brand-medium-gray dark:text-zinc-400">
          No banks found matching &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBanks.map((bank) => (
            <Link
              key={bank.slug}
              href={`/bank-routing-numbers/${bank.slug}`}
              className="group card card-hover"
            >
              <h2 className="text-lg font-semibold text-brand-near-black transition-colors group-hover:text-teal-primary dark:text-zinc-100 dark:group-hover:text-teal-medium">
                {bank.name}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-brand-medium-gray dark:text-zinc-400">
                {bank.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-brand-light-gray-text dark:text-zinc-500">
                  {bank.routingNumbers.length} routing number{bank.routingNumbers.length !== 1 ? 's' : ''}
                </span>
                <span className="text-sm font-medium text-teal-primary dark:text-teal-medium">
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
