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
        <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          News
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          The latest in cryptocurrency, finance, and markets
        </p>
      </header>

      {/* Category Filter Tabs */}
      <nav className="mb-8 flex flex-wrap gap-2" aria-label="News categories">
        {categoryTabs.map((cat) => (
          <Link
            key={cat.slug}
            href={cat.slug === 'all' ? '/news' : `/news/category/${cat.slug}`}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
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
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-zinc-600 dark:text-zinc-400">
            No articles published yet. Check back soon for the latest news.
          </p>
        </div>
      )}
    </div>
  )
}
