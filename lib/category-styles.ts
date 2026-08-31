// Category-colored gradient placeholders.
//
// Keyed to the same category color scheme used in
// components/news/CategoryBadge.tsx:
//   crypto  = purple (#7c3aed)
//   economy = teal   (#0f766e)
//   markets = green  (#16a34a)
//   banking = amber  (#d97706)
//
// Returned as Tailwind gradient utility classes so they can be dropped
// straight onto a thumbnail placeholder <div>. Used by ArticleCard and the
// FeaturedArticle hero for articles that have no mainImage (sample data).

const categoryGradients: Record<string, string> = {
  crypto: 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-700',
  economy: 'bg-gradient-to-br from-teal-medium via-teal-primary to-emerald-800',
  markets: 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-800',
  banking: 'bg-gradient-to-br from-amber-badge via-amber-accent to-orange-800',
}

const defaultGradient =
  'bg-gradient-to-br from-teal-medium via-teal-primary to-emerald-800'

/**
 * Return Tailwind gradient classes for a category slug, matching the
 * CategoryBadge color scheme. Falls back to teal for unknown/undefined slugs.
 */
export function getCategoryGradient(slug?: string): string {
  if (!slug) return defaultGradient
  return categoryGradients[slug] || defaultGradient
}
