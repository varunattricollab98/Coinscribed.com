import { cache } from 'react'
import { sanityClient, isSanityConfigured } from './sanity'

// ============================================================
// TypeScript Interfaces
// ============================================================

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface Author {
  _id: string
  name: string
  slug: { current: string }
  bio?: string
  image?: SanityImage
  imageUrl?: string
  /** Author's professional role, e.g. 'Senior Cryptocurrency Correspondent'. Used for E-E-A-T Person schema. */
  jobTitle?: string
  /** Short qualification line, e.g. 'CFA, MBA' or a one-line credential. Used for E-E-A-T. */
  credentials?: string
  /** Author's own professional profile URLs (LinkedIn, personal site) for schema `sameAs`. */
  sameAs?: string[]
}

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
}

export interface Article {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  body: PortableTextBlock[]
  author: Author
  publishedAt: string
  /** Sanity document last-modified timestamp; used for the "Updated" trust signal. */
  _updatedAt?: string
  category: Category
  mainImage?: SanityImage
  imageUrl?: string
  readingTime?: number
  seoTitle?: string
  seoDescription?: string
  keyTakeaways?: string[]
  faqs?: { question: string; answer: string }[]
}

export interface ArticleCard {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  author: { name: string; imageUrl?: string }
  publishedAt: string
  category: { title: string; slug: { current: string } }
  mainImage?: SanityImage
  imageUrl?: string
  readingTime?: number
}

// Portable Text block type
export interface PortableTextBlock {
  _key: string
  _type: string
  children?: Array<{
    _key: string
    _type: string
    text?: string
    marks?: string[]
  }>
  style?: string
  /** Present on list blocks only: 'bullet' | 'number'. */
  listItem?: string
  /** Nesting depth for list blocks (1-based), as emitted by Sanity. */
  level?: number
  markDefs?: Array<{
    _key: string
    _type: string
    href?: string
  }>
}

// ============================================================
// GROQ Queries
// ============================================================

// NOTE: We resolve image asset references to plain URL strings inside the GROQ
// query itself (`asset->url`). The UI components render `imageUrl` /
// `author.imageUrl` strings, so resolving here keeps featured images and author
// avatars working with real Sanity content — and keeps the same shape the
// sample-data fallback already returns.
const articleCardFields = `
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "imageUrl": mainImage.asset->url,
  "readingTime": round(length(pt::text(body)) / 5 / 200),
  "author": author->{ name, "imageUrl": image.asset->url },
  "category": category->{ title, slug }
`

const articleFullFields = `
  _id,
  title,
  slug,
  excerpt,
  body,
  publishedAt,
  _updatedAt,
  "imageUrl": mainImage.asset->url,
  "readingTime": round(length(pt::text(body)) / 5 / 200),
  seoTitle,
  seoDescription,
  keyTakeaways,
  faqs,
  "author": author->{ _id, name, slug, bio, jobTitle, credentials, sameAs, "imageUrl": image.asset->url },
  "category": category->{ _id, title, slug, description }
`

// Author document projection for the dedicated author bio page. Mirrors the
// author fields resolved in `articleFullFields` so the two paths share a shape.
const authorFields = `
  _id,
  name,
  slug,
  bio,
  jobTitle,
  credentials,
  sameAs,
  "imageUrl": image.asset->url
`

// ============================================================
// Fetch caching
// ============================================================

/**
 * Cache options applied to every content query.
 *
 * Without these, each query was an uncached network round-trip on every render,
 * so a single page could spend hundreds of milliseconds in Sanity before it
 * produced any HTML — and <Link> prefetches paid the same cost in the
 * background. Five minutes keeps the newsroom responsive to freshly published
 * articles while making repeat renders and prefetches effectively free.
 */
const CONTENT_CACHE = { next: { revalidate: 300, tags: ['sanity-content'] } }

