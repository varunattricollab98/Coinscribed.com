import Link from 'next/link'
import { LineIcon } from '@/components/icons/LineIcon'
import { getCalculator } from '@/data/calculators'

/**
 * Prominent "try this calculator" call-to-action card for article pages.
 *
 * Turns the site's calculators into conversion points from within relevant
 * articles (e.g. a mortgage article -> Mortgage Calculator), which is exactly
 * how the big finance sites monetise and retain readers. More visible than an
 * inline text link: an icon plate, the calculator name, its description and an
 * arrow, styled to match the "Ink & Oxblood" cards.
 *
 * Pass a calculator `key` (e.g. "mortgage-calculator"). Renders nothing if the
 * key doesn't match a known calculator, so it's safe to use anywhere.
 */
export function RelatedCalculatorCard({
  calculatorKey,
}: {
  calculatorKey: string
}) {
  const calc = getCalculator(calculatorKey)
  if (!calc) return null

  return (
    <aside className="mb-14">
      <div className="mb-4 flex items-center gap-3">
        <span className="eyebrow-royal">Try the tool</span>
        <span className="gold-rule flex-1" aria-hidden="true" />
      </div>
      <Link
        href={calc.href}
        className="group flex items-center gap-4 rounded-sm border border-hairline bg-surface p-5 shadow-soft transition-all duration-200 ease-editorial hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lift motion-reduce:transform-none dark:border-hairline-dark dark:bg-elevated dark:shadow-none dark:hover:border-accent-light/40"
      >
        <span className="icon-plate icon-plate-tone shrink-0">
          <LineIcon name={calc.icon} className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
            {calc.title}
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
            {calc.description}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 text-ink-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent dark:group-hover:text-accent-light"
        >
          &rarr;
        </span>
      </Link>
    </aside>
  )
}
