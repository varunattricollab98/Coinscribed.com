import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { MarketsToday } from '@/components/home/MarketsToday'
import { Reveal } from '@/components/motion/Reveal'

export const metadata: Metadata = {
  title: 'Markets Today: Live US Market Snapshot',
  description:
    'A live snapshot of US markets — the S&P 500, Dow, Nasdaq, Russell 2000, VIX, gold, the 10-year Treasury yield and Bitcoin — with a plain-English recap, updated throughout the trading day.',
  alternates: { canonical: '/markets' },
  openGraph: {
    title: `Markets Today: Live US Market Snapshot | ${siteConfig.name}`,
    description:
      'A live snapshot of US markets with a plain-English recap, updated throughout the trading day.',
    url: `${siteConfig.url}/markets`,
    type: 'website',
  },
}

export default function MarketsTodayPage() {
  return (
    <div className="hairline-b">
      <div className="container-page section-padding">
        <nav className="mb-5 text-caption text-ink-muted dark:text-ink-inverse-muted">
          <span className="text-ink dark:text-ink-inverse">Markets Today</span>
        </nav>

        <Reveal className="mb-8">
          <span className="eyebrow-accent">Markets</span>
          <h1 className="page-title mt-2">Markets Today</h1>
          <p className="deck mt-3 max-w-2xl">
            A live look at where US markets stand right now — major indices,
            gold, rates and Bitcoin — with a quick plain-English read on the
            day.
          </p>
        </Reveal>

        <MarketsToday />
      </div>
    </div>
  )
}
