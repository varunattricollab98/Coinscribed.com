import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { isSanityConfigured } from '@/lib/sanity'
import { getLatestArticles } from '@/lib/sanity-queries'

const calculatorHighlights = [
  {
    title: 'Mortgage Calculator',
    description:
      'Calculate your monthly mortgage payments, total interest, and amortization schedule.',
    href: '/calculators/mortgage-calculator',
  },
  {
    title: '401(k) Calculator',
    description:
      'Project your retirement savings with employer matching contributions and compound growth.',
    href: '/calculators/401k-calculator',
  },
  {
    title: 'EMI Calculator',
    description:
      'Determine your equated monthly installment for any loan amount, rate, and tenure.',
    href: '/calculators/emi-calculator',
  },
  {
    title: 'SIP Calculator',
    description:
      'Estimate your systematic investment plan returns over time with the power of compounding.',
    href: '/calculators/sip-calculator',
  },
  {
    title: 'Compound Interest',
    description:
      'See how your money grows with compound interest across different compounding frequencies.',
    href: '/calculators/compound-interest-calculator',
  },
  {
    title: 'Retirement Calculator',
    description:
      'Plan your retirement by calculating how much you need to save each month.',
    href: '/calculators/retirement-calculator',
  },
]

export default async function HomePage() {
  const articles = isSanityConfigured ? await getLatestArticles(3) : []

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-brand-border-gray bg-brand-off-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="container-page section-padding">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Financial Tools You Can{' '}
              <span className="text-brand-zinc">Trust</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-brand-medium-gray dark:text-zinc-400">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/calculators"
                className="rounded-md bg-brand-near-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-zinc dark:bg-zinc-100 dark:text-brand-near-black dark:hover:bg-zinc-200"
              >
                Explore Calculators
              </Link>
              <Link
                href="/bank-routing-numbers"
                className="rounded-md border border-brand-border-gray bg-white px-6 py-3 text-sm font-semibold text-brand-near-black shadow-sm transition-colors hover:bg-brand-light-gray dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                Find Routing Numbers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News Section */}
      <section className="border-b border-brand-border-gray dark:border-zinc-700">
        <div className="container-page section-padding">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl">Latest News</h2>
            <Link
              href="/news"
              className="text-sm font-medium text-brand-zinc transition-colors hover:text-brand-near-black dark:text-zinc-400 dark:hover:text-white"
            >
              View All &rarr;
            </Link>
          </div>
          {articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article._id}
                  className="rounded-lg border border-brand-border-gray bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-medium-gray dark:text-zinc-500">
                    {article.category?.title || 'News'}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold leading-tight">
                    <Link href={`/news/${article.slug.current}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-brand-medium-gray dark:text-zinc-400">
                    {article.excerpt}
                  </p>
                  <time className="mt-3 block text-xs text-brand-light-gray-text dark:text-zinc-500">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-brand-border-gray bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
              <p className="text-brand-medium-gray dark:text-zinc-400">
                Stay tuned for the latest finance and crypto news.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Calculator Highlights */}
      <section className="border-b border-brand-border-gray bg-brand-off-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="container-page section-padding">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
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
                className="group rounded-lg border border-brand-border-gray bg-white p-6 transition-all hover:border-brand-zinc hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-500"
              >
                <h3 className="text-lg font-semibold group-hover:text-brand-zinc dark:group-hover:text-zinc-200">
                  {calc.title}
                </h3>
                <p className="mt-2 text-sm text-brand-medium-gray dark:text-zinc-400">
                  {calc.description}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-brand-zinc dark:text-zinc-400">
                  Calculate &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bank Routing Number Search Preview */}
      <section>
        <div className="container-page section-padding">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
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
                  className="rounded-md bg-brand-near-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-zinc dark:bg-zinc-100 dark:text-brand-near-black dark:hover:bg-zinc-200"
                >
                  Browse All Banks
                </Link>
              </div>
            </div>
            {/* Popular banks */}
            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-wider text-brand-light-gray-text dark:text-zinc-500">
                Popular Banks
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
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
                    className="rounded-full border border-brand-border-gray px-3 py-1 text-xs text-brand-medium-gray transition-colors hover:border-brand-zinc hover:text-brand-near-black dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:text-white"
                  >
                    {bank.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
