/**
 * Data for the Coinscribed Home Affordability Index — an original, transparent
 * "linkable asset" that estimates the household income needed to afford a
 * median-priced home in major US metros under the classic 28% front-end rule.
 *
 * YMYL / TRUST DISCIPLINE (critical): every published number on the study page
 * is COMPUTED here from clearly-stated assumptions, not asserted. Nothing is
 * fabricated:
 *   - `medianHomePrice` values are ROUND, illustrative metro benchmarks the
 *     reader is told to treat as assumptions (the page states they are
 *     approximate and links each city to update its own figure in the
 *     calculator). They are intentionally rounded so no one mistakes them for a
 *     live data feed.
 *   - Everything else (down payment, loan amount, monthly P&I, required income)
 *     is derived with the SAME amortization formula the site's mortgage
 *     calculator uses, so the study and the tool always agree.
 *
 * The methodology section on the page restates all of this in plain English so
 * a journalist citing the study can reproduce every figure.
 */

/** Shared assumptions, surfaced verbatim in the page's methodology box. */
export const AFFORDABILITY_ASSUMPTIONS = {
  /** Annual fixed mortgage rate used for every metro (stated on the page). */
  mortgageRatePct: 6.5,
  /** Loan term in years. */
  termYears: 30,
  /** Down payment as a share of the home price. */
  downPaymentPct: 20,
  /**
   * Front-end DTI limit: housing cost should stay at or below this share of
   * gross monthly income (the classic "28%" rule).
   */
  frontEndDtiPct: 28,
  /**
   * Estimate of monthly property tax + home insurance as a share of the home
   * price PER YEAR, added to principal & interest so the "housing cost" is
   * realistic rather than P&I only. Stated on the page as an assumption.
   */
  taxInsuranceAnnualPct: 1.25,
  /** As-of note for the assumptions (evergreen-safe wording on the page). */
  asOf: 'as of 2026',
} as const

export interface MetroBenchmark {
  city: string
  state: string
  /** Rounded, illustrative median home price benchmark (an assumption). */
  medianHomePrice: number
}

/**
 * Metro benchmarks (rounded, illustrative). Ordered roughly by price so the
 * default table reads as a ranking. The page tells readers these are
 * approximate benchmarks to localize with the calculator.
 */
export const METRO_BENCHMARKS: MetroBenchmark[] = [
  { city: 'San Jose', state: 'CA', medianHomePrice: 1_500_000 },
  { city: 'San Francisco', state: 'CA', medianHomePrice: 1_250_000 },
  { city: 'Los Angeles', state: 'CA', medianHomePrice: 950_000 },
  { city: 'San Diego', state: 'CA', medianHomePrice: 900_000 },
  { city: 'Seattle', state: 'WA', medianHomePrice: 800_000 },
  { city: 'New York', state: 'NY', medianHomePrice: 750_000 },
  { city: 'Boston', state: 'MA', medianHomePrice: 700_000 },
  { city: 'Denver', state: 'CO', medianHomePrice: 600_000 },
  { city: 'Miami', state: 'FL', medianHomePrice: 575_000 },
  { city: 'Washington', state: 'DC', medianHomePrice: 560_000 },
  { city: 'Portland', state: 'OR', medianHomePrice: 550_000 },
  { city: 'Austin', state: 'TX', medianHomePrice: 525_000 },
  { city: 'Sacramento', state: 'CA', medianHomePrice: 500_000 },
  { city: 'Las Vegas', state: 'NV', medianHomePrice: 450_000 },
  { city: 'Phoenix', state: 'AZ', medianHomePrice: 440_000 },
  { city: 'Nashville', state: 'TN', medianHomePrice: 435_000 },
  { city: 'Dallas', state: 'TX', medianHomePrice: 400_000 },
  { city: 'Atlanta', state: 'GA', medianHomePrice: 385_000 },
  { city: 'Charlotte', state: 'NC', medianHomePrice: 380_000 },
  { city: 'Minneapolis', state: 'MN', medianHomePrice: 350_000 },
  { city: 'Chicago', state: 'IL', medianHomePrice: 340_000 },
  { city: 'Houston', state: 'TX', medianHomePrice: 335_000 },
  { city: 'Tampa', state: 'FL', medianHomePrice: 375_000 },
  { city: 'Columbus', state: 'OH', medianHomePrice: 300_000 },
  { city: 'San Antonio', state: 'TX', medianHomePrice: 290_000 },
  { city: 'Kansas City', state: 'MO', medianHomePrice: 285_000 },
  { city: 'Indianapolis', state: 'IN', medianHomePrice: 265_000 },
  { city: 'Cleveland', state: 'OH', medianHomePrice: 230_000 },
  { city: 'Detroit', state: 'MI', medianHomePrice: 220_000 },
  { city: 'Pittsburgh', state: 'PA', medianHomePrice: 235_000 },
  // Expanded metro set (Sep 2026) — rounded, illustrative benchmarks derived
  // from Zillow city-level home values; treated as assumptions like the rest.
  { city: 'Riverside', state: 'CA', medianHomePrice: 580_000 },
  { city: 'Salt Lake City', state: 'UT', medianHomePrice: 560_000 },
  { city: 'Providence', state: 'RI', medianHomePrice: 480_000 },
  { city: 'Raleigh', state: 'NC', medianHomePrice: 435_000 },
  { city: 'Orlando', state: 'FL', medianHomePrice: 375_000 },
  { city: 'Richmond', state: 'VA', medianHomePrice: 375_000 },
  { city: 'Tucson', state: 'AZ', medianHomePrice: 340_000 },
  { city: 'Hartford', state: 'CT', medianHomePrice: 310_000 },
  { city: 'Jacksonville', state: 'FL', medianHomePrice: 280_000 },
  { city: 'Cincinnati', state: 'OH', medianHomePrice: 260_000 },
  { city: 'Louisville', state: 'KY', medianHomePrice: 260_000 },
  { city: 'St. Louis', state: 'MO', medianHomePrice: 260_000 },
  { city: 'Buffalo', state: 'NY', medianHomePrice: 250_000 },
  { city: 'New Orleans', state: 'LA', medianHomePrice: 240_000 },
  { city: 'Birmingham', state: 'AL', medianHomePrice: 235_000 },
  { city: 'Milwaukee', state: 'WI', medianHomePrice: 230_000 },
  { city: 'Philadelphia', state: 'PA', medianHomePrice: 230_000 },
  { city: 'Oklahoma City', state: 'OK', medianHomePrice: 210_000 },
  { city: 'Baltimore', state: 'MD', medianHomePrice: 190_000 },
  { city: 'Memphis', state: 'TN', medianHomePrice: 150_000 },
]

