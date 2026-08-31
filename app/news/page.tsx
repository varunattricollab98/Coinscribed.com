import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { getAllArticles, getCategories } from '@/lib/sanity-queries'
import { ArticleCard } from '@/components/news/ArticleCard'
import { CategoryBadge } from '@/components/news/CategoryBadge'

export const metadata: Metadata = {
  title: 'Finance & Crypto News',
  description:
    'Stay informed with the latest cryptocurrency, market, economy, and banking news from Coinscribed.',
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function NewsPage() {
  const [articles, categories] = await Promise.all([
    getAllArticles(),
    getCategories(),
  ])

  const categoryTabs =
    categories.length > 0
      ? categories.map((c) => ({ title: c.title, slug: c.slug.current }))
      : defaultCategories

  const lead = articles[0]
  const rest = articles.slice(1)

  return (
    <div className="hairline-b">
      <div className="container-page section-padding">
        {/* Page header */}
        <div className="section-header mb-8">
          <div>
            <span className="eyebrow-accent">Newsroom</span>
            <h1 className="page-title mt-1.5">News</h1>
          </div>
        </div>

        <p className="mb-6 max-w-2xl text-base leading-relaxed text-ink-body dark:text-ink-inverse-body">
          The latest in cryptocurrency, finance, and markets.
        </p>

        {/* Category filter — eyebrow text links, no pills */}
        <nav
          className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-hairline pb-4 dark:border-hairline-dark"
          aria-label="News categories"
        >
          <span
            aria-current="page"
            className="text-eyebrow font-semibold uppercase text-oxblood dark:text-oxblood-lighter"
          >
            All
          </span>
          {categoryTabs.map((cat) => (
            <Link
              key={cat.slug}
              href={`/news/category/${cat.slug}`}
              className="text-eyebrow font-semibold uppercase text-ink-muted transition-colors hover:text-oxblood dark:text-ink-inverse-muted dark:hover:text-oxblood-lighter"
            >
              {cat.title}
            </Link>
          ))}
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
              No articles published yet. Check back soon for the latest news.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
