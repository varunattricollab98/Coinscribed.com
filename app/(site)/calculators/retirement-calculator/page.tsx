'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ'
import { calculatorFAQs } from '@/data/calculator-faqs'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema, generateFAQSchema } from '@/lib/schema-markup'


interface RetirementResults {
  projectedSavings: number
  requiredSavings: number
  isOnTrack: boolean
  shortfallOrSurplus: number
  recommendedMonthlySavings: number
  yearsToRetirement: number
  yearsInRetirement: number
}

export default function RetirementCalculatorPage() {
  const { format: formatCurrency, symbol } = useCurrency()
  const faqItems = calculatorFAQs['retirement']
  const [currentAge, setCurrentAge] = useState('')
  const [retirementAge, setRetirementAge] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlySavings, setMonthlySavings] = useState('')
  const [expectedReturn, setExpectedReturn] = useState('')
  const [desiredIncome, setDesiredIncome] = useState('')
  const [results, setResults] = useState<RetirementResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const age = parseInt(currentAge)
    const retAge = parseInt(retirementAge)
    const savings = parseFloat(currentSavings)
    const monthly = parseFloat(monthlySavings)
    const returnRate = parseFloat(expectedReturn)
    const income = parseFloat(desiredIncome)

    if (!currentAge || isNaN(age) || age < 18 || age > 80) newErrors.currentAge = 'Enter a valid age (18-80)'
    if (!retirementAge || isNaN(retAge) || retAge <= age || retAge > 100) newErrors.retirementAge = 'Retirement age must be greater than current age'
    if (!currentSavings || isNaN(savings) || savings < 0) newErrors.currentSavings = 'Enter a valid amount (0 or more)'
    if (!monthlySavings || isNaN(monthly) || monthly < 0) newErrors.monthlySavings = 'Enter a valid monthly savings amount'
    if (!expectedReturn || isNaN(returnRate) || returnRate < 0 || returnRate > 30) newErrors.expectedReturn = 'Enter a valid return rate (0-30%)'
    if (!desiredIncome || isNaN(income) || income <= 0) newErrors.desiredIncome = 'Enter a valid desired annual income'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return

    const age = parseInt(currentAge)
    const retAge = parseInt(retirementAge)
    const savings = parseFloat(currentSavings)
    const monthly = parseFloat(monthlySavings)
    const returnRate = parseFloat(expectedReturn)
    const income = parseFloat(desiredIncome)

    const yearsToRetirement = retAge - age
    const yearsInRetirement = 90 - retAge
    const monthlyRate = returnRate / 100 / 12
    const totalMonths = yearsToRetirement * 12

    // Future value of current savings + future value of monthly contributions
    const fvCurrentSavings = savings * Math.pow(1 + monthlyRate, totalMonths)
    const fvContributions = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
    const projectedSavings = fvCurrentSavings + fvContributions

    // Required savings using 4% withdrawal rule
    const withdrawalRate = 0.04
    const requiredSavings = income / withdrawalRate

    const isOnTrack = projectedSavings >= requiredSavings
    const shortfallOrSurplus = projectedSavings - requiredSavings

    // Recommended monthly savings if not on track
    let recommendedMonthlySavings = monthly
    if (!isOnTrack) {
      const additionalNeeded = requiredSavings - fvCurrentSavings
      if (monthlyRate > 0) {
        recommendedMonthlySavings = additionalNeeded / (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))
      } else {
        recommendedMonthlySavings = additionalNeeded / totalMonths
      }
    }

    setResults({
      projectedSavings,
      requiredSavings,
      isOnTrack,
      shortfallOrSurplus,
      recommendedMonthlySavings,
      yearsToRetirement,
      yearsInRetirement,
    })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Plan Your Retirement Savings',
    description: 'Calculate if you are on track for retirement based on your current savings, monthly contributions, and desired retirement income.',
    steps: [
      { name: 'Enter your current age', text: 'Input your current age to determine how many years until retirement.' },
      { name: 'Enter retirement age', text: 'Choose the age at which you want to retire.' },
      { name: 'Enter current savings', text: 'Input your total current retirement savings across all accounts.' },
      { name: 'Enter monthly savings', text: 'Input how much you save for retirement each month.' },
      { name: 'Enter expected return and desired income', text: 'Input your expected annual investment return and desired annual retirement income.' },
      { name: 'View retirement plan', text: 'See if you are on track, any shortfall or surplus, and recommended monthly savings.' },
    ],
  })

  return (
    <CalculatorLayout
      canonicalPath="/calculators/retirement-calculator"
      relatedReading={[
        { href: '/news/how-much-to-contribute-to-401k', title: 'How Much Should You Contribute to Your 401(k)?' },
        { href: '/news/401k-vs-roth-ira', title: '401(k) vs Roth IRA: Which Should You Choose?' },
        { href: '/news/rule-of-72', title: 'The Rule of 72: How Fast Your Money Doubles' },
      ]}
      title="Retirement Calculator"
      description="Plan your retirement by calculating if you are on track to meet your retirement income goals. See projected savings, shortfall or surplus, and recommended monthly savings."
      jsonLd={[jsonLd, generateFAQSchema(faqItems)]}
      faq={<CalculatorFAQ items={faqItems} />}
      results={
        results ? (
          <div className="space-y-6">
            <div
              className={`border-l-2 bg-wash px-4 py-4 dark:bg-wash-dark ${
                results.isOnTrack
                  ? 'border-up dark:border-up-light'
                  : 'border-down dark:border-down-light'
              }`}
            >
              <p className="eyebrow">Status</p>
              <p
                className={`mt-2 font-serif text-display-3 font-bold ${
                  results.isOnTrack
                    ? 'text-up dark:text-up-light'
                    : 'text-down dark:text-down-light'
                }`}
              >
                {results.isOnTrack ? 'On Track' : 'Needs Attention'}
              </p>
              <p className="mt-2 text-caption tabular-nums text-ink-muted dark:text-ink-inverse-muted">
                {results.isOnTrack
                  ? `You are projected to have a surplus of ${formatCurrency(results.shortfallOrSurplus)}`
                  : `You have a projected shortfall of ${formatCurrency(Math.abs(results.shortfallOrSurplus))}`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Projected Savings</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.projectedSavings)}</p>
              </div>
              <div>
                <p className="eyebrow">Required Savings</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.requiredSavings)}</p>
              </div>
              <div>
                <p className="eyebrow">Years to Retirement</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{results.yearsToRetirement}</p>
              </div>
              <div>
                <p className="eyebrow">Years in Retirement</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{results.yearsInRetirement}</p>
              </div>
            </div>
            {!results.isOnTrack && (
              <div className="border-t border-hairline pt-4 dark:border-hairline-dark">
                <h3 className="eyebrow-strong mb-3 block">Recommended Action</h3>
                <p className="text-caption text-ink-muted dark:text-ink-inverse-muted">
                  To reach your retirement goal, consider saving:
                </p>
                <p className="mt-2 font-serif text-display-3 font-bold tabular-nums text-ink dark:text-ink-inverse">
                  {formatCurrency(results.recommendedMonthlySavings)}/month
                </p>
              </div>
            )}
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">Planning for Retirement</h2>
          <div className="space-y-4 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
            <p>
              Retirement planning is the process of estimating how much money you&apos;ll need to live
              comfortably once you stop working, and building a savings and investing plan to get
              there. Because retirement can last decades, the goal is to accumulate enough that your
              savings, combined with other income sources, can cover your expenses for the rest of
              your life.
            </p>
            <p>
              The main levers are your <strong>retirement age</strong>, your expected
              <strong> spending</strong>, how much you save each year, and the returns your
              investments earn along the way. Small adjustments to any of these &mdash; retiring a
              little later, saving a bit more, or starting earlier &mdash; can meaningfully change the
              outcome. The estimates below are guidelines to help you plan, not guarantees.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Estimating how much you&apos;ll need
            </h3>
            <p>
              A common starting point is <strong>income replacement</strong>: many planners suggest
              aiming to replace roughly 70&ndash;80% of your pre-retirement income each year, though
              your real number depends on your lifestyle. Building an estimate from your expected
              annual <strong>expenses</strong> &mdash; housing, food, healthcare, travel &mdash; is
              often more accurate. Multiplying your target annual spending by the number of retirement
              years gives a rough sense of the nest egg you&apos;re working toward.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              The 4% rule and safe withdrawal rates
            </h3>
            <p>
              The <strong>4% rule</strong> is a well-known guideline suggesting you can withdraw about
              4% of your savings in your first year of retirement, then adjust for inflation each year,
              with a reasonable chance of not running out over a 25&ndash;30 year retirement. It&apos;s
              a useful planning shortcut, not a promise: your <strong>safe withdrawal rate</strong>
              depends on market conditions, how long you live, and how flexible your spending is.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Compounding and starting early
            </h3>
            <p>
              Time is the most powerful factor in retirement saving. Thanks to
              <strong> compounding</strong>, your returns earn their own returns, so money invested in
              your 20s or 30s has decades to grow. Starting early often matters more than the exact
              amount you save, because a longer runway lets even modest contributions grow into a much
              larger balance by retirement age.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Tax-advantaged accounts, Social Security, and inflation
            </h3>
            <p>
              Saving inside <strong>tax-advantaged accounts</strong> such as a 401(k) or IRA can boost
              your results, since they offer tax benefits and many employers match 401(k) contributions
              &mdash; effectively free money. <strong>Social Security</strong> is one piece of the
              picture rather than a full plan, so it&apos;s wise to treat it as a supplement to your own
              savings. Finally, remember <strong>inflation</strong> gradually erodes purchasing power,
              so your target and withdrawals should account for rising costs over a long retirement.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="currentAge" className="field-label">Current Age</label>
          <input id="currentAge" type="number" min="18" max="80" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} placeholder="35"
            className="field-input" />
          {errors.currentAge && <p className="field-error">{errors.currentAge}</p>}
        </div>
        <div>
          <label htmlFor="retirementAge" className="field-label">Desired Retirement Age</label>
          <input id="retirementAge" type="number" min="18" max="100" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} placeholder="65"
            className="field-input" />
          {errors.retirementAge && <p className="field-error">{errors.retirementAge}</p>}
        </div>
        <div>
          <label htmlFor="currentSavings" className="field-label">Current Retirement Savings ({symbol})</label>
          <input id="currentSavings" type="number" min="0" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} placeholder="100000"
            className="field-input" />
          {errors.currentSavings && <p className="field-error">{errors.currentSavings}</p>}
        </div>
        <div>
          <label htmlFor="monthlySavings" className="field-label">Monthly Savings ({symbol})</label>
          <input id="monthlySavings" type="number" min="0" value={monthlySavings} onChange={(e) => setMonthlySavings(e.target.value)} placeholder="1000"
            className="field-input" />
          {errors.monthlySavings && <p className="field-error">{errors.monthlySavings}</p>}
        </div>
        <div>
          <label htmlFor="expectedReturn" className="field-label">Expected Annual Return (%)</label>
          <input id="expectedReturn" type="number" min="0" max="30" step="0.1" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} placeholder="7"
            className="field-input" />
          {errors.expectedReturn && <p className="field-error">{errors.expectedReturn}</p>}
        </div>
        <div>
          <label htmlFor="desiredIncome" className="field-label">Desired Annual Retirement Income ({symbol})</label>
          <input id="desiredIncome" type="number" min="0" value={desiredIncome} onChange={(e) => setDesiredIncome(e.target.value)} placeholder="60000"
            className="field-input" />
          <p className="mt-1.5 text-caption text-ink-muted dark:text-ink-inverse-muted">How much annual income you want in retirement (in today&apos;s dollars)</p>
          {errors.desiredIncome && <p className="field-error">{errors.desiredIncome}</p>}
        </div>
        <button onClick={calculate}
          className="btn-primary w-full">
          Calculate Retirement Plan
        </button>
      </div>
    </CalculatorLayout>
  )
}
