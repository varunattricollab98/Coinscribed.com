import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import {
  AFFORDABILITY_ASSUMPTIONS,
  affordabilityRows,
} from '@/data/affordability-index'

/**
 * Coinscribed Home Affordability Index — an original, methodology-transparent
 * "linkable asset" (digital-PR page) estimating the household income needed to
 * afford a median-priced home across major US metros under the classic 28%
 * front-end rule.
 *
 * WHY THIS PAGE EXISTS (SEO/backlink strategy): original, citeable data is the
 * highest-value backlink magnet for a new site. Journalists writing "how much
 * income do you need to buy a home in <city>" stories can cite a single table
 * with a clear, reproducible methodology. Every figure is computed at build
 * time from the assumptions stated on the page (see `data/affordability-index.ts`)
 * — nothing is fabricated, which keeps it YMYL-safe.
 */

const PAGE_PATH = '/home-affordability-index'
const rows = affordabilityRows()

const usd0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const metadata: Metadata = {
  alternates: { canonical: PAGE_PATH },
  title: 'Home Affordability Index: Income Needed to Buy in 30 US Cities',
  description:
    'How much household income do you need to afford a median-priced home in major US metros? The Coinscribed Home Affordability Index ranks 30 cities using the 28% rule, with a fully transparent methodology.',
  openGraph: {
    title: `Home Affordability Index | ${siteConfig.name}`,
    description:
      'The income needed to afford a median-priced home across 30 US metros, ranked — using the 28% front-end rule and a transparent, reproducible methodology.',
    url: `${siteConfig.url}${PAGE_PATH}`,
    type: 'article',
  },
}

