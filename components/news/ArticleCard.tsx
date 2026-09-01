import Image from 'next/image'
import Link from 'next/link'
import { CategoryBadge } from './CategoryBadge'
import { Byline } from './Byline'
import type { ArticleCard as ArticleCardType } from '@/lib/sanity-queries'

interface ArticleCardProps {
  article: ArticleCardType
  /**
   * Only the single true hero image on a page should be eager. Everything else
   * stays lazy so a long listing never blocks the initial paint.
   */
  priority?: boolean
}

/**
 * Article cell. Designed to sit inside a `.rule-grid`, so it carries no border
 * or shadow of its own — the grid supplies the hairline column/row rules.
 */
export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const eyebrow = article.category?.title ?? 'Coinscribed'
  const href = `/news/${article.slug.current}`

  return (
    <article className="group rule-cell-hover flex h-full flex-col px-5 py-7 sm:px-6">
      {/* Thumbnail: render a real image when available, otherwise fall back to
          a neutral paper/ink duotone plate carrying an eyebrow label overlay. */}
      {article.imageUrl ? (
        <Link
          href={href}
          prefetch={false}
          className="media-frame mb-5 aspect-[16/10] w-full"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="media-zoom"
          />
          {/* Whisper-light scrim: grounds the photo against the paper without
              darkening it. */}
          <span aria-hidden="true" className="media-scrim-soft opacity-60" />
        </Link>
      ) : (
        <Link
          href={href}
          prefetch={false}
          className="thumb-duotone mb-5 aspect-[16/10] w-full"
          tabIndex={-1}
          aria-hidden="true"
        >
          <span className="eyebrow px-3 pb-2.5">{eyebrow}</span>
        </Link>
      )}

      {article.category && (
        <div className="mb-3">
          <CategoryBadge
            title={article.category.title}
            slug={article.category.slug.current}
          />
        </div>
      )}

      <h2 className="font-serif text-display-4 font-bold leading-snug text-ink dark:text-ink-inverse">
        <Link href={href} prefetch={false} className="title-link">
          {article.title}
        </Link>
      </h2>

      <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
        {article.excerpt}
      </p>

      <Byline
        author={article.author}
        publishedAt={article.publishedAt}
        readingTime={article.readingTime}
        className="mt-auto pt-5"
      />
    </article>
  )
}
