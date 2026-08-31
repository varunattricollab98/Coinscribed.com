'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return

    // TODO: Connect this to a real email service later
    // (e.g. Mailchimp, ConvertKit, or Resend). For now this is a purely
    // client-side confirmation and does not send the address anywhere.
    setSubscribed(true)
    setEmail('')
  }

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
          <p
            role="status"
            className="mt-6 font-medium text-white"
          >
            Thanks! You are subscribed.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
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
