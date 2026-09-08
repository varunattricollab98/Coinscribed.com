import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Roth IRA Calculator - Project Your Tax-Free Retirement',
  description:
    'Free Roth IRA calculator. Project your tax-free retirement balance from your age, current savings, annual contributions, and expected rate of return.',
  alternates: { canonical: '/calculators/roth-ira-calculator' },
  openGraph: {
    title: 'Roth IRA Calculator',
    description:
      'Project your tax-free Roth IRA balance at retirement from contributions and expected returns.',
    url: `${siteConfig.url}/calculators/roth-ira-calculator`,
    type: 'website',
  },
}

export default function RothIraCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
