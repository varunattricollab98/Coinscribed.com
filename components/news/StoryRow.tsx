import Image from 'next/image'
import Link from 'next/link'
import { Byline } from './Byline'
import { getCategoryTone } from '@/lib/category-styles'
import type { ArticleCard as ArticleCardType } from '@/lib/sanity-queries'

interface StoryRowProps {
  article: ArticleCardType
  /**
   * Heading level for the headline. The homepage rail sits under an `h2`
   * column label, so its rows are `h3`; a page that uses this block as its
   * primary content can raise it.
   */
  headingLevel?: 'h2' | 'h3'
  className?: string
}

/**
 * A compact, scannable headline row: small 16:9 thumbnail on the right, section
 * eyebrow + headline + byline filling the measure on the left.
 *
 * This is the density workhorse — the unit that lets a column carry seven
 * stories in the space one card used to take. Deliberately borderless: stack
 * these inside a `divide-y` list so the hairlines belong to the list, not to
 * each row, and no double rules appear at the seams.
 *
 * Two link-shape decisions worth keeping:
 *  - The headline is the only focusable link. The thumbnail is a second link to
 *    the same place, so it is removed from the tab order and hidden from
 *    assistive tech; otherwise every row would cost keyboard users two stops
 *    and screen-reader users a duplicate announcement.
 *  - Text comes first in the DOM even though the thumbnail is on the right, so
 *    reading order matches scanning order at every breakpoint.
 */
export function StoryRow({
  article,
  headingLevel = 'h3',
  className = '',
}: StoryRowProps) {
  const Heading = headingLevel
  const href = `/news/${article.slug.current}`
  const tone = getCategoryTone(article.category?.slug.current)

  return (
    <article className={`group flex items-start gap-4 sm:gap-5 ${className}`}>
      <div className="min-w-0 flex-1">
        {article.category && (
          <span className={`text-eyebrow font-semibold uppercase ${tone.label}`}>
            {article.category.title}
          </span>
        )}

        <Heading className="mt-1.5 font-serif text-display-4 font-bold leading-snug text-ink dark:text-ink-inverse">
          <Link href={href} className="title-link">
            {article.title}
          </Link>
        </Heading>

        <Byline
          author={article.author}
          publishedAt={article.publishedAt}
          className="mt-2"
        />
      </div>

      {article.imageUrl ? (
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="media-frame aspect-video w-24 shrink-0 rounded-md sm:w-28"
        >
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="112px"
            className="media-zoom"
          />
        </Link>
      ) : (
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="thumb-duotone aspect-video w-24 shrink-0 rounded-md sm:w-28"
        />
      )}
    </article>
  )
}
