import Image from 'next/image'

interface BylineProps {
  author?: { name: string; imageUrl?: string }
  publishedAt: string
  readingTime?: number
  /** `sm` for card footers, `md` for lead stories and article headers. */
  size?: 'sm' | 'md'
  /** Render on top of a photograph — inverts the palette. */
  onDark?: boolean
  className?: string
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * The newsroom byline: author portrait, name, publication date and reading time.
 *
 * One component so every surface — card footers, lead stories, article headers,
 * the Most Read rail — renders the same thing at the same rhythm. The portrait
 * is decorative next to the name it accompanies, so it carries an empty alt.
 * When no portrait exists the space collapses to a neutral disc rather than
 * shifting the layout.
 */
export function Byline({
  author,
  publishedAt,
  readingTime,
  size = 'sm',
  onDark = false,
  className = '',
}: BylineProps) {
  const dimension = size === 'md' ? 36 : 26
  const box = size === 'md' ? 'h-9 w-9' : 'h-[26px] w-[26px]'

  const tone = onDark
    ? 'text-white/70'
    : 'text-ink-muted dark:text-ink-inverse-muted'
  const nameTone = onDark
    ? 'text-white'
    : 'text-ink-body dark:text-ink-inverse-body'
  const ring = onDark
    ? 'ring-white/30'
    : 'ring-hairline dark:ring-hairline-dark'

  return (
    <div
      className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-caption ${tone} ${className}`}
    >
      {author?.name && (
        <span className="flex items-center gap-2">
          {author.imageUrl ? (
            <Image
              src={author.imageUrl}
              alt=""
              width={dimension}
              height={dimension}
              className={`${box} shrink-0 rounded-full object-cover ring-1 ${ring}`}
            />
          ) : (
            <span
              aria-hidden="true"
              className={`${box} shrink-0 rounded-full bg-hairline ring-1 ${ring} dark:bg-wash-dark`}
            />
          )}
          <span className={`font-medium ${nameTone}`}>{author.name}</span>
        </span>
      )}

      <span aria-hidden="true" className="opacity-50">
        &middot;
      </span>
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>

      {readingTime ? (
        <>
          <span aria-hidden="true" className="opacity-50">
            &middot;
          </span>
          <span className="tabular-nums">{readingTime} min read</span>
        </>
      ) : null}
    </div>
  )
}
