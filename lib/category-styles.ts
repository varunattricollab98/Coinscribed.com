// Category tones for the "Ink & Oxblood" design language.
//
// Each category keeps a desaturated, ink-adjacent tone so it stays visually
// distinguishable without introducing saturated or pastel colour:
//   crypto  = muted aubergine (#514B63)
//   economy = muted olive     (#4A5A45)
//   markets = muted steel     (#3B5266)
//   banking = muted sepia     (#6B5540)
//
// The tone is expressed as eyebrow label text plus a short 2px accent rule —
// never as a pill background. Article thumbnails deliberately share one
// neutral paper/ink duotone treatment (`.thumb-duotone` in globals.css) so
// they read as print plates rather than coloured blocks.

export interface CategoryTone {
  /** Text colour classes for the uppercase eyebrow label. */
  label: string
  /** Background colour classes for the short 2px accent rule. */
  rule: string
  /**
   * Background for a solid icon plate carrying white artwork. Uses the base
   * tone in both colour schemes rather than swapping to the `-light` variant:
   * those are pale by design and would leave white icons unreadable. All four
   * base tones clear AA against white.
   */
  plate: string
}

const CATEGORY_TONES: Record<string, CategoryTone> = {
  crypto: {
    label: 'text-category-crypto dark:text-category-crypto-light',
    rule: 'bg-category-crypto dark:bg-category-crypto-light',
    plate: 'bg-category-crypto',
  },
  economy: {
    label: 'text-category-economy dark:text-category-economy-light',
    rule: 'bg-category-economy dark:bg-category-economy-light',
    plate: 'bg-category-economy',
  },
  markets: {
    label: 'text-category-markets dark:text-category-markets-light',
    rule: 'bg-category-markets dark:bg-category-markets-light',
    plate: 'bg-category-markets',
  },
  banking: {
    label: 'text-category-banking dark:text-category-banking-light',
    rule: 'bg-category-banking dark:bg-category-banking-light',
    plate: 'bg-category-banking',
  },
}

const DEFAULT_TONE: CategoryTone = {
  label: 'text-category-neutral dark:text-category-neutral-light',
  rule: 'bg-category-neutral dark:bg-category-neutral-light',
  plate: 'bg-category-neutral',
}

/**
 * Return the eyebrow label and accent-rule classes for a category slug.
 * Falls back to a neutral warm grey for unknown or undefined slugs.
 */
export function getCategoryTone(slug?: string): CategoryTone {
  if (!slug) return DEFAULT_TONE
  return CATEGORY_TONES[slug] ?? DEFAULT_TONE
}
