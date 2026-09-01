'use client'

import { CURRENCIES } from '@/lib/currency'
import { useCurrency } from './CurrencyProvider'

/**
 * Currency picker for the calculators.
 *
 * The helper line is not decoration: the dropdown changes the unit, not the
 * value, so a reader who expects conversion would otherwise misread every figure
 * on the page after switching.
 */
export function CurrencySelect() {
  const { code, setCode, symbol } = useCurrency()

  return (
    <div className="sm:text-right">
      <label
        htmlFor="calculator-currency"
        className="field-label sm:justify-end"
      >
        Currency
      </label>
      <select
        id="calculator-currency"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        aria-describedby="calculator-currency-note"
        className="mt-2 border border-hairline bg-surface px-3 py-2 text-sm text-ink-body transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-hairline-dark dark:bg-elevated dark:text-ink-inverse dark:focus:border-accent-light"
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} — {currency.label}
          </option>
        ))}
      </select>
      <p
        id="calculator-currency-note"
        className="mt-2 max-w-xs text-caption leading-relaxed text-ink-muted sm:ml-auto dark:text-ink-inverse-muted"
      >
        Sets the unit for every figure on this page. Amounts are not converted —
        enter your values in {symbol}.
      </p>
    </div>
  )
}
