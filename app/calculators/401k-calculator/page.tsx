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
            <div className="rounded-lg bg-brand-off-white p-4 dark:bg-zinc-900">
              <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Projected Retirement Savings</p>
              <p className="text-3xl font-bold text-brand-near-black dark:text-zinc-100">
                {formatCurrency(results.projectedSavings)}
              </p>
              <p className="mt-1 text-xs text-brand-medium-gray dark:text-zinc-400">
                In {results.yearsToRetirement} years
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Your Contributions</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.totalContributions)}</p>
              </div>
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Employer Match</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.totalEmployerMatch)}</p>
              </div>
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Investment Growth</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.totalGrowth)}</p>
              </div>
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Initial Savings</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(parseFloat(currentSavings) || 0)}</p>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 text-xl font-semibold">Understanding Your 401(k)</h2>
          <div className="space-y-4 text-sm text-brand-dark-gray dark:text-zinc-300">
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
          <label htmlFor="currentAge" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Current Age</label>
          <input id="currentAge" type="number" min="18" max="80" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} placeholder="30"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.currentAge && <p className="mt-1 text-xs text-red-600">{errors.currentAge}</p>}
        </div>
        <div>
          <label htmlFor="retirementAge" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Retirement Age</label>
          <input id="retirementAge" type="number" min="18" max="100" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} placeholder="65"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.retirementAge && <p className="mt-1 text-xs text-red-600">{errors.retirementAge}</p>}
        </div>
        <div>
          <label htmlFor="currentSavings" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Current 401(k) Balance ($)</label>
          <input id="currentSavings" type="number" min="0" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} placeholder="50000"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.currentSavings && <p className="mt-1 text-xs text-red-600">{errors.currentSavings}</p>}
        </div>
        <div>
          <label htmlFor="monthlyContribution" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Monthly Contribution ($)</label>
          <input id="monthlyContribution" type="number" min="0" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} placeholder="500"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.monthlyContribution && <p className="mt-1 text-xs text-red-600">{errors.monthlyContribution}</p>}
        </div>
        <div>
          <label htmlFor="expectedReturn" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Expected Annual Return (%)</label>
          <input id="expectedReturn" type="number" min="0" max="30" step="0.1" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} placeholder="7"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.expectedReturn && <p className="mt-1 text-xs text-red-600">{errors.expectedReturn}</p>}
        </div>
        <div>
          <label htmlFor="employerMatch" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Employer Match (%)</label>
          <input id="employerMatch" type="number" min="0" max="100" step="1" value={employerMatch} onChange={(e) => setEmployerMatch(e.target.value)} placeholder="50"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          <p className="mt-1 text-xs text-brand-medium-gray dark:text-zinc-500">Percentage of your contribution that your employer matches</p>
          {errors.employerMatch && <p className="mt-1 text-xs text-red-600">{errors.employerMatch}</p>}
        </div>
        <button onClick={calculate}
          className="w-full rounded-md bg-brand-near-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-zinc dark:bg-zinc-100 dark:text-brand-near-black dark:hover:bg-zinc-200">
          Calculate
        </button>
      </div>
    </CalculatorLayout>
  )
}
