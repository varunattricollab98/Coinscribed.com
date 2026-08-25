import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
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
