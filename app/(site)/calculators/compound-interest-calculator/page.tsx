'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { generateHowToSchema } from '@/lib/schema-markup'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)

interface CompoundResults {
  futureValue: number
  totalInterest: number
  principal: number
}

const compoundingOptions = [
  { value: '1', label: 'Annually' },
  { value: '2', label: 'Semi-annually' },
  { value: '4', label: 'Quarterly' },
  { value: '12', label: 'Monthly' },
  { value: '365', label: 'Daily' },
]

export default function CompoundInterestCalculatorPage() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [time, setTime] = useState('')
  const [frequency, setFrequency] = useState('12')
  const [results, setResults] = useState<CompoundResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const p = parseFloat(principal)
    const r = parseFloat(rate)
    const t = parseFloat(time)

    if (!principal || isNaN(p) || p <= 0) newErrors.principal = 'Please enter a valid principal amount'
    if (!rate || isNaN(r) || r <= 0 || r > 100) newErrors.rate = 'Please enter a valid interest rate (0-100%)'
    if (!time || isNaN(t) || t <= 0 || t > 100) newErrors.time = 'Please enter a valid time period (1-100 years)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return

    const p = parseFloat(principal)
    const r = parseFloat(rate) / 100
    const t = parseFloat(time)
    const n = parseInt(frequency)

    // A = P(1 + r/n)^(nt)
    const futureValue = p * Math.pow(1 + r / n, n * t)
    const totalInterest = futureValue - p

    setResults({ futureValue, totalInterest, principal: p })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Compound Interest',
    description: 'Calculate compound interest on your investment based on principal, rate, time, and compounding frequency.',
    steps: [
      { name: 'Enter principal amount', text: 'Input the initial amount you are investing or depositing.' },
      { name: 'Enter interest rate', text: 'Input the annual interest rate as a percentage.' },
      { name: 'Enter time period', text: 'Input the number of years you plan to keep the money invested.' },
      { name: 'Select compounding frequency', text: 'Choose how often interest is compounded: annually, semi-annually, quarterly, monthly, or daily.' },
      { name: 'View results', text: 'See the future value of your investment and total interest earned.' },
    ],
  })

  return (
    <CalculatorLayout
      title="Compound Interest Calculator"
      description="See how your money grows with compound interest. Calculate future value and total interest earned across different compounding frequencies."
      jsonLd={jsonLd}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">Future Value</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.futureValue)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Principal</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.principal)}</p>
              </div>
              <div>
                <p className="eyebrow">Total Interest Earned</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalInterest)}</p>
              </div>
            </div>
            <div className="border-t border-hairline pt-4 dark:border-hairline-dark">
              <h3 className="eyebrow-strong mb-3 block">Growth Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden bg-hairline dark:bg-hairline-dark">
                    <div className="h-full bg-oxblood dark:bg-oxblood-light" style={{ width: `${(results.principal / results.futureValue) * 100}%` }} />
                  </div>
                  <span className="eyebrow">
                    Principal ({((results.principal / results.futureValue) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden bg-hairline dark:bg-hairline-dark">
                    <div className="h-full bg-ink-muted dark:bg-ink-inverse-muted" style={{ width: `${(results.totalInterest / results.futureValue) * 100}%` }} />
                  </div>
                  <span className="eyebrow">
                    Interest ({((results.totalInterest / results.futureValue) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-hairline pt-4 dark:border-hairline-dark">
              <p className="text-caption tabular-nums text-ink-muted dark:text-ink-inverse-muted">
                Compounding: {compoundingOptions.find((o) => o.value === frequency)?.label} | Rate: {rate}% | Period: {time} years
              </p>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">Understanding Compound Interest</h2>
          <div className="space-y-4 text-sm text-ink-body dark:text-ink-inverse-body">
            <p>Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. It is often called &quot;interest on interest&quot; and is the mechanism that makes your money grow exponentially over time.</p>
            <p><strong>The Formula:</strong> A = P(1 + r/n)^(nt), where A is the future value, P is the principal, r is the annual rate, n is the compounding frequency, and t is time in years.</p>
            <p><strong>Compounding Frequency:</strong> The more frequently interest is compounded, the more total interest you earn. Daily compounding yields slightly more than monthly, which yields more than annually.</p>
            <p><strong>The Rule of 72:</strong> A quick way to estimate how long it takes to double your money is to divide 72 by the annual interest rate. For example, at 6% interest, your money doubles in approximately 12 years.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="principal" className="field-label">Principal Amount ($)</label>
          <input id="principal" type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="10000"
            className="field-input" />
          {errors.principal && <p className="field-error">{errors.principal}</p>}
        </div>
        <div>
          <label htmlFor="rate" className="field-label">Annual Interest Rate (%)</label>
          <input id="rate" type="number" min="0" max="100" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="7"
            className="field-input" />
          {errors.rate && <p className="field-error">{errors.rate}</p>}
        </div>
        <div>
          <label htmlFor="time" className="field-label">Time Period (years)</label>
          <input id="time" type="number" min="1" max="100" value={time} onChange={(e) => setTime(e.target.value)} placeholder="10"
            className="field-input" />
          {errors.time && <p className="field-error">{errors.time}</p>}
        </div>
        <div>
          <label htmlFor="frequency" className="field-label">Compounding Frequency</label>
          <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}
            className="field-input">
            {compoundingOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <button onClick={calculate}
          className="btn-primary w-full">
          Calculate
        </button>
      </div>
    </CalculatorLayout>
  )
}
