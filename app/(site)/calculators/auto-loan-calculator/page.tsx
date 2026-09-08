'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ'
import { calculatorFAQs } from '@/data/calculator-faqs'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema, generateFAQSchema } from '@/lib/schema-markup'

interface AutoLoanResults {
  monthlyPayment: number
  amountFinanced: number
  totalInterest: number
  totalCost: number
}

export default function AutoLoanCalculatorPage() {
  const { format: formatCurrency, symbol } = useCurrency()
  const faqItems = calculatorFAQs['auto-loan']
  const [vehiclePrice, setVehiclePrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [tradeIn, setTradeIn] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<AutoLoanResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const price = parseFloat(vehiclePrice)
    const down = parseFloat(downPayment || '0')
    const trade = parseFloat(tradeIn || '0')
    const rate = parseFloat(interestRate)
    const months = parseFloat(term)

    if (!vehiclePrice || isNaN(price) || price <= 0)
      newErrors.vehiclePrice = 'Please enter a valid vehicle price'
    if (isNaN(down) || down < 0) newErrors.downPayment = 'Enter a valid down payment (0 or more)'
    if (isNaN(trade) || trade < 0) newErrors.tradeIn = 'Enter a valid trade-in value (0 or more)'
    if (!interestRate || isNaN(rate) || rate < 0 || rate > 50)
      newErrors.interestRate = 'Please enter a valid interest rate (0-50%)'
    if (!term || isNaN(months) || months <= 0 || months > 120)
      newErrors.term = 'Please enter a valid term (1-120 months)'
    if (price > 0 && price - down - trade <= 0)
      newErrors.vehiclePrice = 'Down payment and trade-in exceed the vehicle price'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return
    const price = parseFloat(vehiclePrice)
    const down = parseFloat(downPayment || '0')
    const trade = parseFloat(tradeIn || '0')
    const rate = parseFloat(interestRate)
    const months = parseFloat(term)

    const principal = price - down - trade
    const monthlyRate = rate / 100 / 12
    let monthlyPayment: number
    if (monthlyRate === 0) {
      monthlyPayment = principal / months
    } else {
      monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
    }
    const totalCost = monthlyPayment * months
    const totalInterest = totalCost - principal

    setResults({
      monthlyPayment,
      amountFinanced: principal,
      totalInterest,
      totalCost,
    })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate an Auto Loan Payment',
    description:
      'Estimate your monthly car payment, total interest, and total loan cost.',
    steps: [
      { name: 'Enter vehicle price', text: 'Input the total price of the car.' },
      { name: 'Enter down payment and trade-in', text: 'Input any cash down payment and trade-in value.' },
      { name: 'Enter interest rate', text: 'Input your annual interest rate (APR).' },
      { name: 'Enter loan term', text: 'Input the loan length in months.' },
      { name: 'View results', text: 'See your monthly payment, total interest, and total cost.' },
    ],
  })

  return (
    <CalculatorLayout
      relatedReading={[
        { href: '/news/what-is-apr', title: 'What Is APR? (And What Counts as a Good One?)' },
        { href: '/news/how-to-pay-off-a-loan-faster', title: 'How to Pay Off a Loan Faster' },
        { href: '/news/what-is-a-good-credit-score', title: 'What Is a Good Credit Score?' },
      ]}
      title="Auto Loan Calculator"
      description="Estimate your monthly car payment, total interest, and total cost. Enter the vehicle price, down payment, trade-in, interest rate, and loan term."
      jsonLd={[jsonLd, generateFAQSchema(faqItems)]}
      faq={<CalculatorFAQ items={faqItems} />}
      results={
        results ? (
          <div className="space-y-6">
            <div className="border-l-2 border-accent bg-accent-soft px-4 py-4 dark:border-accent-light dark:bg-accent/10">
              <p className="eyebrow">Monthly Payment</p>
              <p className="mt-2 font-serif text-display-2 font-bold tabular-nums text-ink dark:text-ink-inverse">
                {formatCurrency(results.monthlyPayment)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow">Amount Financed</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">
                  {formatCurrency(results.amountFinanced)}
                </p>
              </div>
              <div>
                <p className="eyebrow">Total Interest</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">
                  {formatCurrency(results.totalInterest)}
                </p>
              </div>
            </div>
            <div className="border-t border-hairline pt-4 dark:border-hairline-dark">
              <div className="flex justify-between text-sm">
                <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">Total cost (principal + interest)</span>
                <span className="font-medium tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalCost)}</span>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">How Auto Loans Work</h2>
          <div className="space-y-4 text-sm text-ink-body dark:text-ink-inverse-body">
            <p>An auto loan is repaid in fixed monthly installments over a set term. Each payment covers the interest due that month first, and the remainder reduces your principal balance.</p>
            <p><strong>Amount financed:</strong> the vehicle price minus your down payment and any trade-in value. A larger down payment lowers both your monthly payment and total interest.</p>
            <p><strong>Term trade-off:</strong> a shorter term means higher monthly payments but far less total interest; a longer term lowers the payment but costs more overall. Choose the shortest term whose payment fits your budget.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="vehiclePrice" className="field-label">Vehicle Price ({symbol})</label>
          <input id="vehiclePrice" type="number" min="0" value={vehiclePrice} onChange={(e) => setVehiclePrice(e.target.value)} placeholder="35000" className="field-input" />
          {errors.vehiclePrice && <p className="field-error">{errors.vehiclePrice}</p>}
        </div>
        <div>
          <label htmlFor="downPayment" className="field-label">Down Payment ({symbol})</label>
          <input id="downPayment" type="number" min="0" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} placeholder="5000" className="field-input" />
          {errors.downPayment && <p className="field-error">{errors.downPayment}</p>}
        </div>
        <div>
          <label htmlFor="tradeIn" className="field-label">Trade-In Value ({symbol})</label>
          <input id="tradeIn" type="number" min="0" value={tradeIn} onChange={(e) => setTradeIn(e.target.value)} placeholder="0" className="field-input" />
          {errors.tradeIn && <p className="field-error">{errors.tradeIn}</p>}
        </div>
        <div>
          <label htmlFor="interestRate" className="field-label">Annual Interest Rate / APR (%)</label>
          <input id="interestRate" type="number" min="0" max="50" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="7.5" className="field-input" />
          {errors.interestRate && <p className="field-error">{errors.interestRate}</p>}
        </div>
        <div>
          <label htmlFor="term" className="field-label">Loan Term (months)</label>
          <input id="term" type="number" min="1" max="120" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="60" className="field-input" />
          {errors.term && <p className="field-error">{errors.term}</p>}
        </div>
        <button onClick={calculate} className="btn-primary w-full">Calculate Payment</button>
      </div>
    </CalculatorLayout>
  )
}
