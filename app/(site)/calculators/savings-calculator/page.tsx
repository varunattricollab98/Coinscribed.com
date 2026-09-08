'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ'
import { calculatorFAQs } from '@/data/calculator-faqs'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema, generateFAQSchema } from '@/lib/schema-markup'

interface SavingsResults {
  futureValue: number
  totalContributions: number
  interestEarned: number
}

export default function SavingsCalculatorPage() {
  const { format: formatCurrency, symbol } = useCurrency()
  const faqItems = calculatorFAQs['savings']
  const [initial, setInitial] = useState('')
  const [monthly, setMonthly] = useState('')
  const [apy, setApy] = useState('')
  const [years, setYears] = useState('')
  const [results, setResults] = useState<SavingsResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const init = parseFloat(initial || '0')
    const mon = parseFloat(monthly || '0')
    const rate = parseFloat(apy)
    const yrs = parseFloat(years)

    if (isNaN(init) || init < 0) newErrors.initial = 'Enter a valid starting amount (0 or more)'
    if (isNaN(mon) || mon < 0) newErrors.monthly = 'Enter a valid monthly amount (0 or more)'
    if (!apy || isNaN(rate) || rate < 0 || rate > 50) newErrors.apy = 'Please enter a valid APY (0-50%)'
    if (!years || isNaN(yrs) || yrs <= 0 || yrs > 100) newErrors.years = 'Please enter a valid time frame (1-100 years)'
    if (init === 0 && mon === 0) newErrors.initial = 'Enter a starting amount or a monthly contribution'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return
    const init = parseFloat(initial || '0')
    const mon = parseFloat(monthly || '0')
    const rate = parseFloat(apy)
    const yrs = parseFloat(years)

    const monthlyRate = rate / 100 / 12
    const months = yrs * 12

    // Future value of the initial deposit plus an ordinary annuity of monthly deposits.
    let futureValue: number
    if (monthlyRate === 0) {
      futureValue = init + mon * months
    } else {
      const growth = Math.pow(1 + monthlyRate, months)
      futureValue = init * growth + mon * ((growth - 1) / monthlyRate)
    }
    const totalContributions = init + mon * months
    const interestEarned = futureValue - totalContributions

    setResults({ futureValue, totalContributions, interestEarned })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Savings Growth',
    description: 'Project how your savings grow with regular contributions and interest.',
    steps: [
      { name: 'Enter starting amount', text: 'Input any money you already have saved.' },
      { name: 'Enter monthly contribution', text: 'Input how much you\u2019ll add each month.' },
      { name: 'Enter APY', text: 'Input the annual percentage yield of your account.' },
      { name: 'Enter time frame', text: 'Input how many years you\u2019ll save.' },
      { name: 'View results', text: 'See your projected balance, contributions, and interest earned.' },
    ],
  })

  return (
    <CalculatorLayout
      relatedReading={[
        { href: '/news/best-high-yield-savings-account', title: 'How to Choose the Best High-Yield Savings Account' },
        { href: '/news/what-is-apy', title: 'What Is APY? (And Is a High APY Worth It?)' },
        { href: '/news/how-to-build-an-emergency-fund', title: 'How to Build an Emergency Fund' },
      ]}
      title="Savings Calculator"
      description="See how your savings grow over time with regular monthly contributions and interest. Enter a starting amount, monthly deposit, APY, and time frame."
      jsonLd={[jsonLd, generateFAQSchema(faqItems)]}
      faq={<CalculatorFAQ items={faqItems} />}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">Future Balance</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatCurrency(results.futureValue)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">You Contributed</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalContributions)}</p>
              </div>
              <div>
                <p className="eyebrow">Interest Earned</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-up dark:text-up-light">{formatCurrency(results.interestEarned)}</p>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">How Savings Grow Over Time</h2>
          <div className="space-y-4 text-sm text-ink-body dark:text-ink-inverse-body">
            <p>Your balance grows from two sources: the money you contribute, and the interest that compounds on it. The longer your time frame and the higher the APY, the larger the share that comes from interest rather than your own deposits.</p>
            <p><strong>Rate matters:</strong> moving savings from a traditional account (often well under 1% APY) to a high-yield account (recently around 4%) can multiply the interest you earn on the same balance.</p>
            <p><strong>Consistency matters more:</strong> steady monthly contributions, even small ones, compound into a substantial balance over years.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="initial" className="field-label">Starting Amount ({symbol})</label>
          <input id="initial" type="number" min="0" value={initial} onChange={(e) => setInitial(e.target.value)} placeholder="1000" className="field-input" />
          {errors.initial && <p className="field-error">{errors.initial}</p>}
        </div>
        <div>
          <label htmlFor="monthly" className="field-label">Monthly Contribution ({symbol})</label>
          <input id="monthly" type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="200" className="field-input" />
          {errors.monthly && <p className="field-error">{errors.monthly}</p>}
        </div>
        <div>
          <label htmlFor="apy" className="field-label">Annual Interest Rate / APY (%)</label>
          <input id="apy" type="number" min="0" max="50" step="0.01" value={apy} onChange={(e) => setApy(e.target.value)} placeholder="4.0" className="field-input" />
          {errors.apy && <p className="field-error">{errors.apy}</p>}
        </div>
        <div>
          <label htmlFor="years" className="field-label">Time Frame (years)</label>
          <input id="years" type="number" min="1" max="100" value={years} onChange={(e) => setYears(e.target.value)} placeholder="10" className="field-input" />
          {errors.years && <p className="field-error">{errors.years}</p>}
        </div>
        <button onClick={calculate} className="btn-primary w-full">Calculate Savings</button>
      </div>
    </CalculatorLayout>
  )
}
