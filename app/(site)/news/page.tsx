import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { getAllArticles, getCategories } from '@/lib/sanity-queries'
import { ArticleCard } from '@/components/news/ArticleCard'
import { LeadStory } from '@/components/news/LeadStory'
import { Pagination } from '@/components/news/Pagination'
import { Reveal } from '@/components/motion/Reveal'

export const metadata: Metadata = {
  title: 'Finance & Crypto News',
  description:
    'Stay informed with the latest cryptocurrency, market, economy, and banking news from Coinscribed.',
  // The listing paginates via ?page=N. Every page points its canonical at the
  // clean /news so the paginated variants are consolidated into one indexed
  // URL rather than competing as near-duplicate content. The page links
  // themselves remain crawlable for discovery.
  alternates: { canonical: '/news' },
  openGraph: {
    title: `Finance & Crypto News | ${siteConfig.name}`,
    description:
      'Stay informed with the latest cryptocurrency, market, economy, and banking news.',
    url: `${siteConfig.url}/news`,
  },
}

const defaultCategories = [
  { title: 'Crypto', slug: 'crypto' },
  { title: 'Economy', slug: 'economy' },
  { title: 'Markets', slug: 'markets' },
  { title: 'Banking', slug: 'banking' },
]

/** Cards rendered per page, excluding the lead story on page one. */
const PER_PAGE = 12

interface NewsPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const [{ page }, articles, categories] = await Promise.all([
    searchParams,
    getAllArticles(),
    getCategories(),
  ])

  const categoryTabs =
    categories.length > 0
      ? categories.map((c) => ({ title: c.title, slug: c.slug.current }))
      : defaultCategories

  // Page one leads with a hero story; every page after it is a pure grid.
  const [lead, ...remaining] = articles
  const totalPages = Math.max(1, Math.ceil(remaining.length / PER_PAGE))
  const parsed = Number.parseInt(page ?? '1', 10)
  const currentPage = Math.min(
    Math.max(Number.isNaN(parsed) ? 1 : parsed, 1),
    totalPages
  )
  const isFirstPage = currentPage === 1

  const visible = remaining.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  )

  return (
    <div className="hairline-b">
      <div className="container-page section-padding">
        {/* Page header */}
        <Reveal className="section-header mb-8">
          <div>
            <span className="eyebrow-accent">Newsroom</span>
            <h1 className="page-title mt-2">News</h1>
          </div>
          <p className="text-caption text-ink-muted dark:text-ink-inverse-muted">
            <span className="tabular-nums">{articles.length}</span> stories
            {totalPages > 1 && (
              <>
                {' '}
                &middot; Page <span className="tabular-nums">{currentPage}</span> of{' '}
                <span className="tabular-nums">{totalPages}</span>
              </>
            )}
          </p>
        </Reveal>

        <p className="deck mb-8 max-w-2xl">
          Daily coverage of cryptocurrency, markets, the US economy and the
          banking industry — reported for people who have money at stake.
        </p>

        {/* Category filter — accent-tinted tabs on a hairline underline row */}
        <nav
          className="mb-12 flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-hairline pb-4 dark:border-hairline-dark"
          aria-label="News categories"
        >
          <Link
            href="/news"
            aria-current="page"
            className="border-b-2 border-accent pb-1.5 text-eyebrow font-semibold uppercase text-accent dark:border-accent-light dark:text-accent-light"
          >
            All
          </Link>
          {categoryTabs.map((cat) => (
            <Link
              key={cat.slug}
              href={`/news/category/${cat.slug}`}
              className="border-b-2 border-transparent pb-1.5 text-eyebrow font-semibold uppercase text-ink-muted transition-colors hover:border-accent/40 hover:text-accent dark:text-ink-inverse-muted dark:hover:text-accent-light"
            >
              {cat.title}
            </Link>
          ))}
        </nav>

        {articles.length > 0 ? (
          <>
            {isFirstPage && lead && (
              <Reveal>
                <LeadStory article={lead} />
              </Reveal>
            )}

            {visible.length > 0 && (
              <div className="rule-grid sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((article, i) => (
                  <Reveal key={article._id} delay={Math.min(i, 5) * 0.05}>
                    {/* On pages 2+ the first card is the LCP candidate. */}
                    <ArticleCard article={article} priority={!isFirstPage && i === 0} />
                  </Reveal>
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/news"
            />
          </>
        ) : (
          <div className="panel-muted text-center">
            <p className="text-ink-body dark:text-ink-inverse-muted">
              No articles published yet. Check back soon for the latest news.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
