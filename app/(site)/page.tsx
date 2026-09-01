import Link from 'next/link'
import Image from 'next/image'
import { getLatestArticles } from '@/lib/sanity-queries'
import { sampleCategories } from '@/data/sample-news'
import { getCategoryTone } from '@/lib/category-styles'
import { CryptoTicker } from '@/components/home/CryptoTicker'
import { MarketHero } from '@/components/home/MarketHero'
import { Reveal } from '@/components/motion/Reveal'
import { FeaturedArticle } from '@/components/home/FeaturedArticle'
import { MarketDataWidget } from '@/components/home/MarketDataWidget'
import { TrustSignals } from '@/components/home/TrustSignals'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import { ArticleCard } from '@/components/news/ArticleCard'
import { Byline } from '@/components/news/Byline'
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

export default async function HomePage() {
  // One fetch feeds every editorial block below; nothing is fetched and thrown
  // away, and the homepage never renders the whole archive.
  const articles = await getLatestArticles(15)

  const featured = articles[0]
  const sidebarArticles = articles.slice(1, 5)
  const gridArticles = articles.slice(5, 11)

  // Trending / Most-Read reuses the freshest five stories (same images, already
  // in cache — no extra network cost).
  const trendingArticles = articles.slice(0, 5)
  const editorsPicks = articles.slice(11, 15)

  return (
    <>
      {/* Live crypto price ticker */}
      <CryptoTicker />

      {/* Bold modern fintech hero with live coin cards + sparklines */}
      <MarketHero />

      {/* Lead story */}
      <section className="hairline-b">
        <div className="container-page section-padding">
          <Reveal className="section-header mb-10">
            <div>
              <span className="eyebrow-royal">Top Story</span>
              <h2 className="section-title mt-2">Today&rsquo;s Briefing</h2>
            </div>
            <Link href="/news" className="link-more">
              All News
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </Reveal>

          {featured ? (
            <Reveal>
              <FeaturedArticle featured={featured} sidebar={sidebarArticles} />
            </Reveal>
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
          <Reveal className="section-header mb-8">
            <div>
              <span className="eyebrow">Markets</span>
              <h2 className="section-title mt-2">Index Snapshot</h2>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <MarketDataWidget />
          </Reveal>
        </div>
      </section>

      {/* Latest news grid */}
      {gridArticles.length > 0 && (
        <section className="hairline-b">
          <div className="container-page section-padding">
            <div className="section-header mb-10">
              <div>
                <span className="eyebrow">Analysis</span>
                <h2 className="section-title mt-2">Latest News</h2>
              </div>
              <Link href="/news" className="link-more">
                View All
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="rule-grid sm:grid-cols-2 lg:grid-cols-3">
              {gridArticles.map((article, i) => (
                <Reveal key={article._id} delay={Math.min(i, 3) * 0.05}>
                  <ArticleCard article={article} />
                </Reveal>
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
                <h2 className="section-title mt-2">Most Read</h2>
              </div>
              <Link href="/news" className="link-more">
                All News
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <ol className="divide-y divide-hairline dark:divide-hairline-dark">
              {trendingArticles.map((article, index) => (
                <li key={article._id}>
                  <Link
                    href={`/news/${article.slug.current}`}
                    className="group rule-cell-hover flex items-center gap-4 py-5 sm:gap-7"
                  >
                    <span
                      aria-hidden="true"
                      className="w-10 shrink-0 font-serif text-display-2 font-bold tabular-nums text-gold dark:text-gold-light"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {article.imageUrl && (
                      <span className="media-frame hidden aspect-[16/10] w-32 shrink-0 sm:block">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          sizes="128px"
                          className="media-zoom"
                        />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      {article.category && (
                        <span className="text-eyebrow font-semibold uppercase text-ink-muted dark:text-ink-inverse-muted">
                          {article.category.title}
                        </span>
                      )}
                      <span className="mt-1.5 block font-serif text-display-4 font-bold leading-snug text-ink dark:text-ink-inverse">
                        <span className="title-link">{article.title}</span>
                      </span>
                      <Byline
                        author={article.author}
                        publishedAt={article.publishedAt}
                        className="mt-2"
                      />
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
          <Reveal className="section-header mb-10">
            <div>
              <span className="eyebrow">Sections</span>
              <h2 className="section-title mt-2">Explore by Topic</h2>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topicTiles.map((topic, i) => {
              const category = sampleCategories.find(
                (c) => c.slug.current === topic.slug
              )
              if (!category) return null
              const tone = getCategoryTone(topic.slug)
              return (
                <Reveal key={topic.slug} delay={i * 0.06}>
                  <Link
                    href={`/news/category/${topic.slug}`}
                    className="group card-premium p-7"
                  >
                    {/* Soft accent glow on hover */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/0 blur-2xl transition-colors duration-300 group-hover:bg-accent/10"
                    />
                    <span className="icon-plate">
                      <LineIcon name={topic.icon} className="h-6 w-6" />
                    </span>
                    <span
                      className={`mt-6 text-eyebrow font-semibold uppercase ${tone.label}`}
                    >
                      {category.title}
                    </span>
                    <span
                      className={`mt-2 block h-0.5 w-8 ${tone.rule}`}
                      aria-hidden="true"
                    />
                    <p className="mt-3.5 flex-1 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                      {category.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-eyebrow font-semibold uppercase text-accent transition-all duration-200 ease-editorial group-hover:gap-2.5 dark:text-accent-light">
                      Read {category.title}
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Editor's picks */}
      {editorsPicks.length > 0 && (
        <section className="hairline-b">
          <div className="container-page section-padding">
            <div className="section-header mb-10">
              <div>
                <span className="eyebrow-royal">Selected</span>
                <h2 className="section-title mt-2">Editor&rsquo;s Picks</h2>
              </div>
              <Link href="/news" className="link-more">
                More Stories
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="rule-grid sm:grid-cols-2 lg:grid-cols-4">
              {editorsPicks.map((article, i) => (
                <Reveal key={article._id} delay={Math.min(i, 3) * 0.05}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust signals */}
      <section className="hairline-b">
        <div className="container-page section-padding">
          <Reveal>
            <TrustSignals />
          </Reveal>
        </div>
      </section>

      {/* Calculators */}
      <section className="hairline-b">
        <div className="container-page section-padding">
          <div className="section-header mb-10">
            <div>
              <span className="eyebrow">Tools</span>
              <h2 className="section-title mt-2">Financial Calculators</h2>
            </div>
            <Link href="/calculators" className="link-more">
              All Tools
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {calculatorHighlights.map((calc, i) => (
              <Reveal key={calc.href} delay={Math.min(i, 3) * 0.05}>
                <Link href={calc.href} className="group card-premium p-7">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/0 blur-2xl transition-colors duration-300 group-hover:bg-accent/10"
                  />
                  <span className="icon-plate">
                    <LineIcon name={calc.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                    <span className="title-link">{calc.title}</span>
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                    {calc.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-eyebrow font-semibold uppercase text-accent transition-all duration-200 ease-editorial group-hover:gap-2.5 dark:text-accent-light">
                    Calculate
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bank routing numbers preview */}
      <section className="hairline-b">
        <div className="container-page section-padding">
          <div className="section-header mb-10">
            <div>
              <span className="eyebrow">Reference</span>
              <h2 className="section-title mt-2">US Bank Routing Numbers</h2>
            </div>
            <Link href="/bank-routing-numbers" className="link-more">
              Browse All
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <Reveal>
            <p className="deck max-w-2xl">
              Find routing numbers for all major US banks. Verify ABA routing
              numbers for wire transfers, ACH payments, and direct deposits.
            </p>
          </Reveal>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {popularBanks.map((bank, i) => (
              <Reveal key={bank.slug} delay={Math.min(i, 4) * 0.03}>
                <Link
                  href={`/bank-routing-numbers/${bank.slug}`}
                  className="group flex h-full items-center gap-3 border border-hairline bg-surface px-4 py-4 shadow-soft transition-all duration-200 ease-editorial hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lift motion-reduce:transform-none dark:border-hairline-dark dark:bg-elevated dark:shadow-none dark:hover:border-accent-light/40"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center bg-accent-soft text-accent dark:bg-accent/15 dark:text-accent-light">
                    <LineIcon name="bank" className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink dark:text-ink-inverse">
                    {bank.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-ink-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent dark:group-hover:text-accent-light"
                  >
                    &rarr;
                  </span>
                </Link>
              </Reveal>
            ))}
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
