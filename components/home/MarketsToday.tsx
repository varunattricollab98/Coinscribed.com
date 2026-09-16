'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkline } from '@/components/home/Sparkline'

// Markets Today — an auto-generated live market snapshot.
//
// Zero-maintenance: it reads the same cached /api/market feed (Yahoo Finance)
// and builds a plain-English summary, hero cards, and a full index table on the
// fly, so the page is always current without anyone writing a daily post. This
// gives the site a genuinely fresh, dated "state of the market" surface (a
// freshness signal search engines like) with no manual upkeep.

interface Row {
  name: string
  symbol: string
  isPercent?: boolean
  isCurrency?: boolean
  value: number
  changePercent: number
  /** Intraday close series for the sparkline (already returned by /api/market). */
  spark: number[]
}

const INSTRUMENTS: Omit<Row, 'value' | 'changePercent' | 'spark'>[] = [
  { name: 'S&P 500', symbol: '^GSPC' },
  { name: 'Dow Jones', symbol: '^DJI' },
  { name: 'Nasdaq', symbol: '^IXIC' },
  { name: 'Russell 2000', symbol: '^RUT' },
  { name: 'VIX', symbol: '^VIX' },
  { name: 'Gold', symbol: 'GC=F', isCurrency: true },
  { name: '10Y Treasury', symbol: '^TNX', isPercent: true },
  { name: 'Bitcoin', symbol: 'BTC-USD', isCurrency: true },
]

// A short, plain-English "what is this" note per instrument, shown in the table
// so a newcomer understands what each row actually tracks.
const BLURB: Record<string, string> = {
  '^GSPC': '500 largest US companies',
  '^DJI': '30 major US blue chips',
  '^IXIC': 'Tech-heavy US index',
  '^RUT': 'US small-cap stocks',
  '^VIX': "Market's fear gauge",
  'GC=F': 'Gold futures, per ounce',
  '^TNX': '10-year US govt bond yield',
  'BTC-USD': 'Bitcoin price in USD',
}

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
  spark: [],
}))

function formatValue(row: Pick<Row, 'value' | 'isPercent' | 'isCurrency'>): string {
  if (row.isPercent) return `${row.value.toFixed(2)}%`
  const formatted = row.value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return row.isCurrency ? `$${formatted}` : formatted
}

/** Build a plain-English recap sentence from the three main equity indices. */
function buildSummary(rows: Row[]): string {
  const indices = rows.filter((r) =>
    ['^GSPC', '^DJI', '^IXIC'].includes(r.symbol)
  )
  if (indices.length === 0) return ''
  const up = indices.filter((r) => r.changePercent > 0).length
  const down = indices.filter((r) => r.changePercent < 0).length

  let mood: string
  if (up === indices.length) mood = 'US stocks were broadly higher'
  else if (down === indices.length) mood = 'US stocks were broadly lower'
  else mood = 'US stocks were mixed'

  const sp = rows.find((r) => r.symbol === '^GSPC')
  const spPart = sp
    ? `, with the S&P 500 ${sp.changePercent >= 0 ? 'up' : 'down'} ${Math.abs(
        sp.changePercent
      ).toFixed(2)}%`
    : ''

  return `${mood}${spPart}.`
}

/** Direction helpers shared by cards and table. */
function tone(changePercent: number) {
  const up = changePercent > 0
  const down = changePercent < 0
  return {
    up,
    down,
    text: up
      ? 'text-up dark:text-up-light'
      : down
        ? 'text-down dark:text-down-light'
        : 'text-ink-muted dark:text-ink-inverse-muted',
    pill: up
      ? 'bg-up/10 text-up dark:bg-up-light/10 dark:text-up-light'
      : down
        ? 'bg-down/10 text-down dark:bg-down-light/10 dark:text-down-light'
        : 'bg-wash text-ink-muted dark:bg-elevated dark:text-ink-inverse-muted',
    arrow: up ? '▲' : down ? '▼' : '■',
  }
}

function formatChange(changePercent: number): string {
  return `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`
}

