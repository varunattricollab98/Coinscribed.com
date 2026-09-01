'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema } from '@/lib/schema-markup'


interface SIPResults {
  totalInvested: number
  estimatedReturns: number
  totalValue: number
}

export default function SIPCalculatorPage() {
  const { format: formatCurrency, symbol } = useCurrency()
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
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">Total Value</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalValue)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Total Invested</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalInvested)}</p>
              </div>
              <div>
                <p className="eyebrow">Estimated Returns</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.estimatedReturns)}</p>
              </div>
            </div>
            <div className="border-t border-hairline pt-4 dark:border-hairline-dark">
              <h3 className="eyebrow-strong mb-3 block">Investment Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden bg-hairline dark:bg-hairline-dark">
                    <div className="h-full bg-oxblood dark:bg-oxblood-light" style={{ width: `${(results.totalInvested / results.totalValue) * 100}%` }} />
                  </div>
                  <span className="eyebrow">
                    Invested ({((results.totalInvested / results.totalValue) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden bg-hairline dark:bg-hairline-dark">
                    <div className="h-full bg-ink-muted dark:bg-ink-inverse-muted" style={{ width: `${(results.estimatedReturns / results.totalValue) * 100}%` }} />
                  </div>
                  <span className="eyebrow">
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
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">Understanding SIP Investments</h2>
          <div className="space-y-4 text-sm text-ink-body dark:text-ink-inverse-body">
            <p>A Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds or other investments. It helps build wealth over time through the discipline of regular investing and the power of compounding.</p>
            <p><strong>Dollar Cost Averaging:</strong> By investing a fixed amount regularly, you buy more units when prices are low and fewer when prices are high, averaging out your cost over time.</p>
            <p><strong>Power of Compounding:</strong> Your returns earn their own returns over time, creating a snowball effect. The longer you stay invested, the more significant the compounding effect becomes.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="monthlyInvestment" className="field-label">Monthly Investment ({symbol})</label>
          <input id="monthlyInvestment" type="number" min="0" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} placeholder="500"
            className="field-input" />
          {errors.monthlyInvestment && <p className="field-error">{errors.monthlyInvestment}</p>}
        </div>
        <div>
          <label htmlFor="expectedReturn" className="field-label">Expected Annual Return (%)</label>
          <input id="expectedReturn" type="number" min="0" max="50" step="0.1" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} placeholder="12"
            className="field-input" />
          {errors.expectedReturn && <p className="field-error">{errors.expectedReturn}</p>}
        </div>
        <div>
          <label htmlFor="timePeriod" className="field-label">Time Period (years)</label>
          <input id="timePeriod" type="number" min="1" max="50" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} placeholder="10"
            className="field-input" />
          {errors.timePeriod && <p className="field-error">{errors.timePeriod}</p>}
        </div>
        <button onClick={calculate}
          className="btn-primary w-full">
          Calculate SIP Returns
        </button>
      </div>
    </CalculatorLayout>
  )
}
