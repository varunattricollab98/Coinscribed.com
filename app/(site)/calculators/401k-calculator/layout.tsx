import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: '401(k) Calculator - Project Retirement Savings',
  description:
    'Free 401(k) calculator to project your retirement savings with employer matching, compound growth, and monthly contributions over time.',
  alternates: { canonical: '/calculators/401k-calculator' },
  openGraph: {
    title: '401(k) Calculator',
    description:
      'Project your 401(k) retirement savings with employer matching contributions and compound growth.',
    url: `${siteConfig.url}/calculators/401k-calculator`,
    type: 'website',
  },
}

export default function Calculator401kLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
