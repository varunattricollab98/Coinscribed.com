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
    <div className="bg-oxblood px-6 py-10 text-white sm:px-10 sm:py-12 dark:bg-oxblood-light">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
          Get the latest finance &amp; crypto news in your inbox
        </h2>
        <p className="mt-3 text-paper">
          Market moves, calculators, and banking insights. No spam, unsubscribe
          anytime.
        </p>

        {subscribed ? (
          <p role="status" className="mt-6 font-medium text-white">
            Thanks! You are subscribed.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
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
              className="w-full border border-transparent px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-white sm:max-w-xs"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-white px-6 py-3 text-eyebrow font-semibold uppercase text-oxblood transition-colors duration-150 hover:bg-wash"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
