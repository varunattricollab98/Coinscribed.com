'use client'

import { useEffect, useState } from 'react'

// Live market data table for major indices, commodities and rates.
//
// Data flows through our own `/api/market` route (server-side proxy to Yahoo
// Finance, cached ~60s) so there is no browser CORS problem and all visitors
// share one cached upstream call. We refresh every 60s. Any value the API
// returns as null falls back to the realistic static number below, and the
// static values are also what render on the server / first paint, so there is
// no hydration mismatch and the table never blanks out.

interface IndexRow {
  name: string
  symbol: string
  isPercent?: boolean
  isCurrency?: boolean
  value: number
  changePercent: number
}

const INSTRUMENTS: Omit<IndexRow, 'value' | 'changePercent'>[] = [
  { name: 'S&P 500', symbol: '^GSPC' },
  { name: 'Dow Jones', symbol: '^DJI' },
  { name: 'Nasdaq', symbol: '^IXIC' },
  { name: 'Gold', symbol: 'GC=F', isCurrency: true },
  { name: '10Y Treasury', symbol: '^TNX', isPercent: true },
]

const FALLBACK: Record<string, { value: number; changePercent: number }> = {
  '^GSPC': { value: 5308.13, changePercent: 0.35 },
  '^DJI': { value: 39872.99, changePercent: -0.1 },
  '^IXIC': { value: 16801.54, changePercent: 0.31 },
  'GC=F': { value: 2417.4, changePercent: 0.38 },
  '^TNX': { value: 4.42, changePercent: -0.68 },
}

const initialRows: IndexRow[] = INSTRUMENTS.map((i) => ({
  ...i,
  value: FALLBACK[i.symbol].value,
  changePercent: FALLBACK[i.symbol].changePercent,
}))

function formatValue(row: IndexRow): string {
  if (row.isPercent) return `${row.value.toFixed(2)}%`
  const formatted = row.value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return row.isCurrency ? `$${formatted}` : formatted
}

export function MarketDataWidget() {
  const [rows, setRows] = useState<IndexRow[]>(initialRows)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let active = true

    async function fetchAll() {
      try {
        const res = await fetch('/api/market', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!Array.isArray(data?.rows)) return

        const bySymbol = new Map<string, { value: unknown; changePercent: unknown }>()
        for (const r of data.rows) {
          if (r && typeof r.symbol === 'string') {
            bySymbol.set(r.symbol, { value: r.value, changePercent: r.changePercent })
          }
        }

        let anyLive = false
        const next = INSTRUMENTS.map((inst) => {
          const fallback = FALLBACK[inst.symbol]
          const live = bySymbol.get(inst.symbol)
          const value =
            live && typeof live.value === 'number' ? live.value : fallback.value
          const changePercent =
            live && typeof live.changePercent === 'number'
              ? live.changePercent
              : fallback.changePercent
          if (
            live &&
            typeof live.value === 'number' &&
            typeof live.changePercent === 'number'
          ) {
            anyLive = true
          }
          return { ...inst, value, changePercent }
        })

        if (!active) return
        setRows(next)
        setIsLive(anyLive)
      } catch {
        // Keep last good / fallback data.
      }
    }

    fetchAll()
    const interval = setInterval(fetchAll, 60000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="panel-flush overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Index</th>
            <th className="text-right">Last</th>
            <th className="text-right">% Change</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => {
            const up = item.changePercent > 0
            const down = item.changePercent < 0
            const colorClass = up
              ? 'text-up dark:text-up-light'
              : down
                ? 'text-down dark:text-down-light'
                : 'text-ink-muted dark:text-ink-inverse-muted'
            const sign = up ? '+' : ''
            return (
              <tr key={item.symbol}>
                <td className="font-medium text-ink dark:text-ink-inverse">
                  {item.name}
                </td>
                <td className="text-right font-serif font-bold text-ink dark:text-ink-inverse">
                  {formatValue(item)}
                </td>
                <td className={`text-right ${colorClass}`}>
                  {sign}
                  {item.changePercent.toFixed(2)}%
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="border-t border-hairline px-4 py-3 text-caption text-ink-muted dark:border-hairline-dark dark:text-ink-inverse-muted">
        {isLive
          ? 'Live market data via Yahoo Finance, refreshed every 60 seconds (may be delayed up to 15 minutes).'
          : 'Illustrative values shown. Live data will load shortly.'}
      </p>
    </div>
  )
}
