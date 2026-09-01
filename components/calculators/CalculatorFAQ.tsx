'use client'

import { useId, useState } from 'react'

export interface FAQItem {
  question: string
  /** Plain-text answer. Must match the FAQPage JSON-LD emitted for this page. */
  answer: string
}

/**
 * Visible FAQ accordion for a calculator page.
 *
 * The rendered text here is the same string handed to generateFAQSchema, which
 * is a hard Google requirement: an FAQ rich result is only granted when the
 * answer is present in the page HTML. Keeping both from one array guarantees
 * they never drift.
 *
 * Accessibility: each question is a real <button> toggling its panel via
 * aria-expanded / aria-controls; panels are hidden with the `hidden` attribute
 * so collapsed answers leave the accessibility tree; the chevron rotation is
 * reduced-motion guarded.
 */
export function CalculatorFAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()

  return (
    <section aria-labelledby={`${base}-heading`}>
      <div className="section-header mb-6">
        <div>
          <span className="eyebrow">Answers</span>
          <h2 id={`${base}-heading`} className="section-title mt-1.5">
            Frequently asked questions
          </h2>
        </div>
      </div>

      <dl className="divide-y divide-hairline border-y border-hairline dark:divide-hairline-dark dark:border-hairline-dark">
        {items.map((item, i) => {
          const isOpen = open === i
          const qId = `${base}-q-${i}`
          const aId = `${base}-a-${i}`
          return (
            <div key={i}>
              <dt>
                <button
                  type="button"
                  id={qId}
                  aria-expanded={isOpen}
                  aria-controls={aId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                    {item.question}
                  </span>
                  <svg
                    className={`h-4 w-4 shrink-0 text-accent transition-transform duration-200 motion-reduce:transition-none dark:text-accent-light ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </dt>
              <dd
                id={aId}
                role="region"
                aria-labelledby={qId}
                hidden={!isOpen}
                className="pb-5 pr-8 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body"
              >
                {item.answer}
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
