import Link from 'next/link'
import { CategoryBadge } from '@/components/news/CategoryBadge'
import { getCategoryGradient } from '@/lib/category-styles'
import type { ArticleCard as ArticleCardType } from '@/lib/sanity-queries'

interface FeaturedArticleProps {
  featured: ArticleCardType
  sidebar: ArticleCardType[]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function FeaturedArticle({ featured, sidebar }: FeaturedArticleProps) {
  const gradient = getCategoryGradient(featured.category?.slug.current)

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Featured story */}
      <article className="group card card-hover lg:col-span-2">
        <Link
          href={`/news/${featured.slug.current}`}
          className="block overflow-hidden rounded-lg"
        >
          <div
            className={`flex aspect-video w-full items-center justify-center ${gradient}`}
          >
            <span className="font-serif text-2xl font-bold text-white/90">
              {featured.category?.title ?? 'Featured'}
            </span>
          </div>
        </Link>

        <div className="mt-5 space-y-3">
          {featured.category && (
            <CategoryBadge
              title={featured.category.title}
              slug={featured.category.slug.current}
            />
          )}

          <h2 className="font-serif text-2xl font-bold leading-tight text-zinc-900 transition-colors group-hover:text-teal-primary dark:text-zinc-100 dark:group-hover:text-teal-medium sm:text-3xl">
            <Link href={`/news/${featured.slug.current}`}>
              {featured.title}
            </Link>
          </h2>

          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {featured.excerpt}
          </p>

          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
            {featured.author?.name && (
              <>
                <span className="font-medium">{featured.author.name}</span>
                <span aria-hidden="true">&middot;</span>
              </>
            )}
            <time dateTime={featured.publishedAt}>
              {formatDate(featured.publishedAt)}
            </time>
          </div>
        </div>
      </article>

      {/* Sidebar headlines */}
      <aside className="card">
        <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">
          More Headlines
        </h3>
        <ul className="mt-4 divide-y divide-brand-border-gray dark:divide-zinc-800">
          {sidebar.map((article) => (
            <li key={article._id} className="py-3 first:pt-0 last:pb-0">
              <Link
                href={`/news/${article.slug.current}`}
                className="group block"
              >
                {article.category && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-teal-primary dark:text-teal-medium">
                    {article.category.title}
                  </span>
                )}
                <p className="mt-1 font-serif text-sm font-bold leading-snug text-zinc-900 transition-colors group-hover:text-teal-primary dark:text-zinc-100 dark:group-hover:text-teal-medium">
                  {article.title}
                </p>
                <time
                  dateTime={article.publishedAt}
                  className="mt-1 block text-xs text-zinc-500 dark:text-zinc-500"
                >
                  {formatDate(article.publishedAt)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
