import { CurrencyProvider } from '@/components/calculators/CurrencyProvider'

/**
 * Shared shell for every calculator route.
 *
 * The currency selection lives here rather than in CalculatorLayout because each
 * calculator page formats its own results during its own render — the provider
 * has to sit above the pages to be readable from them. Mounting it once here also
 * means the choice persists as the reader moves between calculators.
 */
export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CurrencyProvider>{children}</CurrencyProvider>
}
