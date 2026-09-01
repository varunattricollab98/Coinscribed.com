import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { Reveal } from '@/components/motion/Reveal'
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calc, i) => (
            <Reveal key={calc.href} delay={i * 0.05}>
              <Link
                href={calc.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 motion-reduce:transform-none dark:border-hairline-dark dark:bg-elevated dark:hover:border-accent-light/40"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/0 blur-2xl transition-colors duration-300 group-hover:bg-accent/10"
                />
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-sm">
                  <LineIcon name={calc.icon} className="h-6 w-6" />
                </span>
                <h2 className="mt-5 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                  <span className="title-link">{calc.title}</span>
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                  {calc.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-eyebrow font-semibold uppercase text-accent transition-transform duration-150 group-hover:gap-2 dark:text-accent-light">
                  Open Calculator
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  )
}
