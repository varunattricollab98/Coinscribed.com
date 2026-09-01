import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  /** Path the page number is appended to as `?page=N`. */
  basePath: string
}

/**
 * Server-rendered pagination.
 *
 * A newsroom with forty-odd stories should not ship all of them to every
 * visitor: each extra card costs an image request, a DOM subtree and a scroll
 * observer. Real links with `?page=N` keep the listing crawlable, keep every
 * page cheap, and work with JavaScript disabled.
 */
export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const href = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`)

  // Window of pages around the current one, always including first and last.
  const pages: (number | 'gap')[] = []
  for (let page = 1; page <= totalPages; page += 1) {
    const nearCurrent = Math.abs(page - currentPage) <= 1
    const isEdge = page === 1 || page === totalPages

    if (nearCurrent || isEdge) {
      pages.push(page)
    } else if (pages[pages.length - 1] !== 'gap') {
      pages.push('gap')
    }
  }

  const cell =
    'grid h-10 min-w-10 place-items-center border px-3 text-eyebrow font-semibold uppercase tabular-nums transition-colors duration-150'

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-hairline pt-8 dark:border-hairline-dark"
    >
      {currentPage > 1 && (
        <Link
          href={href(currentPage - 1)}
          rel="prev"
          className={`${cell} border-hairline text-ink-muted hover:border-accent/50 hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-muted dark:hover:border-accent-light/50 dark:hover:text-accent-light`}
        >
          <span aria-hidden="true">&larr;</span>
          <span className="sr-only">Previous page</span>
        </Link>
      )}

      {pages.map((page, index) =>
        page === 'gap' ? (
          <span
            key={`gap-${index}`}
            aria-hidden="true"
            className="px-1 text-caption text-ink-muted dark:text-ink-inverse-muted"
          >
            &hellip;
          </span>
        ) : page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            className={`${cell} border-accent bg-accent text-white dark:border-accent-light dark:bg-accent-light dark:text-graphite`}
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            className={`${cell} border-hairline text-ink-muted hover:border-accent/50 hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-muted dark:hover:border-accent-light/50 dark:hover:text-accent-light`}
          >
            <span className="sr-only">Page </span>
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={href(currentPage + 1)}
          rel="next"
          className={`${cell} border-hairline text-ink-muted hover:border-accent/50 hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-muted dark:hover:border-accent-light/50 dark:hover:text-accent-light`}
        >
          <span className="sr-only">Next page</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      )}
    </nav>
  )
}
