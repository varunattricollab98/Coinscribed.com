import Link from 'next/link'
import Image from 'next/image'
import type { Author } from '@/lib/sanity-queries'

/**
 * E-E-A-T trust bar shown under the article title.
 *
 * On YMYL (finance) topics, Google and readers weigh trust signals heavily, so
 * this surfaces authorship and freshness prominently: author photo + name
 * (linked to their bio page), their job title, the publish date, an "Updated"
 * date when the article was revised meaningfully after publishing, and the
 * reading time. Richer than the plain Byline (which shows only name/date/time).
 */
function formatDate(value?: string): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function AuthorTrustBar({
  author,
  authorSlug,
  publishedAt,
  updatedAt,
  readingTime,
  className = '',
}: {
  author?: Author
  authorSlug?: string
  publishedAt: string
  updatedAt?: string
  readingTime?: number
  className?: string
}) {
  const published = formatDate(publishedAt)
  // Only treat as "Updated" if the revision is at least ~24h after publish, so
  // trivial re-saves right after publishing don't show a misleading date.
  const showUpdated =
    updatedAt &&
    new Date(updatedAt).getTime() - new Date(publishedAt).getTime() >
      24 * 60 * 60 * 1000
  const updated = showUpdated ? formatDate(updatedAt) : ''

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-caption text-ink-muted dark:text-ink-inverse-muted ${className}`}
    >
      {author && (
        <span className="flex items-center gap-2">
          {author.imageUrl ? (
            <Image
              src={author.imageUrl}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-hairline dark:ring-hairline-dark"
            />
          ) : (
            <span
              className="h-7 w-7 rounded-full bg-hairline dark:bg-wash-dark"
              aria-hidden="true"
            />
          )}
          <span className="text-ink-body dark:text-ink-inverse-body">
            By{' '}
            {authorSlug ? (
              <Link
                href={`/news/author/${authorSlug}`}
                className="font-semibold text-ink transition-colors hover:text-accent dark:text-ink-inverse dark:hover:text-accent-light"
              >
                {author.name}
              </Link>
            ) : (
              <span className="font-semibold text-ink dark:text-ink-inverse">
                {author.name}
              </span>
            )}
          </span>
        </span>
      )}

      {author?.jobTitle && (
        <>
          <span aria-hidden="true">·</span>
          <span>{author.jobTitle}</span>
        </>
      )}

      {published && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            {updated ? 'Published ' : ''}
            <time dateTime={publishedAt}>{published}</time>
          </span>
        </>
      )}

      {updated && (
        <>
          <span aria-hidden="true">·</span>
          <span className="text-accent dark:text-accent-light">
            Updated <time dateTime={updatedAt}>{updated}</time>
          </span>
        </>
      )}

      {typeof readingTime === 'number' && readingTime > 0 && (
        <>
          <span aria-hidden="true">·</span>
          <span>{readingTime} min read</span>
        </>
      )}
    </div>
  )
}
