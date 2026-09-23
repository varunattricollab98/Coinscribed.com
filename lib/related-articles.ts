import type { ArticleCard } from './sanity-queries'

/**
 * Topical ranking for the "Related Articles" section.
 *
 * The newsroom used to surface the 3 NEWEST articles in the same category,
 * which meant a car-loan piece could sit next to an unrelated savings piece
 * simply because both are "Banking". This module re-ranks the same
 * same-category candidates by how much their topic overlaps the current
 * article, so a reader finishing "What Credit Score Do You Need to Buy a Car?"
 * is offered the negative-equity / balloon-payment car pieces first.
 *
 * It is intentionally pure and dependency-free (no Sanity, no network, no npm
 * deps) so it is trivially testable and cannot introduce a runtime risk on this
 * YMYL finance site. Scoring uses only the cheap `slug + title` text that
 * `articleCardFields` already returns — the article body is never needed.
 *
 * SAFETY / ZERO-REGRESSION CONTRACT: `rankRelatedArticles` never drops or
 * invents candidates. It only re-orders the list it is given and then returns
 * the first `limit`. When nothing scores above zero (no shared topical tokens),
 * the input order is preserved, so the result is byte-for-byte the same set the
 * old "category newest" behavior produced. Good matches lead; otherwise it
 * degrades exactly to today's behavior.
 */

/**
 * Words that carry no topical signal on a personal-finance site. Matching on
 * these would pull in random same-category articles (e.g. every "how to" piece
 * would look related to every other "how to" piece), which is exactly the noise
 * we want to remove. Kept deliberately small and curated — over-stripping risks
 * discarding a genuinely useful token.
 */
const STOPWORDS = new Set<string>([
  // grammatical filler
  'the', 'a', 'an', 'to', 'for', 'and', 'or', 'of', 'in', 'on', 'at', 'by',
  'with', 'from', 'as', 'is', 'are', 'be', 'do', 'does', 'you', 'your', 'i',
  'it', 'its', 'my', 'me', 'we', 'us', 'this', 'that', 'these', 'those',
  // question / listicle framing words
  'what', 'why', 'how', 'when', 'where', 'who', 'which', 'vs', 'versus',
  'guide', 'explained', 'best', 'top', 'need', 'get', 'got', 'make', 'made',
  'use', 'using', 'about', 'into', 'out', 'up', 'down', 'off', 'more', 'much',
  'many', 'can', 'should', 'will', 'have', 'has', 'between', 'difference',
  // generic finance filler that appears across unrelated topics
  'calculator', 'money', 'finance', 'financial',
])

/**
 * Break a slug and/or title into meaningful, de-duplicated lowercase tokens.
 * Splits on any non-alphanumeric run so both hyphenated slugs
 * ("negative-equity-car-loan") and spaced titles ("Negative Equity Car Loan")
 * yield the same tokens. Drops stopwords and 1-character tokens; keeps short
 * but meaningful finance terms like "cd", "72" and "401k".
 */
export function tokenize(text: string): Set<string> {
  const tokens = new Set<string>()
  for (const raw of text.toLowerCase().split(/[^a-z0-9]+/)) {
    if (raw.length < 2) continue
    if (STOPWORDS.has(raw)) continue
    tokens.add(raw)
  }
  return tokens
}

/**
 * Number of meaningful tokens shared between two token sets — the relevance
 * score. Symmetric and cheap (iterates the smaller set).
 */
export function sharedTokenScore(a: Set<string>, b: Set<string>): number {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a]
  let score = 0
  small.forEach((token) => {
    if (large.has(token)) score += 1
  })
  return score
}

/**
 * Re-rank same-category candidates by topical relevance to the current article.
 *
 * @param currentSlug   Slug of the article being viewed (e.g. "credit-score-to-buy-a-car").
 * @param currentTitle  Title of the article being viewed.
 * @param candidates    Same-category ArticleCards (already excludes current, newest first).
 * @param limit         How many to return.
 * @returns The top `limit` candidates: highest shared-token score first, then
 *          the original (publishedAt desc) order as a stable tiebreaker. When no
 *          candidate scores > 0, the original order is preserved unchanged.
 */
export function rankRelatedArticles(
  currentSlug: string,
  currentTitle: string,
  candidates: ArticleCard[],
  limit: number
): ArticleCard[] {
  if (candidates.length <= 1) return candidates.slice(0, limit)

  const currentTokens = tokenize(`${currentSlug} ${currentTitle}`)

  const scored = candidates.map((article, index) => {
    const candidateTokens = tokenize(`${article.slug.current} ${article.title}`)
    return {
      article,
      // Original position is the publishedAt-desc order from GROQ.
      index,
      score: sharedTokenScore(currentTokens, candidateTokens),
    }
  })

  // Sort by score desc; on a tie keep the newest-first input order. A stable
  // comparator on `index` guarantees the fallback matches today's behavior.
  scored.sort((a, b) => (b.score - a.score) || (a.index - b.index))

  return scored.slice(0, limit).map((s) => s.article)
}
