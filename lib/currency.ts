/**
 * Currency support for the calculators.
 *
 * IMPORTANT — this changes the unit the calculators are denominated in, it does
 * NOT convert between currencies. There is no FX rate anywhere in this module.
 * Selecting a currency means "the figures I type and read are in this currency";
 * an amount of 100,000 stays 100,000 when the selection changes, only the symbol
 * and grouping change. Converting would require live rates, and quietly
 * re-denominating someone's mortgage figures behind a dropdown would be worse
 * than not offering the feature at all. The UI states this explicitly.
 *
 * Each entry carries its own locale so grouping matches local convention —
 * Indian readers get ₹1,00,000 rather than ₹100,000 — and so that currencies
 * with different minor units (JPY has none) format correctly without special
 * cases here.
 */

export interface CurrencyOption {
  /** ISO 4217 code, also the persisted value. */
  code: string
  /** Locale used for grouping and symbol placement. */
  locale: string
  /** Shown in the picker. */
  label: string
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', locale: 'en-US', label: 'US Dollar' },
  { code: 'EUR', locale: 'de-DE', label: 'Euro' },
  { code: 'GBP', locale: 'en-GB', label: 'British Pound' },
  { code: 'INR', locale: 'en-IN', label: 'Indian Rupee' },
  { code: 'CAD', locale: 'en-CA', label: 'Canadian Dollar' },
  { code: 'AUD', locale: 'en-AU', label: 'Australian Dollar' },
  { code: 'JPY', locale: 'ja-JP', label: 'Japanese Yen' },
  { code: 'SGD', locale: 'en-SG', label: 'Singapore Dollar' },
  { code: 'AED', locale: 'en-AE', label: 'UAE Dirham' },
  { code: 'CHF', locale: 'de-CH', label: 'Swiss Franc' },
]

export const DEFAULT_CURRENCY = 'USD'

export function getCurrency(code: string): CurrencyOption {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
}

/**
 * Format a value as currency.
 *
 * Minor units are left to Intl rather than pinned to two decimals, so JPY
 * renders as ¥1,000 instead of ¥1,000.00. Non-finite values (a division that
 * produced Infinity, an unparsed field) render as an em dash instead of
 * "NaN" or "£∞".
 */
export function formatCurrency(value: number, code: string): string {
  const { locale } = getCurrency(code)
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
  }).format(value)
}

/**
 * The bare symbol for a currency, for use in field labels like "Loan Amount (₹)".
 *
 * Derived from Intl rather than hardcoded so it always matches what
 * `formatCurrency` will render. Falls back to the code if the symbol cannot be
 * isolated, which is the correct answer for currencies Intl renders as a code
 * anyway (CHF).
 */
export function currencySymbol(code: string): string {
  const { locale } = getCurrency(code)
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
    }).formatToParts(0)
    return parts.find((p) => p.type === 'currency')?.value ?? code
  } catch {
    return code
  }
}
