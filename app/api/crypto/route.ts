import { NextResponse } from 'next/server'

// Server-side proxy for live crypto market data (CoinGecko).
//
// Why a server route: CoinGecko's free API rate-limits / blocks direct browser
// calls, so fetching client-side unreliably falls back to static prices. By
// proxying here, every visitor shares ONE cached upstream call (revalidated
// ~60s), which is reliable, respects the rate limit, and returns live data.
//
// `per_page` is capped generously so both the 4-card hero and the ~12-coin
// ticker can be served from the same response.

export const revalidate = 60

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=true&price_change_percentage=24h'

export interface CryptoCoin {
  id: string
  symbol: string
  name: string
  image: string
  price: number
  change24h: number
  sparkline: number[]
}

export async function GET() {
  try {
    const res = await fetch(COINGECKO_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Coinscribed/1.0)' },
      next: { revalidate },
    })
    if (!res.ok) {
      return NextResponse.json({ coins: [] }, { status: 200 })
    }
    const data = await res.json()
    if (!Array.isArray(data)) {
      return NextResponse.json({ coins: [] }, { status: 200 })
    }

    const coins: CryptoCoin[] = data.map((c) => ({
      id: typeof c.id === 'string' ? c.id : '',
      symbol: typeof c.symbol === 'string' ? c.symbol.toUpperCase() : '',
      name: typeof c.name === 'string' ? c.name : '',
      image: typeof c.image === 'string' ? c.image : '',
      price: typeof c.current_price === 'number' ? c.current_price : 0,
      change24h:
        typeof c.price_change_percentage_24h === 'number'
          ? c.price_change_percentage_24h
          : 0,
      sparkline: Array.isArray(c.sparkline_in_7d?.price)
        ? c.sparkline_in_7d.price.filter(
            (n: unknown): n is number => typeof n === 'number'
          )
        : [],
    }))

    return NextResponse.json(
      { coins },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch {
    return NextResponse.json({ coins: [] }, { status: 200 })
  }
}
