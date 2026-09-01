import { NextResponse } from 'next/server'

// Server-side proxy for live market data.
//
// The browser can't call Yahoo Finance directly (no CORS headers), so we fetch
// it here on the server and return a small, normalized JSON payload. This route
// is revalidated at most once per minute to stay well within rate limits and to
// serve a shared cached response to all visitors.

export const revalidate = 60

const INSTRUMENTS: { name: string; symbol: string; isPercent?: boolean; isCurrency?: boolean }[] = [
  { name: 'S&P 500', symbol: '^GSPC' },
  { name: 'Dow Jones', symbol: '^DJI' },
  { name: 'Nasdaq', symbol: '^IXIC' },
  { name: 'Gold', symbol: 'GC=F', isCurrency: true },
  { name: '10Y Treasury', symbol: '^TNX', isPercent: true },
]

interface MarketRow {
  name: string
  symbol: string
  isPercent?: boolean
  isCurrency?: boolean
  value: number | null
  changePercent: number | null
  spark: number[]
}

async function fetchOne(
  inst: (typeof INSTRUMENTS)[number]
): Promise<MarketRow> {
  const base: MarketRow = {
    name: inst.name,
    symbol: inst.symbol,
    isPercent: inst.isPercent,
    isCurrency: inst.isCurrency,
    value: null,
    changePercent: null,
    spark: [],
  }
  try {
    // range=1d&interval=5m gives an intraday series we can use for a sparkline.
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      inst.symbol
    )}?range=1d&interval=5m`
    const res = await fetch(url, {
      // A UA header avoids occasional bot blocks; revalidate caches the result.
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Coinscribed/1.0)' },
      next: { revalidate: 60 },
    })
    if (!res.ok) return base
    const data = await res.json()
    const result = data?.chart?.result?.[0]
    const meta = result?.meta
    const price = meta?.regularMarketPrice
    let changePct = meta?.regularMarketChangePercent
    if (
      typeof changePct !== 'number' &&
      typeof price === 'number' &&
      typeof meta?.previousClose === 'number' &&
      meta.previousClose !== 0
    ) {
      changePct = ((price - meta.previousClose) / meta.previousClose) * 100
    }

    // Extract intraday close prices, drop nulls, downsample to ~24 points.
    let spark: number[] = []
    const closes = result?.indicators?.quote?.[0]?.close
    if (Array.isArray(closes)) {
      const clean = closes.filter(
        (n: unknown): n is number => typeof n === 'number'
      )
      const targetPoints = 24
      const stride = Math.max(1, Math.floor(clean.length / targetPoints))
      spark = clean.filter((_, i) => i % stride === 0).slice(0, targetPoints)
    }

    if (typeof price === 'number' && typeof changePct === 'number') {
      return { ...base, value: price, changePercent: changePct, spark }
    }
    return base
  } catch {
    return base
  }
}

export async function GET() {
  const rows = await Promise.all(INSTRUMENTS.map(fetchOne))
  return NextResponse.json(
    { rows },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    }
  )
}
