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
          <div className="space-y-4 text-sm text-ink-body dark:text-ink-inverse-body">
            <p>Retirement planning involves estimating how much money you need to live comfortably after you stop working. The key factors are your desired retirement age, expected lifestyle costs, and how much you can save and invest before retiring.</p>
            <p><strong>The 4% Rule:</strong> A commonly used guideline suggests you can safely withdraw 4% of your retirement savings annually without running out of money over a 25-30 year retirement. This calculator uses this rule to estimate required savings.</p>
            <p><strong>Start Early:</strong> The earlier you begin saving for retirement, the more time compound interest has to grow your money. Even small amounts invested in your 20s can grow substantially by retirement age.</p>
            <p><strong>Diversify:</strong> Spread your investments across stocks, bonds, and other assets. As you approach retirement, gradually shift toward more conservative investments to protect your savings.</p>
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
