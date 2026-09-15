'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ'
import { calculatorFAQs } from '@/data/calculator-faqs'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema, generateFAQSchema } from '@/lib/schema-markup'

interface EFResults {
  target: number
  alreadySaved: number
  remaining: number
  monthsToGoal: number | null
}

export default function EmergencyFundCalculatorPage() {
  const { format: formatCurrency, symbol } = useCurrency()
  const faqItems = calculatorFAQs['emergency-fund']
  const [expenses, setExpenses] = useState('')
  const [months, setMonths] = useState('6')
  const [saved, setSaved] = useState('')
  const [monthlySaving, setMonthlySaving] = useState('')
  const [results, setResults] = useState<EFResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const exp = parseFloat(expenses)
    const mo = parseFloat(months)
    const sv = parseFloat(saved || '0')
    const ms = parseFloat(monthlySaving || '0')

    if (!expenses || isNaN(exp) || exp <= 0) newErrors.expenses = 'Please enter your monthly essential expenses'
    if (!months || isNaN(mo) || mo <= 0 || mo > 24) newErrors.months = 'Enter months of coverage (1-24)'
    if (isNaN(sv) || sv < 0) newErrors.saved = 'Enter a valid amount already saved (0 or more)'
    if (isNaN(ms) || ms < 0) newErrors.monthlySaving = 'Enter a valid monthly saving (0 or more)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return
    const exp = parseFloat(expenses)
    const mo = parseFloat(months)
    const sv = parseFloat(saved || '0')
    const ms = parseFloat(monthlySaving || '0')

    const target = exp * mo
    const remaining = Math.max(0, target - sv)
    const monthsToGoal = ms > 0 && remaining > 0 ? Math.ceil(remaining / ms) : remaining <= 0 ? 0 : null

    setResults({ target, alreadySaved: sv, remaining, monthsToGoal })
  }

  const formatMonths = (m: number): string => {
    if (m === 0) return 'Goal reached'
    const years = Math.floor(m / 12)
    const rem = m % 12
    if (years === 0) return `${rem} month${rem > 1 ? 's' : ''}`
    if (rem === 0) return `${years} year${years > 1 ? 's' : ''}`
    return `${years} yr, ${rem} mo`
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Your Emergency Fund',
    description: 'Find how much you need in an emergency fund and how long it takes to save it.',
    steps: [
      { name: 'Enter monthly expenses', text: 'Input your essential monthly living costs.' },
      { name: 'Choose months of coverage', text: 'Pick how many months of expenses to cover (commonly 3-6).' },
      { name: 'Enter amount saved', text: 'Input what you already have set aside.' },
      { name: 'Enter monthly saving', text: 'Input how much you can save each month.' },
      { name: 'View results', text: 'See your target, remaining amount, and time to reach it.' },
    ],
  })

  return (
    <CalculatorLayout
      canonicalPath="/calculators/emergency-fund-calculator"
      relatedReading={[
        { href: '/news/how-to-build-an-emergency-fund', title: 'How to Build an Emergency Fund' },
        { href: '/news/best-high-yield-savings-account', title: 'How to Choose the Best High-Yield Savings Account' },
        { href: '/news/debt-snowball-vs-avalanche', title: 'Debt Snowball vs Debt Avalanche' },
      ]}
      title="Emergency Fund Calculator"
      description="Find out how much you should keep in your emergency fund based on your monthly expenses, and how long it takes to reach your target at your current savings rate."
      jsonLd={[jsonLd, generateFAQSchema(faqItems)]}
      faq={<CalculatorFAQ items={faqItems} />}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">Emergency Fund Target</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatCurrency(results.target)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Still to Save</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.remaining)}</p>
              </div>
              <div>
                <p className="eyebrow">Time to Goal</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-up dark:text-up-light">
                  {results.monthsToGoal === null ? '—' : formatMonths(results.monthsToGoal)}
                </p>
              </div>
            </div>
            {results.monthsToGoal === null && (
              <p className="text-caption text-ink-muted dark:text-ink-inverse-muted">Enter a monthly saving amount to see how long it takes to reach your goal.</p>
            )}
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">How Big Should Your Emergency Fund Be?</h2>
          <div className="space-y-4 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
            <p>
              An <strong>emergency fund</strong> is money set aside to cover unexpected costs like a job
              loss, medical bill, or urgent car or home repair. Its job is to keep a surprise from
              turning into debt, so it should be safe, accessible, and separate from your everyday
              spending money.
            </p>
            <p>
              The right size depends on your situation, but a clear target makes it easier to save with
              purpose. Once you know your monthly essentials, you can decide how many months of coverage
              you want and build toward it step by step.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              The three-to-six-month rule
            </h3>
            <p>
              The classic guideline is <strong>three to six months</strong> of essential expenses. Aim
              for the lower end if you have stable income and a dual-earner household, and the higher end
              if your income is variable, you are a sole earner, or you work in a field where finding a
              new job can take longer. Some people keep even more for extra peace of mind.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              What counts as essential expenses
            </h3>
            <p>
              Base your target on <strong>essential</strong> costs, not your full budget. That means
              rent or mortgage, utilities, groceries, insurance, transportation, and minimum debt
              payments. You can usually leave out discretionary spending like dining out, travel, and
              subscriptions, since those can be paused during a true emergency.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Starter fund vs full fund
            </h3>
            <p>
              You do not need the whole amount at once. A <strong>starter fund</strong> of roughly $500
              to $1,000 covers most common surprises and keeps them off a credit card. Once that is in
              place, keep building toward the <strong>full fund</strong> of several months of expenses,
              contributing a fixed amount each month until you reach the goal.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Where to keep it and when to use it
            </h3>
            <p>
              Keep the money <strong>liquid and safe</strong> in a high-yield savings account, where it
              stays accessible and earns interest while it waits. Avoid investing it in the stock market,
              where the value could drop right when you need it. Use the fund only for genuine
              emergencies, and once you do, make replenishing it your next savings priority.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="expenses" className="field-label">Monthly Essential Expenses ({symbol})</label>
          <input id="expenses" type="number" min="0" value={expenses} onChange={(e) => setExpenses(e.target.value)} placeholder="3500" className="field-input" />
          {errors.expenses && <p className="field-error">{errors.expenses}</p>}
        </div>
        <div>
          <label htmlFor="months" className="field-label">Months of Coverage</label>
          <select id="months" value={months} onChange={(e) => setMonths(e.target.value)} className="field-input">
            <option value="3">3 months (stable income)</option>
            <option value="6">6 months (recommended)</option>
            <option value="9">9 months (variable income)</option>
            <option value="12">12 months (sole earner)</option>
          </select>
          {errors.months && <p className="field-error">{errors.months}</p>}
        </div>
        <div>
          <label htmlFor="saved" className="field-label">Already Saved ({symbol})</label>
          <input id="saved" type="number" min="0" value={saved} onChange={(e) => setSaved(e.target.value)} placeholder="2000" className="field-input" />
          {errors.saved && <p className="field-error">{errors.saved}</p>}
        </div>
        <div>
          <label htmlFor="monthlySaving" className="field-label">Monthly Saving ({symbol})</label>
          <input id="monthlySaving" type="number" min="0" value={monthlySaving} onChange={(e) => setMonthlySaving(e.target.value)} placeholder="300" className="field-input" />
          {errors.monthlySaving && <p className="field-error">{errors.monthlySaving}</p>}
        </div>
        <button onClick={calculate} className="btn-primary w-full">Calculate Target</button>
      </div>
    </CalculatorLayout>
  )
}
