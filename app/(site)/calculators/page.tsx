import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { Reveal } from '@/components/motion/Reveal'
import { calculators } from '@/data/calculators'
import { CalculatorGrid } from '@/components/calculators/CalculatorGrid'

export const metadata: Metadata = {
  alternates: { canonical: '/calculators' },
  title: 'Financial Calculators',
  description:
    'Free online financial calculators for mortgage, retirement, compound interest, EMI, SIP, loan payoff, and 401(k) planning. Make informed financial decisions.',
  openGraph: {
    title: 'Financial Calculators',
    description:
      'Free online financial calculators for mortgage, retirement, compound interest, EMI, SIP, loan payoff, and 401(k) planning.',
    url: `${siteConfig.url}/calculators`,
    type: 'website',
  },
}

export default function CalculatorsIndexPage() {
  return (
    <>
      <div className="hairline-b">
        <div className="container-page py-10 sm:py-14">
          <Reveal>
            <span className="eyebrow">Tools</span>
            <h1 className="page-title mt-1.5">Financial Calculators</h1>
            <p className="mt-3 max-w-2xl text-ink-body dark:text-ink-inverse-body">
              Free, accurate financial calculators to help you make informed
              decisions about mortgages, retirement, investments, and loans.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="container-page py-10 sm:py-14">
        <CalculatorGrid calculators={calculators} />
      </div>
    </>
  )
}
