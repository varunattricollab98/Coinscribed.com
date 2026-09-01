import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { getArticleBySlug, getRelatedArticles } from '@/lib/sanity-queries'
import { generateArticleSchema } from '@/lib/schema-markup'
import { PortableTextRenderer } from '@/components/news/PortableTextRenderer'
import { CategoryBadge } from '@/components/news/CategoryBadge'
import { ArticleCard } from '@/components/news/ArticleCard'
import { Reveal } from '@/components/motion/Reveal'

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
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      type: 'article',
      url: `${siteConfig.url}/news/${article.slug.current}`,
      publishedTime: article.publishedAt,
      authors: [article.author?.name || siteConfig.name],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

  const articleSchema = generateArticleSchema({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    url: `${siteConfig.url}/news/${article.slug.current}`,
    datePublished: article.publishedAt,
    author: article.author?.name,
    image: article.imageUrl,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="container-page section-padding">
        <article className="container-prose">
          {/* Article Header */}
          <header className="mb-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-caption text-ink-muted dark:text-ink-inverse-muted">
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
            <h1 className="mt-4 font-serif text-display-1 font-bold leading-tight text-ink sm:text-display-0 dark:text-ink-inverse">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-4 text-lg leading-relaxed text-ink-body dark:text-ink-inverse-body">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-hairline pb-6 text-caption text-ink-muted dark:border-hairline-dark dark:text-ink-inverse-muted">
              {article.author && (
                <div className="flex items-center gap-2">
                  {article.author.imageUrl ? (
                    <Image
                      src={article.author.imageUrl}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-8 w-8 rounded-full bg-hairline dark:bg-elevated"
                      aria-hidden="true"
                    />
                  )}
                  <span className="font-medium text-ink-body dark:text-ink-inverse-body">
                    {article.author.name}
                  </span>
                  <span aria-hidden="true">&middot;</span>
                </div>
              )}
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {article.readingTime && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span className="tabular-nums">{article.readingTime} min read</span>
                </>
              )}
            </div>
          </header>

          {/* Hero image */}
          {article.imageUrl && (
            <figure className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl border border-hairline dark:border-hairline-dark">
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
          <div className="mb-12">
            <PortableTextRenderer content={article.body} />
          </div>

          {/* Author Bio */}
          {article.author?.bio && (
            <aside className="mb-12 rounded-2xl border border-hairline bg-surface p-6 dark:border-hairline-dark dark:bg-elevated">
              <div className="flex items-start gap-4">
                {article.author.imageUrl ? (
                  <Image
                    src={article.author.imageUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="h-12 w-12 flex-shrink-0 rounded-full bg-hairline dark:bg-elevated"
                    aria-hidden="true"
                  />
                )}
                <div>
                  <p className="font-medium text-ink dark:text-ink-inverse">
                    {article.author.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
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
                <h2 className="section-title mt-1.5">Related Articles</h2>
              </div>
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
