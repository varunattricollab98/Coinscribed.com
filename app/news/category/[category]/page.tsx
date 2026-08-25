import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { isSanityConfigured } from '@/lib/sanity'
import { getArticlesByCategory, getCategories } from '@/lib/sanity-queries'
import { ArticleCard } from '@/components/news/ArticleCard'

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
  { title: 'All', slug: 'all' },
  { title: 'Crypto', slug: 'crypto' },
  { title: 'Economy', slug: 'economy' },
  { title: 'Markets', slug: 'markets' },
  { title: 'Banking', slug: 'banking' },
]

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  if (!isSanityConfigured) {
    return <CategoryPlaceholder category={category} />
  }

  const [articles, categories] = await Promise.all([
    getArticlesByCategory(category),
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

  const meta = categoryMeta[category]
  const pageTitle = meta?.title || `${category.charAt(0).toUpperCase() + category.slice(1)} News`

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="mb-10">
        <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/news" className="hover:text-zinc-700 dark:hover:text-zinc-200">
            News
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-zinc-100">{pageTitle}</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {pageTitle}
        </h1>
        {meta?.description && (
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            {meta.description}
          </p>
        )}
      </header>

      {/* Category Filter Tabs */}
      <nav className="mb-8 flex flex-wrap gap-2" aria-label="News categories">
        {categoryTabs.map((cat) => (
          <Link
            key={cat.slug}
            href={cat.slug === 'all' ? '/news' : `/news/category/${cat.slug}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              cat.slug === category
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100'
            }`}
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
            No articles in this category yet. Check back soon.
          </p>
        </div>
      )}
    </div>
  )
}

function CategoryPlaceholder({ category }: { category: string }) {
  const meta = categoryMeta[category]
  const pageTitle = meta?.title || `${category.charAt(0).toUpperCase() + category.slice(1)} News`

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/news" className="hover:text-zinc-700 dark:hover:text-zinc-200">
            News
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-zinc-100">{pageTitle}</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {pageTitle}
        </h1>
      </header>

      {/* Category Filter Tabs (static) */}
      <nav className="mb-8 flex flex-wrap gap-2" aria-label="News categories">
        {defaultCategories.map((cat) => (
          <span
            key={cat.slug}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              cat.slug === category
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
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
