import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Loan Payoff Calculator - Pay Off Debt Faster',
  description:
    'Free loan payoff calculator to see how extra payments help you pay off your loan faster. Calculate new payoff date, interest saved, and time saved.',
  alternates: { canonical: '/calculators/loan-payoff-calculator' },
  openGraph: {
    title: 'Loan Payoff Calculator',
    description: 'Find out how extra payments can help you pay off your loan faster and save on interest.',
    url: `${siteConfig.url}/calculators/loan-payoff-calculator`,
    type: 'website',
  },
}

export default function LoanPayoffCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
