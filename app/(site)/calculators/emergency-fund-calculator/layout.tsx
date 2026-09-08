import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Emergency Fund Calculator - How Much Should You Save?',
  description:
    'Free emergency fund calculator. Find your target based on monthly expenses and months of coverage, and see how long it takes to reach it at your savings rate.',
  alternates: { canonical: '/calculators/emergency-fund-calculator' },
  openGraph: {
    title: 'Emergency Fund Calculator',
    description:
      'Find how much you need in an emergency fund and how long it takes to save it.',
    url: `${siteConfig.url}/calculators/emergency-fund-calculator`,
    type: 'website',
  },
}

export default function EmergencyFundCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
