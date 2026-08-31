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

/**
 * Get all articles, ordered by publish date (newest first)
 */
export async function getAllArticles(): Promise<ArticleCard[]> {
  if (!isSanityConfigured) return getSampleArticles()

  const query = `*[_type == "article"] | order(publishedAt desc) {
    ${articleCardFields}
  }`

  return sanityClient.fetch(query)
}

/**
 * Get a single article by its slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!isSanityConfigured) return getSampleArticleBySlug(slug)

  const query = `*[_type == "article" && slug.current == $slug][0] {
    ${articleFullFields}
  }`

  return sanityClient.fetch(query, { slug })
}

/**
 * Get articles filtered by category slug
 */
export async function getArticlesByCategory(
  categorySlug: string
): Promise<ArticleCard[]> {
  if (!isSanityConfigured) return getSampleArticlesByCategory(categorySlug)

  const query = `*[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    ${articleCardFields}
  }`

  return sanityClient.fetch(query, { categorySlug })
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

  return sanityClient.fetch(query)
}

/**
 * Get the latest N articles
 */
export async function getLatestArticles(limit: number = 5): Promise<ArticleCard[]> {
  if (!isSanityConfigured) return getLatestSampleArticles(limit)

  const query = `*[_type == "article"] | order(publishedAt desc)[0...$limit] {
    ${articleCardFields}
  }`

  return sanityClient.fetch(query, { limit })
}

/**
 * Get related articles (same category, excluding current article)
 */
export async function getRelatedArticles(
  categorySlug: string,
  currentArticleId: string,
  limit: number = 3
): Promise<ArticleCard[]> {
  if (!isSanityConfigured) return getRelatedSampleArticles(categorySlug, currentArticleId, limit)

  const query = `*[_type == "article" && category->slug.current == $categorySlug && _id != $currentArticleId] | order(publishedAt desc)[0...$limit] {
    ${articleCardFields}
  }`

  return sanityClient.fetch(query, { categorySlug, currentArticleId, limit })
}
