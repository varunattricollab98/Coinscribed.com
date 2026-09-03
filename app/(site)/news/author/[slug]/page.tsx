import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { getAuthorBySlug, getArticlesByAuthor } from '@/lib/sanity-queries'
import { generateBreadcrumbSchema } from '@/lib/schema-markup'
import { ArticleCard } from '@/components/news/ArticleCard'
import { Reveal } from '@/components/motion/Reveal'
import { getSampleAuthors } from '@/data/sample-news'

/**
 * Pre-render every known author at build time.
 *
 * The article byline and bio aside link to these pages, so Next prefetches each
 * <Link> as it enters the viewport. Statically generating the sample roster
 * turns those prefetches into CDN file reads. `dynamicParams` defaults to true,
 * so authors added in the CMS after a build are still served on demand.
 */
export function generateStaticParams() {
  return getSampleAuthors().map((author) => ({ slug: author.slug.current }))
}

/** Refresh the static output periodically so CMS edits still land. */
export const revalidate = 300

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) {
    return {
      title: 'Author Not Found',
    }
  }

  const title = author.jobTitle ? `${author.name} — ${author.jobTitle}` : author.name
  const description =
    author.bio ||
    `Articles and analysis by ${author.name}${
      author.jobTitle ? `, ${author.jobTitle}` : ''
    } at ${siteConfig.name}.`

  return {
    title,
    description,
    alternates: { canonical: `/news/author/${author.slug.current}` },
    openGraph: {
      title: `${author.name} | ${siteConfig.name}`,
      description,
      type: 'profile',
      url: `${siteConfig.url}/news/author/${author.slug.current}`,
      ...(author.imageUrl && { images: [{ url: author.imageUrl }] }),
    },
    twitter: {
      card: 'summary',
      title: author.name,
      description,
      ...(author.imageUrl && { images: [author.imageUrl] }),
    },
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) {
    notFound()
  }

  const articles = await getArticlesByAuthor(author.slug.current)
  const canonicalUrl = `${siteConfig.url}/news/author/${author.slug.current}`

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: canonicalUrl,
    ...(author.jobTitle && { jobTitle: author.jobTitle }),
    ...(author.imageUrl && { image: author.imageUrl }),
    ...(author.bio && { description: author.bio }),
    ...(author.sameAs?.length && { sameAs: author.sameAs }),
    worksFor: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'News', url: `${siteConfig.url}/news` },
    { name: author.name, url: canonicalUrl },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container-page section-padding">
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
          <span className="text-ink dark:text-ink-inverse">{author.name}</span>
        </nav>

        {/* Author header */}
        <Reveal>
          <header className="panel mb-12">
            <div className="flex items-center gap-3">
              <span className="eyebrow-royal">Author</span>
              <span className="gold-rule flex-1" aria-hidden="true" />
            </div>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
              {author.imageUrl ? (
                <Image
                  src={author.imageUrl}
                  alt=""
                  width={96}
                  height={96}
                  className="h-24 w-24 flex-shrink-0 rounded-full object-cover ring-1 ring-hairline dark:ring-hairline-dark"
                />
              ) : (
                <div
                  className="h-24 w-24 flex-shrink-0 rounded-full bg-hairline dark:bg-wash-dark"
                  aria-hidden="true"
                />
              )}
              <div>
                <h1 className="page-title">{author.name}</h1>
                {author.jobTitle && (
                  <p className="mt-1.5 text-caption font-medium uppercase tracking-wide text-accent dark:text-accent-light">
                    {author.jobTitle}
                  </p>
                )}
                {author.credentials && (
                  <p className="mt-1 text-caption text-ink-muted dark:text-ink-inverse-muted">
                    {author.credentials}
                  </p>
                )}
                {author.bio && (
                  <p className="mt-4 max-w-2xl leading-relaxed text-ink-body dark:text-ink-inverse-body">
                    {author.bio}
                  </p>
                )}
                {author.sameAs && author.sameAs.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-caption">
                    {author.sameAs.map((link) => (
                      <li key={link}>
                        <a
                          href={link}
                          rel="noopener noreferrer nofollow me"
                          target="_blank"
                          className="link-accent"
                        >
                          {link.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </header>
        </Reveal>

        {/* Author's articles */}
        <Reveal className="section-header mb-8">
          <div>
            <span className="eyebrow">Newsroom</span>
            <h2 className="section-title mt-2">Stories by {author.name}</h2>
          </div>
          <p className="text-caption text-ink-muted dark:text-ink-inverse-muted">
            <span className="tabular-nums">{articles.length}</span> stories
          </p>
        </Reveal>

        {articles.length > 0 ? (
          <div className="rule-grid sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <Reveal key={article._id} delay={Math.min(i, 5) * 0.05}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="panel-muted text-center">
            <p className="text-ink-body dark:text-ink-inverse-muted">
              No articles from this author yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
