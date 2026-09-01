'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  currencySymbol,
  formatCurrency,
  getCurrency,
} from '@/lib/currency'

const STORAGE_KEY = 'coinscribed:currency'

interface CurrencyContextValue {
  /** Selected ISO 4217 code. */
  code: string
  setCode: (code: string) => void
  /** Format a number in the selected currency. */
  format: (value: number) => string
  /** Bare symbol, for field labels. */
  symbol: string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

/**
 * Holds the calculator currency selection.
 *
 * Mounted once at the /calculators route segment rather than inside
 * CalculatorLayout: each calculator page builds its own results markup during
 * its own render, so it has to sit *above* the pages in the tree to be readable
 * from them.
 *
 * The initial render always uses the default so the server and the first client
 * render agree; a stored preference is applied in an effect straight afterwards.
 * Reading localStorage during render would produce a hydration mismatch.
 */
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCodeState] = useState(DEFAULT_CURRENCY)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored && CURRENCIES.some((c) => c.code === stored)) {
        setCodeState(stored)
      }
    } catch {
      // Private browsing or blocked storage: keep the default.
    }
  }, [])

  const setCode = useCallback((next: string) => {
    // Never persist or apply a code we cannot format.
    if (!CURRENCIES.some((c) => c.code === next)) return
    setCodeState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Selection still applies for this session.
    }
  }, [])

  const format = useCallback((value: number) => formatCurrency(value, code), [code])

  return (
    <CurrencyContext.Provider
      value={{ code, setCode, format, symbol: currencySymbol(code) }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

/**
 * Read the selected currency.
 *
 * Falls back to the default rather than throwing when no provider is present, so
 * a calculator rendered outside the /calculators segment still formats sensibly
 * instead of crashing the page.
 */
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  if (ctx) return ctx

  return {
    code: DEFAULT_CURRENCY,
    setCode: () => {},
    format: (value: number) => formatCurrency(value, DEFAULT_CURRENCY),
    symbol: currencySymbol(DEFAULT_CURRENCY),
  }
}

export { getCurrency }
