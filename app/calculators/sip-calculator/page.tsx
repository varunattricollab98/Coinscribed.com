'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { generateHowToSchema } from '@/lib/schema-markup'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

interface SIPResults {
  totalInvested: number
  estimatedReturns: number
  totalValue: number
}

export default function SIPCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState('')
  const [expectedReturn, setExpectedReturn] = useState('')
  const [timePeriod, setTimePeriod] = useState('')
  const [results, setResults] = useState<SIPResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const investment = parseFloat(monthlyInvestment)
    const returnRate = parseFloat(expectedReturn)
    const time = parseInt(timePeriod)

    if (!monthlyInvestment || isNaN(investment) || investment <= 0) newErrors.monthlyInvestment = 'Please enter a valid monthly investment'
    if (!expectedReturn || isNaN(returnRate) || returnRate <= 0 || returnRate > 50) newErrors.expectedReturn = 'Please enter a valid return rate (0-50%)'
    if (!timePeriod || isNaN(time) || time <= 0 || time > 50) newErrors.timePeriod = 'Please enter a valid time period (1-50 years)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return

    const investment = parseFloat(monthlyInvestment)
    const returnRate = parseFloat(expectedReturn)
    const time = parseInt(timePeriod)

    const monthlyRate = returnRate / 100 / 12
    const totalMonths = time * 12
    const totalInvested = investment * totalMonths

    // SIP Future Value = P * [(1 + r)^n - 1] / r * (1 + r)
    const totalValue = investment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
    const estimatedReturns = totalValue - totalInvested

    setResults({ totalInvested, estimatedReturns, totalValue })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate SIP Returns',
    description: 'Calculate your Systematic Investment Plan returns based on monthly investment, expected return rate, and time period.',
    steps: [
      { name: 'Enter monthly investment', text: 'Input the amount you plan to invest every month through SIP.' },
      { name: 'Enter expected return rate', text: 'Input the expected annual return rate for your investment.' },
      { name: 'Enter time period', text: 'Input the number of years you plan to continue the SIP.' },
      { name: 'View SIP results', text: 'See your total invested amount, estimated returns, and total corpus value.' },
    ],
  })

  return (
    <CalculatorLayout
      title="SIP Calculator"
      description="Calculate your Systematic Investment Plan (SIP) returns. See how regular monthly investments grow over time with the power of compounding."
      jsonLd={jsonLd}
      results={
        results ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-brand-off-white p-4 dark:bg-zinc-900">
              <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Total Value</p>
              <p className="text-3xl font-bold text-brand-near-black dark:text-zinc-100">{formatCurrency(results.totalValue)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Total Invested</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.totalInvested)}</p>
              </div>
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Estimated Returns</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.estimatedReturns)}</p>
              </div>
            </div>
            <div className="border-t border-brand-border-gray pt-4 dark:border-zinc-700">
              <h3 className="mb-2 font-semibold dark:text-zinc-100">Investment Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-brand-border-gray dark:bg-zinc-700">
                    <div className="h-full rounded-full bg-brand-near-black dark:bg-zinc-300" style={{ width: `${(results.totalInvested / results.totalValue) * 100}%` }} />
                  </div>
                  <span className="text-xs text-brand-medium-gray dark:text-zinc-400">
                    Invested ({((results.totalInvested / results.totalValue) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-brand-border-gray dark:bg-zinc-700">
                    <div className="h-full rounded-full bg-brand-zinc dark:bg-zinc-500" style={{ width: `${(results.estimatedReturns / results.totalValue) * 100}%` }} />
                  </div>
                  <span className="text-xs text-brand-medium-gray dark:text-zinc-400">
                    Returns ({((results.estimatedReturns / results.totalValue) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 text-xl font-semibold">Understanding SIP Investments</h2>
          <div className="space-y-4 text-sm text-brand-dark-gray dark:text-zinc-300">
            <p>A Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds or other investments. It helps build wealth over time through the discipline of regular investing and the power of compounding.</p>
            <p><strong>Dollar Cost Averaging:</strong> By investing a fixed amount regularly, you buy more units when prices are low and fewer when prices are high, averaging out your cost over time.</p>
            <p><strong>Power of Compounding:</strong> Your returns earn their own returns over time, creating a snowball effect. The longer you stay invested, the more significant the compounding effect becomes.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="monthlyInvestment" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Monthly Investment ($)</label>
          <input id="monthlyInvestment" type="number" min="0" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} placeholder="500"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.monthlyInvestment && <p className="mt-1 text-xs text-red-600">{errors.monthlyInvestment}</p>}
        </div>
        <div>
          <label htmlFor="expectedReturn" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Expected Annual Return (%)</label>
          <input id="expectedReturn" type="number" min="0" max="50" step="0.1" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} placeholder="12"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.expectedReturn && <p className="mt-1 text-xs text-red-600">{errors.expectedReturn}</p>}
        </div>
        <div>
          <label htmlFor="timePeriod" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Time Period (years)</label>
          <input id="timePeriod" type="number" min="1" max="50" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} placeholder="10"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.timePeriod && <p className="mt-1 text-xs text-red-600">{errors.timePeriod}</p>}
        </div>
        <button onClick={calculate}
          className="w-full rounded-md bg-brand-near-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-zinc dark:bg-zinc-100 dark:text-brand-near-black dark:hover:bg-zinc-200">
          Calculate SIP Returns
        </button>
      </div>
    </CalculatorLayout>
  )
}
