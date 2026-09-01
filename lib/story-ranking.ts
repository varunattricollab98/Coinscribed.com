// Story ordering helpers for the editorial rails.
//
// IMPORTANT — this file contains no analytics. There is no traffic pipeline
// behind this site yet, so nothing here measures, estimates or implies real
// readership, and no view counts are ever fabricated for display. What the
// "Most Read" rail actually shows is a *stable, seeded rotation* of the same
// stories the page already fetched: a different, repeatable order that gives
// the reader a second way into the archive.
//
// Stability is the requirement that shapes the implementation. The order must
// be identical on the server and on the client (or React logs a hydration
// mismatch), identical between two requests a second apart (or the list
// visibly reshuffles under the reader), and derived only from data already in
// hand (no extra fetch). `Math.random()` and anything time-based fail all
// three, so the order comes from a pure hash of the article id.
//
// When real analytics land, replace `rankByReadership` with a query and delete
// the hash — every call site keeps working.

/**
 * FNV-1a, 32-bit. A tiny non-cryptographic string hash.
 *
 * Chosen for being deterministic and dependency-free rather than for
 * distribution quality; the only property that matters here is that the same
 * id always yields the same number on every runtime.
 */
function hashString(value: string): number {
  let hash = 0x811c9dc5

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    // 16777619, expressed as shifts so the maths stays inside 32 bits.
    hash = Math.imul(hash, 0x01000193) >>> 0
  }

  return hash >>> 0
}

/**
 * Return a deterministic, chronology-independent ordering of `articles`.
 *
 * Used for the "Most Read" tab in the homepage rail. The result is a seeded
 * rotation of the input — NOT a popularity ranking — and is presented to the
 * reader as a curated rotation, never as measured traffic.
 *
 * Ties (astronomically unlikely, but possible) fall back to the id so the sort
 * is total and therefore stable across engines with different sort
 * implementations.
 *
 * @param articles Pool to reorder. Never mutated.
 * @param limit    Maximum number of stories to return.
 */
export function rankByReadership<T extends { _id: string }>(
  articles: T[],
  limit: number
): T[] {
  return articles
    .map((article) => ({ article, seed: hashString(article._id) }))
    .sort((a, b) =>
      a.seed === b.seed
        ? a.article._id.localeCompare(b.article._id)
        : a.seed - b.seed
    )
    .slice(0, Math.max(0, limit))
    .map((entry) => entry.article)
}
