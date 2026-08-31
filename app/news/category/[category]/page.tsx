import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { getArticlesByCategory, getCategories } from '@/lib/sanity-queries'
import { ArticleCard } from '@/components/news/ArticleCard'
import { CategoryBadge } from '@/components/news/CategoryBadge'

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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

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

  const lead = articles[0]
  const rest = articles.slice(1)

  return (
    <div className="hairline-b">
      <div className="container-page section-padding">
        {/* Breadcrumb */}
        <nav className="mb-4 text-caption text-ink-muted dark:text-ink-inverse-muted">
          <Link
            href="/news"
            className="transition-colors hover:text-oxblood dark:hover:text-oxblood-lighter"
          >
            News
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-ink dark:text-ink-inverse">{pageTitle}</span>
        </nav>

        {/* Page header */}
        <div className="section-header mb-8">
          <div>
            <span className="eyebrow-accent">Newsroom</span>
            <h1 className="page-title mt-1.5">{pageTitle}</h1>
          </div>
        </div>

        {meta?.description && (
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-ink-body dark:text-ink-inverse-body">
            {meta.description}
          </p>
        )}

        {/* Category filter — active tab uses oxblood/bold ink, not a pill */}
        <nav
          className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-hairline pb-4 dark:border-hairline-dark"
          aria-label="News categories"
        >
          <Link
            href="/news"
            className="text-eyebrow font-semibold uppercase text-ink-muted transition-colors hover:text-oxblood dark:text-ink-inverse-muted dark:hover:text-oxblood-lighter"
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
                    ? 'text-eyebrow font-semibold uppercase text-oxblood dark:text-oxblood-lighter'
                    : 'text-eyebrow font-semibold uppercase text-ink-muted transition-colors hover:text-oxblood dark:text-ink-inverse-muted dark:hover:text-oxblood-lighter'
                }
              >
                {cat.title}
              </Link>
            )
          })}
        </nav>

        {articles.length > 0 ? (
          <>
            {/* Lead featured story */}
            {lead && (
              <article className="group mb-10 grid grid-cols-1 gap-6 border-b border-hairline pb-10 lg:grid-cols-2 lg:gap-10 dark:border-hairline-dark">
                {lead.imageUrl ? (
                  <Link
                    href={`/news/${lead.slug.current}`}
                    className="relative aspect-video w-full overflow-hidden"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Image
                      src={lead.imageUrl}
                      alt={lead.title}
                      fill
                      priority
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </Link>
                ) : (
                  <Link
                    href={`/news/${lead.slug.current}`}
                    className="thumb-duotone aspect-video w-full"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                )}
                <div className="flex flex-col justify-center">
                  {lead.category && (
                    <div className="mb-3">
                      <CategoryBadge
                        title={lead.category.title}
                        slug={lead.category.slug.current}
                      />
                    </div>
                  )}
                  <h2 className="font-serif text-display-2 font-bold leading-tight text-ink dark:text-ink-inverse">
                    <Link href={`/news/${lead.slug.current}`} className="title-link">
                      {lead.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-ink-body dark:text-ink-inverse-body">
                    {lead.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-caption text-ink-muted dark:text-ink-inverse-muted">
                    {lead.author?.name && (
                      <>
                        <span className="font-medium">{lead.author.name}</span>
                        <span aria-hidden="true">&middot;</span>
                      </>
                    )}
                    <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time>
                    {lead.readingTime && (
                      <>
                        <span aria-hidden="true">&middot;</span>
                        <span className="tabular-nums">{lead.readingTime} min read</span>
                      </>
                    )}
                  </div>
                </div>
              </article>
            )}

            {/* Remaining stories in a dense rule-grid */}
            {rest.length > 0 && (
              <div className="rule-grid sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <ArticleCard key={article._id} article={article} />
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
