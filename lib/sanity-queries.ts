import { cache } from 'react'
import { sanityClient, isSanityConfigured } from './sanity'
import {
  getSampleArticles,
  getLatestSampleArticles,
  getSampleArticlesByCategory,
  getSampleArticleBySlug,
  getRelatedSampleArticles,
  sampleCategories,
} from '@/data/sample-news'

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
  category: Category
  mainImage?: SanityImage
  imageUrl?: string
  readingTime?: number
  seoTitle?: string
  seoDescription?: string
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
  "imageUrl": mainImage.asset->url,
  "readingTime": round(length(pt::text(body)) / 5 / 200),
  seoTitle,
  seoDescription,
  "author": author->{ _id, name, slug, bio, "imageUrl": image.asset->url },
  "category": category->{ _id, title, slug, description }
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
  if (!(await hasSanityArticles())) return getSampleArticles()

  const query = `*[_type == "article"] | order(publishedAt desc) {
    ${articleCardFields}
  }`

  try {
    const articles = await sanityClient.fetch<ArticleCard[]>(query, {}, CONTENT_CACHE)
    return articles?.length ? articles : getSampleArticles()
  } catch {
    return getSampleArticles()
  }
}

/**
 * Get a single article by its slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!(await hasSanityArticles())) return getSampleArticleBySlug(slug)

  const query = `*[_type == "article" && slug.current == $slug][0] {
    ${articleFullFields}
  }`

  try {
    const article = await sanityClient.fetch<Article | null>(query, { slug }, CONTENT_CACHE)
    return article ?? getSampleArticleBySlug(slug)
  } catch {
    return getSampleArticleBySlug(slug)
  }
}

/**
 * Get articles filtered by category slug
 */
export async function getArticlesByCategory(
  categorySlug: string
): Promise<ArticleCard[]> {
  if (!(await hasSanityArticles())) return getSampleArticlesByCategory(categorySlug)

  const query = `*[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    ${articleCardFields}
  }`

  try {
    // An empty result here is a legitimate answer once Sanity holds content —
    // a category simply may not have been written to yet — so it is returned
    // as-is rather than mixing real and sample stories on one page.
    return await sanityClient.fetch<ArticleCard[]>(query, { categorySlug }, CONTENT_CACHE)
  } catch {
    return getSampleArticlesByCategory(categorySlug)
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return sampleCategories

  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }`

  try {
    const categories = await sanityClient.fetch<Category[]>(query, {}, CONTENT_CACHE)
    return categories?.length ? categories : sampleCategories
  } catch {
    return sampleCategories
  }
}

/**
 * Get the latest N articles
 */
export async function getLatestArticles(limit: number = 5): Promise<ArticleCard[]> {
  if (!(await hasSanityArticles())) return getLatestSampleArticles(limit)

  const query = `*[_type == "article"] | order(publishedAt desc)[0...$limit] {
    ${articleCardFields}
  }`

  try {
    const articles = await sanityClient.fetch<ArticleCard[]>(query, { limit }, CONTENT_CACHE)
    return articles?.length ? articles : getLatestSampleArticles(limit)
  } catch {
    return getLatestSampleArticles(limit)
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
  if (!(await hasSanityArticles()))
    return getRelatedSampleArticles(categorySlug, currentArticleId, limit)

  const query = `*[_type == "article" && category->slug.current == $categorySlug && _id != $currentArticleId] | order(publishedAt desc)[0...$limit] {
    ${articleCardFields}
  }`

  try {
    return await sanityClient.fetch<ArticleCard[]>(query, {
      categorySlug,
      currentArticleId,
      limit,
    }, CONTENT_CACHE)
  } catch {
    return getRelatedSampleArticles(categorySlug, currentArticleId, limit)
  }
}
