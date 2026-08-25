import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { isSanityConfigured } from '@/lib/sanity'
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
  if (!isSanityConfigured) {
    return <NewsPlaceholder />
  }

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

function NewsPlaceholder() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          News
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          The latest in cryptocurrency, finance, and markets
        </p>
      </header>

      {/* Category Filter Tabs (static) */}
      <nav className="mb-8 flex flex-wrap gap-2" aria-label="News categories">
        {defaultCategories.map((cat) => (
          <span
            key={cat.slug}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {cat.title}
          </span>
        ))}
      </nav>

      {/* Placeholder Message */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
            />
          </svg>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Content Managed via Sanity CMS
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            News content is managed via Sanity CMS. Configure your Sanity project
            to see articles here. See the README for setup instructions.
          </p>
        </div>
      </div>
    </div>
  )
}
