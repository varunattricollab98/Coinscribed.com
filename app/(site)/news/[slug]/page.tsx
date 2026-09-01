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
import { Byline } from '@/components/news/Byline'
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
          <div className="mb-14">
            <PortableTextRenderer content={article.body} />
          </div>

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
                    {article.author.name}
                  </p>
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
