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
            className="w-full rounded-md border border-brand-border-gray bg-white px-4 py-2 pl-9 text-sm text-brand-dark-gray placeholder-brand-light-gray-text focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500"
            aria-label="Filter routing numbers"
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
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm text-brand-dark-gray focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
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
      <div className="overflow-x-auto rounded-lg border border-brand-border-gray dark:border-zinc-700">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-border-gray bg-brand-off-white dark:border-zinc-700 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-brand-near-black dark:text-zinc-200">
                Routing Number
              </th>
              <th className="px-4 py-3 font-semibold text-brand-near-black dark:text-zinc-200">
                State / Region
              </th>
              <th className="px-4 py-3 font-semibold text-brand-near-black dark:text-zinc-200">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border-gray dark:divide-zinc-700">
            {filteredNumbers.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-brand-medium-gray dark:text-zinc-400"
                >
                  No routing numbers found matching your search.
                </td>
              </tr>
            ) : (
              filteredNumbers.map((rn, index) => (
                <tr
                  key={`${rn.number}-${rn.state}-${rn.type}-${index}`}
                  className="bg-white transition-colors hover:bg-brand-off-white dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <td className="px-4 py-3 font-mono text-brand-near-black dark:text-zinc-200">
                    {rn.number}
                  </td>
                  <td className="px-4 py-3 text-brand-dark-gray dark:text-zinc-300">
                    {rn.state}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        rn.type === 'wire'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                          : rn.type === 'electronic'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                      }`}
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
      <p className="mt-3 text-xs text-brand-light-gray-text dark:text-zinc-500">
        Showing {filteredNumbers.length} of {routingNumbers.length} routing
        number{routingNumbers.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
