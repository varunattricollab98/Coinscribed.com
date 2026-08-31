import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { getArticleBySlug, getRelatedArticles } from '@/lib/sanity-queries'
import { generateArticleSchema } from '@/lib/schema-markup'
import { PortableTextRenderer } from '@/components/news/PortableTextRenderer'
import { CategoryBadge } from '@/components/news/CategoryBadge'
import { ArticleCard } from '@/components/news/ArticleCard'

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
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Article Header */}
        <header className="mb-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-ink-muted dark:text-ink-inverse-muted">
            <Link href="/news" className="hover:text-oxblood dark:hover:text-ink-inverse">
              News
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/news/category/${article.category.slug.current}`}
              className="hover:text-oxblood dark:hover:text-ink-inverse"
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
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl dark:text-ink-inverse">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="mt-4 text-lg text-ink-body dark:text-ink-inverse-muted">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="mt-6 flex items-center gap-4 border-b border-hairline pb-6 text-sm text-ink-muted dark:border-hairline-dark dark:text-ink-inverse-muted">
            {article.author && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-hairline dark:bg-elevated" />
                <span className="font-medium text-ink-body dark:text-ink-inverse-body">
                  {article.author.name}
                </span>
              </div>
            )}
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Main Image Placeholder */}
        {article.mainImage && (
          <div className="mb-8 overflow-hidden rounded-lg bg-wash dark:bg-elevated">
            <div className="aspect-video w-full bg-hairline dark:bg-elevated" />
          </div>
        )}

        {/* Article Body */}
        <div className="mb-12">
          <PortableTextRenderer content={article.body} />
        </div>

        {/* Author Bio */}
        {article.author?.bio && (
          <aside className="mb-12 rounded-lg border border-hairline bg-wash p-6 dark:border-hairline-dark dark:bg-elevated">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 flex-shrink-0 rounded-full bg-hairline dark:bg-elevated" />
              <div>
                <p className="font-medium text-ink dark:text-ink-inverse">
                  {article.author.name}
                </p>
                <p className="mt-1 text-sm text-ink-body dark:text-ink-inverse-muted">
                  {article.author.bio}
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-hairline pt-12 dark:border-hairline-dark">
            <h2 className="mb-6 font-serif text-2xl font-bold text-ink dark:text-ink-inverse">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle._id} article={relatedArticle} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
