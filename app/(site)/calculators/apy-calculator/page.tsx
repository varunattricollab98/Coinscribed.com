'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ'
import { calculatorFAQs } from '@/data/calculator-faqs'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema, generateFAQSchema } from '@/lib/schema-markup'

interface ApyResults {
  endingBalance: number
  interestEarned: number
  firstYearInterest: number
}

export default function ApyCalculatorPage() {
  const { format: formatCurrency, symbol } = useCurrency()
  const faqItems = calculatorFAQs['apy']
  const [deposit, setDeposit] = useState('')
  const [apy, setApy] = useState('')
  const [years, setYears] = useState('')
  const [results, setResults] = useState<ApyResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const dep = parseFloat(deposit)
    const rate = parseFloat(apy)
    const yrs = parseFloat(years)

    if (!deposit || isNaN(dep) || dep <= 0) newErrors.deposit = 'Please enter a valid deposit amount'
    if (!apy || isNaN(rate) || rate < 0 || rate > 50) newErrors.apy = 'Please enter a valid APY (0-50%)'
    if (!years || isNaN(yrs) || yrs <= 0 || yrs > 100) newErrors.years = 'Please enter a valid time frame (1-100 years)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return
    const dep = parseFloat(deposit)
    const rate = parseFloat(apy) / 100
    const yrs = parseFloat(years)

    // APY already expresses the effective annual yield, so applying it per year
    // (compounded annually) reflects the real return the rate promises.
    const endingBalance = dep * Math.pow(1 + rate, yrs)
    const interestEarned = endingBalance - dep
    const firstYearInterest = dep * rate

    setResults({ endingBalance, interestEarned, firstYearInterest })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Interest from APY',
    description: 'See how much interest your savings earn at a given APY over time.',
    steps: [
      { name: 'Enter deposit', text: 'Input the amount you\u2019re saving.' },
      { name: 'Enter APY', text: 'Input the account\u2019s annual percentage yield.' },
      { name: 'Enter time frame', text: 'Input how many years the money stays invested.' },
      { name: 'View results', text: 'See your ending balance and total interest earned.' },
    ],
  })

  return (
    <CalculatorLayout
      canonicalPath="/calculators/apy-calculator"
      relatedReading={[
        { href: '/news/what-is-apy', title: 'What Is APY? (And Is a High APY Worth It?)' },
        { href: '/news/apr-vs-apy', title: 'APR vs APY: What\u2019s the Difference?' },
        { href: '/news/best-high-yield-savings-account', title: 'How to Choose the Best High-Yield Savings Account' },
      ]}
      title="APY Calculator"
      description="See how much interest your savings earn at a given APY. Enter a deposit, the APY, and a time frame to see your ending balance and total interest."
      jsonLd={[jsonLd, generateFAQSchema(faqItems)]}
      faq={<CalculatorFAQ items={faqItems} />}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">Ending Balance</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatCurrency(results.endingBalance)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Total Interest</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-up dark:text-up-light">{formatCurrency(results.interestEarned)}</p>
              </div>
              <div>
                <p className="eyebrow">First-Year Interest</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.firstYearInterest)}</p>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">What APY Really Tells You</h2>
          <div className="space-y-4 text-sm text-ink-body dark:text-ink-inverse-body">
            <p>APY (Annual Percentage Yield) is the real annual return on a deposit account after compounding is included. Because it already bakes in how often interest compounds, it\u2019s the fairest number for comparing savings accounts and CDs.</p>
            <p><strong>Rate matters enormously:</strong> the same balance earns roughly ten times more at 4% APY than at a typical 0.4% big-bank rate \u2014 which is why moving cash to a high-yield account is one of the easiest money wins.</p>
            <p><strong>APY vs APR:</strong> APY is what you earn on savings (includes compounding); APR is what you pay to borrow. Compare like with like.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="deposit" className="field-label">Deposit Amount ({symbol})</label>
          <input id="deposit" type="number" min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="10000" className="field-input" />
          {errors.deposit && <p className="field-error">{errors.deposit}</p>}
        </div>
        <div>
          <label htmlFor="apy" className="field-label">APY (%)</label>
          <input id="apy" type="number" min="0" max="50" step="0.01" value={apy} onChange={(e) => setApy(e.target.value)} placeholder="4.5" className="field-input" />
          {errors.apy && <p className="field-error">{errors.apy}</p>}
        </div>
        <div>
          <label htmlFor="years" className="field-label">Time Frame (years)</label>
          <input id="years" type="number" min="1" max="100" value={years} onChange={(e) => setYears(e.target.value)} placeholder="5" className="field-input" />
          {errors.years && <p className="field-error">{errors.years}</p>}
        </div>
        <button onClick={calculate} className="btn-primary w-full">Calculate Interest</button>
      </div>
    </CalculatorLayout>
  )
}
