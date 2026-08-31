import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { getAllArticles, getCategories } from '@/lib/sanity-queries'
import { ArticleCard } from '@/components/news/ArticleCard'

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
  { title: 'All', slug: 'all' },
  { title: 'Crypto', slug: 'crypto' },
  { title: 'Economy', slug: 'economy' },
  { title: 'Markets', slug: 'markets' },
  { title: 'Banking', slug: 'banking' },
]

export default async function NewsPage() {
  const [articles, categories] = await Promise.all([
    getAllArticles(),
    getCategories(),
  ])

  const categoryTabs =
    categories.length > 0
      ? [
          { title: 'All', slug: 'all' },
          ...categories.map((c) => ({
            title: c.title,
            slug: c.slug.current,
          })),
        ]
      : defaultCategories

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-ink dark:text-ink-inverse">
          News
        </h1>
        <p className="mt-2 text-lg text-ink-body dark:text-ink-inverse-muted">
          The latest in cryptocurrency, finance, and markets
        </p>
      </header>

      {/* Category Filter Tabs */}
      <nav className="mb-8 flex flex-wrap gap-2" aria-label="News categories">
        {categoryTabs.map((cat) => (
          <Link
            key={cat.slug}
            href={cat.slug === 'all' ? '/news' : `/news/category/${cat.slug}`}
            className="rounded-full border border-hairline bg-white px-4 py-2 text-sm font-medium text-ink-body transition-colors hover:border-oxblood hover:text-oxblood dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse-body dark:hover:border-oxblood-light dark:hover:text-ink-inverse"
          >
            {cat.title}
          </Link>
        ))}
      </nav>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-hairline bg-wash p-12 text-center dark:border-hairline-dark dark:bg-elevated">
          <p className="text-ink-body dark:text-ink-inverse-muted">
            No articles published yet. Check back soon for the latest news.
          </p>
        </div>
      )}
    </div>
  )
}
