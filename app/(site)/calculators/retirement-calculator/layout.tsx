import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Retirement Calculator - Plan Your Retirement',
  description:
    'Free retirement calculator to see if you are on track to meet your retirement income goals. Calculate projected savings, shortfall or surplus, and recommended monthly savings.',
  alternates: { canonical: '/calculators/retirement-calculator' },
  openGraph: {
    title: 'Retirement Calculator',
    description: 'Plan your retirement by calculating if you are on track to meet your goals.',
    url: `${siteConfig.url}/calculators/retirement-calculator`,
    type: 'website',
  },
}

export default function RetirementCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
