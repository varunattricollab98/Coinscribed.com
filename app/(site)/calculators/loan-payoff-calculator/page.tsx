'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ'
import { calculatorFAQs } from '@/data/calculator-faqs'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema, generateFAQSchema } from '@/lib/schema-markup'


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
  const { format: formatCurrency, symbol } = useCurrency()
  const faqItems = calculatorFAQs['loan-payoff']
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
      canonicalPath="/calculators/loan-payoff-calculator"
      relatedReading={[
        { href: '/news/debt-snowball-vs-avalanche', title: 'Debt Snowball vs Debt Avalanche: Which Is Faster?' },
        { href: '/news/how-to-build-an-emergency-fund', title: 'How to Build an Emergency Fund' },
        { href: '/news/what-is-apr', title: 'What Is APR? (And What Counts as a Good One?)' },
      ]}
      title="Loan Payoff Calculator"
      description="Find out how extra payments can help you pay off your loan faster. See your new payoff date, total interest saved, and time saved."
      jsonLd={[jsonLd, generateFAQSchema(faqItems)]}
      faq={<CalculatorFAQ items={faqItems} />}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">New Payoff Date</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">{results.payoffDate}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Interest Saved</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-up dark:text-up-light">{formatCurrency(results.interestSaved)}</p>
              </div>
              <div>
                <p className="eyebrow">Time Saved</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-up dark:text-up-light">{formatMonths(results.monthsSaved)}</p>
              </div>
            </div>
            <div className="border-t border-hairline pt-4 dark:border-hairline-dark">
              <h3 className="eyebrow-strong mb-3 block">Comparison</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">Without extra payment</span>
                  <span className="font-medium tabular-nums text-ink dark:text-ink-inverse">{formatMonths(results.originalPayoffMonths)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">With extra payment</span>
                  <span className="font-medium tabular-nums text-ink dark:text-ink-inverse">{formatMonths(results.newPayoffMonths)}</span>
                </div>
                <div className="flex justify-between border-t border-hairline pt-2 dark:border-hairline-dark">
                  <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">Total interest (without)</span>
                  <span className="font-medium tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.interestWithout)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">Total interest (with)</span>
                  <span className="font-medium tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.interestWith)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">Benefits of Extra Loan Payments</h2>
          <div className="space-y-4 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
            <p>
              Paying more than your required monthly amount is one of the most reliable ways to get
              out of debt faster and keep more of your money. Because interest is charged on your
              outstanding balance, every extra dollar you send toward <strong>principal</strong>
              lowers the balance that future interest is calculated on &mdash; a benefit that compounds
              month after month.
            </p>
            <p>
              Even modest extra payments add up. Trimming years off a loan not only saves interest, it
              frees up cash flow sooner and reduces the risk that a long-term debt outlives your
              financial plans. The key is to make sure your extra payments are applied to principal,
              not treated as an early payment of next month&apos;s bill.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              How extra principal shortens your loan
            </h3>
            <p>
              When you pay extra toward <strong>principal</strong>, the balance drops faster than the
              original schedule assumed. Less interest accrues the following month, so a larger share
              of your next regular payment also goes to principal. This snowball effect shortens the
              <strong> term</strong> of the loan and can cut the <strong>total interest</strong> you
              pay substantially over the life of the loan.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              The biweekly payment strategy
            </h3>
            <p>
              With a <strong>biweekly payment</strong> plan you pay half your monthly amount every two
              weeks. Because there are 52 weeks in a year, you make 26 half-payments &mdash; the
              equivalent of 13 full monthly payments instead of 12. That one extra payment each year
              goes straight to principal, quietly shortening your loan without a large change to your
              budget. Confirm your lender applies the payments correctly rather than holding them.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Putting windfalls to work
            </h3>
            <p>
              Lump sums such as a tax refund, work bonus, or gift can make a big dent when applied to
              principal. Because these <strong>windfalls</strong> are money you weren&apos;t relying on
              for daily expenses, directing even part of them to your loan accelerates payoff without
              straining your regular budget. Applying a windfall early in the loan has the greatest
              effect on total interest saved.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              When extra payments may not be the best move
            </h3>
            <p>
              First, check for a <strong>prepayment penalty</strong> &mdash; some loans charge a fee
              for paying ahead of schedule, which can offset the savings. It also often makes sense to
              tackle <strong>higher-interest debt</strong> (such as credit cards) before prepaying a
              lower-rate loan, and to build a basic <strong>emergency fund</strong> first so an
              unexpected expense doesn&apos;t force you into costly borrowing. Once those are covered,
              extra payments are usually a smart use of spare cash.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="loanBalance" className="field-label">Current Loan Balance ({symbol})</label>
          <input id="loanBalance" type="number" min="0" value={loanBalance} onChange={(e) => setLoanBalance(e.target.value)} placeholder="200000"
            className="field-input" />
          {errors.loanBalance && <p className="field-error">{errors.loanBalance}</p>}
        </div>
        <div>
          <label htmlFor="interestRate" className="field-label">Annual Interest Rate (%)</label>
          <input id="interestRate" type="number" min="0" max="50" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="6.5"
            className="field-input" />
          {errors.interestRate && <p className="field-error">{errors.interestRate}</p>}
        </div>
        <div>
          <label htmlFor="monthlyPayment" className="field-label">Monthly Payment ({symbol})</label>
          <input id="monthlyPayment" type="number" min="0" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} placeholder="1500"
            className="field-input" />
          {errors.monthlyPayment && <p className="field-error">{errors.monthlyPayment}</p>}
        </div>
        <div>
          <label htmlFor="extraPayment" className="field-label">Extra Monthly Payment ({symbol})</label>
          <input id="extraPayment" type="number" min="0" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} placeholder="200"
            className="field-input" />
          {errors.extraPayment && <p className="field-error">{errors.extraPayment}</p>}
        </div>
        <button onClick={calculate}
          className="btn-primary w-full">
          Calculate Payoff
        </button>
      </div>
    </CalculatorLayout>
  )
}
