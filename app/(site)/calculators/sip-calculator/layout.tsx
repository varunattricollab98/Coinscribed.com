import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'SIP Calculator - Systematic Investment Plan Returns',
  description:
    'Free SIP calculator to estimate your Systematic Investment Plan returns. Calculate total invested amount, estimated returns, and total corpus value.',
  alternates: { canonical: '/calculators/sip-calculator' },
  openGraph: {
    title: 'SIP Calculator',
    description: 'Estimate your SIP returns over time with the power of compounding.',
    url: `${siteConfig.url}/calculators/sip-calculator`,
    type: 'website',
  },
}

export default function SIPCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
