'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ'
import { calculatorFAQs } from '@/data/calculator-faqs'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema, generateFAQSchema } from '@/lib/schema-markup'


interface Results401k {
  projectedSavings: number
  totalContributions: number
  totalEmployerMatch: number
  totalGrowth: number
  yearsToRetirement: number
}

export default function Calculator401kPage() {
  const { format: formatCurrency, symbol } = useCurrency()
  const faqItems = calculatorFAQs['401k']
  const [currentAge, setCurrentAge] = useState('')
  const [retirementAge, setRetirementAge] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [expectedReturn, setExpectedReturn] = useState('')
  const [employerMatch, setEmployerMatch] = useState('')
  const [results, setResults] = useState<Results401k | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const age = parseInt(currentAge)
    const retAge = parseInt(retirementAge)
    const savings = parseFloat(currentSavings)
    const contribution = parseFloat(monthlyContribution)
    const returnRate = parseFloat(expectedReturn)
    const match = parseFloat(employerMatch)

    if (!currentAge || isNaN(age) || age < 18 || age > 80) {
      newErrors.currentAge = 'Enter a valid age (18-80)'
    }
    if (!retirementAge || isNaN(retAge) || retAge <= age || retAge > 100) {
      newErrors.retirementAge = 'Retirement age must be greater than current age'
    }
    if (!currentSavings || isNaN(savings) || savings < 0) {
      newErrors.currentSavings = 'Enter a valid amount (0 or more)'
    }
    if (!monthlyContribution || isNaN(contribution) || contribution < 0) {
      newErrors.monthlyContribution = 'Enter a valid monthly contribution'
    }
    if (!expectedReturn || isNaN(returnRate) || returnRate < 0 || returnRate > 30) {
      newErrors.expectedReturn = 'Enter a valid return rate (0-30%)'
    }
    if (!employerMatch || isNaN(match) || match < 0 || match > 100) {
      newErrors.employerMatch = 'Enter a valid match percentage (0-100%)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return

    const age = parseInt(currentAge)
    const retAge = parseInt(retirementAge)
    const savings = parseFloat(currentSavings)
    const contribution = parseFloat(monthlyContribution)
    const returnRate = parseFloat(expectedReturn)
    const match = parseFloat(employerMatch)

    const yearsToRetirement = retAge - age
    const monthlyReturn = returnRate / 100 / 12
    const totalMonths = yearsToRetirement * 12
    const totalMonthlyContrib = contribution * (1 + match / 100)

    let balance = savings
    let totalContributions = 0
    let totalEmployerMatchAmount = 0

    for (let i = 0; i < totalMonths; i++) {
      balance += balance * monthlyReturn
      balance += totalMonthlyContrib
      totalContributions += contribution
      totalEmployerMatchAmount += contribution * (match / 100)
    }

    setResults({
      projectedSavings: balance,
      totalContributions,
      totalEmployerMatch: totalEmployerMatchAmount,
      totalGrowth: balance - savings - totalContributions - totalEmployerMatchAmount,
      yearsToRetirement,
    })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Your 401(k) Retirement Savings',
    description: 'Project your 401(k) retirement savings based on contributions, employer match, and expected returns.',
    steps: [
      { name: 'Enter your current age', text: 'Input your current age to determine the time horizon for your investments.' },
      { name: 'Enter retirement age', text: 'Choose the age at which you plan to retire.' },
      { name: 'Enter current savings', text: 'Input your current 401(k) balance.' },
      { name: 'Enter monthly contribution', text: 'Input how much you contribute to your 401(k) each month.' },
      { name: 'Enter expected return and employer match', text: 'Input your expected annual return rate and employer match percentage.' },
      { name: 'View projected savings', text: 'See your projected retirement savings at your target retirement age.' },
    ],
  })

  return (
    <CalculatorLayout
      canonicalPath="/calculators/401k-calculator"
      relatedReading={[
        { href: '/news/401k-employer-match-explained', title: '401(k) Employer Match Explained' },
        { href: '/news/how-much-to-contribute-to-401k', title: 'How Much Should I Contribute to My 401(k)?' },
        { href: '/news/what-is-a-good-credit-score', title: 'What Is a Good Credit Score?' },
      ]}
      title="401(k) Calculator"
      description="Project your 401(k) retirement savings with employer matching contributions, compound growth, and monthly contributions over time."
      jsonLd={[jsonLd, generateFAQSchema(faqItems)]}
      faq={<CalculatorFAQ items={faqItems} />}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">Projected Retirement Savings</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatCurrency(results.projectedSavings)}
              </p>
              <p className="eyebrow mt-2 block">
                In {results.yearsToRetirement} years
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Your Contributions</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalContributions)}</p>
              </div>
              <div>
                <p className="eyebrow">Employer Match</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalEmployerMatch)}</p>
              </div>
              <div>
                <p className="eyebrow">Investment Growth</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalGrowth)}</p>
              </div>
              <div>
                <p className="eyebrow">Initial Savings</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(parseFloat(currentSavings) || 0)}</p>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">Understanding Your 401(k)</h2>
          <div className="space-y-4 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
            <p>
              A <strong>401(k)</strong> is an employer-sponsored retirement plan that lets you set
              aside part of each paycheck for the future. Contributions come straight out of your pay
              before you ever see the money, which makes saving automatic and consistent. Over a full
              career, steady contributions combined with investment growth can turn modest monthly
              amounts into a substantial nest egg.
            </p>
            <p>
              What makes a 401(k) especially powerful is the mix of tax advantages, potential employer
              matching, and decades of compounding. Understanding how each piece works helps you decide
              how much to contribute and which type of account fits your situation.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Employee contributions and 2026 limits
            </h3>
            <p>
              You choose what percentage of your salary to contribute, and the IRS sets an annual cap.
              As of <strong>2026</strong>, employees can contribute up to <strong>$24,500</strong> of
              their own money. If you are age 50 or older, a <strong>catch-up contribution</strong> of
              an extra <strong>$8,000</strong> is allowed, and workers aged 60 to 63 can use a larger
              &quot;super catch-up&quot; of <strong>$11,250</strong> instead. Contributing consistently,
              even below the maximum, is what matters most over time.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Employer match: do not leave free money on the table
            </h3>
            <p>
              Many employers match a portion of what you contribute. A common formula is 50% of your
              contributions up to 6% of your salary, though terms vary. This match is effectively a{' '}
              <strong>guaranteed return</strong> on your savings and is one of the best deals in
              personal finance. At a minimum, try to contribute enough to capture the full match;
              anything less leaves free money on the table.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Traditional vs Roth 401(k)
            </h3>
            <p>
              A <strong>traditional 401(k)</strong> uses pre-tax dollars, lowering your taxable income
              today, but your withdrawals in retirement are taxed as ordinary income. A{' '}
              <strong>Roth 401(k)</strong> uses after-tax dollars now, so qualified withdrawals in
              retirement are tax-free. Traditional often suits those who expect a lower tax rate later,
              while Roth can favor those who expect higher rates or want tax-free income in retirement.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Compounding and vesting
            </h3>
            <p>
              The real engine of a 401(k) is <strong>compounding</strong>: your investment returns earn
              their own returns, and over several decades that growth can dwarf your contributions.
              Starting early gives your money more time to compound. Keep in mind that employer match
              dollars may be subject to a <strong>vesting schedule</strong>, meaning you earn full
              ownership of them only after staying with the company for a set number of years. Your own
              contributions are always 100% yours.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="currentAge" className="field-label">Current Age</label>
          <input id="currentAge" type="number" min="18" max="80" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} placeholder="30"
            className="field-input" />
          {errors.currentAge && <p className="field-error">{errors.currentAge}</p>}
        </div>
        <div>
          <label htmlFor="retirementAge" className="field-label">Retirement Age</label>
          <input id="retirementAge" type="number" min="18" max="100" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} placeholder="65"
            className="field-input" />
          {errors.retirementAge && <p className="field-error">{errors.retirementAge}</p>}
        </div>
        <div>
          <label htmlFor="currentSavings" className="field-label">Current 401(k) Balance ({symbol})</label>
          <input id="currentSavings" type="number" min="0" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} placeholder="50000"
            className="field-input" />
          {errors.currentSavings && <p className="field-error">{errors.currentSavings}</p>}
        </div>
        <div>
          <label htmlFor="monthlyContribution" className="field-label">Monthly Contribution ({symbol})</label>
          <input id="monthlyContribution" type="number" min="0" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} placeholder="500"
            className="field-input" />
          {errors.monthlyContribution && <p className="field-error">{errors.monthlyContribution}</p>}
        </div>
        <div>
          <label htmlFor="expectedReturn" className="field-label">Expected Annual Return (%)</label>
          <input id="expectedReturn" type="number" min="0" max="30" step="0.1" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} placeholder="7"
            className="field-input" />
          {errors.expectedReturn && <p className="field-error">{errors.expectedReturn}</p>}
        </div>
        <div>
          <label htmlFor="employerMatch" className="field-label">Employer Match (%)</label>
          <input id="employerMatch" type="number" min="0" max="100" step="1" value={employerMatch} onChange={(e) => setEmployerMatch(e.target.value)} placeholder="50"
            className="field-input" />
          <p className="mt-1.5 text-caption text-ink-muted dark:text-ink-inverse-muted">Percentage of your contribution that your employer matches</p>
          {errors.employerMatch && <p className="field-error">{errors.employerMatch}</p>}
        </div>
        <button onClick={calculate}
          className="btn-primary w-full">
          Calculate
        </button>
      </div>
    </CalculatorLayout>
  )
}
