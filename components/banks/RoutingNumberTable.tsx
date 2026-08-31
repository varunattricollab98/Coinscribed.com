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
            className="w-full rounded-md border border-hairline bg-white px-4 py-2 pl-9 text-sm text-ink-body placeholder-ink-muted focus:border-ink-body focus:outline-none focus:ring-1 focus:ring-ink-body dark:border-hairline-dark dark:bg-elevated dark:text-ink-inverse dark:placeholder-ink-inverse-muted"
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
          className="rounded-md border border-hairline bg-white px-3 py-2 text-sm text-ink-body focus:border-ink-body focus:outline-none focus:ring-1 focus:ring-ink-body dark:border-hairline-dark dark:bg-elevated dark:text-ink-inverse"
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
      <div className="overflow-x-auto rounded-lg border border-hairline dark:border-hairline-dark">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-hairline bg-wash dark:border-hairline-dark dark:bg-elevated">
            <tr>
              <th className="px-4 py-3 font-semibold text-ink dark:text-ink-inverse">
                Routing Number
              </th>
              <th className="px-4 py-3 font-semibold text-ink dark:text-ink-inverse">
                State / Region
              </th>
              <th className="px-4 py-3 font-semibold text-ink dark:text-ink-inverse">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline dark:divide-hairline-dark">
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
                  className="bg-white transition-colors hover:bg-wash dark:bg-graphite dark:hover:bg-wash-dark"
                >
                  <td className="px-4 py-3 font-mono text-ink dark:text-ink-inverse">
                    {rn.number}
                  </td>
                  <td className="px-4 py-3 text-ink-body dark:text-ink-inverse-body">
                    {rn.state}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-eyebrow font-semibold uppercase text-ink-muted dark:text-ink-inverse-muted"
                    >
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
