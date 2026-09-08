import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Auto Loan Calculator - Estimate Your Car Payment',
  description:
    'Free auto loan calculator to estimate your monthly car payment, total interest, and total cost. Enter vehicle price, down payment, trade-in, rate, and term.',
  alternates: { canonical: '/calculators/auto-loan-calculator' },
  openGraph: {
    title: 'Auto Loan Calculator',
    description:
      'Estimate your monthly car payment, total interest, and total loan cost.',
    url: `${siteConfig.url}/calculators/auto-loan-calculator`,
    type: 'website',
  },
}

export default function AutoLoanCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
