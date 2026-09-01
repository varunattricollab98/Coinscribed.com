'use client'

import { useEffect, useRef, useState } from 'react'
import type { RoutingNumber } from '@/data/banks'

interface RoutingNumberTableProps {
  routingNumbers: RoutingNumber[]
  /** Used in the expanded detail copy so guidance names the institution. */
  bankName: string
}

/**
 * What each routing-number type is actually for.
 *
 * Someone reading this table is usually mid-transfer and the wrong type is a
 * real failure mode — a wire sent on a paper/ACH number gets rejected or
 * delayed. So the guidance is specific about when each one applies rather than
 * just restating the label.
 */
const TYPE_GUIDANCE: Record<
  RoutingNumber['type'],
  { title: string; useFor: string[]; note: string }
> = {
  paper: {
    title: 'Paper / check routing number',
    useFor: [
      'Printed on the bottom-left of a paper check',
      'Ordering new cheque books',
      'Some older ACH and cheque-clearing systems',
    ],
    note: 'This is the number pre-printed on your cheques. Many banks use the same number for ACH, but not all — confirm before reusing it for a direct deposit.',
  },
  electronic: {
    title: 'Electronic / ACH routing number',
    useFor: [
      'Direct deposit of pay or benefits',
      'Automatic bill payments and standing debits',
      'Transfers between accounts at different banks',
    ],
    note: 'ACH transfers settle in batches, so they typically take one to three business days rather than arriving the same day.',
  },
  wire: {
    title: 'Wire (Fedwire) routing number',
    useFor: [
      'Domestic wire transfers',
      'Same-day settlement of large or time-critical payments',
      'The domestic leg of an incoming international wire',
    ],
    note: 'Wires are usually same-day and, once sent, generally cannot be reversed. A wire almost always needs a different number from your cheques.',
  },
}

/** Small inline icons. Sized to sit inside a table cell without adding height. */
function CopyIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6a2.5 2.5 0 0 0-2.5 2.5V13" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition-transform duration-200 motion-reduce:transition-none ${
        open ? 'rotate-180' : ''
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function RoutingNumberTable({
  routingNumbers,
  bankName,
}: RoutingNumberTableProps) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // One timer, cleared on unmount, so a copy right before navigating away
  // cannot fire setState on an unmounted component.
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    },
    []
  )

  const filteredNumbers = routingNumbers.filter((rn) => {
    const matchesQuery =
      rn.number.includes(query) ||
      rn.state.toLowerCase().includes(query.toLowerCase())
    const matchesType = typeFilter === 'all' || rn.type === typeFilter
    return matchesQuery && matchesType
  })

  const types = Array.from(new Set(routingNumbers.map((rn) => rn.type)))

  async function copyNumber(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Non-secure contexts and older browsers reject the async clipboard API.
      const field = document.createElement('textarea')
      field.value = value
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      try {
        document.execCommand('copy')
      } catch {
        return // Nothing worked; leave the icon unchanged rather than lying.
      } finally {
        document.body.removeChild(field)
      }
    }

    setCopiedKey(key)
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setCopiedKey(null), 1800)
  }

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
              {/* Actions column: the header is for assistive tech only, since a
                  visible label would compete with the data columns. */}
              <th className="w-px">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredNumbers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-ink-muted dark:text-ink-inverse-muted"
                >
                  No routing numbers found matching your search.
                </td>
              </tr>
            ) : (
              filteredNumbers.map((rn, index) => {
                const key = `${rn.number}-${rn.state}-${rn.type}-${index}`
                const isOpen = expanded === key
                const isCopied = copiedKey === key
                const guidance = TYPE_GUIDANCE[rn.type]
                const panelId = `rn-detail-${index}`
                const label = `${rn.type} routing number ${rn.number} for ${rn.state}`

                return [
                  <tr
                    key={key}
                    className={`transition-colors ${
                      isOpen
                        ? 'bg-wash dark:bg-wash-dark'
                        : 'hover:bg-wash dark:hover:bg-wash-dark'
                    }`}
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
                    {/*
                      Two separate icon buttons rather than a clickable row: a
                      row-wide handler cannot be reached by keyboard and would
                      swallow the copy click. Both are icon-only, so each carries
                      its own accessible name.
                    */}
                    <td className="whitespace-nowrap pl-0 pr-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => copyNumber(key, rn.number)}
                          aria-label={
                            isCopied
                              ? `Copied ${rn.number}`
                              : `Copy ${label}`
                          }
                          title="Copy routing number"
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                            isCopied
                              ? 'border-up/40 text-up dark:border-up-light/40 dark:text-up-light'
                              : 'border-hairline text-ink-muted hover:border-accent/40 hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-muted dark:hover:border-accent-light/40 dark:hover:text-accent-light'
                          }`}
                        >
                          {isCopied ? <CheckIcon /> : <CopyIcon />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : key)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          aria-label={
                            isOpen
                              ? `Hide details for ${label}`
                              : `Show details for ${label}`
                          }
                          title="Show details"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-hairline text-ink-muted transition-colors hover:border-accent/40 hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-muted dark:hover:border-accent-light/40 dark:hover:text-accent-light"
                        >
                          <ChevronIcon open={isOpen} />
                        </button>
                      </div>
                    </td>
                  </tr>,

                  /* Detail row. Rendered only when open — a permanently present
                     but hidden row would still be announced by some screen
                     readers as an empty table row. */
                  isOpen ? (
                    <tr key={`${key}-detail`} className="bg-wash dark:bg-wash-dark">
                      <td colSpan={4} id={panelId} className="px-4 py-5">
                        <p className="text-eyebrow font-semibold uppercase text-accent dark:text-accent-light">
                          {guidance.title}
                        </p>

                        <div className="mt-3 grid gap-5 sm:grid-cols-2">
                          <div>
                            <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
                              Use it for
                            </p>
                            <ul className="mt-2 space-y-1.5">
                              {guidance.useFor.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold dark:bg-gold-light"
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
                              Good to know
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                              {guidance.note}
                            </p>
                            <p className="mt-3 text-caption leading-relaxed text-ink-muted dark:text-ink-inverse-muted">
                              Confirm this number with {bankName} before sending
                              funds — routing numbers vary by where the account
                              was opened.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null,
                ]
              })
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