export interface AffordabilityRow extends MetroBenchmark {
  downPayment: number
  loanAmount: number
  /** Monthly principal & interest. */
  monthlyPrincipalInterest: number
  /** Monthly property tax + insurance estimate. */
  monthlyTaxInsurance: number
  /** Total monthly housing cost (PITI-style, ex-HOA). */
  monthlyHousingCost: number
  /** Gross annual household income required under the front-end DTI rule. */
  requiredAnnualIncome: number
}

/**
 * Standard fixed-rate amortization — IDENTICAL to the site's mortgage
 * calculator (`app/(site)/calculators/mortgage-calculator/page.tsx`), so the
 * study and the tool never disagree.
 */
export function monthlyPrincipalAndInterest(
  loanAmount: number,
  annualRatePct: number,
  termYears: number
): number {
  const monthlyRate = annualRatePct / 100 / 12
  const numPayments = termYears * 12
  if (monthlyRate === 0) return loanAmount / numPayments
  return (
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  )
}

/** Compute one affordability row from a metro benchmark + the assumptions. */
export function computeAffordability(metro: MetroBenchmark): AffordabilityRow {
  const {
    mortgageRatePct,
    termYears,
    downPaymentPct,
    frontEndDtiPct,
    taxInsuranceAnnualPct,
  } = AFFORDABILITY_ASSUMPTIONS

  const downPayment = metro.medianHomePrice * (downPaymentPct / 100)
  const loanAmount = metro.medianHomePrice - downPayment
  const monthlyPrincipalInterest = monthlyPrincipalAndInterest(
    loanAmount,
    mortgageRatePct,
    termYears
  )
  const monthlyTaxInsurance =
    (metro.medianHomePrice * (taxInsuranceAnnualPct / 100)) / 12
  const monthlyHousingCost = monthlyPrincipalInterest + monthlyTaxInsurance
  // Housing cost must be <= frontEndDti% of gross monthly income, so:
  const requiredMonthlyIncome = monthlyHousingCost / (frontEndDtiPct / 100)
  const requiredAnnualIncome = requiredMonthlyIncome * 12

  return {
    ...metro,
    downPayment,
    loanAmount,
    monthlyPrincipalInterest,
    monthlyTaxInsurance,
    monthlyHousingCost,
    requiredAnnualIncome,
  }
}

/** All rows, sorted by required income (highest first). */
export function affordabilityRows(): AffordabilityRow[] {
  return METRO_BENCHMARKS.map(computeAffordability).sort(
    (a, b) => b.requiredAnnualIncome - a.requiredAnnualIncome
  )
}
