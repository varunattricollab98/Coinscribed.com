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

interface Results401k {
  projectedSavings: number
  totalContributions: number
  totalEmployerMatch: number
  totalGrowth: number
  yearsToRetirement: number
}

export default function Calculator401kPage() {
  const [currentAge, setCurrentAge] = useState('')
  const [retirementAge, setRetirementAge] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [expectedReturn, setExpectedReturn] = useState('')
  const [employerMatch, setEmployerMatch] = useState('')
  const [results, setResults] = useState<Results401k | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const age = parseInt(currentAge)
    const retAge = parseInt(retirementAge)
    const savings = parseFloat(currentSavings)
    const contribution = parseFloat(monthlyContribution)
    const returnRate = parseFloat(expectedReturn)
    const match = parseFloat(employerMatch)

    if (!currentAge || isNaN(age) || age < 18 || age > 80) {
      newErrors.currentAge = 'Enter a valid age (18-80)'
    }
    if (!retirementAge || isNaN(retAge) || retAge <= age || retAge > 100) {
      newErrors.retirementAge = 'Retirement age must be greater than current age'
    }
    if (!currentSavings || isNaN(savings) || savings < 0) {
      newErrors.currentSavings = 'Enter a valid amount (0 or more)'
    }
    if (!monthlyContribution || isNaN(contribution) || contribution < 0) {
      newErrors.monthlyContribution = 'Enter a valid monthly contribution'
    }
    if (!expectedReturn || isNaN(returnRate) || returnRate < 0 || returnRate > 30) {
      newErrors.expectedReturn = 'Enter a valid return rate (0-30%)'
    }
    if (!employerMatch || isNaN(match) || match < 0 || match > 100) {
      newErrors.employerMatch = 'Enter a valid match percentage (0-100%)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return

    const age = parseInt(currentAge)
    const retAge = parseInt(retirementAge)
    const savings = parseFloat(currentSavings)
    const contribution = parseFloat(monthlyContribution)
    const returnRate = parseFloat(expectedReturn)
    const match = parseFloat(employerMatch)

    const yearsToRetirement = retAge - age
    const monthlyReturn = returnRate / 100 / 12
    const totalMonths = yearsToRetirement * 12
    const totalMonthlyContrib = contribution * (1 + match / 100)

    let balance = savings
    let totalContributions = 0
    let totalEmployerMatchAmount = 0

    for (let i = 0; i < totalMonths; i++) {
      balance += balance * monthlyReturn
      balance += totalMonthlyContrib
      totalContributions += contribution
      totalEmployerMatchAmount += contribution * (match / 100)
    }

    setResults({
      projectedSavings: balance,
      totalContributions,
      totalEmployerMatch: totalEmployerMatchAmount,
      totalGrowth: balance - savings - totalContributions - totalEmployerMatchAmount,
      yearsToRetirement,
    })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Your 401(k) Retirement Savings',
    description: 'Project your 401(k) retirement savings based on contributions, employer match, and expected returns.',
    steps: [
      { name: 'Enter your current age', text: 'Input your current age to determine the time horizon for your investments.' },
      { name: 'Enter retirement age', text: 'Choose the age at which you plan to retire.' },
      { name: 'Enter current savings', text: 'Input your current 401(k) balance.' },
      { name: 'Enter monthly contribution', text: 'Input how much you contribute to your 401(k) each month.' },
      { name: 'Enter expected return and employer match', text: 'Input your expected annual return rate and employer match percentage.' },
      { name: 'View projected savings', text: 'See your projected retirement savings at your target retirement age.' },
    ],
  })

  return (
    <CalculatorLayout
      title="401(k) Calculator"
      description="Project your 401(k) retirement savings with employer matching contributions, compound growth, and monthly contributions over time."
      jsonLd={jsonLd}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-oxblood bg-wash px-4 py-4 dark:border-oxblood-light dark:bg-wash-dark">
              <p className="eyebrow">Projected Retirement Savings</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatCurrency(results.projectedSavings)}
              </p>
              <p className="eyebrow mt-2 block">
                In {results.yearsToRetirement} years
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Your Contributions</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalContributions)}</p>
              </div>
              <div>
                <p className="eyebrow">Employer Match</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalEmployerMatch)}</p>
              </div>
              <div>
                <p className="eyebrow">Investment Growth</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalGrowth)}</p>
              </div>
              <div>
                <p className="eyebrow">Initial Savings</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(parseFloat(currentSavings) || 0)}</p>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">Understanding Your 401(k)</h2>
          <div className="space-y-4 text-sm text-ink-body dark:text-ink-inverse-body">
            <p>
              A 401(k) is an employer-sponsored retirement savings plan that allows you to
              contribute pre-tax dollars from your paycheck. Many employers offer matching
              contributions, which is essentially free money for your retirement.
            </p>
            <p>
              <strong>Employer Match:</strong> If your employer offers a 50% match, they
              contribute $0.50 for every $1 you contribute, up to a certain percentage of your
              salary. Always try to contribute enough to get the full employer match.
            </p>
            <p>
              <strong>Compound Growth:</strong> The power of compound interest means your earnings
              generate their own earnings over time. Starting early, even with smaller amounts,
              can lead to significantly larger retirement savings.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="currentAge" className="field-label">Current Age</label>
          <input id="currentAge" type="number" min="18" max="80" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} placeholder="30"
            className="field-input" />
          {errors.currentAge && <p className="field-error">{errors.currentAge}</p>}
        </div>
        <div>
          <label htmlFor="retirementAge" className="field-label">Retirement Age</label>
          <input id="retirementAge" type="number" min="18" max="100" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} placeholder="65"
            className="field-input" />
          {errors.retirementAge && <p className="field-error">{errors.retirementAge}</p>}
        </div>
        <div>
          <label htmlFor="currentSavings" className="field-label">Current 401(k) Balance ($)</label>
          <input id="currentSavings" type="number" min="0" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} placeholder="50000"
            className="field-input" />
          {errors.currentSavings && <p className="field-error">{errors.currentSavings}</p>}
        </div>
        <div>
          <label htmlFor="monthlyContribution" className="field-label">Monthly Contribution ($)</label>
          <input id="monthlyContribution" type="number" min="0" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} placeholder="500"
            className="field-input" />
          {errors.monthlyContribution && <p className="field-error">{errors.monthlyContribution}</p>}
        </div>
        <div>
          <label htmlFor="expectedReturn" className="field-label">Expected Annual Return (%)</label>
          <input id="expectedReturn" type="number" min="0" max="30" step="0.1" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} placeholder="7"
            className="field-input" />
          {errors.expectedReturn && <p className="field-error">{errors.expectedReturn}</p>}
        </div>
        <div>
          <label htmlFor="employerMatch" className="field-label">Employer Match (%)</label>
          <input id="employerMatch" type="number" min="0" max="100" step="1" value={employerMatch} onChange={(e) => setEmployerMatch(e.target.value)} placeholder="50"
            className="field-input" />
          <p className="mt-1.5 text-caption text-ink-muted dark:text-ink-inverse-muted">Percentage of your contribution that your employer matches</p>
          {errors.employerMatch && <p className="field-error">{errors.employerMatch}</p>}
        </div>
        <button onClick={calculate}
          className="btn-primary w-full">
          Calculate
        </button>
      </div>
    </CalculatorLayout>
  )
}
