import Image from 'next/image'
import Link from 'next/link'
import { CategoryBadge } from './CategoryBadge'
import { Byline } from './Byline'
import type { ArticleCard as ArticleCardType } from '@/lib/sanity-queries'

interface LeadStoryProps {
  article: ArticleCardType
  /** Small gilt label above the headline, e.g. "Top Story". */
  kicker?: string
}

/**
 * The lead story for a listing page: photograph on one side, headline and deck
 * on the other, separated from the grid below by a hairline.
 *
 * This is the only image on a listing page marked `priority` — it is the
 * page's largest-contentful-paint candidate. Everything below it stays lazy.
 */
export function LeadStory({ article, kicker = 'Top Story' }: LeadStoryProps) {
  const href = `/news/${article.slug.current}`

  return (
    <article className="group mb-12 grid grid-cols-1 gap-7 border-b border-hairline pb-12 lg:grid-cols-2 lg:gap-12 dark:border-hairline-dark">
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
            sizes="(min-width: 1024px) 50vw, 100vw"
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

      <div className="flex flex-col justify-center">
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
      </div>
    </article>
  )
}
