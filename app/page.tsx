import Link from 'next/link'
import { getLatestArticles } from '@/lib/sanity-queries'
import { CryptoTicker } from '@/components/home/CryptoTicker'
import { FeaturedArticle } from '@/components/home/FeaturedArticle'
import { MarketDataWidget } from '@/components/home/MarketDataWidget'
import { TrustSignals } from '@/components/home/TrustSignals'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import { ArticleCard } from '@/components/news/ArticleCard'

const calculatorHighlights = [
  {
    title: 'Mortgage Calculator',
    description:
      'Calculate your monthly mortgage payments, total interest, and amortization schedule.',
    href: '/calculators/mortgage-calculator',
    icon: '🏠',
  },
  {
    title: '401(k) Calculator',
    description:
      'Project your retirement savings with employer matching contributions and compound growth.',
    href: '/calculators/401k-calculator',
    icon: '📈',
  },
  {
    title: 'EMI Calculator',
    description:
      'Determine your equated monthly installment for any loan amount, rate, and tenure.',
    href: '/calculators/emi-calculator',
    icon: '💳',
  },
  {
    title: 'SIP Calculator',
    description:
      'Estimate your systematic investment plan returns over time with the power of compounding.',
    href: '/calculators/sip-calculator',
    icon: '📊',
  },
  {
    title: 'Compound Interest',
    description:
      'See how your money grows with compound interest across different compounding frequencies.',
    href: '/calculators/compound-interest-calculator',
    icon: '💰',
  },
  {
    title: 'Retirement Calculator',
    description:
      'Plan your retirement by calculating how much you need to save each month.',
    href: '/calculators/retirement-calculator',
    icon: '🎯',
  },
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

      {/* Slim hero band + Featured article */}
      <section className="border-b border-brand-border-gray bg-gradient-to-br from-teal-pale/40 via-white to-teal-pale/20 dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
        <div className="container-page section-padding">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Financial Tools You Can{' '}
              <span className="text-teal-primary">Trust</span>
            </h1>
            <p className="mt-4 text-base leading-8 text-brand-medium-gray dark:text-zinc-400">
              Live crypto prices, market data, breaking finance news, and free
              calculators to help you make smarter money decisions.
            </p>
          </div>

          {featured ? (
            <FeaturedArticle featured={featured} sidebar={sidebarArticles} />
          ) : (
            <div className="card text-center">
              <p className="text-brand-medium-gray dark:text-zinc-400">
                Stay tuned for the latest finance and crypto news.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Market Data Widget */}
      <section className="border-b border-brand-border-gray dark:border-zinc-700">
        <div className="container-page section-padding">
          <MarketDataWidget />
        </div>
      </section>

      {/* Latest News grid */}
      {gridArticles.length > 0 && (
        <section className="border-b border-brand-border-gray dark:border-zinc-700">
          <div className="container-page section-padding">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                Latest News
              </h2>
              <Link
                href="/news"
                className="text-sm font-medium text-teal-primary transition-colors hover:text-teal-medium dark:text-teal-medium dark:hover:text-teal-pale"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Signals */}
      <section className="border-b border-brand-border-gray dark:border-zinc-700">
        <div className="container-page section-padding">
          <TrustSignals />
        </div>
      </section>

      {/* Calculator Highlights */}
      <section className="border-b border-brand-border-gray bg-amber-light/30 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="container-page section-padding">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              Financial Calculators
            </h2>
            <p className="mt-3 text-brand-medium-gray dark:text-zinc-400">
              Free, accurate tools to help you plan your financial future.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {calculatorHighlights.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group card card-hover"
              >
                <div className="mb-3 text-2xl">{calc.icon}</div>
                <h3 className="text-lg font-semibold transition-colors group-hover:text-teal-primary dark:group-hover:text-teal-medium">
                  {calc.title}
                </h3>
                <p className="mt-2 text-sm text-brand-medium-gray dark:text-zinc-400">
                  {calc.description}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-teal-primary dark:text-teal-medium">
                  Calculate &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bank Routing Number Search Preview */}
      <section className="border-b border-brand-border-gray dark:border-zinc-700">
        <div className="container-page section-padding">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              US Bank Routing Numbers
            </h2>
            <p className="mt-3 text-brand-medium-gray dark:text-zinc-400">
              Find routing numbers for all major US banks. Verify ABA routing
              numbers for wire transfers, ACH payments, and direct deposits.
            </p>
            <div className="mt-8">
              <div className="flex items-center justify-center">
                <Link
                  href="/bank-routing-numbers"
                  className="btn-primary"
                >
                  Browse All Banks
                </Link>
              </div>
            </div>
            {/* Popular banks */}
            <div className="mt-10">
              <p className="text-xs font-medium uppercase tracking-wider text-brand-light-gray-text dark:text-zinc-500">
                Popular Banks
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  { name: 'Chase', slug: 'chase' },
                  { name: 'Bank of America', slug: 'bank-of-america' },
                  { name: 'Wells Fargo', slug: 'wells-fargo' },
                  { name: 'Citibank', slug: 'citibank' },
                  { name: 'Capital One', slug: 'capital-one' },
                  { name: 'TD Bank', slug: 'td-bank' },
                  { name: 'PNC', slug: 'pnc-bank' },
                  { name: 'US Bank', slug: 'us-bank' },
                ].map((bank) => (
                  <Link
                    key={bank.slug}
                    href={`/bank-routing-numbers/${bank.slug}`}
                    className="rounded-full border border-brand-border-gray px-4 py-1.5 text-xs font-medium text-brand-medium-gray transition-all hover:border-teal-primary hover:text-teal-primary dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-teal-medium dark:hover:text-teal-medium"
                  >
                    {bank.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section>
        <div className="container-page section-padding">
          <NewsletterSignup />
        </div>
      </section>
    </>
  )
}