export default function HomeAffordabilityIndexPage() {
  const { mortgageRatePct, termYears, downPaymentPct, frontEndDtiPct, taxInsuranceAnnualPct, asOf } =
    AFFORDABILITY_ASSUMPTIONS

  const mostExpensive = rows[0]
  const leastExpensive = rows[rows.length - 1]

  // Dataset JSON-LD so the study is machine-readable and citeable as a source.
  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Coinscribed Home Affordability Index',
    description:
      'Estimated gross household income required to afford a median-priced home in 30 major US metros, computed with a 30-year fixed mortgage, 20% down, and the 28% front-end debt-to-income rule.',
    url: `${siteConfig.url}${PAGE_PATH}`,
    creator: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    keywords: [
      'home affordability',
      'income to buy a house',
      'mortgage affordability by city',
      '28 percent rule',
    ],
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />

      <header className="mb-8">
        <p className="mb-2 font-sans text-caption font-semibold uppercase tracking-wide text-oxblood dark:text-oxblood-light">
          Coinscribed Data Study
        </p>
        <h1 className="mb-3 font-serif text-3xl font-bold text-ink dark:text-ink-inverse sm:text-4xl">
          The Home Affordability Index: Income Needed to Buy in 30 US Cities
        </h1>
        <p className="text-lg text-ink-body dark:text-ink-inverse-body">
          How much do you actually need to earn to buy a typical home where you
          live? We ran the numbers for 30 major US metros using the classic{' '}
          <strong>28% rule</strong>, a 30-year fixed mortgage, and a 20% down
          payment. The methodology below is fully transparent, so every figure
          is reproducible.
        </p>
      </header>

      {/* Key findings */}
      <section className="mb-8 rounded-sm border border-hairline bg-wash p-5 dark:border-hairline-dark dark:bg-elevated">
        <h2 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
          Key findings
        </h2>
        <ul className="space-y-2 text-ink-body dark:text-ink-inverse-body">
          <li>
            <strong>{mostExpensive.city}, {mostExpensive.state}</strong> is the
            hardest metro on the list — a household needs about{' '}
            <strong>{usd0.format(mostExpensive.requiredAnnualIncome)}</strong> a
            year to afford the median home.
          </li>
          <li>
            <strong>{leastExpensive.city}, {leastExpensive.state}</strong> is the
            most attainable, at roughly{' '}
            <strong>{usd0.format(leastExpensive.requiredAnnualIncome)}</strong> a
            year.
          </li>
          <li>
            The gap between the most and least expensive metro is more than{' '}
            <strong>
              {Math.round(
                mostExpensive.requiredAnnualIncome /
                  leastExpensive.requiredAnnualIncome
              )}
              ×
            </strong>{' '}
            — location, not just income, drives affordability.
          </li>
        </ul>
      </section>

      {/* The table */}
      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl font-bold text-ink dark:text-ink-inverse">
          Income needed to afford a median home, by metro
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-ink/20 text-left dark:border-ink-inverse/20">
                <th className="py-2 pr-3 font-sans font-semibold">Metro</th>
                <th className="py-2 pr-3 text-right font-sans font-semibold">
                  Median home price
                </th>
                <th className="py-2 pr-3 text-right font-sans font-semibold">
                  Monthly housing cost
                </th>
                <th className="py-2 text-right font-sans font-semibold">
                  Income needed
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={`${row.city}-${row.state}`}
                  className="border-b border-hairline dark:border-hairline-dark"
                >
                  <td className="py-2 pr-3 text-ink-body dark:text-ink-inverse-body">
                    {row.city}, {row.state}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums text-ink-body dark:text-ink-inverse-body">
                    {usd0.format(row.medianHomePrice)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums text-ink-body dark:text-ink-inverse-body">
                    {usd0.format(row.monthlyHousingCost)}
                  </td>
                  <td className="py-2 text-right font-semibold tabular-nums text-ink dark:text-ink-inverse">
                    {usd0.format(row.requiredAnnualIncome)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-caption text-ink-muted dark:text-ink-inverse-muted">
          Want to localize these numbers with your own price, rate, and down
          payment? Use the{' '}
          <Link
            href="/calculators/mortgage-calculator"
            className="text-oxblood underline dark:text-oxblood-light"
          >
            mortgage calculator
          </Link>{' '}
          or see{' '}
          <Link
            href="/news/how-much-house-can-i-afford"
            className="text-oxblood underline dark:text-oxblood-light"
          >
            How Much House Can I Afford?
          </Link>
        </p>
      </section>

      {/* Methodology */}
      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl font-bold text-ink dark:text-ink-inverse">
          Methodology
        </h2>
        <p className="mb-3 text-ink-body dark:text-ink-inverse-body">
          For each metro we start from an approximate median home price
          benchmark ({asOf}) and calculate the income a household would need so
          that total monthly housing cost stays within the {frontEndDtiPct}%
          front-end rule. Every figure in the table is computed from these
          stated assumptions — treat the median prices as benchmarks and localize
          them with the calculator for your exact situation.
        </p>
        <ul className="mb-3 space-y-2 text-ink-body dark:text-ink-inverse-body">
          <li>• <strong>Down payment:</strong> {downPaymentPct}% of the home price.</li>
          <li>• <strong>Mortgage:</strong> {termYears}-year fixed at {mortgageRatePct}% APR.</li>
          <li>
            • <strong>Property tax + insurance:</strong> estimated at{' '}
            {taxInsuranceAnnualPct}% of the home price per year, added to
            principal &amp; interest.
          </li>
          <li>
            • <strong>Affordability rule:</strong> housing cost must be at or
            below {frontEndDtiPct}% of gross monthly income (the classic 28%
            front-end rule).
          </li>
          <li>
            • <strong>Excluded:</strong> HOA dues, PMI, and metro-specific tax
            variation, so real requirements can be higher.
          </li>
        </ul>
        <p className="text-caption text-ink-muted dark:text-ink-inverse-muted">
          The monthly principal &amp; interest uses the standard fixed-rate
          amortization formula — the same one behind the Coinscribed mortgage
          calculator, so the study and the tool always agree.
        </p>
      </section>

      {/* Citation / usage */}
      <section className="rounded-sm border border-hairline bg-wash p-5 dark:border-hairline-dark dark:bg-elevated">
        <h2 className="mb-2 font-sans text-sm font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
          Use this study
        </h2>
        <p className="mb-2 text-ink-body dark:text-ink-inverse-body">
          Journalists and writers are welcome to cite the Coinscribed Home
          Affordability Index with a link back to this page. Suggested citation:
        </p>
        <p className="rounded-sm border border-hairline bg-paper p-3 font-mono text-caption text-ink-body dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse-body">
          Coinscribed Home Affordability Index, {siteConfig.url}
          {PAGE_PATH}
        </p>
      </section>
    </main>
  )
}
