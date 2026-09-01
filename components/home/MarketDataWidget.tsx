'use client'

import { useEffect, useState } from 'react'
import { Sparkline } from './Sparkline'
import { LineIcon, type LineIconName } from '@/components/icons/LineIcon'

// Live market data cards for major indices, commodities and rates.
//
// Data flows through our own `/api/market` route (server-side proxy to Yahoo
// Finance, cached ~60s) so there is no browser CORS problem and all visitors
// share one cached upstream call. We refresh every 60s. Any value the API
// returns as null falls back to the realistic static number below, and the
// static values are also what render on the server / first paint, so there is
// no hydration mismatch and the cards never blank out.

interface IndexRow {
  name: string
  symbol: string
  icon: LineIconName
  isPercent?: boolean
  isCurrency?: boolean
  value: number
  changePercent: number
  spark: number[]
}

const INSTRUMENTS: Omit<IndexRow, 'value' | 'changePercent' | 'spark'>[] = [
  { name: 'S&P 500', symbol: '^GSPC', icon: 'trend-up' },
  { name: 'Dow Jones', symbol: '^DJI', icon: 'bars' },
  { name: 'Nasdaq', symbol: '^IXIC', icon: 'trend-up' },
  { name: 'Gold', symbol: 'GC=F', icon: 'coins', isCurrency: true },
  { name: '10Y Treasury', symbol: '^TNX', icon: 'bank', isPercent: true },
]

const FALLBACK: Record<
  string,
  { value: number; changePercent: number; spark: number[] }
> = {
  '^GSPC': { value: 5308.13, changePercent: 0.35, spark: [5290, 5296, 5301, 5298, 5305, 5308] },
  '^DJI': { value: 39872.99, changePercent: -0.1, spark: [39920, 39900, 39885, 39890, 39878, 39873] },
  '^IXIC': { value: 16801.54, changePercent: 0.31, spark: [16750, 16770, 16785, 16780, 16795, 16802] },
  'GC=F': { value: 2417.4, changePercent: 0.38, spark: [2408, 2411, 2414, 2412, 2416, 2417] },
  '^TNX': { value: 4.42, changePercent: -0.68, spark: [4.47, 4.45, 4.44, 4.43, 4.43, 4.42] },
}

const initialRows: IndexRow[] = INSTRUMENTS.map((i) => ({
  ...i,
  value: FALLBACK[i.symbol].value,
  changePercent: FALLBACK[i.symbol].changePercent,
  spark: FALLBACK[i.symbol].spark,
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

        const bySymbol = new Map<
          string,
          { value: unknown; changePercent: unknown; spark: unknown }
        >()
        for (const r of data.rows) {
          if (r && typeof r.symbol === 'string') {
            bySymbol.set(r.symbol, {
              value: r.value,
              changePercent: r.changePercent,
              spark: r.spark,
            })
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
          const spark =
            live && Array.isArray(live.spark) && live.spark.length > 1
              ? (live.spark as number[])
              : fallback.spark
          if (
            live &&
            typeof live.value === 'number' &&
            typeof live.changePercent === 'number'
          ) {
            anyLive = true
          }
          return { ...inst, value, changePercent, spark }
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
    <div>
      <div className="rule-grid grid-cols-2 lg:grid-cols-5">
        {rows.map((item) => {
          const up = item.changePercent > 0
          const down = item.changePercent < 0
          const pillClass = up
            ? 'bg-up/10 text-up dark:bg-up-light/15 dark:text-up-light'
            : down
              ? 'bg-down/10 text-down dark:bg-down-light/15 dark:text-down-light'
              : 'bg-ink/5 text-ink-muted dark:bg-ink-inverse/10 dark:text-ink-inverse-muted'
          const arrow = up ? '▲' : down ? '▼' : '■'
          return (
            <div
              key={item.symbol}
              className="group flex flex-col gap-3 px-5 py-5 transition-colors hover:bg-wash dark:hover:bg-wash-dark"
            >
              <div className="flex items-center gap-2">
                <LineIcon
                  name={item.icon}
                  className="h-4 w-4 text-accent dark:text-accent-light"
                />
                <span className="text-eyebrow font-semibold uppercase text-ink-muted dark:text-ink-inverse-muted">
                  {item.name}
                </span>
              </div>

              <div className="font-serif text-display-3 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatValue(item)}
              </div>

              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-semibold tabular-nums ${pillClass}`}
                >
                  <span aria-hidden="true" className="text-[8px]">
                    {arrow}
                  </span>
                  {up ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </span>
                <Sparkline data={item.spark} width={72} height={24} />
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-3 flex items-center gap-2 text-caption text-ink-muted dark:text-ink-inverse-muted">
        {isLive && (
          <span className="inline-flex items-center gap-1.5 font-semibold uppercase text-up dark:text-up-light">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-up dark:bg-up-light" />
            Live
          </span>
        )}
        {isLive
          ? 'Market data via Yahoo Finance, refreshed every 60 seconds (may be delayed up to 15 minutes).'
          : 'Illustrative values shown. Live data will load shortly.'}
      </p>
    </div>
  )
}
