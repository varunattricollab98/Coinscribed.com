'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ'
import { calculatorFAQs } from '@/data/calculator-faqs'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema, generateFAQSchema } from '@/lib/schema-markup'

interface RothResults {
  balanceAtRetirement: number
  totalContributions: number
  growth: number
  years: number
}

export default function RothIraCalculatorPage() {
  const { format: formatCurrency, symbol } = useCurrency()
  const faqItems = calculatorFAQs['roth-ira']
  const [currentAge, setCurrentAge] = useState('')
  const [retireAge, setRetireAge] = useState('')
  const [currentBalance, setCurrentBalance] = useState('')
  const [annualContribution, setAnnualContribution] = useState('')
  const [returnRate, setReturnRate] = useState('')
  const [results, setResults] = useState<RothResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const age = parseFloat(currentAge)
    const rAge = parseFloat(retireAge)
    const bal = parseFloat(currentBalance || '0')
    const contrib = parseFloat(annualContribution || '0')
    const rate = parseFloat(returnRate)

    if (!currentAge || isNaN(age) || age < 18 || age > 90) newErrors.currentAge = 'Enter a valid current age (18-90)'
    if (!retireAge || isNaN(rAge) || rAge <= age || rAge > 100) newErrors.retireAge = 'Retirement age must be greater than current age'
    if (isNaN(bal) || bal < 0) newErrors.currentBalance = 'Enter a valid current balance (0 or more)'
    if (isNaN(contrib) || contrib < 0) newErrors.annualContribution = 'Enter a valid contribution (0 or more)'
    if (!returnRate || isNaN(rate) || rate < 0 || rate > 30) newErrors.returnRate = 'Enter a valid return rate (0-30%)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return
    const age = parseFloat(currentAge)
    const rAge = parseFloat(retireAge)
    const bal = parseFloat(currentBalance || '0')
    const contrib = parseFloat(annualContribution || '0')
    const rate = parseFloat(returnRate) / 100
    const years = rAge - age

    // Grow current balance, and add contributions at year-end (ordinary annuity).
    let balance = bal
    for (let y = 0; y < years; y++) {
      balance = balance * (1 + rate) + contrib
    }
    const totalContributions = bal + contrib * years
    const growth = balance - totalContributions

    setResults({ balanceAtRetirement: balance, totalContributions, growth, years })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Roth IRA Growth',
    description: 'Project your tax-free Roth IRA balance at retirement.',
    steps: [
      { name: 'Enter your ages', text: 'Input your current age and planned retirement age.' },
      { name: 'Enter current balance', text: 'Input what you already have in the Roth IRA.' },
      { name: 'Enter annual contribution', text: 'Input how much you\u2019ll contribute each year.' },
      { name: 'Enter expected return', text: 'Input an estimated annual rate of return.' },
      { name: 'View results', text: 'See your projected tax-free balance at retirement.' },
    ],
  })

  return (
    <CalculatorLayout
      canonicalPath="/calculators/roth-ira-calculator"
      relatedReading={[
        { href: '/news/what-is-a-roth-ira', title: 'What Is a Roth IRA? How It Works and 2026 Rules' },
        { href: '/news/401k-vs-roth-ira', title: '401(k) vs Roth IRA: Which Is Better for You?' },
        { href: '/news/how-much-to-contribute-to-401k', title: 'How Much Should I Contribute to My 401(k)?' },
      ]}
      title="Roth IRA Calculator"
      description="Project your tax-free Roth IRA balance at retirement from your current age, balance, annual contributions, and expected rate of return."
      jsonLd={[jsonLd, generateFAQSchema(faqItems)]}
      faq={<CalculatorFAQ items={faqItems} />}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">Balance at Retirement (Tax-Free)</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatCurrency(results.balanceAtRetirement)}
              </p>
              <p className="mt-1 text-caption text-ink-muted dark:text-ink-inverse-muted">After {results.years} years of growth</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Total Contributions</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalContributions)}</p>
              </div>
              <div>
                <p className="eyebrow">Investment Growth</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-up dark:text-up-light">{formatCurrency(results.growth)}</p>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">Why a Roth IRA Is So Powerful</h2>
          <div className="space-y-4 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
            <p>
              A <strong>Roth IRA</strong> is a retirement account you fund with
              <strong> after-tax</strong> money &mdash; you don&apos;t get a deduction today, but in
              return your qualified withdrawals in retirement, including all the investment growth,
              are completely <strong>tax-free</strong>. That means the projected balance represents
              money you actually get to keep, not a pre-tax figure the IRS will tax later.
            </p>
            <p>
              This tax treatment is what makes the Roth so powerful over long horizons: decades of
              compounding happen without a future tax bill on the gains. It also offers unusual
              flexibility compared with most retirement accounts, along with a few rules worth
              understanding before you contribute.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Tax-free growth and flexible access to contributions
            </h3>
            <p>
              Because you already paid tax on the money going in, your earnings can grow and be
              withdrawn tax-free once you qualify. A key perk: your <strong>contributions</strong> (the
              money you put in, not the earnings) can be withdrawn at any time, for any reason, without
              taxes or penalties. That makes the Roth flexible, though leaving the money invested is
              what lets compounding do its work.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              2026 contribution limits
            </h3>
            <p>
              As of <strong>2026</strong>, you can contribute up to <strong>$7,500</strong> across your
              IRAs for the year. If you&apos;re age 50 or older, an extra $1,100 catch-up contribution
              raises your total to <strong>$8,600</strong>. You can only contribute earned income, and
              your allowed amount begins to phase out at higher incomes based on your
              <strong> modified adjusted gross income (MAGI)</strong> and filing status &mdash; check
              the current IRS thresholds for your situation.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              The 5-year rule and qualified withdrawals
            </h3>
            <p>
              To withdraw <strong>earnings</strong> completely tax-free, two conditions generally must
              be met: you must be at least <strong>age 59&frac12;</strong>, and your Roth IRA must have
              been open for at least five years &mdash; the <strong>5-year rule</strong>. Taking
              earnings out before meeting these tests can trigger taxes and a penalty, with some
              exceptions. Contributions, as noted above, remain accessible anytime regardless of these
              rules.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Roth vs traditional: the tax tradeoff
            </h3>
            <p>
              The core choice between a <strong>Roth</strong> and a <strong>traditional</strong> IRA is
              when you pay tax. A traditional IRA may give you a deduction now but taxes your
              withdrawals in retirement, while a Roth is funded with after-tax dollars and delivers
              tax-free qualified withdrawals later. A Roth tends to favor those who expect to be in the
              same or a higher tax bracket in retirement. This calculator shows estimates only; actual
              returns and tax rules vary.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="currentAge" className="field-label">Current Age</label>
            <input id="currentAge" type="number" min="18" max="90" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} placeholder="30" className="field-input" />
            {errors.currentAge && <p className="field-error">{errors.currentAge}</p>}
          </div>
          <div>
            <label htmlFor="retireAge" className="field-label">Retirement Age</label>
            <input id="retireAge" type="number" min="19" max="100" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} placeholder="65" className="field-input" />
            {errors.retireAge && <p className="field-error">{errors.retireAge}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="currentBalance" className="field-label">Current Roth IRA Balance ({symbol})</label>
          <input id="currentBalance" type="number" min="0" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} placeholder="10000" className="field-input" />
          {errors.currentBalance && <p className="field-error">{errors.currentBalance}</p>}
        </div>
        <div>
          <label htmlFor="annualContribution" className="field-label">Annual Contribution ({symbol})</label>
          <input id="annualContribution" type="number" min="0" value={annualContribution} onChange={(e) => setAnnualContribution(e.target.value)} placeholder="7000" className="field-input" />
          {errors.annualContribution && <p className="field-error">{errors.annualContribution}</p>}
        </div>
        <div>
          <label htmlFor="returnRate" className="field-label">Expected Annual Return (%)</label>
          <input id="returnRate" type="number" min="0" max="30" step="0.1" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} placeholder="7" className="field-input" />
          {errors.returnRate && <p className="field-error">{errors.returnRate}</p>}
        </div>
        <button onClick={calculate} className="btn-primary w-full">Calculate Growth</button>
      </div>
    </CalculatorLayout>
  )
}