/**
 * Scheduled-publishing gate.
 *
 * An article is only "live" once its `publishedAt` is in the past. Setting
 * `publishedAt` to a FUTURE date/time therefore schedules the article: it stays
 * hidden from every public listing, the article page, the sitemap and static
 * params until that moment arrives, then appears automatically (within the
 * 5-minute content cache window) with no cron or manual step.
 *
 * GROQ's `now()` is evaluated server-side at query time, so this needs no
 * client clock. `dateTime(...)` makes the comparison an explicit datetime
 * compare rather than string comparison. `defined(publishedAt)` keeps out
 * drafts that never set a date.
 */
const PUBLISHED_GATE = `defined(publishedAt) && dateTime(publishedAt) <= dateTime(now())`

// ============================================================
// Sanity availability
// ============================================================

/**
 * Whether Sanity should be treated as the source of truth for articles.
 *
 * Being *configured* is not the same as having *content*: a project can be
 * wired up with credentials while the dataset is still empty, which is exactly
 * the state a newly provisioned Studio starts in. Falling back only on missing
 * credentials would leave such a site rendering blank listings and 404ing every
 * article — so we check for actual documents.
 *
 * The count is memoised per request with React `cache`, so a page that calls
 * several of the helpers below issues one extra lightweight query rather than
 * one per helper. Any transport error resolves to 0, which degrades to the
 * sample newsroom instead of throwing a 500.
 *
 * The moment real articles are published, every function here switches to
 * Sanity automatically — no code change, no redeploy.
 */
const hasSanityArticles = cache(async (): Promise<boolean> => {
  if (!isSanityConfigured) return false

  try {
    // React `cache` only dedupes within a single request. Without a fetch-level
    // cache this count was a fresh network round-trip to Sanity on every render
    // — including every <Link> prefetch — which measured as the dominant cost on
    // the dynamic news routes (600-700ms each). Caching it for five minutes
    // keeps "has content been published yet?" effectively free, and newly
    // published articles still appear within that window.
    const count = await sanityClient.fetch<number>(
      'count(*[_type == "article"])',
      {},
      { next: { revalidate: 300, tags: ['sanity-article-count'] } }
    )
    return typeof count === 'number' && count > 0
  } catch {
    return false
  }
})

// ============================================================
// Data access
// ============================================================

/**
 * Get all articles, ordered by publish date (newest first)
 */
export async function getAllArticles(): Promise<ArticleCard[]> {
  if (!(await hasSanityArticles())) return []

  const query = `*[_type == "article" && ${PUBLISHED_GATE}] | order(publishedAt desc) {
    ${articleCardFields}
  }`

  try {
    return (await sanityClient.fetch<ArticleCard[]>(query, {}, CONTENT_CACHE)) ?? []
  } catch {
    return []
  }
}

/**
 * Get a single article by its slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!(await hasSanityArticles())) return null

  const query = `*[_type == "article" && slug.current == $slug && ${PUBLISHED_GATE}][0] {
    ${articleFullFields}
  }`

  try {
    return (await sanityClient.fetch<Article | null>(query, { slug }, CONTENT_CACHE)) ?? null
  } catch {
    return null
  }
}

/**
 * Get articles filtered by category slug
 */
