'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ'
import { calculatorFAQs } from '@/data/calculator-faqs'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema, generateFAQSchema } from '@/lib/schema-markup'

interface CardResults {
  months: number
  totalInterest: number
  totalPaid: number
  payoffDate: string
}

export default function CreditCardPayoffCalculatorPage() {
  const { format: formatCurrency, symbol } = useCurrency()
  const faqItems = calculatorFAQs['credit-card-payoff']
  const [balance, setBalance] = useState('')
  const [apr, setApr] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState('')
  const [results, setResults] = useState<CardResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const bal = parseFloat(balance)
    const rate = parseFloat(apr)
    const pay = parseFloat(monthlyPayment)

    if (!balance || isNaN(bal) || bal <= 0) newErrors.balance = 'Please enter a valid balance'
    if (!apr || isNaN(rate) || rate < 0 || rate > 60) newErrors.apr = 'Please enter a valid APR (0-60%)'
    if (!monthlyPayment || isNaN(pay) || pay <= 0) newErrors.monthlyPayment = 'Please enter a valid monthly payment'

    if (bal > 0 && rate > 0 && pay > 0) {
      const monthlyInterest = bal * (rate / 100 / 12)
      if (pay <= monthlyInterest) {
        newErrors.monthlyPayment =
          'Your payment must exceed the first month\u2019s interest of ' +
          formatCurrency(monthlyInterest) +
          ' or the balance never goes down.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return
    const bal = parseFloat(balance)
    const rate = parseFloat(apr)
    const pay = parseFloat(monthlyPayment)
    const monthlyRate = rate / 100 / 12

    let remaining = bal
    let months = 0
    let totalInterest = 0
    const maxMonths = 1200

    while (remaining > 0 && months < maxMonths) {
      const interest = remaining * monthlyRate
      totalInterest += interest
      const principal = Math.min(pay - interest, remaining)
      remaining -= principal
      months++
      if (remaining < 0.01) remaining = 0
    }

    const payoffDate = new Date()
    payoffDate.setMonth(payoffDate.getMonth() + months)

    setResults({
      months,
      totalInterest,
      totalPaid: bal + totalInterest,
      payoffDate: payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    })
  }

  const formatMonths = (months: number): string => {
    const years = Math.floor(months / 12)
    const rem = months % 12
    if (years === 0) return `${rem} months`
    if (rem === 0) return `${years} year${years > 1 ? 's' : ''}`
    return `${years} yr, ${rem} mo`
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Credit Card Payoff',
    description: 'See how long it takes to pay off a credit card and the total interest you\u2019ll pay.',
    steps: [
      { name: 'Enter balance', text: 'Input your current credit card balance.' },
      { name: 'Enter APR', text: 'Input your card\u2019s annual percentage rate.' },
      { name: 'Enter monthly payment', text: 'Input how much you can pay each month.' },
      { name: 'View results', text: 'See your payoff time, total interest, and payoff date.' },
    ],
  })

  return (
    <CalculatorLayout
      canonicalPath="/calculators/credit-card-payoff-calculator"
      relatedReading={[
        { href: '/news/how-to-pay-off-credit-card-debt', title: 'How to Pay Off Credit Card Debt Fast' },
        { href: '/news/debt-snowball-vs-avalanche', title: 'Debt Snowball vs Debt Avalanche' },
        { href: '/news/what-is-apr', title: 'What Is APR? (And What Counts as a Good One?)' },
      ]}
      title="Credit Card Payoff Calculator"
      description="See how long it will take to pay off your credit card, how much interest you\u2019ll pay, and your payoff date \u2014 based on your balance, APR, and monthly payment."
      jsonLd={[jsonLd, generateFAQSchema(faqItems)]}
      faq={<CalculatorFAQ items={faqItems} />}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">Time to Pay Off</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatMonths(results.months)}
              </p>
              <p className="mt-1 text-caption text-ink-muted dark:text-ink-inverse-muted">Debt-free by {results.payoffDate}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Total Interest</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-down dark:text-down-light">{formatCurrency(results.totalInterest)}</p>
              </div>
              <div>
                <p className="eyebrow">Total Paid</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalPaid)}</p>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">Why Credit Card Interest Adds Up So Fast</h2>
          <div className="space-y-4 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
            <p>
              Credit cards carry some of the <strong>highest interest rates</strong> of any common
              debt, and that interest typically compounds daily. The result is that a balance you only
              make minimum payments on barely moves, while the cost quietly grows. Understanding how
              card interest works is the first step to escaping it.
            </p>
            <p>
              The good news is that credit card debt is very responsive to a plan. Paying more than the
              minimum, targeting the right balances first, and using the right tools can cut both your
              payoff time and your total interest dramatically.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              High APRs and daily compounding
            </h3>
            <p>
              Card issuers usually quote an <strong>APR</strong> (Annual Percentage Rate), but interest
              is often charged daily based on your balance. Because each day&apos;s interest is added to
              the balance the next day&apos;s interest is calculated on, the cost compounds quickly.
              Carrying a balance from month to month is expensive, which is why paying in full whenever
              possible is so valuable.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              The minimum-payment trap
            </h3>
            <p>
              Minimum payments are typically set just above the monthly interest charge, so most of the
              payment goes to interest and very little to principal. Paying only the minimum can stretch
              repayment over many years. Even a <strong>modest increase</strong> above the minimum
              dramatically shortens the payoff timeline and reduces the total interest you pay.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Avalanche vs snowball
            </h3>
            <p>
              With multiple cards, two popular strategies help. The <strong>avalanche method</strong>{' '}
              directs extra money to the highest-APR balance first, which saves the most in interest.
              The <strong>snowball method</strong> pays off the smallest balance first for a quick win
              and motivation. Both work; the best one is the one you will actually stick with.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Balance transfers and practical tips
            </h3>
            <p>
              A <strong>balance transfer</strong> to a card with a 0% introductory APR can pause
              interest for a set period, letting more of your payment attack the principal. Watch for
              transfer fees and the rate that applies once the promotion ends. Alongside that, pausing
              new charges, setting a fixed monthly amount above the minimum, and automating payments are
              simple habits that speed up payoff.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="balance" className="field-label">Credit Card Balance ({symbol})</label>
          <input id="balance" type="number" min="0" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="5000" className="field-input" />
          {errors.balance && <p className="field-error">{errors.balance}</p>}
        </div>
        <div>
          <label htmlFor="apr" className="field-label">APR (%)</label>
          <input id="apr" type="number" min="0" max="60" step="0.01" value={apr} onChange={(e) => setApr(e.target.value)} placeholder="22.9" className="field-input" />
          {errors.apr && <p className="field-error">{errors.apr}</p>}
        </div>
        <div>
          <label htmlFor="monthlyPayment" className="field-label">Monthly Payment ({symbol})</label>
          <input id="monthlyPayment" type="number" min="0" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} placeholder="250" className="field-input" />
          {errors.monthlyPayment && <p className="field-error">{errors.monthlyPayment}</p>}
        </div>
        <button onClick={calculate} className="btn-primary w-full">Calculate Payoff</button>
      </div>
    </CalculatorLayout>
  )
}
