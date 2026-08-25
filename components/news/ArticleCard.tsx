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

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group rounded-lg border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      {article.mainImage && (
        <div className="mb-4 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
          <div className="aspect-video w-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
      )}

      <div className="space-y-3">
        {article.category && (
          <CategoryBadge
            title={article.category.title}
            slug={article.category.slug.current}
          />
        )}

        <h2 className="font-serif text-xl font-bold leading-tight text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
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
