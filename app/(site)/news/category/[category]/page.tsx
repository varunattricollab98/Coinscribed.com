import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { getArticlesByCategory, getCategories } from '@/lib/sanity-queries'
import { sampleCategories } from '@/data/sample-news'
import { ArticleCard } from '@/components/news/ArticleCard'
import { LeadStory } from '@/components/news/LeadStory'
import { Reveal } from '@/components/motion/Reveal'

/**
 * Pre-render every category at build time.
 *
 * Without this the route was server-rendered on demand, so each of the four
 * category links on the home page turned its <Link> prefetch into a full server
 * render — measured at 600-700ms each, and they fired in parallel while the
 * reader was still loading the page. Statically generated, those prefetches
 * become plain CDN file reads.
 */
export function generateStaticParams() {
  return sampleCategories.map((category) => ({
    category: category.slug.current,
  }))
}

/** Refresh the static output periodically so CMS edits still land. */
export const revalidate = 300

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

const categoryMeta: Record<string, { title: string; description: string }> = {
  crypto: {
    title: 'Crypto News',
    description:
      'Latest cryptocurrency news covering Bitcoin, Ethereum, DeFi, NFTs, and blockchain technology.',
  },
  economy: {
    title: 'Economy News',
    description:
      'Macroeconomic news including GDP, inflation, employment data, and fiscal policy updates.',
  },
  markets: {
    title: 'Market News',
    description:
      'Stock market, bonds, commodities, forex, and investment analysis from Coinscribed.',
  },
  banking: {
    title: 'Banking News',
    description:
      'Banking industry news, regulations, fintech innovations, and digital banking updates.',
  },
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const meta = categoryMeta[category] || {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} News`,
    description: `Latest ${category} news and analysis from ${siteConfig.name}.`,
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/news/category/${category}` },
    openGraph: {
      title: `${meta.title} | ${siteConfig.name}`,
      description: meta.description,
      url: `${siteConfig.url}/news/category/${category}`,
    },
  }
}

const defaultCategories = [
  { title: 'Crypto', slug: 'crypto' },
  { title: 'Economy', slug: 'economy' },
  { title: 'Markets', slug: 'markets' },
  { title: 'Banking', slug: 'banking' },
]

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  const [articles, categories] = await Promise.all([
    getArticlesByCategory(category),
    getCategories(),
  ])

  const categoryTabs =
    categories.length > 0
      ? categories.map((c) => ({ title: c.title, slug: c.slug.current }))
      : defaultCategories

  const meta = categoryMeta[category]
  const pageTitle =
    meta?.title || `${category.charAt(0).toUpperCase() + category.slice(1)} News`

  const [lead, ...rest] = articles

  return (
    <div className="hairline-b">
      <div className="container-page section-padding">
        {/* Breadcrumb */}
        <nav className="mb-5 text-caption text-ink-muted dark:text-ink-inverse-muted">
          <Link
            href="/news"
            className="transition-colors hover:text-accent dark:hover:text-accent-light"
          >
            News
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-ink dark:text-ink-inverse">{pageTitle}</span>
        </nav>

        {/* Page header */}
        <Reveal className="section-header mb-8">
          <div>
            <span className="eyebrow-accent">Newsroom</span>
            <h1 className="page-title mt-2">{pageTitle}</h1>
          </div>
          <p className="text-caption text-ink-muted dark:text-ink-inverse-muted">
            <span className="tabular-nums">{articles.length}</span> stories
          </p>
        </Reveal>

        {meta?.description && <p className="deck mb-8 max-w-2xl">{meta.description}</p>}

        {/* Category filter — accent-tinted tabs on a hairline underline row */}
        <nav
          className="mb-12 flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-hairline pb-4 dark:border-hairline-dark"
          aria-label="News categories"
        >
          <Link
            href="/news"
            className="border-b-2 border-transparent pb-1.5 text-eyebrow font-semibold uppercase text-ink-muted transition-colors hover:border-accent/40 hover:text-accent dark:text-ink-inverse-muted dark:hover:text-accent-light"
          >
            All
          </Link>
          {categoryTabs.map((cat) => {
            const active = cat.slug === category
            return (
              <Link
                key={cat.slug}
                href={`/news/category/${cat.slug}`}
                aria-current={active ? 'page' : undefined}
                className={
                  active
                    ? 'border-b-2 border-accent pb-1.5 text-eyebrow font-semibold uppercase text-accent dark:border-accent-light dark:text-accent-light'
                    : 'border-b-2 border-transparent pb-1.5 text-eyebrow font-semibold uppercase text-ink-muted transition-colors hover:border-accent/40 hover:text-accent dark:text-ink-inverse-muted dark:hover:text-accent-light'
                }
              >
                {cat.title}
              </Link>
            )
          })}
        </nav>

        {articles.length > 0 ? (
          <>
            {lead && (
              <Reveal>
                <LeadStory article={lead} kicker="Lead Story" />
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="rule-grid sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article, i) => (
                  <Reveal key={article._id} delay={Math.min(i, 5) * 0.05}>
                    <ArticleCard article={article} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="panel-muted text-center">
            <p className="text-ink-body dark:text-ink-inverse-muted">
              No articles in this category yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
