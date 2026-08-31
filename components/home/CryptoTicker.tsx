'use client'

import { useEffect, useState } from 'react'

interface Coin {
  id: string
  symbol: string
  price: number
  change24h: number
}

// CoinGecko ids -> display symbols
const COINS: { id: string; symbol: string }[] = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'binancecoin', symbol: 'BNB' },
  { id: 'solana', symbol: 'SOL' },
  { id: 'ripple', symbol: 'XRP' },
  { id: 'cardano', symbol: 'ADA' },
]

// Realistic static fallback prices. Used for the initial render (before the
// first fetch resolves) and whenever the CoinGecko request fails or returns a
// non-ok response, so the ticker never crashes or blanks the page.
const FALLBACK_COINS: Coin[] = [
  { id: 'bitcoin', symbol: 'BTC', price: 78000, change24h: -0.24 },
  { id: 'ethereum', symbol: 'ETH', price: 2400, change24h: 0.85 },
  { id: 'binancecoin', symbol: 'BNB', price: 680, change24h: 0.42 },
  { id: 'solana', symbol: 'SOL', price: 100, change24h: -1.1 },
  { id: 'ripple', symbol: 'XRP', price: 1.3, change24h: 2.3 },
  { id: 'cardano', symbol: 'ADA', price: 0.19, change24h: -0.5 },
]

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple,cardano&vs_currencies=usd&include_24hr_change=true'

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

        const next = COINS.map(({ id, symbol }) => {
          const entry = data?.[id]
          const fallback = FALLBACK_COINS.find((c) => c.id === id)!
          return {
            id,
            symbol,
            price:
              typeof entry?.usd === 'number' ? entry.usd : fallback.price,
            change24h:
              typeof entry?.usd_24h_change === 'number'
                ? entry.usd_24h_change
                : fallback.change24h,
          }
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