export function MarketsToday() {
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [isLive, setIsLive] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
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
          const fb = FALLBACK[inst.symbol]
          const live = bySymbol.get(inst.symbol)
          const value = live && typeof live.value === 'number' ? live.value : fb.value
          const changePercent =
            live && typeof live.changePercent === 'number'
              ? live.changePercent
              : fb.changePercent
          const spark =
            live && Array.isArray(live.spark)
              ? (live.spark.filter((n) => typeof n === 'number') as number[])
              : []
          if (live && typeof live.value === 'number') anyLive = true
          return { ...inst, value, changePercent, spark }
        })
        if (!active) return
        setRows(next)
        setIsLive(anyLive)
        if (anyLive) setUpdatedAt(new Date())
      } catch {
        // keep fallback
      }
    }
    load()
    const interval = setInterval(load, 60000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const summary = buildSummary(rows)
  // Hero cards: the headline instruments most readers scan first.
  const heroSymbols = ['^GSPC', '^DJI', '^IXIC', 'BTC-USD']
  const heroCards = heroSymbols
    .map((s) => rows.find((r) => r.symbol === s))
    .filter((r): r is Row => Boolean(r))

  return (
    <div>
      {/* Auto-generated recap sentence */}
      <p className="text-lg leading-relaxed text-ink-body dark:text-ink-inverse-body">
        {summary}{' '}
        <span className="text-ink-muted dark:text-ink-inverse-muted">
          Here&apos;s where the major US indices, gold, the 10-year Treasury
          yield and Bitcoin stand right now.
        </span>
      </p>

      {/* Hero cards — the four headline instruments, big and glanceable */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {heroCards.map((row) => {
          const t = tone(row.changePercent)
          return (
            <div
              key={row.symbol}
              className="flex flex-col justify-between rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-ink/20 dark:border-hairline-dark dark:bg-elevated dark:hover:border-ink-inverse/20"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
                  {row.name}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-caption font-semibold tabular-nums ${t.pill}`}
                >
                  <span aria-hidden="true" className="text-[0.6rem] leading-none">
                    {t.arrow}
                  </span>
                  {formatChange(row.changePercent)}
                </span>
              </div>
              <div className="mt-2 font-serif text-display-3 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatValue(row)}
              </div>
              <div className="mt-3">
                <Sparkline
                  data={row.spark}
                  width={180}
                  height={40}
                  className="w-full"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Live index table */}
      <div className="mt-8 overflow-x-auto rounded-lg border border-hairline dark:border-hairline-dark">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-hairline bg-wash dark:border-hairline-dark dark:bg-elevated">
              <th className="px-4 py-3 font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink dark:text-ink-inverse">
                Market
              </th>
              <th className="hidden px-4 py-3 text-center font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink dark:text-ink-inverse sm:table-cell">
                Trend (today)
              </th>
              <th className="px-4 py-3 text-right font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink dark:text-ink-inverse">
                Level
              </th>
              <th className="px-4 py-3 text-right font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink dark:text-ink-inverse">
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const t = tone(row.changePercent)
              return (
                <tr
                  key={row.symbol}
                  className="border-b border-hairline transition-colors last:border-0 hover:bg-wash/60 dark:border-hairline-dark dark:hover:bg-elevated/60"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink dark:text-ink-inverse">
                      {row.name}
                    </div>
                    {BLURB[row.symbol] && (
                      <div className="mt-0.5 text-caption text-ink-muted dark:text-ink-inverse-muted">
                        {BLURB[row.symbol]}
                      </div>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 align-middle sm:table-cell">
                    <div className="flex justify-center">
                      <Sparkline data={row.spark} width={110} height={28} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-ink-body dark:text-ink-inverse-body">
                    {formatValue(row)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-caption font-semibold tabular-nums ${t.pill}`}
                    >
                      <span aria-hidden="true" className="text-[0.6rem] leading-none">
                        {t.arrow}
                      </span>
                      {formatChange(row.changePercent)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-ink-muted dark:text-ink-inverse-muted">
        {isLive && (
          <span className="inline-flex items-center gap-1.5 font-semibold uppercase text-up dark:text-up-light">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-up dark:bg-up-light" />
            Live
          </span>
        )}
        {updatedAt && (
          <span>
            Updated{' '}
            {updatedAt.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZoneName: 'short',
              // Force US Eastern so every visitor (incl. non-US) sees a
              // consistent US-market timestamp (ET), not their own local zone.
              // This is a US-market site, so ET is the correct reference — the
              // same convention Bloomberg/CNBC use.
              timeZone: 'America/New_York',
            })}
            {' · '}
          </span>
        )}
        Data via Yahoo Finance, refreshed every 60 seconds (may be delayed up to
        15 minutes). Not investment advice.
      </p>

      {/* Cross-links into editorial content (topical authority) */}
      <div className="mt-8 border-t border-hairline pt-6 dark:border-hairline-dark">
        <h2 className="mb-3 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
          Understand the markets
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            { href: '/news/simple-vs-compound-interest', title: 'Simple vs Compound Interest' },
            { href: '/news/rule-of-72', title: 'The Rule of 72: How Fast Money Doubles' },
            { href: '/news/apr-vs-apy', title: 'APR vs APY: What’s the Difference?' },
            { href: '/news', title: 'All market & finance news →' },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="font-medium text-accent underline-offset-2 hover:underline dark:text-accent-light"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
