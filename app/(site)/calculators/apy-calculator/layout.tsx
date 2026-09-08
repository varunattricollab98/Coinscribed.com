import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'APY Calculator - Interest Earned on Savings',
  description:
    'Free APY calculator. See how much interest your savings earn at a given APY over time, and compare what different rates earn on the same balance.',
  alternates: { canonical: '/calculators/apy-calculator' },
  openGraph: {
    title: 'APY Calculator',
    description:
      'Calculate the interest your savings earn at a given APY and time frame.',
    url: `${siteConfig.url}/calculators/apy-calculator`,
    type: 'website',
  },
}

export default function ApyCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
