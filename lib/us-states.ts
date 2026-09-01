/**
 * US state reference and the normaliser that powers the state hub pages.
 *
 * The routing-number data was entered by hand over time, so a single state
 * appears as "New York", "NY", "New York (Metro)", "New York (Wire)" and so on,
 * and some rows are not geographic at all ("Wire Transfers", "Nationwide",
 * "Brokerage Accounts"). Grouping on the raw string would scatter one state
 * across several buckets and invent nonsense "states". This module maps every
 * raw label to a canonical state, or flags it as non-geographic, so the hub
 * pages are built on clean data without touching the verified numbers
 * themselves.
 */

export interface USState {
  code: string // two-letter, also the URL slug source
  name: string
  slug: string
}

export const US_STATES: USState[] = [
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['DC', 'Washington DC'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VA', 'Virginia'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
].map(([code, name]) => ({
  code,
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
}))

const BY_NAME = new Map(US_STATES.map((s) => [s.name.toLowerCase(), s]))
const BY_CODE = new Map(US_STATES.map((s) => [s.code, s]))
const BY_SLUG = new Map(US_STATES.map((s) => [s.slug, s]))

/**
 * Resolve a raw `state` label from the bank data to a canonical US state.
 *
 * Handles: exact names, two-letter codes, and names carrying a parenthetical
 * qualifier such as "New York (Metro)" or "Pennsylvania (Eastern)". Returns
 * null for non-geographic labels ("Wire Transfers", "Nationwide", "Brokerage
 * Accounts", "Online Banking", "Savings Accounts"), which should be shown on a
 * bank page but never grouped under a state.
 */
export function resolveState(raw: string): USState | null {
  const trimmed = raw.trim()

  // Strip a trailing "(...)" qualifier: "New York (Metro)" -> "New York".
  const base = trimmed.replace(/\s*\([^)]*\)\s*$/, '').trim()

  const byName = BY_NAME.get(base.toLowerCase())
  if (byName) return byName

  const byCode = BY_CODE.get(base.toUpperCase())
  if (byCode) return byCode

  return null
}

export function stateBySlug(slug: string): USState | null {
  return BY_SLUG.get(slug) ?? null
}
