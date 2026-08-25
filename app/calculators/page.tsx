import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'

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

const calculators = [
  {
    title: 'Mortgage Calculator',
    description:
      'Calculate your monthly mortgage payments, total interest paid, and view an amortization summary based on home price, down payment, loan term, and interest rate.',
    href: '/calculators/mortgage-calculator',
  },
  {
    title: '401(k) Calculator',
    description:
      'Project your retirement savings by entering your current age, savings, monthly contributions, expected return rate, and employer match percentage.',
    href: '/calculators/401k-calculator',
  },
  {
    title: 'EMI Calculator',
    description:
      'Determine your Equated Monthly Installment for any loan amount, interest rate, and tenure. See total interest and total payment breakdown.',
    href: '/calculators/emi-calculator',
  },
  {
    title: 'SIP Calculator',
    description:
      'Estimate your Systematic Investment Plan returns over time. Calculate total invested amount, estimated returns, and total corpus value.',
    href: '/calculators/sip-calculator',
  },
  {
    title: 'Loan Payoff Calculator',
    description:
      'Find out how extra payments can help you pay off your loan faster. See your payoff date, total interest saved, and time saved.',
    href: '/calculators/loan-payoff-calculator',
  },
  {
    title: 'Compound Interest Calculator',
    description:
      'See how your money grows with compound interest. Calculate future value and total interest earned across different compounding frequencies.',
    href: '/calculators/compound-interest-calculator',
  },
  {
    title: 'Retirement Calculator',
    description:
      'Plan your retirement by calculating if you are on track. See projected shortfall or surplus and recommended monthly savings.',
    href: '/calculators/retirement-calculator',
  },
]

export default function CalculatorsIndexPage() {
  return (
    <>
      <div className="border-b border-brand-border-gray bg-brand-off-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="container-page py-8 sm:py-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Financial Calculators
          </h1>
          <p className="mt-3 max-w-2xl text-brand-medium-gray dark:text-zinc-400">
            Free, accurate financial calculators to help you make informed
            decisions about mortgages, retirement, investments, and loans.
          </p>
        </div>
      </div>

      <div className="container-page py-8 sm:py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group rounded-lg border border-brand-border-gray bg-white p-6 transition-all hover:border-brand-zinc hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-500"
            >
              <h2 className="text-lg font-semibold group-hover:text-brand-zinc dark:group-hover:text-zinc-200">
                {calc.title}
              </h2>
              <p className="mt-2 text-sm text-brand-medium-gray dark:text-zinc-400">
                {calc.description}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-brand-zinc dark:text-zinc-400">
                Open Calculator &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
