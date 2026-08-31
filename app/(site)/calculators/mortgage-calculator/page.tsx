'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { generateHowToSchema } from '@/lib/schema-markup'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const formatCurrencyDetailed = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

interface MortgageResults {
  monthlyPayment: number
  totalInterest: number
  totalPayment: number
  loanAmount: number
}

export default function MortgageCalculatorPage() {
  const [homePrice, setHomePrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [loanTerm, setLoanTerm] = useState('30')
  const [interestRate, setInterestRate] = useState('')
  const [results, setResults] = useState<MortgageResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const price = parseFloat(homePrice)
    const down = parseFloat(downPayment)
    const rate = parseFloat(interestRate)

    if (!homePrice || isNaN(price) || price <= 0) {
      newErrors.homePrice = 'Please enter a valid home price'
    }
    if (!downPayment || isNaN(down) || down < 0) {
      newErrors.downPayment = 'Please enter a valid down payment'
    }
    if (down >= price) {
      newErrors.downPayment = 'Down payment must be less than home price'
    }
    if (!interestRate || isNaN(rate) || rate <= 0 || rate > 50) {
      newErrors.interestRate = 'Please enter a valid interest rate (0-50%)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return

    const price = parseFloat(homePrice)
    const down = parseFloat(downPayment)
    const rate = parseFloat(interestRate)
    const years = parseInt(loanTerm)

    const loanAmount = price - down
    const monthlyRate = rate / 100 / 12
    const numPayments = years * 12

    const monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)

    const totalPayment = monthlyPayment * numPayments
    const totalInterest = totalPayment - loanAmount

    setResults({
      monthlyPayment,
      totalInterest,
      totalPayment,
      loanAmount,
    })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Your Mortgage Payment',
    description:
      'Calculate your monthly mortgage payment based on home price, down payment, loan term, and interest rate.',
    steps: [
      { name: 'Enter home price', text: 'Input the total purchase price of the home you are considering.' },
      { name: 'Enter down payment', text: 'Input the amount you plan to pay upfront as a down payment.' },
      { name: 'Select loan term', text: 'Choose between a 15-year or 30-year fixed-rate mortgage.' },
      { name: 'Enter interest rate', text: 'Input the annual interest rate offered by your lender.' },
      { name: 'View results', text: 'See your estimated monthly payment, total interest, and total cost of the loan.' },
    ],
  })

  return (
    <CalculatorLayout
      title="Mortgage Calculator"
      description="Calculate your monthly mortgage payments, total interest paid, and view a payment summary based on your home price, down payment, loan term, and interest rate."
      jsonLd={jsonLd}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-oxblood bg-wash px-4 py-4 dark:border-oxblood-light dark:bg-wash-dark">
              <p className="eyebrow">Monthly Payment</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatCurrencyDetailed(results.monthlyPayment)}
              </p>
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
              <div>
                <p className="eyebrow">Total Payment</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalPayment)}</p>
              </div>
              <div>
                <p className="eyebrow">Loan Term</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{loanTerm} years</p>
              </div>
            </div>
            <div className="border-t border-hairline pt-4 dark:border-hairline-dark">
              <h3 className="eyebrow-strong mb-3 block">Amortization Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">Principal</span>
                  <span className="font-medium tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">Interest</span>
                  <span className="font-medium tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="flex justify-between border-t border-hairline pt-2 dark:border-hairline-dark">
                  <span className="font-medium tabular-nums text-ink dark:text-ink-inverse">Total Cost</span>
                  <span className="font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalPayment)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">Understanding Mortgage Payments</h2>
          <div className="space-y-4 text-sm text-ink-body dark:text-ink-inverse-body">
            <p>
              A mortgage payment consists of principal and interest (P&amp;I). The principal is the
              amount you borrowed, while interest is the cost of borrowing that money.
            </p>
            <p>
              <strong>15-year vs 30-year:</strong> A 15-year mortgage has higher monthly payments
              but significantly less total interest paid. A 30-year mortgage has lower monthly
              payments but costs more over the life of the loan.
            </p>
            <p>
              <strong>Down payment:</strong> A larger down payment reduces your loan amount and
              monthly payment. Putting down 20% or more typically eliminates the need for private
              mortgage insurance (PMI).
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="homePrice" className="field-label">
            Home Price ($)
          </label>
          <input
            id="homePrice"
            type="number"
            min="0"
            value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)}
            placeholder="350000"
            className="field-input"
          />
          {errors.homePrice && <p className="field-error">{errors.homePrice}</p>}
        </div>
        <div>
          <label htmlFor="downPayment" className="field-label">
            Down Payment ($)
          </label>
          <input
            id="downPayment"
            type="number"
            min="0"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder="70000"
            className="field-input"
          />
          {errors.downPayment && <p className="field-error">{errors.downPayment}</p>}
        </div>
        <div>
          <label htmlFor="loanTerm" className="field-label">
            Loan Term
          </label>
          <select
            id="loanTerm"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="field-input"
          >
            <option value="15">15 Years</option>
            <option value="30">30 Years</option>
          </select>
        </div>
        <div>
          <label htmlFor="interestRate" className="field-label">
            Annual Interest Rate (%)
          </label>
          <input
            id="interestRate"
            type="number"
            min="0"
            max="50"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="6.5"
            className="field-input"
          />
          {errors.interestRate && <p className="field-error">{errors.interestRate}</p>}
        </div>
        <button
          onClick={calculate}
          className="btn-primary w-full"
        >
          Calculate
        </button>
      </div>
    </CalculatorLayout>
  )
}
