'use client'

import { useEffect, useState } from 'react'

// US market ticker — a single auto-scrolling strip of colored cards
// (Investing.com / CNBC style): each instrument is a green (up) / red (down)
// card showing name, value and change. Covers the major US indices plus gold,
// the 10Y yield and Bitcoin, so the homepage leads with a live "state of the
// market" snapshot rather than crypto alone.
//
// Data flows through our own `/api/market` route (server-side proxy to Yahoo
// Finance, cached ~60s) so there's no browser CORS problem and all visitors
// share one cached upstream call. Refreshes every 60s. Any value the API
// returns as null falls back to the realistic static number below, which is
// also what renders on the server / first paint, so the bar never blanks out.

interface Row {
  name: string
  symbol: string
  isPercent?: boolean
  isCurrency?: boolean
  value: number
  changePercent: number
}

const INSTRUMENTS: Omit<Row, 'value' | 'changePercent'>[] = [
  { name: 'S&P 500', symbol: '^GSPC' },
  { name: 'Dow 30', symbol: '^DJI' },
  { name: 'Nasdaq', symbol: '^IXIC' },
  { name: 'Russell 2000', symbol: '^RUT' },
  { name: 'VIX', symbol: '^VIX' },
  { name: 'Gold', symbol: 'GC=F', isCurrency: true },
  { name: '10Y Yield', symbol: '^TNX', isPercent: true },
  { name: 'Bitcoin', symbol: 'BTC-USD', isCurrency: true },
]

// Realistic static fallback used on first paint and if the API is unavailable.
const FALLBACK: Record<string, { value: number; changePercent: number }> = {
  '^GSPC': { value: 5308.13, changePercent: 0.35 },
  '^DJI': { value: 39872.99, changePercent: -0.1 },
  '^IXIC': { value: 16801.54, changePercent: 0.31 },
  '^RUT': { value: 2065.4, changePercent: 0.52 },
  '^VIX': { value: 14.53, changePercent: -1.39 },
  'GC=F': { value: 2417.4, changePercent: 0.38 },
  '^TNX': { value: 4.42, changePercent: -0.68 },
  'BTC-USD': { value: 68000, changePercent: 1.1 },
}

const initialRows: Row[] = INSTRUMENTS.map((i) => ({
  ...i,
  value: FALLBACK[i.symbol].value,
  changePercent: FALLBACK[i.symbol].changePercent,
}))

function formatValue(row: Row): string {
  if (row.isPercent) return `${row.value.toFixed(2)}%`
  const digits = row.value >= 1000 ? 2 : row.value >= 1 ? 2 : 2
  const formatted = row.value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  return row.isCurrency ? `$${formatted}` : formatted
}

export function MarketTicker() {
  const [rows, setRows] = useState<Row[]>(initialRows)

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

        const next = INSTRUMENTS.map((inst) => {
          const fb = FALLBACK[inst.symbol]
          const live = bySymbol.get(inst.symbol)
          const value = live && typeof live.value === 'number' ? live.value : fb.value
          const changePercent =
            live && typeof live.changePercent === 'number' ? live.changePercent : fb.changePercent
          return { ...inst, value, changePercent }
        })

        if (active) setRows(next)
      } catch {
        // keep last good / fallback
      }
    }

    fetchAll()
    const interval = setInterval(fetchAll, 60000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const renderCard = (row: Row, i: number) => {
    const up = row.changePercent > 0
    const down = row.changePercent < 0
    // For the VIX, a rise is "risk-off" but we keep the plain up=green / down=red
    // convention for consistency across the strip.
    const cardClass = up
      ? 'bg-emerald-600'
      : down
        ? 'bg-rose-600'
        : 'bg-zinc-600'
    const arrow = up ? '▲' : down ? '▼' : '■'
    return (
      <div
        key={`${row.symbol}-${i}`}
        className={`mx-1.5 flex min-w-[168px] flex-col gap-0.5 rounded-md ${cardClass} px-4 py-2.5 text-white shadow-sm`}
      >
        <span className="text-[11px] font-bold uppercase tracking-wide text-white/90">
          {row.name}
        </span>
        <span className="font-mono text-[15px] font-semibold tabular-nums leading-tight">
          {formatValue(row)}
        </span>
        <span className="flex items-center gap-1 font-mono text-[12px] font-medium tabular-nums text-white/95">
          <span aria-hidden="true" className="text-[8px]">
            {arrow}
          </span>
          {up ? '+' : ''}
          {row.changePercent.toFixed(2)}%
        </span>
      </div>
    )
  }

  return (
    <div className="group relative flex w-full items-stretch overflow-hidden border-b border-hairline bg-[#0b0b0d] py-2 dark:border-hairline-dark">
      {/* Fixed "US MARKETS" flag on the left; always visible, does not scroll. */}
      <div className="z-10 flex shrink-0 items-center gap-2 border-r border-white/15 px-4">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="hidden font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white sm:inline">
          US Markets
        </span>
      </div>

      <div className="flex flex-1 items-center overflow-hidden">
        {/* Slower marquee so cards are readable; pauses on hover; respects
            reduced-motion. */}
        <div className="flex min-w-full shrink-0 animate-marquee-slow items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <div className="flex items-center">
            {rows.map((row, i) => renderCard(row, i))}
          </div>
          <div className="flex items-center" aria-hidden="true">
            {rows.map((row, i) => renderCard(row, i))}
          </div>
        </div>
      </div>

      {/* Soft fade on the right edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0b0b0d] to-transparent"
      />
    </div>
  )
}
