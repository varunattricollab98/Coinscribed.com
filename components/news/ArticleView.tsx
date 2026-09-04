import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/lib/sanity-queries'
import { PortableTextRenderer } from '@/components/news/PortableTextRenderer'
import { CategoryBadge } from '@/components/news/CategoryBadge'
import { Byline } from '@/components/news/Byline'

/**
 * Shared, presentational article body.
 *
 * This is the single source of truth for how a published article *looks*: the
 * public route (app/(site)/news/[slug]/page.tsx) and the admin draft preview
 * both render through this component so a preview is guaranteed to match the
 * live page ("one component = one look"). It is intentionally presentational:
 * no 'use client', no data fetching, no metadata or JSON-LD emission. It takes
 * a fully-resolved `Article` (as returned by getArticleBySlug / articleFullFields)
 * and renders the header, byline, hero image, PortableText body, editorial
 * notice, FAQ section and author bio — the exact markup the public page used to
 * inline.
 *
 * Boundary choice: to keep the public route's DOM nesting byte-for-byte
 * identical to before the refactor, this component renders the container wrapper
 * itself — `<div className="container-page section-padding">` with the
 * `<article className="container-prose">` inside it — and accepts optional
 * `children` rendered as a sibling of <article> inside that same container div.
 * The public page passes its Related Articles <section> as those children, which
 * is exactly where that section previously sat (a sibling of <article> within
 * the container). The two JSON-LD <script> tags and all data fetching stay on
 * the public route and are NOT part of this component.
 */
interface ArticleViewProps {
  article: Article
  /**
   * Author slug used for the byline/author-bio links. Derived by callers from
   * article.author?.slug?.current; passed in so callers that already compute it
   * (for schema) don't recompute, and so it can be omitted where absent.
   */
  authorSlug?: string
  /** Rendered as a sibling of <article> inside the container (e.g. Related Articles). */
  children?: React.ReactNode
}

export function ArticleView({ article, authorSlug, children }: ArticleViewProps) {
  return (
    <div className="container-page section-padding">
      <article className="container-prose">
        {/* Article Header */}
        <header className="mb-10">
          {/* Breadcrumb */}
          <nav className="mb-7 text-caption text-ink-muted dark:text-ink-inverse-muted">
            <Link
              href="/news"
              className="transition-colors hover:text-accent dark:hover:text-accent-light"
            >
              News
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link
              href={`/news/category/${article.category.slug.current}`}
              className="transition-colors hover:text-accent dark:hover:text-accent-light"
            >
              {article.category.title}
            </Link>
          </nav>

          {/* Category Badge */}
          <CategoryBadge
            title={article.category.title}
            slug={article.category.slug.current}
          />

          {/* Title */}
          <h1 className="hero-title mt-4">{article.title}</h1>

          {/* Standfirst */}
          <p className="deck mt-5 border-l-2 border-gold pl-5 dark:border-gold-light">
            {article.excerpt}
          </p>

          {/* Byline */}
          <Byline
            author={article.author}
            publishedAt={article.publishedAt}
            readingTime={article.readingTime}
            size="md"
            className="mt-7 border-b border-hairline pb-7 dark:border-hairline-dark"
          />
        </header>

        {/* Hero image */}
        {article.imageUrl && (
          <figure className="media-frame mb-10 aspect-[16/9] w-full border border-hairline dark:border-hairline-dark">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </figure>
        )}

        {/* Article Body */}
        <div className="mb-8">
          <PortableTextRenderer content={article.body} />
        </div>

        {/*
          Per-article notice. Coverage of a market, asset, or institution is
          reporting, not a recommendation, and that belongs at the end of the
          piece rather than only in the footer.
        */}
        <aside className="mb-14 border-l-2 border-gold bg-gold-soft px-5 py-4 dark:border-gold-light dark:bg-gold/10">
          <p className="eyebrow-royal">Editorial notice</p>
          <p className="mt-2 text-caption leading-relaxed text-ink-body dark:text-ink-inverse-body">
            This article is published for general information and education
            only. It is <strong>not</strong> financial, investment, tax, or
            legal advice, and nothing in it is a recommendation to buy, sell,
            or hold any security or digital asset. Prices and figures were
            accurate as understood at the time of writing and may since have
            changed. Past performance does not indicate future results, and
            digital assets in particular are volatile and may not be covered by
            any deposit-insurance or investor-compensation scheme. Do your own
            research and consult a licensed professional before acting. See our{' '}
            <Link href="/disclaimer" className="link-accent">
              full disclaimer
            </Link>
            .
          </p>
        </aside>

        {/*
          FAQ section. Rendered visibly (not just as schema) because Google
          requires FAQPage rich-result content to be present on the page. The
          matching FAQPage JSON-LD is emitted at the top of this route.
        */}
        {article.faqs && article.faqs.length > 0 && (
          <section className="mb-14">
            <div className="mb-6 flex items-center gap-3">
              <span className="eyebrow-royal">Questions</span>
              <span className="gold-rule flex-1" aria-hidden="true" />
            </div>
            <h2 className="section-title mb-8">Frequently Asked Questions</h2>
            <dl className="divide-y divide-hairline dark:divide-hairline-dark">
              {article.faqs.map((faq, i) => (
                <div key={i} className="py-6 first:pt-0">
                  <dt className="font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                    {faq.question}
                  </dt>
                  <dd className="mt-3 leading-relaxed text-ink-body dark:text-ink-inverse-body">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Author Bio */}
        {article.author?.bio && (
          <aside className="panel mb-14">
            <div className="flex items-center gap-3">
              <span className="eyebrow-royal">Written by</span>
              <span className="gold-rule flex-1" aria-hidden="true" />
            </div>
            <div className="mt-5 flex items-start gap-5">
              {article.author.imageUrl ? (
                <Image
                  src={article.author.imageUrl}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 flex-shrink-0 rounded-full object-cover ring-1 ring-hairline dark:ring-hairline-dark"
                />
              ) : (
                <div
                  className="h-14 w-14 flex-shrink-0 rounded-full bg-hairline dark:bg-wash-dark"
                  aria-hidden="true"
                />
              )}
              <div>
                <p className="font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                  {authorSlug ? (
                    <Link
                      href={`/news/author/${authorSlug}`}
                      className="transition-colors hover:text-accent dark:hover:text-accent-light"
                    >
                      {article.author.name}
                    </Link>
                  ) : (
                    article.author.name
                  )}
                </p>
                {article.author.jobTitle && (
                  <p className="mt-0.5 text-caption text-ink-muted dark:text-ink-inverse-muted">
                    {article.author.jobTitle}
                  </p>
                )}
                <p className="mt-1.5 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                  {article.author.bio}
                </p>
              </div>
            </div>
          </aside>
        )}
      </article>

      {children}
    </div>
  )
}
