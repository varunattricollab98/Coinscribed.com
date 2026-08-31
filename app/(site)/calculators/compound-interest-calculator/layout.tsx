import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Compound Interest Calculator - Calculate Investment Growth',
  description:
    'Free compound interest calculator to see how your money grows over time. Calculate future value and total interest earned across different compounding frequencies.',
  openGraph: {
    title: 'Compound Interest Calculator',
    description: 'See how your money grows with compound interest across different compounding frequencies.',
    url: `${siteConfig.url}/calculators/compound-interest-calculator`,
    type: 'website',
  },
}

export default function CompoundInterestCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
