import Link from 'next/link'
import { getLatestArticles } from '@/lib/sanity-queries'
import { sampleCategories } from '@/data/sample-news'
import { getCategoryTone } from '@/lib/category-styles'
import { rankByReadership } from '@/lib/story-ranking'
import { banks } from '@/data/banks'
import { BankMark } from '@/components/banks/BankMark'
import { CryptoTicker } from '@/components/home/CryptoTicker'
import { MarketHero } from '@/components/home/MarketHero'
import { Reveal } from '@/components/motion/Reveal'
import { MarketDataWidget } from '@/components/home/MarketDataWidget'
import { RailTabs } from '@/components/home/RailTabs'
import { TrustSignals } from '@/components/home/TrustSignals'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import { ArticleCard } from '@/components/news/ArticleCard'
import { LeadStory } from '@/components/news/LeadStory'
import { StoryRow } from '@/components/news/StoryRow'
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

/**
 * The eight banks surfaced on the front page, resolved from the bank dataset
 * rather than restated here. The previous hardcoded list carried only a name
 * and slug, so it could silently drift from the real data — and it had no brand
 * mark to render.
 */
const POPULAR_BANK_SLUGS = [
  'chase',
  'bank-of-america',
  'wells-fargo',
  'citibank',
  'capital-one',
  'td-bank',
  'pnc-bank',
  'us-bank',
]

const popularBanks = POPULAR_BANK_SLUGS.map((slug) =>
  banks.find((bank) => bank.slug === slug)
).filter((bank): bank is (typeof banks)[number] => Boolean(bank))

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
  const articles = await getLatestArticles(17)

  // The three-column newsroom block. The slices are disjoint on purpose: a
  // trade publication front page earns its density from *distinct* headlines,
  // so repeating the lead's neighbours in the rail would spend vertical space
  // without adding anything to scan. 1 + 6 + 6 = 13 headlines in the block,
  // 17 across the page.
  const featured = articles[0]
  const secondaryStories = articles.slice(1, 7)
  const railLatest = articles.slice(7, 13)
  const editorsPicks = articles.slice(13, 17)

  // A stable seeded rotation of the same pool — no extra fetch, and explicitly
  // not a traffic ranking (see lib/story-ranking.ts).
  const railMostRead = rankByReadership(articles, 6)

  return (
    <>
      {/* Live crypto price ticker */}
      <CryptoTicker />

      {/* Bold modern fintech hero with live coin cards + sparklines */}
      <MarketHero />

      {/*
        ============================================================
        The newsroom block — lead story, headline column, rail.
        ============================================================

        One block replaces what used to be three stacked sections (Today's
        Briefing, Latest News, Most Read). Those showed four or five headlines
        across the first two screens; this shows thirteen, which is the whole
        point of the pattern.

        Density comes from the columns, not from tightening the type: the lead
        keeps its full display headline and deck, and the secondary stories are
        hairline-divided rows rather than cards, so nothing feels cramped.

        Nothing in this block is wrapped in `Reveal`. It is the first screen —
        fading in the largest-contentful-paint element would trade real speed
        for the appearance of polish. Reveals resume below the fold.
      */}
      {featured ? (
        <section className="hairline-b">
          <div className="container-page section-padding">
            <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-8 lg:gap-x-0">
              {/* Primary column: the lead story, widest of the three. */}
              <div className="min-w-0 md:col-span-7 lg:col-span-5 lg:border-r lg:border-hairline lg:pr-8 xl:pr-10 dark:lg:border-hairline-dark">
                <LeadStory
                  article={featured}
                  layout="stacked"
                  divided={false}
                  imageSizes="(min-width: 1280px) 38vw, (min-width: 1024px) 40vw, (min-width: 768px) 56vw, 100vw"
                />
              </div>

              {/* Middle column: the scannable headline list. */}
              <div className="min-w-0 hairline-t pt-10 md:border-t-0 md:pt-0 md:col-span-5 lg:col-span-4 lg:border-r lg:border-hairline lg:px-8 dark:lg:border-hairline-dark">
                <div className="flex items-end justify-between gap-4 border-b border-ink/15 pb-3 dark:border-ink-inverse/15">
                  <h2 className="font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">
                    Latest News
                  </h2>
                  <Link href="/news" className="link-more pb-1">
                    All News
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>

                <ul className="divide-y divide-hairline dark:divide-hairline-dark">
                  {secondaryStories.map((article) => (
                    <li key={article._id} className="py-5">
                      <StoryRow article={article} />
                    </li>
                  ))}
                </ul>
              </div>

              {/*
                Right rail. Narrowest column, and the only sticky one — on a
                long front page the tabs and the signup stay with the reader
                instead of scrolling away after one screen.
              */}
              <aside className="min-w-0 hairline-t pt-10 md:col-span-12 lg:col-span-3 lg:border-t-0 lg:pl-8 lg:pt-0">
                <div className="grid gap-8 md:grid-cols-2 lg:sticky lg:top-28 lg:grid-cols-1">
                  <RailTabs latest={railLatest} mostRead={railMostRead} />
                  <NewsletterSignup variant="compact" />
                </div>
              </aside>
            </div>
          </div>
        </section>
      ) : (
        <section className="hairline-b">
          <div className="container-page section-padding">
            <div className="panel text-center">
              <p className="text-ink-muted dark:text-ink-inverse-muted">
                Stay tuned for the latest finance and crypto news.
              </p>
            </div>
          </div>
        </section>
      )}

      {/*
        Editor's Picks follows the newsroom block directly, so the editorial
        run stays together before the page changes register to market data and
        tools. Cards here rather than rows: after thirteen dense headlines the
        eye wants the change of pace.
      */}
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
                  <BankMark brand={bank.brand} size="sm" />
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
