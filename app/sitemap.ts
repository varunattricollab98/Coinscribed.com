import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { sampleArticles, sampleCategories, getSampleAuthors } from '@/data/sample-news'
import { getAllBankSlugs, getStatesWithData } from '@/data/banks'

/**
 * Native Next.js sitemap.
 *
 * This replaces the previous `next-sitemap` postbuild step. next-sitemap only
 * discovers routes from the built `.next` app output, which made dynamic-route
 * coverage fragile. Here we enumerate every route directly from the same
 * TypeScript data the pages render from, so the sitemap is guaranteed to list
 * all static pages plus every dynamic route (articles, categories, author bio
 * pages, per-bank routing pages and per-state routing pages).
 *
 * Note on CMS content: /news/[slug] and /news/category/[category] use Next's
 * default `dynamicParams: true`, so any Sanity-only articles or categories
 * published after build are not (and cannot be) part of a static sitemap.
 * Enumerating from `sampleArticles`/`sampleCategories` matches exactly what the
 * pages statically render in an empty-Sanity build, which is the correct
 * behaviour for this environment.
 *
 * Next serves this file at `${siteConfig.url}/sitemap.xml` (referenced by
 * app/robots.ts).
 */

const baseUrl = siteConfig.url.replace(/\/$/, '')

// Priority intent carried over from the old next-sitemap.config.js:
// home = 1.0; the three top-level hubs = 0.9; everything else = 0.7.
const HOME_PRIORITY = 1.0
const HUB_PRIORITY = 0.9
const DEFAULT_PRIORITY = 0.7

function url(path: string): string {
  return path === '/' ? baseUrl : `${baseUrl}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // -- Static routes -------------------------------------------------------
  const staticEntries: MetadataRoute.Sitemap = [
    { path: '/', priority: HOME_PRIORITY, changeFrequency: 'daily' as const },
    { path: '/about', priority: DEFAULT_PRIORITY, changeFrequency: 'monthly' as const },
    { path: '/calculators', priority: HUB_PRIORITY, changeFrequency: 'weekly' as const },
    { path: '/calculators/mortgage-calculator', priority: DEFAULT_PRIORITY, changeFrequency: 'monthly' as const },
    { path: '/calculators/401k-calculator', priority: DEFAULT_PRIORITY, changeFrequency: 'monthly' as const },
    { path: '/calculators/emi-calculator', priority: DEFAULT_PRIORITY, changeFrequency: 'monthly' as const },
    { path: '/calculators/sip-calculator', priority: DEFAULT_PRIORITY, changeFrequency: 'monthly' as const },
    { path: '/calculators/loan-payoff-calculator', priority: DEFAULT_PRIORITY, changeFrequency: 'monthly' as const },
    { path: '/calculators/compound-interest-calculator', priority: DEFAULT_PRIORITY, changeFrequency: 'monthly' as const },
    { path: '/calculators/retirement-calculator', priority: DEFAULT_PRIORITY, changeFrequency: 'monthly' as const },
    { path: '/news', priority: HUB_PRIORITY, changeFrequency: 'daily' as const },
    { path: '/bank-routing-numbers', priority: HUB_PRIORITY, changeFrequency: 'weekly' as const },
    { path: '/bank-routing-numbers/state', priority: DEFAULT_PRIORITY, changeFrequency: 'weekly' as const },
    { path: '/disclaimer', priority: DEFAULT_PRIORITY, changeFrequency: 'yearly' as const },
    { path: '/privacy-policy', priority: DEFAULT_PRIORITY, changeFrequency: 'yearly' as const },
    { path: '/terms-of-service', priority: DEFAULT_PRIORITY, changeFrequency: 'yearly' as const },
  ].map((e) => ({
    url: url(e.path),
    lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }))

  // -- News articles: /news/<slug> ----------------------------------------
  const articleEntries: MetadataRoute.Sitemap = sampleArticles.map((article) => ({
    url: url(`/news/${article.slug.current}`),
    lastModified: article.publishedAt ? new Date(article.publishedAt) : lastModified,
    changeFrequency: 'weekly' as const,
    priority: DEFAULT_PRIORITY,
  }))

  // -- News categories: /news/category/<slug> -----------------------------
  const categoryEntries: MetadataRoute.Sitemap = sampleCategories.map((category) => ({
    url: url(`/news/category/${category.slug.current}`),
    lastModified,
    changeFrequency: 'daily' as const,
    priority: DEFAULT_PRIORITY,
  }))

  // -- Author bio pages: /news/author/<slug> (added in FEAT-002) ----------
  const authorEntries: MetadataRoute.Sitemap = getSampleAuthors().map((author) => ({
    url: url(`/news/author/${author.slug.current}`),
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: DEFAULT_PRIORITY,
  }))

  // -- Per-bank routing pages: /bank-routing-numbers/<slug> ---------------
  const bankEntries: MetadataRoute.Sitemap = getAllBankSlugs().map((slug) => ({
    url: url(`/bank-routing-numbers/${slug}`),
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: DEFAULT_PRIORITY,
  }))

  // -- Per-state routing pages: /bank-routing-numbers/state/<state.slug> --
  const stateEntries: MetadataRoute.Sitemap = getStatesWithData().map(({ state }) => ({
    url: url(`/bank-routing-numbers/state/${state.slug}`),
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: DEFAULT_PRIORITY,
  }))

  return [
    ...staticEntries,
    ...articleEntries,
    ...categoryEntries,
    ...authorEntries,
    ...bankEntries,
    ...stateEntries,
  ]
}