export async function getArticlesByCategory(
  categorySlug: string
): Promise<ArticleCard[]> {
  if (!(await hasSanityArticles())) return []

  const query = `*[_type == "article" && category->slug.current == $categorySlug && ${PUBLISHED_GATE}] | order(publishedAt desc) {
    ${articleCardFields}
  }`

  try {
    return (await sanityClient.fetch<ArticleCard[]>(query, { categorySlug }, CONTENT_CACHE)) ?? []
  } catch {
    return []
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return []

  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }`

  try {
    return (await sanityClient.fetch<Category[]>(query, {}, CONTENT_CACHE)) ?? []
  } catch {
    return []
  }
}

/**
 * Get the latest N articles
 */
export async function getLatestArticles(limit: number = 5): Promise<ArticleCard[]> {
  if (!(await hasSanityArticles())) return []

  const query = `*[_type == "article" && ${PUBLISHED_GATE}] | order(publishedAt desc)[0...$limit] {
    ${articleCardFields}
  }`

  try {
    return (await sanityClient.fetch<ArticleCard[]>(query, { limit }, CONTENT_CACHE)) ?? []
  } catch {
    return []
  }
}

/**
 * Get related articles (same category, excluding current article)
 */
export async function getRelatedArticles(
  categorySlug: string,
  currentArticleId: string,
  limit: number = 3
): Promise<ArticleCard[]> {
  if (!(await hasSanityArticles())) return []

  const query = `*[_type == "article" && category->slug.current == $categorySlug && _id != $currentArticleId && ${PUBLISHED_GATE}] | order(publishedAt desc)[0...$limit] {
    ${articleCardFields}
  }`

  try {
    return (await sanityClient.fetch<ArticleCard[]>(query, {
      categorySlug,
      currentArticleId,
      limit,
    }, CONTENT_CACHE)) ?? []
  } catch {
    return []
  }
}

/**
 * Get a single author by slug for the dedicated author bio page.
 *
 * Uses Sanity when the dataset holds published articles, otherwise falls back
 * to the sample newsroom — the same content the rest of the site renders.
 */
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  if (!(await hasSanityArticles())) return null

  const query = `*[_type == "author" && slug.current == $slug][0] {
    ${authorFields}
  }`

  try {
    return (await sanityClient.fetch<Author | null>(query, { slug }, CONTENT_CACHE)) ?? null
  } catch {
    return null
  }
}

/**
 * Get every article written by a given author (newest first), as cards.
 */
export async function getArticlesByAuthor(slug: string): Promise<ArticleCard[]> {
  if (!(await hasSanityArticles())) return []

  const query = `*[_type == "article" && author->slug.current == $slug && ${PUBLISHED_GATE}] | order(publishedAt desc) {
    ${articleCardFields}
  }`

  try {
    return (await sanityClient.fetch<ArticleCard[]>(query, { slug }, CONTENT_CACHE)) ?? []
  } catch {
    return []
  }
}

// ============================================================
// Slug enumeration (for generateStaticParams + sitemap)
// ============================================================

/**
 * Lightweight slug/date lists used by `generateStaticParams` and the sitemap.
 *
 * These enumerate REAL published content from Sanity so the build pre-renders
 * (and the sitemap lists) exactly the live articles/categories/authors — no
 * sample/placeholder slugs leak into the sitemap or static output. Each degrades
 * to an empty list on an unconfigured/empty dataset or transport error, so a
 * fresh environment still builds (pages render on demand via dynamicParams).
 */
export async function getAllArticleSlugs(): Promise<
  { slug: string; publishedAt?: string; updatedAt?: string }[]
> {
  if (!isSanityConfigured) return []
  try {
    const rows = await sanityClient.fetch<
      { slug?: { current?: string }; publishedAt?: string; _updatedAt?: string }[]
    >(
      `*[_type == "article" && defined(slug.current) && ${PUBLISHED_GATE}]{ slug, publishedAt, _updatedAt }`,
      {},
      CONTENT_CACHE
    )
    return (rows ?? [])
      .map((r) => ({
        slug: r.slug?.current ?? '',
        publishedAt: r.publishedAt,
        updatedAt: r._updatedAt,
      }))
      .filter((r) => r.slug.length > 0)
  } catch {
    return []
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  if (!isSanityConfigured) return []
  try {
    const rows = await sanityClient.fetch<{ slug?: { current?: string } }[]>(
      `*[_type == "category" && defined(slug.current)]{ slug }`,
      {},
      CONTENT_CACHE
    )
    return (rows ?? []).map((r) => r.slug?.current ?? '').filter((s) => s.length > 0)
  } catch {
    return []
  }
}

export async function getAllAuthorSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return []
  try {
    const rows = await sanityClient.fetch<{ slug?: { current?: string } }[]>(
      `*[_type == "author" && defined(slug.current)]{ slug }`,
      {},
      CONTENT_CACHE
    )
    return (rows ?? []).map((r) => r.slug?.current ?? '').filter((s) => s.length > 0)
  } catch {
    return []
  }
}
