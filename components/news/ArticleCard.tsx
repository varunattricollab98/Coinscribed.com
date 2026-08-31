import Link from 'next/link'
import { CategoryBadge } from './CategoryBadge'
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

/**
 * Article cell. Designed to sit inside a `.rule-grid`, so it carries no border
 * or shadow of its own — the grid supplies the hairline column/row rules.
 */
export function ArticleCard({ article }: ArticleCardProps) {
  const eyebrow = article.category?.title ?? 'Coinscribed'

  return (
    <article className="group rule-cell-hover flex h-full flex-col px-5 py-6 sm:px-6">
      {/* Thumbnail: sample articles have no mainImage, so we render a neutral
          paper/ink duotone plate carrying an eyebrow label overlay. */}
      <Link
        href={`/news/${article.slug.current}`}
        className="thumb-duotone mb-4 aspect-video w-full"
        tabIndex={-1}
        aria-hidden="true"
      >
        <span className="eyebrow px-3 pb-2.5">{eyebrow}</span>
      </Link>

      {article.category && (
        <div className="mb-3">
          <CategoryBadge
            title={article.category.title}
            slug={article.category.slug.current}
          />
        </div>
      )}

      <h2 className="font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
        <Link href={`/news/${article.slug.current}`} className="title-link">
          {article.title}
        </Link>
      </h2>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
        {article.excerpt}
      </p>

      <div className="mt-auto flex items-center gap-2 pt-4 text-caption text-ink-muted dark:text-ink-inverse-muted">
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
    </article>
  )
}
