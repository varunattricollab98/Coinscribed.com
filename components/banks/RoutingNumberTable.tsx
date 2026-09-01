'use client'

import { useState } from 'react'
import type { RoutingNumber } from '@/data/banks'

interface RoutingNumberTableProps {
  routingNumbers: RoutingNumber[]
}

export function RoutingNumberTable({ routingNumbers }: RoutingNumberTableProps) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredNumbers = routingNumbers.filter((rn) => {
    const matchesQuery =
      rn.number.includes(query) ||
      rn.state.toLowerCase().includes(query.toLowerCase())
    const matchesType = typeFilter === 'all' || rn.type === typeFilter
    return matchesQuery && matchesType
  })

  const types = Array.from(new Set(routingNumbers.map((rn) => rn.type)))

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by number or state..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-hairline bg-surface px-4 py-2.5 pl-9 text-sm text-ink-body placeholder-ink-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-hairline-dark dark:bg-elevated dark:text-ink-inverse dark:placeholder-ink-inverse-muted dark:focus:border-accent-light"
            aria-label="Filter routing numbers"
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
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-hairline bg-surface px-3 py-2.5 text-sm text-ink-body transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-hairline-dark dark:bg-elevated dark:text-ink-inverse dark:focus:border-accent-light"
          aria-label="Filter by type"
        >
          <option value="all">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-hairline bg-surface dark:border-hairline-dark dark:bg-elevated">
        <table className="data-table">
          <thead>
            <tr>
              <th>Routing Number</th>
              <th>State / Region</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredNumbers.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-ink-muted dark:text-ink-inverse-muted"
                >
                  No routing numbers found matching your search.
                </td>
              </tr>
            ) : (
              filteredNumbers.map((rn, index) => (
                <tr
                  key={`${rn.number}-${rn.state}-${rn.type}-${index}`}
                  className="transition-colors hover:bg-wash dark:hover:bg-wash-dark"
                >
                  <td className="font-mono tabular-nums text-ink dark:text-ink-inverse">
                    {rn.number}
                  </td>
                  <td className="text-ink-body dark:text-ink-inverse-body">
                    {rn.state}
                  </td>
                  <td>
                    <span className="text-eyebrow font-semibold uppercase text-ink-muted dark:text-ink-inverse-muted">
                      {rn.type.charAt(0).toUpperCase() + rn.type.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Result count */}
      <p className="mt-3 text-xs text-ink-muted dark:text-ink-inverse-muted">
        Showing {filteredNumbers.length} of {routingNumbers.length} routing
        number{routingNumbers.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
