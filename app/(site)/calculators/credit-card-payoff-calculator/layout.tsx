import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Credit Card Payoff Calculator - Pay Off Debt Faster',
  description:
    'Free credit card payoff calculator. See how long it takes to clear your balance, the total interest you\u2019ll pay, and how much faster a bigger payment gets you debt-free.',
  alternates: { canonical: '/calculators/credit-card-payoff-calculator' },
  openGraph: {
    title: 'Credit Card Payoff Calculator',
    description:
      'See how long to pay off your credit card, total interest, and how a bigger payment speeds it up.',
    url: `${siteConfig.url}/calculators/credit-card-payoff-calculator`,
    type: 'website',
  },
}

export default function CreditCardPayoffCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
