'use client'

import { useState } from 'react'

interface NewsletterSignupProps {
  /**
   * `wide` is the full-bleed claret block that closes a page. `compact` is the
   * narrow rail card that sits inside the homepage's three-column block, where
   * it is visible in the first screen rather than only after a long scroll.
   */
  variant?: 'wide' | 'compact'
}

export function NewsletterSignup({ variant = 'wide' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Both variants can render on the same document (rail + page footer), so the
  // field id is derived from the variant. Two elements sharing an id would
  // break the label association for whichever one the browser resolved second.
  const fieldId = `newsletter-email-${variant}`

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return

    // TODO: Connect this to a real email service later
    // (e.g. Mailchimp, ConvertKit, or Resend). For now this is a purely
    // client-side confirmation and does not send the address anywhere.
    setSubscribed(true)
    setEmail('')
  }

  // ------------------------------------------------------------------ compact
  if (variant === 'compact') {
    return (
      <section
        aria-labelledby={`${fieldId}-heading`}
        className="border border-hairline bg-wash p-5 dark:border-hairline-dark dark:bg-elevated"
      >
        <div className="flex items-center gap-3">
          <span className="eyebrow-royal">Newsletter</span>
          <span className="gold-rule flex-1" aria-hidden="true" />
        </div>

        <h2
          id={`${fieldId}-heading`}
          className="mt-3 font-serif text-display-4 font-bold leading-snug text-ink dark:text-ink-inverse"
        >
          The morning brief, in your inbox
        </h2>
        <p className="mt-2 text-caption leading-relaxed text-ink-body dark:text-ink-inverse-body">
          Market moves, calculators and banking insight. No spam, unsubscribe
          anytime.
        </p>

        {subscribed ? (
          <p
            role="status"
            className="mt-4 text-sm font-medium text-accent dark:text-accent-light"
          >
            Thanks! You are subscribed.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <label htmlFor={fieldId} className="sr-only">
              Email address
            </label>
            <input
              id={fieldId}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-hairline bg-surface px-3 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-muted/70 focus:border-accent focus:outline-none dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse dark:placeholder:text-ink-inverse-muted/70 dark:focus:border-accent-light"
            />
            <button
              type="submit"
              className="mt-2.5 w-full bg-accent-gradient px-4 py-2.5 text-eyebrow font-semibold uppercase text-white transition-transform duration-150 hover:scale-[1.01] motion-reduce:transform-none"
            >
              Subscribe
            </button>
          </form>
        )}
      </section>
    )
  }

  // --------------------------------------------------------------------- wide
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-oxblood via-oxblood to-[#5a1518] px-6 py-12 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] sm:px-10 sm:py-14 dark:from-oxblood-light dark:via-oxblood dark:to-[#4a1114]">
      {/* Soft decorative glows — pure visual, aria-hidden. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        {/* Eyebrow with mail icon */}
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-eyebrow font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Newsletter
        </span>

        <h2 className="mt-4 font-serif text-2xl font-bold leading-tight text-white sm:text-3xl">
          Get the latest finance &amp; crypto news in your inbox
        </h2>
        <p className="mx-auto mt-3 max-w-md text-paper/90">
          Market moves, calculators, and banking insights — a few times a week.
          No spam, unsubscribe anytime.
        </p>

        {subscribed ? (
          <p
            role="status"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 font-medium text-white"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Thanks! You&apos;re subscribed.
          </p>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row sm:items-center"
            >
              <label htmlFor={fieldId} className="sr-only">
                Email address
              </label>
              <input
                id={fieldId}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full flex-1 rounded-lg border border-transparent bg-white px-4 py-3 text-sm text-ink shadow-sm placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-white/70"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-6 py-3 text-eyebrow font-semibold uppercase text-oxblood shadow-sm transition-all duration-150 hover:bg-paper hover:shadow-md"
              >
                Subscribe
                <span aria-hidden="true">&rarr;</span>
              </button>
            </form>

            {/* Trust row */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-caption text-paper/70">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden="true" />
                No spam, ever
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden="true" />
                Unsubscribe in one click
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden="true" />
                Free forever
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
