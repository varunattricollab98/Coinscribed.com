import Link from 'next/link'
import Image from 'next/image'
import { getLatestArticles } from '@/lib/sanity-queries'
import { sampleCategories } from '@/data/sample-news'
import { getCategoryTone } from '@/lib/category-styles'
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

// Topic tiles for the "Explore by Topic" section. Each maps to a category
// slug so it can pull the shared muted tone + description from sample data.
const topicTiles: { slug: string; icon: LineIconName }[] = [
  { slug: 'crypto', icon: 'coins' },
  { slug: 'economy', icon: 'globe' },
  { slug: 'markets', icon: 'bars' },
  { slug: 'banking', icon: 'bank' },
]

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function HomePage() {
  const articles = await getLatestArticles(12)

  const featured = articles[0]
  const sidebarArticles = articles.slice(1, 5)
  const gridArticles = articles.slice(5, 8)

  // Trending / Most-Read reuses the freshest five stories.
  const trendingArticles = articles.slice(0, 5)
  // Editor's Picks pulls a distinct set offset from the grid above.
  // slice(8, 12) keeps all 12 fetched articles in play (no wasted fetch).
  const editorsPicks = articles.slice(8, 12)

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

      {/* Trending / Most-Read */}
      {trendingArticles.length > 0 && (
        <section className="hairline-b">
          <div className="container-page section-padding">
            <div className="section-header mb-8">
              <div>
                <span className="eyebrow">Ranked</span>
                <h2 className="section-title mt-1.5">Most Read</h2>
              </div>
              <Link
                href="/news"
                className="link-quiet text-eyebrow font-semibold uppercase"
              >
                All News &rarr;
              </Link>
            </div>
            <ol className="divide-y divide-hairline dark:divide-hairline-dark">
              {trendingArticles.map((article, index) => (
                <li key={article._id}>
                  <Link
                    href={`/news/${article.slug.current}`}
                    className="group rule-cell-hover flex items-center gap-4 py-4 sm:gap-6"
                  >
                    <span
                      aria-hidden="true"
                      className="w-10 shrink-0 font-serif text-display-2 font-bold tabular-nums text-oxblood dark:text-oxblood-lighter"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {article.imageUrl && (
                      <span className="relative hidden aspect-video w-28 shrink-0 overflow-hidden sm:block">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      {article.category && (
                        <span className="text-eyebrow font-semibold uppercase text-ink-muted dark:text-ink-inverse-muted">
                          {article.category.title}
                        </span>
                      )}
                      <span className="mt-1 block font-serif text-display-4 font-bold leading-snug text-ink dark:text-ink-inverse">
                        <span className="title-link">{article.title}</span>
                      </span>
                      <span className="mt-1 flex items-center gap-2 text-caption text-ink-muted dark:text-ink-inverse-muted">
                        {article.author?.name && (
                          <>
                            <span className="font-medium">{article.author.name}</span>
                            <span aria-hidden="true">&middot;</span>
                          </>
                        )}
                        <time dateTime={article.publishedAt}>
                          {formatDate(article.publishedAt)}
                        </time>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Explore by topic */}
      <section className="hairline-b">
        <div className="container-page section-padding">
          <div className="section-header mb-8">
            <div>
              <span className="eyebrow">Sections</span>
              <h2 className="section-title mt-1.5">Explore by Topic</h2>
            </div>
          </div>
          <div className="rule-grid sm:grid-cols-2 lg:grid-cols-4">
            {topicTiles.map((topic) => {
              const category = sampleCategories.find(
                (c) => c.slug.current === topic.slug
              )
              if (!category) return null
              const tone = getCategoryTone(topic.slug)
              return (
                <Link
                  key={topic.slug}
                  href={`/news/category/${topic.slug}`}
                  className="group rule-cell-hover flex h-full flex-col px-5 py-6 sm:px-6"
                >
                  <LineIcon
                    name={topic.icon}
                    className={`h-6 w-6 ${tone.label}`}
                  />
                  <span className={`mt-4 text-eyebrow font-semibold uppercase ${tone.label}`}>
                    {category.title}
                  </span>
                  <span className={`mt-1.5 block h-0.5 w-7 ${tone.rule}`} aria-hidden="true" />
                  <p className="mt-3 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                    {category.description}
                  </p>
                  <span className="eyebrow-accent mt-4 inline-block">
                    Read {category.title} &rarr;
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Editor's picks */}
      {editorsPicks.length > 0 && (
        <section className="hairline-b">
          <div className="container-page section-padding">
            <div className="section-header mb-8">
              <div>
                <span className="eyebrow">Selected</span>
                <h2 className="section-title mt-1.5">Editor&rsquo;s Picks</h2>
              </div>
              <Link
                href="/news"
                className="link-quiet text-eyebrow font-semibold uppercase"
              >
                More Stories &rarr;
              </Link>
            </div>
            <div className="rule-grid sm:grid-cols-2 lg:grid-cols-4">
              {editorsPicks.map((article) => (
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
