'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { generateHowToSchema } from '@/lib/schema-markup'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)

interface EMIResults {
  emi: number
  totalInterest: number
  totalPayment: number
  loanAmount: number
}

export default function EMICalculatorPage() {
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
            <div className="rounded-lg bg-brand-off-white p-4 dark:bg-zinc-900">
              <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Monthly EMI</p>
              <p className="text-3xl font-bold text-brand-near-black dark:text-zinc-100">{formatCurrency(results.emi)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Loan Amount</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.loanAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Total Interest</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.totalInterest)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Total Payment (Principal + Interest)</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.totalPayment)}</p>
              </div>
            </div>
            <div className="border-t border-brand-border-gray pt-4 dark:border-zinc-700">
              <h3 className="mb-2 font-semibold dark:text-zinc-100">Payment Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-brand-border-gray dark:bg-zinc-700">
                    <div className="h-full rounded-full bg-brand-near-black dark:bg-zinc-300" style={{ width: `${(results.loanAmount / results.totalPayment) * 100}%` }} />
                  </div>
                  <span className="text-xs text-brand-medium-gray dark:text-zinc-400">
                    Principal ({((results.loanAmount / results.totalPayment) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-brand-border-gray dark:bg-zinc-700">
                    <div className="h-full rounded-full bg-brand-zinc dark:bg-zinc-500" style={{ width: `${(results.totalInterest / results.totalPayment) * 100}%` }} />
                  </div>
                  <span className="text-xs text-brand-medium-gray dark:text-zinc-400">
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
          <h2 className="mb-4 text-xl font-semibold">Understanding EMI</h2>
          <div className="space-y-4 text-sm text-brand-dark-gray dark:text-zinc-300">
            <p>EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender on a specified date each month. EMIs consist of both principal and interest components.</p>
            <p><strong>How EMI is calculated:</strong> EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is the principal loan amount, R is the monthly interest rate, and N is the number of monthly installments.</p>
            <p><strong>Tips to reduce EMI:</strong> You can reduce your EMI by making a larger down payment, choosing a longer tenure (though this increases total interest), or negotiating a lower interest rate with your lender.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Loan Amount ($)</label>
          <input id="loanAmount" type="number" min="0" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="25000"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.loanAmount && <p className="mt-1 text-xs text-red-600">{errors.loanAmount}</p>}
        </div>
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Annual Interest Rate (%)</label>
          <input id="interestRate" type="number" min="0" max="50" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="8.5"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.interestRate && <p className="mt-1 text-xs text-red-600">{errors.interestRate}</p>}
        </div>
        <div>
          <label htmlFor="loanTenure" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Loan Tenure (months)</label>
          <input id="loanTenure" type="number" min="1" max="360" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} placeholder="60"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.loanTenure && <p className="mt-1 text-xs text-red-600">{errors.loanTenure}</p>}
        </div>
        <button onClick={calculate}
          className="w-full rounded-md bg-brand-near-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-zinc dark:bg-zinc-100 dark:text-brand-near-black dark:hover:bg-zinc-200">
          Calculate EMI
        </button>
      </div>
    </CalculatorLayout>
  )
}
