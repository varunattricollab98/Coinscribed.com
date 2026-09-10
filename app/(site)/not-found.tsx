import type { Metadata } from 'next'
import Link from 'next/link'

/**
 * Branded 404 page.
 *
 * Rendered inside the (site) layout, so it keeps the header, footer, search and
 * navigation — turning a dead end into a helpful hand-off back into the site.
 * Covers mistyped URLs and any `notFound()` call (bad article slug, deleted CMS
 * content, unknown bank, etc.). Not indexable.
 */
export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
}

const quickLinks: { title: string; description: string; href: string }[] = [
  {
    title: 'Latest News',
    description: 'Personal finance, banking, and market explainers.',
    href: '/news',
  },
  {
    title: 'Calculators',
    description: 'Free tools for mortgages, savings, loans, and retirement.',
    href: '/calculators',
  },
  {
    title: 'Markets Today',
    description: 'A quick read on how the major markets are moving.',
    href: '/markets',
  },
  {
    title: 'Bank Routing Numbers',
    description: 'Look up ABA routing numbers for major US banks.',
    href: '/bank-routing-numbers',
  },
]

export default function NotFound() {
  return (
    <section className="hairline-b">
      <div className="container-page section-padding">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow-royal">Error 404</span>
          <h1 className="mt-3 font-serif text-display-1 font-bold text-ink dark:text-ink-inverse">
            This page could not be found
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-ink-body dark:text-ink-inverse-body">
            The page you&rsquo;re looking for may have moved, been renamed, or
            never existed. Let&rsquo;s get you back on track.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-sm bg-accent px-5 py-3 font-sans text-sm font-semibold text-surface transition-colors hover:bg-accent-hover"
            >
              Back to homepage
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center justify-center rounded-sm border border-hairline px-5 py-3 font-sans text-sm font-semibold text-ink-body transition-colors hover:border-accent hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-body dark:hover:border-accent-light dark:hover:text-accent-light"
            >
              Browse articles
            </Link>
          </div>
        </div>

        {/* Helpful destinations, so the 404 is a hand-off rather than a dead end. */}
        <div className="mx-auto mt-14 grid max-w-3xl gap-px overflow-hidden rounded-sm border border-hairline bg-hairline sm:grid-cols-2 dark:border-hairline-dark dark:bg-hairline-dark">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-1 bg-surface p-6 transition-colors hover:bg-wash dark:bg-elevated dark:hover:bg-wash-dark"
            >
              <span className="flex items-center gap-2 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                {link.title}
                <span
                  aria-hidden="true"
                  className="text-accent transition-transform duration-150 group-hover:translate-x-0.5 dark:text-accent-light"
                >
                  &rarr;
                </span>
              </span>
              <span className="text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                {link.description}
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-caption text-ink-muted dark:text-ink-inverse-muted">
          Tip: press{' '}
          <kbd className="rounded border border-hairline px-1.5 py-0.5 font-sans text-[0.7rem] dark:border-hairline-dark">
            Ctrl
          </kbd>{' '}
          +{' '}
          <kbd className="rounded border border-hairline px-1.5 py-0.5 font-sans text-[0.7rem] dark:border-hairline-dark">
            K
          </kbd>{' '}
          anywhere on the site to search.
        </p>
      </div>
    </section>
  )
}
