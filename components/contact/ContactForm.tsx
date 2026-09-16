'use client'

import { useState } from 'react'

/**
 * Public contact form.
 *
 * Posts to /api/contact, which stores the message as a `contactMessage` in
 * Sanity (owner reads/replies from Studio/admin). Mirrors the newsletter form's
 * honest UX: success is only shown when the server actually stored the message;
 * a 503 (write token not configured) surfaces a clear message plus the direct
 * email fallback passed in via `fallbackEmail`.
 */
export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  // Honeypot — hidden from real users; bots tend to fill every field.
  const [company, setCompany] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          company: company.trim(),
          source: 'contact-page',
        }),
      })
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null
      if (res.ok && data?.ok) {
        setSent(true)
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
      } else {
        setError(data?.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-sm border border-hairline bg-wash p-6 dark:border-hairline-dark dark:bg-elevated"
      >
        <h2 className="mb-2 font-serif text-xl font-bold text-ink dark:text-ink-inverse">
          Thanks — your message is on its way.
        </h2>
        <p className="text-ink-body dark:text-ink-inverse-body">
          We&apos;ve received your message and will reply to your email as soon
          as we can.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full rounded-sm border border-hairline bg-surface px-3 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-muted/70 focus:border-accent focus:outline-none disabled:opacity-60 dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse dark:placeholder:text-ink-inverse-muted/70 dark:focus:border-accent-light'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1 block font-sans text-caption font-semibold text-ink-body dark:text-ink-inverse-body"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1 block font-sans text-caption font-semibold text-ink-body dark:text-ink-inverse-body"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1 block font-sans text-caption font-semibold text-ink-body dark:text-ink-inverse-body"
        >
          Subject <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          maxLength={160}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={submitting}
          placeholder="What's this about?"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1 block font-sans text-caption font-semibold text-ink-body dark:text-ink-inverse-body"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitting}
          placeholder="How can we help?"
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Honeypot: visually hidden + off the a11y tree; only bots fill it. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-sm border border-accent bg-accent px-5 py-2.5 font-sans text-caption font-semibold text-paper transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 dark:border-accent-light dark:bg-accent-light dark:text-graphite"
        >
          {submitting ? 'Sending\u2026' : 'Send message'}
        </button>
        <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">
          Prefer email? Write to{' '}
          <a
            href={`mailto:${fallbackEmail}`}
            className="text-accent underline dark:text-accent-light"
          >
            {fallbackEmail}
          </a>
        </span>
      </div>

      {error && (
        <p role="alert" className="text-caption text-down dark:text-down-light">
          {error}
        </p>
      )}
    </form>
  )
}
