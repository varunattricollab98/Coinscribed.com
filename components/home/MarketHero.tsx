'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkline } from './Sparkline'

interface CoinCard {
  id: string
  symbol: string
  name: string
  image: string
  price: number
  change24h: number
  sparkline: number[]
}

// Fallback so the hero is never empty on first paint or if the API is down.
const FALLBACK: CoinCard[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', image: '', price: 78900, change24h: 1.24, sparkline: [78, 79, 78.6, 79.2, 78.9, 78.4, 78.9] },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', image: '', price: 2476, change24h: 0.85, sparkline: [2.4, 2.45, 2.42, 2.48, 2.46, 2.47, 2.48] },
  { id: 'solana', symbol: 'SOL', name: 'Solana', image: '', price: 100, change24h: -1.1, sparkline: [103, 102, 101.5, 100.8, 100.2, 99.8, 100] },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', image: '', price: 687, change24h: 0.42, sparkline: [680, 682, 684, 683, 686, 685, 687] },
]

const URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=true&price_change_percentage=24h'

function formatPrice(price: number): string {
  const digits = price >= 100 ? 0 : price >= 1 ? 2 : 4
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function MarketHero() {
  const [coins, setCoins] = useState<CoinCard[]>(FALLBACK)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const res = await fetch(URL, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!Array.isArray(data)) return
        const mapped: CoinCard[] = data.map((c) => ({
          id: c.id,
          symbol: typeof c.symbol === 'string' ? c.symbol.toUpperCase() : '',
          name: c.name ?? '',
          image: c.image ?? '',
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
        if (active && mapped.length) setCoins(mapped)
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

  return (
    <section className="relative overflow-hidden border-b border-hairline bg-hero-radial dark:border-hairline-dark dark:bg-hero-radial-dark">
      <div className="container-page section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left: headline */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft/60 px-3 py-1 text-eyebrow font-semibold uppercase text-accent dark:border-accent-light/30 dark:bg-accent/10 dark:text-accent-light">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent dark:bg-accent-light" />
              Live Markets
            </span>
            <h1 className="mt-5 font-serif text-display-0 font-bold leading-[1.03] text-ink dark:text-ink-inverse">
              Finance &amp; crypto,{' '}
              <span className="bg-accent-gradient bg-clip-text text-transparent">
                decoded
              </span>{' '}
              in real time.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-body dark:text-ink-inverse-body">
              Live prices, market data, breaking news and free calculators —
              everything you need to make smarter money decisions, in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/news"
                className="inline-flex items-center justify-center rounded-full bg-accent-gradient px-6 py-3 text-eyebrow font-semibold uppercase text-white transition-transform duration-150 hover:scale-[1.03]"
              >
                Read the News
              </Link>
              <Link
                href="/calculators"
                className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-eyebrow font-semibold uppercase text-ink transition-colors hover:border-accent hover:text-accent dark:border-ink-inverse/20 dark:text-ink-inverse dark:hover:border-accent-light dark:hover:text-accent-light"
              >
                Explore Tools
              </Link>
            </div>
          </motion.div>

          {/* Right: live coin cards with sparklines */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {coins.slice(0, 4).map((coin, i) => {
              const up = coin.change24h > 0
              const down = coin.change24h < 0
              const changeColor = up
                ? 'text-up dark:text-up-light'
                : down
                  ? 'text-down dark:text-down-light'
                  : 'text-ink-muted dark:text-ink-inverse-muted'
              return (
                <motion.div
                  key={coin.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: reduceMotion ? 0 : 0.1 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group rounded-xl border border-hairline bg-surface/80 p-4 backdrop-blur transition-colors hover:border-accent/50 dark:border-hairline-dark dark:bg-elevated/80 dark:hover:border-accent-light/50"
                >
                  <div className="flex items-center gap-2">
                    {coin.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coin.image}
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded-full"
                      />
                    ) : (
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-soft text-[9px] font-bold text-accent dark:bg-accent/20 dark:text-accent-light">
                        {coin.symbol.slice(0, 1)}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-ink dark:text-ink-inverse">
                      {coin.symbol}
                    </span>
                    <span className={`ml-auto text-caption font-medium tabular-nums ${changeColor}`}>
                      {up ? '+' : ''}
                      {coin.change24h.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-2 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">
                    {formatPrice(coin.price)}
                  </div>
                  <Sparkline
                    data={coin.sparkline}
                    className="mt-2 w-full"
                    width={140}
                    height={34}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
