'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema } from '@/lib/schema-markup'


interface EMIResults {
  emi: number
  totalInterest: number
  totalPayment: number
  loanAmount: number
}

export default function EMICalculatorPage() {
  const { format: formatCurrency, symbol } = useCurrency()
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTenure, setLoanTenure] = useState('')
  const [results, setResults] = useState<EMIResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const amount = parseFloat(loanAmount)
    const rate = parseFloat(interestRate)
    const tenure = parseInt(loanTenure)

    if (!loanAmount || isNaN(amount) || amount <= 0) newErrors.loanAmount = 'Please enter a valid loan amount'
    if (!interestRate || isNaN(rate) || rate <= 0 || rate > 50) newErrors.interestRate = 'Please enter a valid interest rate (0-50%)'
    if (!loanTenure || isNaN(tenure) || tenure <= 0 || tenure > 360) newErrors.loanTenure = 'Please enter a valid tenure (1-360 months)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return

    const amount = parseFloat(loanAmount)
    const rate = parseFloat(interestRate)
    const tenure = parseInt(loanTenure)
    const monthlyRate = rate / 100 / 12

    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
    const totalPayment = emi * tenure
    const totalInterest = totalPayment - amount

    setResults({ emi, totalInterest, totalPayment, loanAmount: amount })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate EMI (Equated Monthly Installment)',
    description: 'Calculate your Equated Monthly Installment based on loan amount, interest rate, and loan tenure.',
    steps: [
      { name: 'Enter loan amount', text: 'Input the total amount of loan you want to borrow.' },
      { name: 'Enter interest rate', text: 'Input the annual interest rate offered by your lender.' },
      { name: 'Enter loan tenure', text: 'Input the loan repayment period in months.' },
      { name: 'View EMI results', text: 'See your monthly EMI, total interest payable, and total payment amount.' },
    ],
  })

  return (
    <CalculatorLayout
      title="EMI Calculator"
      description="Calculate your Equated Monthly Installment (EMI) for any loan. See the breakdown of total interest and total payment over the loan tenure."
      jsonLd={jsonLd}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">Monthly EMI</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.emi)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Loan Amount</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.loanAmount)}</p>
              </div>
              <div>
                <p className="eyebrow">Total Interest</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalInterest)}</p>
              </div>
              <div className="col-span-2">
                <p className="eyebrow">Total Payment (Principal + Interest)</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalPayment)}</p>
              </div>
            </div>
            <div className="border-t border-hairline pt-4 dark:border-hairline-dark">
              <h3 className="eyebrow-strong mb-3 block">Payment Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden bg-hairline dark:bg-hairline-dark">
                    <div className="h-full bg-oxblood dark:bg-oxblood-light" style={{ width: `${(results.loanAmount / results.totalPayment) * 100}%` }} />
                  </div>
                  <span className="eyebrow">
                    Principal ({((results.loanAmount / results.totalPayment) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden bg-hairline dark:bg-hairline-dark">
                    <div className="h-full bg-ink-muted dark:bg-ink-inverse-muted" style={{ width: `${(results.totalInterest / results.totalPayment) * 100}%` }} />
                  </div>
                  <span className="eyebrow">
                    Interest ({((results.totalInterest / results.totalPayment) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">Understanding EMI</h2>
          <div className="space-y-4 text-sm text-ink-body dark:text-ink-inverse-body">
            <p>EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender on a specified date each month. EMIs consist of both principal and interest components.</p>
            <p><strong>How EMI is calculated:</strong> EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is the principal loan amount, R is the monthly interest rate, and N is the number of monthly installments.</p>
            <p><strong>Tips to reduce EMI:</strong> You can reduce your EMI by making a larger down payment, choosing a longer tenure (though this increases total interest), or negotiating a lower interest rate with your lender.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="loanAmount" className="field-label">Loan Amount ({symbol})</label>
          <input id="loanAmount" type="number" min="0" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="25000"
            className="field-input" />
          {errors.loanAmount && <p className="field-error">{errors.loanAmount}</p>}
        </div>
        <div>
          <label htmlFor="interestRate" className="field-label">Annual Interest Rate (%)</label>
          <input id="interestRate" type="number" min="0" max="50" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="8.5"
            className="field-input" />
          {errors.interestRate && <p className="field-error">{errors.interestRate}</p>}
        </div>
        <div>
          <label htmlFor="loanTenure" className="field-label">Loan Tenure (months)</label>
          <input id="loanTenure" type="number" min="1" max="360" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} placeholder="60"
            className="field-input" />
          {errors.loanTenure && <p className="field-error">{errors.loanTenure}</p>}
        </div>
        <button onClick={calculate}
          className="btn-primary w-full">
          Calculate EMI
        </button>
      </div>
    </CalculatorLayout>
  )
}
