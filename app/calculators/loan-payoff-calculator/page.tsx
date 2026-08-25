'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { generateHowToSchema } from '@/lib/schema-markup'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)

interface LoanPayoffResults {
  originalPayoffMonths: number
  newPayoffMonths: number
  monthsSaved: number
  interestWithout: number
  interestWith: number
  interestSaved: number
  payoffDate: string
}

export default function LoanPayoffCalculatorPage() {
  const [loanBalance, setLoanBalance] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState('')
  const [extraPayment, setExtraPayment] = useState('')
  const [results, setResults] = useState<LoanPayoffResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const balance = parseFloat(loanBalance)
    const rate = parseFloat(interestRate)
    const payment = parseFloat(monthlyPayment)
    const extra = parseFloat(extraPayment)

    if (!loanBalance || isNaN(balance) || balance <= 0) newErrors.loanBalance = 'Please enter a valid loan balance'
    if (!interestRate || isNaN(rate) || rate <= 0 || rate > 50) newErrors.interestRate = 'Please enter a valid interest rate (0-50%)'
    if (!monthlyPayment || isNaN(payment) || payment <= 0) newErrors.monthlyPayment = 'Please enter a valid monthly payment'
    if (!extraPayment || isNaN(extra) || extra < 0) newErrors.extraPayment = 'Please enter a valid extra payment (0 or more)'

    if (balance > 0 && rate > 0 && payment > 0) {
      const monthlyInterest = balance * (rate / 100 / 12)
      if (payment <= monthlyInterest) {
        newErrors.monthlyPayment = 'Monthly payment must exceed monthly interest of ' + formatCurrency(monthlyInterest)
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculatePayoff = (balance: number, rate: number, payment: number): { months: number; totalInterest: number } => {
    const monthlyRate = rate / 100 / 12
    let remaining = balance
    let months = 0
    let totalInterest = 0
    const maxMonths = 600

    while (remaining > 0 && months < maxMonths) {
      const interest = remaining * monthlyRate
      totalInterest += interest
      const principal = Math.min(payment - interest, remaining)
      remaining -= principal
      months++
      if (remaining < 0.01) remaining = 0
    }

    return { months, totalInterest }
  }

  const calculate = () => {
    if (!validate()) return

    const balance = parseFloat(loanBalance)
    const rate = parseFloat(interestRate)
    const payment = parseFloat(monthlyPayment)
    const extra = parseFloat(extraPayment)

    const withoutExtra = calculatePayoff(balance, rate, payment)
    const withExtra = calculatePayoff(balance, rate, payment + extra)

    const monthsSaved = withoutExtra.months - withExtra.months
    const interestSaved = withoutExtra.totalInterest - withExtra.totalInterest

    const payoffDate = new Date()
    payoffDate.setMonth(payoffDate.getMonth() + withExtra.months)

    setResults({
      originalPayoffMonths: withoutExtra.months,
      newPayoffMonths: withExtra.months,
      monthsSaved,
      interestWithout: withoutExtra.totalInterest,
      interestWith: withExtra.totalInterest,
      interestSaved,
      payoffDate: payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    })
  }

  const formatMonths = (months: number): string => {
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (years === 0) return `${remainingMonths} months`
    if (remainingMonths === 0) return `${years} years`
    return `${years} years, ${remainingMonths} months`
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Loan Payoff with Extra Payments',
    description: 'Calculate how extra payments can help you pay off your loan faster and save on interest.',
    steps: [
      { name: 'Enter loan balance', text: 'Input your current remaining loan balance.' },
      { name: 'Enter interest rate', text: 'Input your annual interest rate.' },
      { name: 'Enter monthly payment', text: 'Input your current required monthly payment.' },
      { name: 'Enter extra payment', text: 'Input the additional amount you want to pay each month.' },
      { name: 'View savings', text: 'See your new payoff date, total interest saved, and time saved.' },
    ],
  })

  return (
    <CalculatorLayout
      title="Loan Payoff Calculator"
      description="Find out how extra payments can help you pay off your loan faster. See your new payoff date, total interest saved, and time saved."
      jsonLd={jsonLd}
      results={
        results ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-brand-off-white p-4 dark:bg-zinc-900">
              <p className="text-sm text-brand-medium-gray dark:text-zinc-400">New Payoff Date</p>
              <p className="text-3xl font-bold text-brand-near-black dark:text-zinc-100">{results.payoffDate}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Interest Saved</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">{formatCurrency(results.interestSaved)}</p>
              </div>
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Time Saved</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">{formatMonths(results.monthsSaved)}</p>
              </div>
            </div>
            <div className="border-t border-brand-border-gray pt-4 dark:border-zinc-700">
              <h3 className="mb-3 font-semibold dark:text-zinc-100">Comparison</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-medium-gray dark:text-zinc-400">Without extra payment</span>
                  <span className="font-medium dark:text-zinc-200">{formatMonths(results.originalPayoffMonths)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-medium-gray dark:text-zinc-400">With extra payment</span>
                  <span className="font-medium dark:text-zinc-200">{formatMonths(results.newPayoffMonths)}</span>
                </div>
                <div className="flex justify-between border-t border-brand-border-gray pt-2 dark:border-zinc-700">
                  <span className="text-brand-medium-gray dark:text-zinc-400">Total interest (without)</span>
                  <span className="font-medium dark:text-zinc-200">{formatCurrency(results.interestWithout)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-medium-gray dark:text-zinc-400">Total interest (with)</span>
                  <span className="font-medium dark:text-zinc-200">{formatCurrency(results.interestWith)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 text-xl font-semibold">Benefits of Extra Loan Payments</h2>
          <div className="space-y-4 text-sm text-brand-dark-gray dark:text-zinc-300">
            <p>Making extra payments on your loan can significantly reduce both the total interest paid and the time it takes to pay off your debt. Even small additional payments can make a big difference over time.</p>
            <p><strong>How it works:</strong> Extra payments go directly toward reducing your principal balance. With a lower principal, less interest accrues each month, meaning more of your regular payment goes toward principal reduction.</p>
            <p><strong>Strategies:</strong> You can make extra payments monthly, bi-weekly (resulting in one extra full payment per year), or as lump sums when you receive bonuses or tax refunds.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="loanBalance" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Current Loan Balance ($)</label>
          <input id="loanBalance" type="number" min="0" value={loanBalance} onChange={(e) => setLoanBalance(e.target.value)} placeholder="200000"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.loanBalance && <p className="mt-1 text-xs text-red-600">{errors.loanBalance}</p>}
        </div>
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Annual Interest Rate (%)</label>
          <input id="interestRate" type="number" min="0" max="50" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="6.5"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.interestRate && <p className="mt-1 text-xs text-red-600">{errors.interestRate}</p>}
        </div>
        <div>
          <label htmlFor="monthlyPayment" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Monthly Payment ($)</label>
          <input id="monthlyPayment" type="number" min="0" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} placeholder="1500"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.monthlyPayment && <p className="mt-1 text-xs text-red-600">{errors.monthlyPayment}</p>}
        </div>
        <div>
          <label htmlFor="extraPayment" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Extra Monthly Payment ($)</label>
          <input id="extraPayment" type="number" min="0" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} placeholder="200"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.extraPayment && <p className="mt-1 text-xs text-red-600">{errors.extraPayment}</p>}
        </div>
        <button onClick={calculate}
          className="w-full rounded-md bg-brand-near-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-zinc dark:bg-zinc-100 dark:text-brand-near-black dark:hover:bg-zinc-200">
          Calculate Payoff
        </button>
      </div>
    </CalculatorLayout>
  )
}
