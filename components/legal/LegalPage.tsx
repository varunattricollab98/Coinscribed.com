import type { ReactNode } from 'react'

/**
 * Shared shell for the legal pages, so Disclaimer, Terms and Privacy stay
 * structurally identical and a change to legal typography happens in one place.
 */

export const LEGAL_EFFECTIVE_DATE = 'September 1, 2026'

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string
  /** Plain-English summary shown above the formal text. */
  intro?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="container-page section-padding">
      <div className="container-prose">
        <span className="eyebrow">Legal</span>
        <h1 className="page-title mt-1.5">{title}</h1>
        <p className="mt-4 text-caption text-ink-muted dark:text-ink-inverse-muted">
          Effective date: {LEGAL_EFFECTIVE_DATE} &middot; Last updated:{' '}
          {LEGAL_EFFECTIVE_DATE}
        </p>

        {intro && (
          <div className="mt-8 border-l-2 border-gold bg-gold-soft px-5 py-4 dark:border-gold-light dark:bg-gold/10">
            <p className="eyebrow-royal">In short</p>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
              {intro}
            </div>
          </div>
        )}

        <div className="mt-10 space-y-9 text-ink-body dark:text-ink-inverse-body">
          {children}
        </div>
      </div>
    </div>
  )
}

/** One numbered clause. */
export function Clause({
  n,
  heading,
  children,
}: {
  n?: number
  heading: string
  children: ReactNode
}) {
  return (
    <section>
      <h2 className="font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">
        {n !== undefined ? `${n}. ` : ''}
        {heading}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed">{children}</div>
    </section>
  )
}

/** Bulleted list with the house marker treatment. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold dark:bg-gold-light"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
