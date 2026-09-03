import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { getArticleBySlug, getRelatedArticles } from '@/lib/sanity-queries'
import { generateArticleSchema, generateFAQSchema } from '@/lib/schema-markup'
import { PortableTextRenderer } from '@/components/news/PortableTextRenderer'
import { CategoryBadge } from '@/components/news/CategoryBadge'
import { ArticleCard } from '@/components/news/ArticleCard'
import { Byline } from '@/components/news/Byline'
import { Reveal } from '@/components/motion/Reveal'
import { sampleArticles } from '@/data/sample-news'

/**
 * Pre-render every known article at build time.
 *
 * The home page links to a lot of stories, and Next prefetches each <Link> as it
 * enters the viewport. While this route was server-rendered on demand every one
 * of those prefetches became a server render (~440ms observed), so simply
 * scrolling the front page fired a burst of background renders. Static output
 * turns them into CDN file reads.
 *
 * Slugs published in the CMS after a build are still served: `dynamicParams`
 * defaults to true, so an unknown slug is rendered on demand and then cached.
 */
export function generateStaticParams() {
  return sampleArticles.map((article) => ({ slug: article.slug.current }))
}

/** Refresh the static output periodically so CMS edits still land. */
export const revalidate = 300

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  const title = article.seoTitle || article.title
  const description = article.seoDescription || article.excerpt

  return {
    title,
    description,
    alternates: { canonical: `/news/${article.slug.current}` },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      type: 'article',
      url: `${siteConfig.url}/news/${article.slug.current}`,
      publishedTime: article.publishedAt,
      authors: [article.author?.name || siteConfig.name],
      ...(article.imageUrl && { images: [{ url: article.imageUrl }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(article.imageUrl && { images: [article.imageUrl] }),
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(
    article.category.slug.current,
    article._id,
    3
  )

  const authorSlug = article.author?.slug?.current
  const articleSchema = generateArticleSchema({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    url: `${siteConfig.url}/news/${article.slug.current}`,
    datePublished: article.publishedAt,
    author: article.author
      ? {
          name: article.author.name,
          ...(authorSlug && {
            url: `${siteConfig.url}/news/author/${authorSlug}`,
          }),
          ...(article.author.jobTitle && { jobTitle: article.author.jobTitle }),
          ...(article.author.sameAs?.length && {
            sameAs: article.author.sameAs,
          }),
          ...(article.author.imageUrl && { image: article.author.imageUrl }),
        }
      : undefined,
    image: article.imageUrl,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {article.faqs && article.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema(article.faqs)),
          }}
        />
      )}

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

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-4">
            <Reveal className="section-header mb-8">
              <div>
                <span className="eyebrow">More Coverage</span>
                <h2 className="section-title mt-2">Related Articles</h2>
              </div>
              <Link href={`/news/category/${article.category.slug.current}`} className="link-more">
                All {article.category.title}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </Reveal>
            <div className="rule-grid sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle, i) => (
                <Reveal key={relatedArticle._id} delay={i * 0.05}>
                  <ArticleCard article={relatedArticle} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
