import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'EMI Calculator - Calculate Equated Monthly Installment',
  description:
    'Free EMI calculator to determine your Equated Monthly Installment for any loan amount, interest rate, and tenure. See total interest and payment breakdown.',
  openGraph: {
    title: 'EMI Calculator',
    description: 'Calculate your EMI, total interest, and total payment for any loan.',
    url: `${siteConfig.url}/calculators/emi-calculator`,
    type: 'website',
  },
}

export default function EMICalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
