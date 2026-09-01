import Image from 'next/image'
import Link from 'next/link'
import { CategoryBadge } from './CategoryBadge'
import { Byline } from './Byline'
import type { ArticleCard as ArticleCardType } from '@/lib/sanity-queries'

interface LeadStoryProps {
  article: ArticleCardType
  /** Small gilt label above the headline, e.g. "Top Story". */
  kicker?: string
  /**
   * `split` puts the photograph beside the text — the full-width treatment for
   * listing pages. `stacked` puts it above, for the narrow primary column of
   * the homepage's three-column block, where a two-up split would leave both
   * halves too cramped to read.
   */
  layout?: 'split' | 'stacked'
  /**
   * Trailing hairline and spacing. Switched off when the surrounding layout
   * already supplies a rule, so the two never double up.
   */
  divided?: boolean
  /**
   * `sizes` for the photograph. Must describe the column the component is
   * actually rendered in, or the browser downloads the wrong candidate.
   */
  imageSizes?: string
}

/**
 * The lead story: the single most important item on a page.
 *
 * This is the only image here marked `priority` — it is the page's
 * largest-contentful-paint candidate. Everything below it stays lazy.
 *
 * The photograph is a second link to the same destination as the headline, so
 * it is taken out of the tab order and hidden from assistive technology; the
 * headline is the one accessible link.
 */
export function LeadStory({
  article,
  kicker = 'Top Story',
  layout = 'split',
  divided = true,
  imageSizes,
}: LeadStoryProps) {
  const href = `/news/${article.slug.current}`
  const isStacked = layout === 'stacked'

  const sizes =
    imageSizes ?? (isStacked ? '(min-width: 1024px) 42vw, 100vw' : '(min-width: 1024px) 50vw, 100vw')

  return (
    <article
      className={`group grid grid-cols-1 gap-7 ${
        isStacked ? '' : 'lg:grid-cols-2 lg:gap-12'
      } ${
        divided
          ? 'mb-12 border-b border-hairline pb-12 dark:border-hairline-dark'
          : ''
      }`}
    >
      {article.imageUrl ? (
        <Link
          href={href}
          className="media-frame aspect-[16/10] w-full"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            priority
            sizes={sizes}
            className="media-zoom"
          />
          <span aria-hidden="true" className="media-scrim-soft" />
        </Link>
      ) : (
        <Link
          href={href}
          className="thumb-duotone aspect-[16/10] w-full"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      <div className={`flex flex-col ${isStacked ? '' : 'justify-center'}`}>
        <div className="flex items-center gap-3">
          <span className="eyebrow-royal">{kicker}</span>
          <span className="gold-rule" aria-hidden="true" />
        </div>

        {article.category && (
          <div className="mt-4">
            <CategoryBadge
              title={article.category.title}
              slug={article.category.slug.current}
            />
          </div>
        )}

        <h2 className="mt-3 font-serif text-display-2 font-bold leading-[1.06] text-ink sm:text-display-1 dark:text-ink-inverse">
          <Link href={href} className="title-link">
            {article.title}
          </Link>
        </h2>

        <p className="deck mt-4">{article.excerpt}</p>

        <Byline
          author={article.author}
          publishedAt={article.publishedAt}
          readingTime={article.readingTime}
          size="md"
          className="mt-5"
        />

        {isStacked && (
          <Link href={href} className="link-more mt-6 self-start">
            Read the full story
            <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>
    </article>
  )
}
