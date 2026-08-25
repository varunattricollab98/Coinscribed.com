import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { isSanityConfigured } from '@/lib/sanity'
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
  if (!isSanityConfigured) {
    return {
      title: 'Article',
      description: 'News article from Coinscribed',
    }
  }

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
  if (!isSanityConfigured) {
    return <ArticlePlaceholder />
  }

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
          <nav className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/news" className="hover:text-zinc-700 dark:hover:text-zinc-200">
              News
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/news/category/${article.category.slug.current}`}
              className="hover:text-zinc-700 dark:hover:text-zinc-200"
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
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="mt-6 flex items-center gap-4 border-b border-zinc-200 pb-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            {article.author && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
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
          <div className="mb-8 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="aspect-video w-full bg-zinc-200 dark:bg-zinc-700" />
          </div>
        )}

        {/* Article Body */}
        <div className="mb-12">
          <PortableTextRenderer content={article.body} />
        </div>

        {/* Author Bio */}
        {article.author?.bio && (
          <aside className="mb-12 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 flex-shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {article.author.name}
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {article.author.bio}
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-zinc-200 pt-12 dark:border-zinc-700">
            <h2 className="mb-6 font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100">
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

function ArticlePlaceholder() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <h1 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Article Content Managed via CMS
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            News content is managed via Sanity CMS. Configure your Sanity project
            to see articles here. See the README for setup instructions.
          </p>
          <Link
            href="/news"
            className="mt-4 inline-block text-sm font-medium text-zinc-700 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Back to News
          </Link>
        </div>
      </div>
    </div>
  )
}
