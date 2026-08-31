import Link from 'next/link'
import { CategoryBadge } from './CategoryBadge'
import { getCategoryGradient } from '@/lib/category-styles'
import type { ArticleCard as ArticleCardType } from '@/lib/sanity-queries'

interface ArticleCardProps {
  article: ArticleCardType
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function ArticleCard({ article }: ArticleCardProps) {
  const gradient = getCategoryGradient(article.category?.slug.current)

  return (
    <article className="group card card-hover card-teal-border">
      {/* Thumbnail: always rendered. Sample articles have no mainImage, so we
          fall back to a category-colored gradient placeholder. */}
      <Link
        href={`/news/${article.slug.current}`}
        className="mb-4 block overflow-hidden rounded-md"
      >
        <div
          className={`flex aspect-video w-full items-center justify-center ${gradient}`}
        >
          <span className="font-serif text-lg font-bold text-white/90">
            {article.category?.title ?? 'Coinscribed'}
          </span>
        </div>
      </Link>

      <div className="space-y-3">
        {article.category && (
          <CategoryBadge
            title={article.category.title}
            slug={article.category.slug.current}
          />
        )}

        <h2 className="font-serif text-xl font-bold leading-tight text-zinc-900 transition-colors group-hover:text-teal-primary dark:text-zinc-100 dark:group-hover:text-teal-medium">
          <Link href={`/news/${article.slug.current}`}>
            {article.title}
          </Link>
        </h2>

        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
          {article.author?.name && (
            <>
              <span className="font-medium">{article.author.name}</span>
              <span aria-hidden="true">&middot;</span>
            </>
          )}
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </div>
    </article>
  )
}
