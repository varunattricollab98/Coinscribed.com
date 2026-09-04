import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { getArticleBySlug, getRelatedArticles } from '@/lib/sanity-queries'
import { generateArticleSchema, generateFAQSchema } from '@/lib/schema-markup'
import { ArticleView } from '@/components/news/ArticleView'
import { ArticleCard } from '@/components/news/ArticleCard'
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

      <ArticleView article={article} authorSlug={authorSlug}>
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
      </ArticleView>
    </>
  )
}
