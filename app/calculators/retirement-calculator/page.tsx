'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { generateHowToSchema } from '@/lib/schema-markup'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

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
      jsonLd={jsonLd}
      results={
        results ? (
          <div className="space-y-6">
            <div className={`rounded-lg p-4 ${results.isOnTrack ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
              <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Status</p>
              <p className={`text-2xl font-bold ${results.isOnTrack ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                {results.isOnTrack ? 'On Track' : 'Needs Attention'}
              </p>
              <p className="mt-1 text-sm text-brand-medium-gray dark:text-zinc-400">
                {results.isOnTrack
                  ? `You are projected to have a surplus of ${formatCurrency(results.shortfallOrSurplus)}`
                  : `You have a projected shortfall of ${formatCurrency(Math.abs(results.shortfallOrSurplus))}`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Projected Savings</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.projectedSavings)}</p>
              </div>
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Required Savings</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{formatCurrency(results.requiredSavings)}</p>
              </div>
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Years to Retirement</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{results.yearsToRetirement}</p>
              </div>
              <div>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">Years in Retirement</p>
                <p className="text-lg font-semibold dark:text-zinc-100">{results.yearsInRetirement}</p>
              </div>
            </div>
            {!results.isOnTrack && (
              <div className="border-t border-brand-border-gray pt-4 dark:border-zinc-700">
                <h3 className="mb-2 font-semibold dark:text-zinc-100">Recommended Action</h3>
                <p className="text-sm text-brand-medium-gray dark:text-zinc-400">To reach your retirement goal, consider saving:</p>
                <p className="mt-1 text-xl font-bold text-brand-near-black dark:text-zinc-100">
                  {formatCurrency(results.recommendedMonthlySavings)}/month
                </p>
              </div>
            )}
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 text-xl font-semibold">Planning for Retirement</h2>
          <div className="space-y-4 text-sm text-brand-dark-gray dark:text-zinc-300">
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
          <label htmlFor="currentAge" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Current Age</label>
          <input id="currentAge" type="number" min="18" max="80" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} placeholder="35"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.currentAge && <p className="mt-1 text-xs text-red-600">{errors.currentAge}</p>}
        </div>
        <div>
          <label htmlFor="retirementAge" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Desired Retirement Age</label>
          <input id="retirementAge" type="number" min="18" max="100" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} placeholder="65"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.retirementAge && <p className="mt-1 text-xs text-red-600">{errors.retirementAge}</p>}
        </div>
        <div>
          <label htmlFor="currentSavings" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Current Retirement Savings ($)</label>
          <input id="currentSavings" type="number" min="0" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} placeholder="100000"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.currentSavings && <p className="mt-1 text-xs text-red-600">{errors.currentSavings}</p>}
        </div>
        <div>
          <label htmlFor="monthlySavings" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Monthly Savings ($)</label>
          <input id="monthlySavings" type="number" min="0" value={monthlySavings} onChange={(e) => setMonthlySavings(e.target.value)} placeholder="1000"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.monthlySavings && <p className="mt-1 text-xs text-red-600">{errors.monthlySavings}</p>}
        </div>
        <div>
          <label htmlFor="expectedReturn" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Expected Annual Return (%)</label>
          <input id="expectedReturn" type="number" min="0" max="30" step="0.1" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} placeholder="7"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          {errors.expectedReturn && <p className="mt-1 text-xs text-red-600">{errors.expectedReturn}</p>}
        </div>
        <div>
          <label htmlFor="desiredIncome" className="block text-sm font-medium text-brand-dark-gray dark:text-zinc-300">Desired Annual Retirement Income ($)</label>
          <input id="desiredIncome" type="number" min="0" value={desiredIncome} onChange={(e) => setDesiredIncome(e.target.value)} placeholder="60000"
            className="mt-1 w-full rounded-md border border-brand-border-gray bg-white px-3 py-2 text-sm focus:border-brand-zinc focus:outline-none focus:ring-1 focus:ring-brand-zinc dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          <p className="mt-1 text-xs text-brand-medium-gray dark:text-zinc-500">How much annual income you want in retirement (in today&apos;s dollars)</p>
          {errors.desiredIncome && <p className="mt-1 text-xs text-red-600">{errors.desiredIncome}</p>}
        </div>
        <button onClick={calculate}
          className="w-full rounded-md bg-brand-near-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-zinc dark:bg-zinc-100 dark:text-brand-near-black dark:hover:bg-zinc-200">
          Calculate Retirement Plan
        </button>
      </div>
    </CalculatorLayout>
  )
}
