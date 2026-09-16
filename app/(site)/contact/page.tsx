import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { ContactForm } from '@/components/contact/ContactForm'

/**
 * Contact page. A simple form (stored to Sanity via /api/contact) plus the
 * direct email address as a fallback. Kept lightweight and static; the form
 * itself is the only client component.
 */

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact',
  description:
    'Get in touch with Coinscribed. Questions, feedback, corrections, or partnership enquiries — send us a message and we will reply by email.',
  openGraph: {
    title: `Contact | ${siteConfig.name}`,
    description:
      'Get in touch with Coinscribed — questions, feedback, corrections, or partnership enquiries.',
    url: `${siteConfig.url}/contact`,
    type: 'website',
  },
}

export default function ContactPage() {
  const email = siteConfig.contactEmail

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="mb-3 font-serif text-3xl font-bold text-ink dark:text-ink-inverse sm:text-4xl">
          Contact us
        </h1>
        <p className="text-lg text-ink-body dark:text-ink-inverse-body">
          Questions, feedback, a correction to an article, or a partnership
          idea? Send a message below and we&apos;ll get back to you by email.
          You can also reach us directly at{' '}
          <a
            href={`mailto:${email}`}
            className="text-accent underline dark:text-accent-light"
          >
            {email}
          </a>
          .
        </p>
      </header>

      <ContactForm fallbackEmail={email} />

      <p className="mt-8 text-caption text-ink-muted dark:text-ink-inverse-muted">
        For privacy or legal requests, email{' '}
        <a
          href={`mailto:${email}`}
          className="text-accent underline dark:text-accent-light"
        >
          {email}
        </a>
        . Coinscribed provides general information only and does not offer
        personalized financial advice.
      </p>
    </main>
  )
}
