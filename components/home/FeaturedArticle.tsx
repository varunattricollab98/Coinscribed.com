import Image from 'next/image'
import Link from 'next/link'
import { Byline } from '@/components/news/Byline'
import { getCategoryTone } from '@/lib/category-styles'
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

/**
 * The lead story block: one dominant photograph carrying the headline over a
 * gradient scrim, with a ruled rail of secondary headlines beside it.
 *
 * The scrim is what makes this work — white display type sits directly on the
 * photo, which is the strongest hierarchy signal available, and the gradient
 * guarantees contrast regardless of which image the newsroom picks.
 */
export function FeaturedArticle({ featured, sidebar }: FeaturedArticleProps) {
  const eyebrow = featured.category?.title ?? 'Featured'
  const href = `/news/${featured.slug.current}`

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-0">
      {/* Lead story */}
      <article className="group relative flex flex-col lg:col-span-2 lg:border-r lg:border-hairline lg:pr-10 dark:lg:border-hairline-dark">
        {featured.imageUrl ? (
          <Link href={href} className="media-frame block w-full">
            <div className="relative aspect-[16/10] w-full sm:aspect-[2/1]">
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="media-zoom"
              />
              <span aria-hidden="true" className="media-scrim" />
            </div>

            {/* Headline lives on the photograph. */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
              <span className="badge-royal">{eyebrow}</span>
              <h2 className="mt-3.5 font-serif text-display-2 font-bold leading-[1.05] text-white sm:text-display-1 lg:text-display-0">
                <span className="underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors duration-200 group-hover:decoration-gold-lighter">
                  {featured.title}
                </span>
              </h2>
              <Byline
                author={featured.author}
                publishedAt={featured.publishedAt}
                readingTime={featured.readingTime}
                size="md"
                onDark
                className="mt-4"
              />
            </div>
          </Link>
        ) : (
          <Link href={href} className="thumb-duotone aspect-[2/1] w-full">
            <span className="eyebrow px-4 pb-3">{eyebrow}</span>
          </Link>
        )}

        <p className="deck mt-6 max-w-2xl">{featured.excerpt}</p>

        <Link href={href} className="link-more mt-5 self-start">
          Read the full story
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </article>

      {/* Secondary headline rail */}
      <aside className="lg:pl-10">
        <div className="flex items-center gap-3">
          <span className="eyebrow-royal">More Headlines</span>
          <span className="gold-rule flex-1" aria-hidden="true" />
        </div>

        <ul className="mt-4 divide-y divide-hairline dark:divide-hairline-dark">
          {sidebar.map((article) => {
            const tone = getCategoryTone(article.category?.slug.current)
            return (
              <li key={article._id} className="py-4 first:pt-0 last:pb-0">
                <Link href={`/news/${article.slug.current}`} className="group block">
                  {article.category && (
                    <span
                      className={`text-eyebrow font-semibold uppercase ${tone.label}`}
                    >
                      {article.category.title}
                    </span>
                  )}
                  <p className="mt-1.5 font-serif text-display-4 font-bold leading-snug text-ink dark:text-ink-inverse">
                    <span className="title-link">{article.title}</span>
                  </p>
                  <time
                    dateTime={article.publishedAt}
                    className="mt-2 block text-caption text-ink-muted dark:text-ink-inverse-muted"
                  >
                    {formatDate(article.publishedAt)}
                  </time>
                </Link>
              </li>
            )
          })}
        </ul>
      </aside>
    </div>
  )
}
