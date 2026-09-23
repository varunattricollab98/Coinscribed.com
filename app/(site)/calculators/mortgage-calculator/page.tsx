'use client'

import { useState } from 'react'
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout'
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ'
import { calculatorFAQs } from '@/data/calculator-faqs'
import { useCurrency } from '@/components/calculators/CurrencyProvider'
import { generateHowToSchema, generateFAQSchema } from '@/lib/schema-markup'



interface MortgageResults {
  monthlyPayment: number
  totalInterest: number
  totalPayment: number
  loanAmount: number
}

export default function MortgageCalculatorPage() {
  const { format: formatCurrency, symbol } = useCurrency()
  const faqItems = calculatorFAQs['mortgage']
  const [homePrice, setHomePrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [loanTerm, setLoanTerm] = useState('30')
  const [interestRate, setInterestRate] = useState('')
  const [results, setResults] = useState<MortgageResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const price = parseFloat(homePrice)
    const down = parseFloat(downPayment)
    const rate = parseFloat(interestRate)

    if (!homePrice || isNaN(price) || price <= 0) {
      newErrors.homePrice = 'Please enter a valid home price'
    }
    if (!downPayment || isNaN(down) || down < 0) {
      newErrors.downPayment = 'Please enter a valid down payment'
    }
    if (down >= price) {
      newErrors.downPayment = 'Down payment must be less than home price'
    }
    if (!interestRate || isNaN(rate) || rate <= 0 || rate > 50) {
      newErrors.interestRate = 'Please enter a valid interest rate (0-50%)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculate = () => {
    if (!validate()) return

    const price = parseFloat(homePrice)
    const down = parseFloat(downPayment)
    const rate = parseFloat(interestRate)
    const years = parseInt(loanTerm)

    const loanAmount = price - down
    const monthlyRate = rate / 100 / 12
    const numPayments = years * 12

    const monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)

    const totalPayment = monthlyPayment * numPayments
    const totalInterest = totalPayment - loanAmount

    setResults({
      monthlyPayment,
      totalInterest,
      totalPayment,
      loanAmount,
    })
  }

  const jsonLd = generateHowToSchema({
    name: 'How to Calculate Your Mortgage Payment',
    description:
      'Calculate your monthly mortgage payment based on home price, down payment, loan term, and interest rate.',
    steps: [
      { name: 'Enter home price', text: 'Input the total purchase price of the home you are considering.' },
      { name: 'Enter down payment', text: 'Input the amount you plan to pay upfront as a down payment.' },
      { name: 'Select loan term', text: 'Choose between a 15-year or 30-year fixed-rate mortgage.' },
      { name: 'Enter interest rate', text: 'Input the annual interest rate offered by your lender.' },
      { name: 'View results', text: 'See your estimated monthly payment, total interest, and total cost of the loan.' },
    ],
  })

  return (
    <CalculatorLayout
      canonicalPath="/calculators/mortgage-calculator"
      relatedReading={[
        { href: '/news/monthly-payment-300k-400k-500k-mortgage', title: 'Monthly Payment on a $300K, $400K or $500K Mortgage' },
        { href: '/news/what-is-a-good-credit-score', title: 'What Credit Score Do You Need to Buy a House?' },
        { href: '/news/how-much-house-can-i-afford', title: 'How Much House Can I Afford? A Salary-by-Salary Guide' },
        { href: '/news/how-to-save-for-a-down-payment', title: 'How to Save for a Down Payment on a House' },
        { href: '/news/how-to-get-rid-of-pmi', title: 'How to Get Rid of PMI: 6 Ways to Stop Paying' },
      ]}
      title="Mortgage Calculator"
      description="Calculate your monthly mortgage payments, total interest paid, and view a payment summary based on your home price, down payment, loan term, and interest rate."
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
                <p className="eyebrow">Loan Amount</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.loanAmount)}</p>
              </div>
              <div>
                <p className="eyebrow">Total Interest</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalInterest)}</p>
              </div>
              <div>
                <p className="eyebrow">Total Payment</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalPayment)}</p>
              </div>
              <div>
                <p className="eyebrow">Loan Term</p>
                <p className="mt-1.5 font-serif text-display-4 font-bold tabular-nums text-ink dark:text-ink-inverse">{loanTerm} years</p>
              </div>
            </div>
            <div className="border-t border-hairline pt-4 dark:border-hairline-dark">
              <h3 className="eyebrow-strong mb-3 block">Amortization Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">Principal</span>
                  <span className="font-medium tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">Interest</span>
                  <span className="font-medium tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="flex justify-between border-t border-hairline pt-2 dark:border-hairline-dark">
                  <span className="font-medium tabular-nums text-ink dark:text-ink-inverse">Total Cost</span>
                  <span className="font-bold tabular-nums text-ink dark:text-ink-inverse">{formatCurrency(results.totalPayment)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : undefined
      }
      educationalContent={
        <div>
          <h2 className="mb-4 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">
            Understanding Your Mortgage Payment
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
            <p>
              A mortgage payment is what you pay your lender each month to repay a home loan. At its
              core it&apos;s made up of <strong>principal</strong> (the amount you borrowed) and{' '}
              <strong>interest</strong> (the cost of borrowing that money). In the early years most
              of your payment goes toward interest; as the balance shrinks, more of each payment
              goes to principal — a process called amortization.
            </p>
            <p>
              Most lenders also collect two more costs inside your monthly payment, held in an
              escrow account: <strong>property taxes</strong> and <strong>homeowners insurance</strong>.
              Together with principal and interest these make up what&apos;s known as{' '}
              <strong>PITI</strong> (Principal, Interest, Taxes, Insurance) — the true monthly cost of
              owning a home. This calculator focuses on principal and interest, so remember to budget
              for taxes and insurance on top.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              How your mortgage payment is calculated
            </h3>
            <p>
              Your monthly principal-and-interest payment depends on three things: the loan amount
              (home price minus down payment), the interest rate, and the loan term. A higher rate or
              a larger loan raises the payment; a longer term lowers the monthly payment but increases
              the total interest you pay over the life of the loan. Even a small change in the rate can
              move your payment noticeably, which is why it pays to compare lenders.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              15-year vs 30-year mortgage
            </h3>
            <p>
              A <strong>30-year mortgage</strong> spreads payments over a longer period, so the
              monthly cost is lower and more affordable — but you pay far more interest overall. A{' '}
              <strong>15-year mortgage</strong> has higher monthly payments, yet you build equity
              faster, usually get a lower interest rate, and pay dramatically less total interest.
              The right choice comes down to whether you value a lower monthly payment (30-year) or
              long-term savings and faster payoff (15-year).
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Down payment and PMI
            </h3>
            <p>
              Your down payment is the cash you pay upfront. A larger down payment reduces the loan
              amount and your monthly payment. Putting down <strong>20% or more</strong> also lets you
              avoid <strong>private mortgage insurance (PMI)</strong> — an extra monthly fee that
              protects the lender, not you. Conventional loans can allow as little as 3% down, FHA
              loans 3.5%, and VA/USDA loans 0% for eligible buyers, but a smaller down payment usually
              means PMI and a higher payment until you build enough equity.
            </p>

            <h3 className="pt-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              How much house can you afford?
            </h3>
            <p>
              A common guideline is the <strong>28/36 rule</strong>: keep your total housing payment
              at or below about 28% of your gross monthly income, and all your debts combined under
              about 36%. Lenders also weigh your credit score, existing debts, and down payment. The
              smartest approach is to shop below the maximum a bank will lend you, so the payment stays
              comfortable alongside taxes, insurance, maintenance, and life&apos;s surprises.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="homePrice" className="field-label">
            Home Price ({symbol})
          </label>
          <input
            id="homePrice"
            type="number"
            min="0"
            value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)}
            placeholder="350000"
            className="field-input"
          />
          {errors.homePrice && <p className="field-error">{errors.homePrice}</p>}
        </div>
        <div>
          <label htmlFor="downPayment" className="field-label">
            Down Payment ({symbol})
          </label>
          <input
            id="downPayment"
            type="number"
            min="0"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder="70000"
            className="field-input"
          />
          {errors.downPayment && <p className="field-error">{errors.downPayment}</p>}
        </div>
        <div>
          <label htmlFor="loanTerm" className="field-label">
            Loan Term
          </label>
          <select
            id="loanTerm"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="field-input"
          >
            <option value="15">15 Years</option>
            <option value="30">30 Years</option>
          </select>
        </div>
        <div>
          <label htmlFor="interestRate" className="field-label">
            Annual Interest Rate (%)
          </label>
          <input
            id="interestRate"
            type="number"
            min="0"
            max="50"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="6.5"
            className="field-input"
          />
          {errors.interestRate && <p className="field-error">{errors.interestRate}</p>}
        </div>
        <button
          onClick={calculate}
          className="btn-primary w-full"
        >
          Calculate
        </button>
      </div>
    </CalculatorLayout>
  )
}
