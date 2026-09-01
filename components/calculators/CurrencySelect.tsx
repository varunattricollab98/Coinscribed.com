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
    <div>
      <label htmlFor="calculator-currency" className="field-label">
        Currency
      </label>
      {/* Matches `.field-input` so it reads as the first field of the form
          rather than a control bolted on above it. */}
      <select
        id="calculator-currency"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        aria-describedby="calculator-currency-note"
        className="field-input"
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} — {currency.label}
          </option>
        ))}
      </select>
      <p
        id="calculator-currency-note"
        className="mt-2 text-caption leading-relaxed text-ink-muted dark:text-ink-inverse-muted"
      >
        Enter every amount below in {symbol}. Changing this switches the unit —
        figures are not converted.
      </p>
    </div>
  )
}
