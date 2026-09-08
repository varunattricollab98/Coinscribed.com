import type { PortableTextBlock } from '@/lib/sanity-queries'

/**
 * A single heading extracted from an article body, used to build the Table of
 * Contents and to give each in-body heading a stable anchor id so the TOC links
 * jump to it.
 */
export interface TocHeading {
  /** Slugified anchor id, unique within the article. */
  id: string
  /** Plain heading text. */
  text: string
  /** 2 for H2, 3 for H3. */
  level: 2 | 3
}

/** Turn heading text into a URL-safe slug (lowercase, hyphenated). */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // drop punctuation
    .replace(/\s+/g, '-') // spaces -> hyphens
    .replace(/-+/g, '-') // collapse repeats
    .replace(/^-|-$/g, '') // trim edge hyphens
}

/** Concatenate the text spans of a Portable Text block. */
function blockText(block: PortableTextBlock): string {
  return (block.children ?? [])
    .map((c) => c.text ?? '')
    .join('')
    .trim()
}

/**
 * Extract H2/H3 headings from an article's Portable Text body and assign each a
 * unique anchor id. The same id-generation logic is used by the renderer so the
 * TOC's links and the headings' ids always match. Ids are de-duplicated with a
 * numeric suffix, and fall back to the block `_key` if the text slugifies to
 * nothing (e.g. an emoji-only heading).
 */
export function extractHeadings(
  body: PortableTextBlock[] | undefined
): TocHeading[] {
  if (!body || body.length === 0) return []
  const headings: TocHeading[] = []
  const seen = new Map<string, number>()

  for (const block of body) {
    if (block._type !== 'block') continue
    const style = block.style
    if (style !== 'h2' && style !== 'h3') continue
    const text = blockText(block)
    if (!text) continue

    let base = slugifyHeading(text) || block._key || 'section'
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count + 1}`

    headings.push({ id, text, level: style === 'h2' ? 2 : 3 })
  }

  return headings
}

/**
 * Build the same id for a given block that extractHeadings produced, so the
 * renderer can stamp matching `id` attributes on the actual <h2>/<h3> elements.
 * Returns a map of block `_key` -> anchor id.
 */
export function headingIdMap(
  body: PortableTextBlock[] | undefined
): Record<string, string> {
  if (!body || body.length === 0) return {}
  const map: Record<string, string> = {}
  const seen = new Map<string, number>()

  for (const block of body) {
    if (block._type !== 'block') continue
    if (block.style !== 'h2' && block.style !== 'h3') continue
    const text = blockText(block)
    if (!text) continue
    let base = slugifyHeading(text) || block._key || 'section'
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    map[block._key] = count === 0 ? base : `${base}-${count + 1}`
  }

  return map
}
