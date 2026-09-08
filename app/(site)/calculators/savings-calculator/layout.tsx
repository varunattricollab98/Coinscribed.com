import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Savings Calculator - Project Your Savings Growth',
  description:
    'Free savings calculator. See how your money grows with regular monthly contributions and interest (APY) over time, and how much of your balance is interest earned.',
  alternates: { canonical: '/calculators/savings-calculator' },
  openGraph: {
    title: 'Savings Calculator',
    description:
      'Project how your savings grow with monthly contributions and compound interest over time.',
    url: `${siteConfig.url}/calculators/savings-calculator`,
    type: 'website',
  },
}

export default function SavingsCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
