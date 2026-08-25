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
            <div className="rounded-lg bg-brand-off-white p-4 dark:bg-zinc-900">
              <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Future Value</p>
              <p className="text-3xl font-bold text-brand-near-black dark:text-zinc-100">{formatCurrency(results.futureValue)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Principal</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.principal)}</p>
              </div>
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Total Interest Earned</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.totalInterest)}</p>
              </div>
            </div>
            <div className="border-t border-brand-border-gray pt-4 dark:border-zinc-700">
              <h3 className="mb-2 font-semibold dark:text-zinc-100">Growth Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-brand-border-gray dark:bg-zinc-700">
                    <div className="h-full rounded-full bg-brand-near-black dark:bg-zinc-300" style={{ width: `${(results.principal / results.futureValue) * 100}%` }} />
                  </div>
                  <span className="text-xs text-brand-medium-gray dark:text-zinc-400">
                    Principal ({((results.principal / results.futureValue) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-brand-border-gray dark:bg-zinc-700">
                    <div className="h-full rounded-full bg-brand-zinc dark:bg-zinc-500" style={{ width: `${(results.totalInterest / results.futureValue) * 100}%` }} />
                  </div>
                  <span className="text-xs text-brand-medium-gray dark:text-zinc-400">
                    Interest ({((results.totalInterest / results.futureValue) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-md bg-brand-light-gray p-3 dark:bg-zinc-900">
              <p className="text-xs text-brand-medium-gray dark:text-zinc-400">
                Compounding: {compoundingOptions.find((o) => o.value === frequency)?.label} | Rate: {rate}% | Period: {time} years
              </p>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 text-xl font-semibold">Understanding Compound Interest</h2>
          <div className="space-y-4 text-sm text-brand-dark-gray dark:text-zinc-300">
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
          <label htmlFor="principal" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Principal Amount ($)</label>
          <input id="principal" type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="10000"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.principal && <p className="mt-1 text-xs text-red-600">{errors.principal}</p>}
        </div>
        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Annual Interest Rate (%)</label>
          <input id="rate" type="number" min="0" max="100" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="7"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.rate && <p className="mt-1 text-xs text-red-600">{errors.rate}</p>}
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Time Period (years)</label>
          <input id="time" type="number" min="1" max="100" value={time} onChange={(e) => setTime(e.target.value)} placeholder="10"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
        </div>
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Compounding Frequency</label>
          <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
            {compoundingOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <button onClick={calculate}
          className="w-full rounded-md bg-brand-near-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-zinc dark:bg-zinc-100 dark:text-brand-near-black dark:hover:bg-zinc-200">
          Calculate
        </button>
      </div>
    </CalculatorLayout>
  )
}
