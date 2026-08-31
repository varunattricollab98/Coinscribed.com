import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { LineIcon, type LineIconName } from '@/components/icons/LineIcon'

export const metadata: Metadata = {
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

const calculators: {
  title: string
  description: string
  href: string
  icon: LineIconName
}[] = [
  {
    title: 'Mortgage Calculator',
    description:
      'Calculate your monthly mortgage payments, total interest paid, and view an amortization summary based on home price, down payment, loan term, and interest rate.',
    href: '/calculators/mortgage-calculator',
    icon: 'house',
  },
  {
    title: '401(k) Calculator',
    description:
      'Project your retirement savings by entering your current age, savings, monthly contributions, expected return rate, and employer match percentage.',
    href: '/calculators/401k-calculator',
    icon: 'trend-up',
  },
  {
    title: 'EMI Calculator',
    description:
      'Determine your Equated Monthly Installment for any loan amount, interest rate, and tenure. See total interest and total payment breakdown.',
    href: '/calculators/emi-calculator',
    icon: 'card',
  },
  {
    title: 'SIP Calculator',
    description:
      'Estimate your Systematic Investment Plan returns over time. Calculate total invested amount, estimated returns, and total corpus value.',
    href: '/calculators/sip-calculator',
    icon: 'bars',
  },
  {
    title: 'Loan Payoff Calculator',
    description:
      'Find out how extra payments can help you pay off your loan faster. See your payoff date, total interest saved, and time saved.',
    href: '/calculators/loan-payoff-calculator',
    icon: 'target',
  },
  {
    title: 'Compound Interest Calculator',
    description:
      'See how your money grows with compound interest. Calculate future value and total interest earned across different compounding frequencies.',
    href: '/calculators/compound-interest-calculator',
    icon: 'coins',
  },
  {
    title: 'Retirement Calculator',
    description:
      'Plan your retirement by calculating if you are on track. See projected shortfall or surplus and recommended monthly savings.',
    href: '/calculators/retirement-calculator',
    icon: 'umbrella',
  },
]

export default function CalculatorsIndexPage() {
  return (
    <>
      <div className="hairline-b">
        <div className="container-page py-10 sm:py-14">
          <span className="eyebrow">Tools</span>
          <h1 className="page-title mt-1.5">Financial Calculators</h1>
          <p className="mt-3 max-w-2xl text-ink-body dark:text-ink-inverse-body">
            Free, accurate financial calculators to help you make informed
            decisions about mortgages, retirement, investments, and loans.
          </p>
        </div>
      </div>

      <div className="container-page py-10 sm:py-14">
        <div className="rule-grid sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group rule-cell-hover flex flex-col px-5 py-6 sm:px-6"
            >
              <LineIcon
                name={calc.icon}
                className="h-6 w-6 text-oxblood dark:text-oxblood-lighter"
              />
              <h2 className="mt-4 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                <span className="title-link">{calc.title}</span>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                {calc.description}
              </p>
              <span className="eyebrow-accent mt-4 inline-block">
                Open Calculator &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
