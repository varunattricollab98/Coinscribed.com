'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ'
import { calculatorFAQs } from '@/data/calculator-faqs'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema, generateFAQSchema } from '@/lib/schema-markup'

interface SavingsResults {
  futureValue: number
  totalContributions: number
  interestEarned: number
}

export default function SavingsCalculatorPage() {
  const { format: formatCurrency, symbol } = useCurrency()
  const faqItems = calculatorFAQs['savings']
  const [initial, setInitial] = useState('')
  const [monthly, setMonthly] = useState('')
  const [apy, setApy] = useState('')
  const [years, setYears] = useState('')
  const [results, setResults] = useState<SavingsResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const init = parseFloat(initial || '0')
    const mon = parseFloat(monthly || '0')
    const rate = parseFloat(apy)
    const yrs = parseFloat(years)

    if (isNaN(init) || init < 0) newErrors.initial = 'Enter a valid starting amount (0 or more)'
    if (isNaN(mon) || mon < 0) newErrors.monthly = 'Enter a valid monthly amount (0 or more)'
    if (!apy || isNaN(rate) || rate < 0 || rate > 50) newErrors.apy = 'Please enter a valid APY (0-50%)'
    if (!years || isNaN(yrs) || yrs <= 0 || yrs > 100) newErrors.years = 'Please enter a valid time frame (1-100 years)'
    if (init === 0 && mon === 0) newErrors.initial = 'Enter a starting amount or a monthly contribution'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return
    const init = parseFloat(initial || '0')
    const mon = parseFloat(monthly || '0')
    const rate = parseFloat(apy)
    const yrs = parseFloat(years)

    const monthlyRate = rate / 100 / 12
    const months = yrs * 12

    // Future value of the initial deposit plus an ordinary annuity of monthly deposits.
    let futureValue: number
    if (monthlyRate === 0) {
      futureValue = init + mon * months
    } else {
      const growth = Math.pow(1 + monthlyRate, months)
      futureValue = init * growth + mon * ((growth - 1) / monthlyRate)
    }
    const totalContributions = init + mon * months
    const interestEarned = futureValue - totalContributions

    setResults({ futureValue, totalContributions, interestEarned })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Savings Growth',
    description: 'Project how your savings grow with regular contributions and interest.',
    steps: [
      { name: 'Enter starting amount', text: 'Input any money you already have saved.' },
      { name: 'Enter monthly contribution', text: 'Input how much you\u2019ll add each month.' },
      { name: 'Enter APY', text: 'Input the annual percentage yield of your account.' },
      { name: 'Enter time frame', text: 'Input how many years you\u2019ll save.' },
      { name: 'View results', text: 'See your projected balance, contributions, and interest earned.' },
    ],
  })

  return (
    <CalculatorLayout
      canonicalPath="/calculators/savings-calculator"
      relatedReading={[
        { href: '/news/best-high-yield-savings-account', title: 'How to Choose the Best High-Yield Savings Account' },
        { href: '/news/what-is-apy', title: 'What Is APY? (And Is a High APY Worth It?)' },
        { href: '/news/how-to-build-an-emergency-fund', title: 'How to Build an Emergency Fund' },
        { href: '/news/how-to-save-for-a-down-payment', title: 'How to Save for a Down Payment on a House' },
      ]}
      title="Savings Calculator"
      description="See how your savings grow over time with regular monthly contributions and interest. Enter a starting amount, monthly deposit, APY, and time frame."
      jsonLd={[jsonLd, generateFAQSchema(faqItems)]}
      faq={<CalculatorFAQ items={faqItems} />}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">Future Balance</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatCurrency(results.futureValue)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">You Contributed</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalContributions)}</p>
              </div>
              <div>
                <p className="eyebrow">Interest Earned</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-up dark:text-up-light">{formatCurrency(results.interestEarned)}</p>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">How Savings Grow Over Time</h2>
          <div className="space-y-4 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
            <p>
              Your savings balance grows from two sources: the money you deposit, and the
              <strong> interest</strong> that account earns. When that interest is added to your
              balance and then earns interest itself, the growth compounds &mdash; and the longer your
              money stays invested, the larger the share of your balance that comes from interest
              rather than your own deposits.
            </p>
            <p>
              Two habits make the biggest difference: choosing an account with a competitive rate, and
              contributing consistently. Together they turn even modest monthly savings into a
              meaningful balance over the years. Understanding a few core ideas helps you get the most
              from every dollar you set aside.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              The power of compounding
            </h3>
            <p>
              <strong>Compounding</strong> means earning interest on both your original savings and the
              interest you&apos;ve already earned. Early on, the effect looks small, but over many years
              it accelerates as your balance grows. This is why time in the account matters so much:
              money saved sooner has more years to compound than the same amount saved later.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              High-yield vs traditional savings accounts
            </h3>
            <p>
              Many <strong>traditional savings accounts</strong> at big banks pay very little interest,
              while <strong>high-yield savings accounts</strong> (often offered by online banks) tend to
              pay noticeably more. The gap can be significant &mdash; sometimes several percentage
              points &mdash; which multiplies the interest you earn on the same balance. Because rates
              move with the broader economy, compare current offers rather than assuming any fixed
              number, and confirm the account carries deposit insurance.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Comparing accounts with APY
            </h3>
            <p>
              When shopping for a savings account, compare the <strong>APY (annual percentage
              yield)</strong> rather than the stated interest rate. APY reflects the effect of
              compounding over a year, so it gives you an apples-to-apples measure of what you&apos;ll
              actually earn. A higher APY on the same balance means more interest, making it the single
              most useful number for comparison.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Automation, goals, and beating inflation
            </h3>
            <p>
              Setting up <strong>automatic transfers</strong> on payday makes saving consistent and
              removes the temptation to spend first. Tying your savings to specific
              <strong> goals</strong> &mdash; an emergency fund, a down payment, a trip &mdash; helps you
              stay motivated and choose the right time frame. Keep in mind that
              <strong> inflation</strong> slowly erodes the value of idle cash, so earning a competitive
              yield helps your savings at least keep pace with rising prices rather than losing ground.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="initial" className="field-label">Starting Amount ({symbol})</label>
          <input id="initial" type="number" min="0" value={initial} onChange={(e) => setInitial(e.target.value)} placeholder="1000" className="field-input" />
          {errors.initial && <p className="field-error">{errors.initial}</p>}
        </div>
        <div>
          <label htmlFor="monthly" className="field-label">Monthly Contribution ({symbol})</label>
          <input id="monthly" type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="200" className="field-input" />
          {errors.monthly && <p className="field-error">{errors.monthly}</p>}
        </div>
        <div>
          <label htmlFor="apy" className="field-label">Annual Interest Rate / APY (%)</label>
          <input id="apy" type="number" min="0" max="50" step="0.01" value={apy} onChange={(e) => setApy(e.target.value)} placeholder="4.0" className="field-input" />
          {errors.apy && <p className="field-error">{errors.apy}</p>}
        </div>
        <div>
          <label htmlFor="years" className="field-label">Time Frame (years)</label>
          <input id="years" type="number" min="1" max="100" value={years} onChange={(e) => setYears(e.target.value)} placeholder="10" className="field-input" />
          {errors.years && <p className="field-error">{errors.years}</p>}
        </div>
        <button onClick={calculate} className="btn-primary w-full">Calculate Savings</button>
      </div>
    </CalculatorLayout>
  )
}
