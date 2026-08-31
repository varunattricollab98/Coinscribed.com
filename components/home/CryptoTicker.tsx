'use client'

import { useEffect, useState } from 'react'

interface Coin {
  id: string
  symbol: string
  price: number
  change24h: number
}

// Top coins to display, in order. CoinGecko `/coins/markets` returns them by
// market cap; we filter to this set (skipping stablecoins we don't want in a
// price ticker) and keep this display order.
const DISPLAY_SYMBOLS = [
  'BTC',
  'ETH',
  'BNB',
  'SOL',
  'XRP',
  'ADA',
  'DOGE',
  'TRX',
  'AVAX',
  'LINK',
  'DOT',
  'MATIC',
]

// Realistic static fallback. Used for the initial render (before the first
// fetch resolves) and whenever the request fails or returns a bad payload, so
// the ticker never crashes or blanks the page.
const FALLBACK_COINS: Coin[] = [
  { id: 'bitcoin', symbol: 'BTC', price: 78000, change24h: -0.24 },
  { id: 'ethereum', symbol: 'ETH', price: 2400, change24h: 0.85 },
  { id: 'binancecoin', symbol: 'BNB', price: 680, change24h: 0.42 },
  { id: 'solana', symbol: 'SOL', price: 100, change24h: -1.1 },
  { id: 'ripple', symbol: 'XRP', price: 1.3, change24h: 2.3 },
  { id: 'cardano', symbol: 'ADA', price: 0.19, change24h: -0.5 },
  { id: 'dogecoin', symbol: 'DOGE', price: 0.14, change24h: 1.2 },
  { id: 'tron', symbol: 'TRX', price: 0.24, change24h: 0.3 },
  { id: 'avalanche-2', symbol: 'AVAX', price: 22, change24h: -0.9 },
  { id: 'chainlink', symbol: 'LINK', price: 14, change24h: 0.6 },
  { id: 'polkadot', symbol: 'DOT', price: 5.4, change24h: -0.4 },
  { id: 'matic-network', symbol: 'MATIC', price: 0.42, change24h: 1.5 },
]

// One call returns price + 24h change for the top coins by market cap.
const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&price_change_percentage=24h'

function formatPrice(price: number): string {
  const fractionDigits = price >= 100 ? 0 : price >= 1 ? 2 : 4
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

export function CryptoTicker() {
  const [coins, setCoins] = useState<Coin[]>(FALLBACK_COINS)

  useEffect(() => {
    let active = true

    async function fetchPrices() {
      try {
        const res = await fetch(COINGECKO_URL, { cache: 'no-store' })
        if (!res.ok) return // keep last good / fallback data
        const data = await res.json()
        if (!Array.isArray(data)) return

        // Map API rows keyed by upper-case symbol, then pull our display set in
        // order. Any symbol missing from the response falls back to its static
        // entry so the bar never shows gaps or NaN.
        const bySymbol = new Map<string, Coin>()
        for (const row of data) {
          const symbol =
            typeof row?.symbol === 'string' ? row.symbol.toUpperCase() : ''
          if (!symbol) continue
          bySymbol.set(symbol, {
            id: typeof row?.id === 'string' ? row.id : symbol,
            symbol,
            price:
              typeof row?.current_price === 'number' ? row.current_price : NaN,
            change24h:
              typeof row?.price_change_percentage_24h === 'number'
                ? row.price_change_percentage_24h
                : NaN,
          })
        }

        const next = DISPLAY_SYMBOLS.map((sym) => {
          const fallback = FALLBACK_COINS.find((c) => c.symbol === sym)
          const live = bySymbol.get(sym)
          if (
            live &&
            Number.isFinite(live.price) &&
            Number.isFinite(live.change24h)
          ) {
            return live
          }
          return fallback ?? { id: sym, symbol: sym, price: 0, change24h: 0 }
        })

        if (active) setCoins(next)
      } catch {
        // Network/parse error: silently keep fallback / last good data.
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const renderCoin = (coin: Coin, i: number) => {
    // A flat 0.00% change is neither a gain nor a loss: show it neutral gray
    // rather than a green up-arrow. Positive is up/green, negative is down/red.
    const up = coin.change24h > 0
    const down = coin.change24h < 0
    const arrow = up ? '▲' : down ? '▼' : '■'
    const colorClass = up
      ? 'text-up-light'
      : down
        ? 'text-down-light'
        : 'text-ink-muted'
    return (
      <div
        key={`${coin.id}-${i}`}
        className="flex items-center gap-2 px-5 py-2.5 text-sm"
      >
        <span className="font-semibold tracking-wide">{coin.symbol}</span>
        <span className="tabular-nums text-ink-muted">
          {formatPrice(coin.price)}
        </span>
        <span
          className={`flex items-center gap-0.5 font-medium tabular-nums ${colorClass}`}
        >
          <span aria-hidden="true">{arrow}</span>
          {Math.abs(coin.change24h).toFixed(2)}%
        </span>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden border-b border-hairline bg-ink text-zinc-100">
      <div className="group flex whitespace-nowrap">
        <div className="flex min-w-full shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {/* Real list, read by assistive tech. */}
          <div className="flex items-center">
            {coins.map((coin, i) => renderCoin(coin, i))}
          </div>
          {/* Duplicate list so the marquee loops seamlessly (animation shifts
              -50%). Hidden from assistive tech so prices are not read twice. */}
          <div className="flex items-center" aria-hidden="true">
            {coins.map((coin, i) => renderCoin(coin, i))}
          </div>
        </div>
      </div>
    </div>
  )
}
