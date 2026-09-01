import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Mortgage Calculator - Calculate Monthly Payments',
  description:
    'Free mortgage calculator to estimate monthly payments, total interest, and amortization. Enter home price, down payment, loan term, and interest rate.',
  alternates: { canonical: '/calculators/mortgage-calculator' },
  openGraph: {
    title: 'Mortgage Calculator',
    description:
      'Calculate your monthly mortgage payments, total interest paid, and view a payment summary.',
    url: `${siteConfig.url}/calculators/mortgage-calculator`,
    type: 'website',
  },
}

export default function MortgageCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
