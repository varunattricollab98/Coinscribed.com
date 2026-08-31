import Link from 'next/link'
import { getLatestArticles } from '@/lib/sanity-queries'
import { CryptoTicker } from '@/components/home/CryptoTicker'
import { FeaturedArticle } from '@/components/home/FeaturedArticle'
import { MarketDataWidget } from '@/components/home/MarketDataWidget'
import { TrustSignals } from '@/components/home/TrustSignals'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import { ArticleCard } from '@/components/news/ArticleCard'
import { LineIcon, type LineIconName } from '@/components/icons/LineIcon'

const calculatorHighlights: {
  title: string
  description: string
  href: string
  icon: LineIconName
}[] = [
  {
    title: 'Mortgage Calculator',
    description:
      'Calculate your monthly mortgage payments, total interest, and amortization schedule.',
    href: '/calculators/mortgage-calculator',
    icon: 'house',
  },
  {
    title: '401(k) Calculator',
    description:
      'Project your retirement savings with employer matching contributions and compound growth.',
    href: '/calculators/401k-calculator',
    icon: 'trend-up',
  },
  {
    title: 'EMI Calculator',
    description:
      'Determine your equated monthly installment for any loan amount, rate, and tenure.',
    href: '/calculators/emi-calculator',
    icon: 'card',
  },
  {
    title: 'SIP Calculator',
    description:
      'Estimate your systematic investment plan returns over time with the power of compounding.',
    href: '/calculators/sip-calculator',
    icon: 'bars',
  },
  {
    title: 'Compound Interest',
    description:
      'See how your money grows with compound interest across different compounding frequencies.',
    href: '/calculators/compound-interest-calculator',
    icon: 'coins',
  },
  {
    title: 'Retirement Calculator',
    description:
      'Plan your retirement by calculating how much you need to save each month.',
    href: '/calculators/retirement-calculator',
    icon: 'target',
  },
]

const popularBanks = [
  { name: 'Chase', slug: 'chase' },
  { name: 'Bank of America', slug: 'bank-of-america' },
  { name: 'Wells Fargo', slug: 'wells-fargo' },
  { name: 'Citibank', slug: 'citibank' },
  { name: 'Capital One', slug: 'capital-one' },
  { name: 'TD Bank', slug: 'td-bank' },
  { name: 'PNC', slug: 'pnc-bank' },
  { name: 'US Bank', slug: 'us-bank' },
]

export default async function HomePage() {
  const articles = await getLatestArticles(8)

  const featured = articles[0]
  const sidebarArticles = articles.slice(1, 5)
  const gridArticles = articles.slice(5)

  return (
    <>
      {/* Live crypto price ticker */}
      <CryptoTicker />

      {/* Lead story — no marketing hero, straight into the news (WSJ/FT style) */}
      <section className="hairline-b">
        <div className="container-page section-padding">
          <div className="section-header mb-8">
            <div>
              <span className="eyebrow-accent">Top Story</span>
              <h1 className="section-title mt-1.5">Today&rsquo;s Briefing</h1>
            </div>
            <Link href="/news" className="link-quiet text-eyebrow font-semibold uppercase">
              All News &rarr;
            </Link>
          </div>

          {featured ? (
            <FeaturedArticle featured={featured} sidebar={sidebarArticles} />
          ) : (
            <div className="panel text-center">
              <p className="text-ink-muted dark:text-ink-inverse-muted">
                Stay tuned for the latest finance and crypto news.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Market data */}
      <section className="hairline-b">
        <div className="container-page section-padding">
          <div className="section-header mb-6">
            <div>
              <span className="eyebrow">Markets</span>
              <h2 className="section-title mt-1.5">Index Snapshot</h2>
            </div>
          </div>
          <MarketDataWidget />
        </div>
      </section>

      {/* Latest news grid */}
      {gridArticles.length > 0 && (
        <section className="hairline-b">
          <div className="container-page section-padding">
            <div className="section-header mb-8">
              <div>
                <span className="eyebrow">Analysis</span>
                <h2 className="section-title mt-1.5">Latest News</h2>
              </div>
              <Link
                href="/news"
                className="link-quiet text-eyebrow font-semibold uppercase"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="rule-grid sm:grid-cols-2 lg:grid-cols-3">
              {gridArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust signals */}
      <section className="hairline-b">
        <div className="container-page section-padding">
          <TrustSignals />
        </div>
      </section>

      {/* Calculators */}
      <section className="hairline-b">
        <div className="container-page section-padding">
          <div className="section-header mb-8">
            <div>
              <span className="eyebrow">Tools</span>
              <h2 className="section-title mt-1.5">Financial Calculators</h2>
            </div>
            <Link
              href="/calculators"
              className="link-quiet text-eyebrow font-semibold uppercase"
            >
              All Tools &rarr;
            </Link>
          </div>
          <div className="rule-grid sm:grid-cols-2 lg:grid-cols-3">
            {calculatorHighlights.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group rule-cell-hover flex flex-col px-5 py-6 sm:px-6"
              >
                <LineIcon
                  name={calc.icon}
                  className="h-6 w-6 text-oxblood dark:text-oxblood-lighter"
                />
                <h3 className="mt-4 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                  <span className="title-link">{calc.title}</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                  {calc.description}
                </p>
                <span className="eyebrow-accent mt-4 inline-block">
                  Calculate &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bank routing numbers preview */}
      <section className="hairline-b">
        <div className="container-page section-padding">
          <div className="section-header mb-8">
            <div>
              <span className="eyebrow">Reference</span>
              <h2 className="section-title mt-1.5">US Bank Routing Numbers</h2>
            </div>
            <Link
              href="/bank-routing-numbers"
              className="link-quiet text-eyebrow font-semibold uppercase"
            >
              Browse All &rarr;
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <p className="max-w-2xl text-sm leading-relaxed text-ink-body lg:col-span-2 dark:text-ink-inverse-body">
              Find routing numbers for all major US banks. Verify ABA routing
              numbers for wire transfers, ACH payments, and direct deposits.
            </p>
            <div>
              <span className="eyebrow">Popular Banks</span>
              <ul className="mt-3 divide-y divide-hairline dark:divide-hairline-dark">
                {popularBanks.map((bank) => (
                  <li key={bank.slug}>
                    <Link
                      href={`/bank-routing-numbers/${bank.slug}`}
                      className="group flex items-center justify-between py-2.5 text-sm text-ink-body transition-colors hover:text-oxblood dark:text-ink-inverse-body dark:hover:text-oxblood-lighter"
                    >
                      <span>{bank.name}</span>
                      <span aria-hidden="true" className="text-ink-muted transition-colors group-hover:text-oxblood dark:group-hover:text-oxblood-lighter">
                        &rarr;
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section>
        <div className="container-page section-padding">
          <NewsletterSignup />
        </div>
      </section>
    </>
  )
}
