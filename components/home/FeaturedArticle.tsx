import Link from 'next/link'
import { CategoryBadge } from '@/components/news/CategoryBadge'
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
  const eyebrow = featured.category?.title ?? 'Featured'

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-0">
      {/* Featured story */}
      <article className="group flex flex-col lg:col-span-2 lg:border-r lg:border-hairline lg:pr-8 dark:lg:border-hairline-dark">
        <Link
          href={`/news/${featured.slug.current}`}
          className="thumb-duotone mb-5 aspect-video w-full"
          tabIndex={-1}
          aria-hidden="true"
        >
          <span className="eyebrow px-4 pb-3">{eyebrow}</span>
        </Link>

        <div className="space-y-3">
          {featured.category && (
            <CategoryBadge
              title={featured.category.title}
              slug={featured.category.slug.current}
            />
          )}

          <h2 className="font-serif text-display-2 font-bold leading-tight text-ink dark:text-ink-inverse">
            <Link href={`/news/${featured.slug.current}`} className="title-link">
              {featured.title}
            </Link>
          </h2>

          <p className="text-base leading-relaxed text-ink-body dark:text-ink-inverse-body">
            {featured.excerpt}
          </p>

          <div className="flex items-center gap-2 text-caption text-ink-muted dark:text-ink-inverse-muted">
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
      <aside className="lg:pl-8">
        <span className="eyebrow">More Headlines</span>
        <ul className="mt-3 divide-y divide-hairline dark:divide-hairline-dark">
          {sidebar.map((article) => (
            <li key={article._id} className="py-3 first:pt-0 last:pb-0">
              <Link
                href={`/news/${article.slug.current}`}
                className="group block"
              >
                {article.category && (
                  <span className="text-eyebrow font-semibold uppercase text-oxblood dark:text-oxblood-lighter">
                    {article.category.title}
                  </span>
                )}
                <p className="mt-1 font-serif text-display-4 font-bold leading-snug text-ink dark:text-ink-inverse">
                  <span className="title-link">{article.title}</span>
                </p>
                <time
                  dateTime={article.publishedAt}
                  className="mt-1 block text-caption text-ink-muted dark:text-ink-inverse-muted"
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
