import type { LineIconName } from '@/components/icons/LineIcon'

/**
 * Single source of truth for the site's calculators — used by the calculators
 * hub page, the homepage highlights, the "related calculator" card on articles,
 * and the site-search index. Keeping this in one place means a new calculator
 * is added once and appears everywhere consistently.
 */
export interface CalculatorInfo {
  title: string
  /** Short slug key (last path segment), handy for lookups. */
  key: string
  href: string
  icon: LineIconName
  description: string
}

export const calculators: CalculatorInfo[] = [
  {
    title: 'Mortgage Calculator',
    key: 'mortgage-calculator',
    href: '/calculators/mortgage-calculator',
    icon: 'house',
    description:
      'Calculate your monthly mortgage payments, total interest paid, and view an amortization summary based on home price, down payment, loan term, and interest rate.',
  },
  {
    title: '401(k) Calculator',
    key: '401k-calculator',
    href: '/calculators/401k-calculator',
    icon: 'trend-up',
    description:
      'Project your retirement savings by entering your current age, savings, monthly contributions, expected return rate, and employer match percentage.',
  },
  {
    title: 'EMI Calculator',
    key: 'emi-calculator',
    href: '/calculators/emi-calculator',
    icon: 'card',
    description:
      'Determine your Equated Monthly Installment for any loan amount, interest rate, and tenure. See total interest and total payment breakdown.',
  },
  {
    title: 'SIP Calculator',
    key: 'sip-calculator',
    href: '/calculators/sip-calculator',
    icon: 'bars',
    description:
      'Estimate your Systematic Investment Plan returns over time. Calculate total invested amount, estimated returns, and total corpus value.',
  },
  {
    title: 'Loan Payoff Calculator',
    key: 'loan-payoff-calculator',
    href: '/calculators/loan-payoff-calculator',
    icon: 'target',
    description:
      'Find out how extra payments can help you pay off your loan faster. See your payoff date, total interest saved, and time saved.',
  },
  {
    title: 'Compound Interest Calculator',
    key: 'compound-interest-calculator',
    href: '/calculators/compound-interest-calculator',
    icon: 'coins',
    description:
      'See how your money grows with compound interest. Calculate future value and total interest earned across different compounding frequencies.',
  },
  {
    title: 'Retirement Calculator',
    key: 'retirement-calculator',
    href: '/calculators/retirement-calculator',
    icon: 'umbrella',
    description:
      'Plan your retirement by calculating if you are on track. See projected shortfall or surplus and recommended monthly savings.',
  },
]

/** Look up a calculator by its slug key (e.g. "mortgage-calculator"). */
export function getCalculator(key: string): CalculatorInfo | undefined {
  return calculators.find((c) => c.key === key)
}
