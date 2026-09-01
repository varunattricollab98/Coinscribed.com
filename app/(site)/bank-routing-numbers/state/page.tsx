import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { getStatesWithData } from '@/data/banks'
import { generateBreadcrumbSchema } from '@/lib/schema-markup'
import { Reveal } from '@/components/motion/Reveal'

export const metadata: Metadata = {
  title: 'Bank Routing Numbers by State',
  description:
    'Find bank routing numbers by US state. Browse ABA routing numbers for major banks in your state for wire transfers, ACH payments, and direct deposits.',
  alternates: { canonical: '/bank-routing-numbers/state' },
  openGraph: {
    title: `Bank Routing Numbers by State | ${siteConfig.name}`,
    description:
      'Find bank routing numbers by US state for major US banks.',
    url: `${siteConfig.url}/bank-routing-numbers/state`,
    type: 'website',
  },
}

export default function StateIndexPage() {
  const states = getStatesWithData()

  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Bank Routing Numbers', url: `${siteConfig.url}/bank-routing-numbers` },
    { name: 'By State', url: `${siteConfig.url}/bank-routing-numbers/state` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="hairline-b">
        <div className="container-page section-padding">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Reference</span>
            <h1 className="page-title mt-1.5">Routing Numbers by State</h1>
            <p className="mt-4 text-lg text-ink-body dark:text-ink-inverse-body">
              Choose your state to see ABA routing numbers for major US banks
              there — for wire transfers, ACH payments, and direct deposits.
              Always confirm a number with your bank before sending funds.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container-page section-padding">
          <nav aria-label="States" className="rule-grid sm:grid-cols-2 lg:grid-cols-3">
            {states.map((s) => (
              <Link
                key={s.state.code}
                href={`/bank-routing-numbers/state/${s.state.slug}`}
                className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-wash dark:hover:bg-wash-dark"
              >
                <span>
                  <span className="block font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                    <span className="title-link">{s.state.name}</span>
                  </span>
                  <span className="mt-0.5 block text-caption text-ink-muted dark:text-ink-inverse-muted">
                    {s.bankCount} bank{s.bankCount !== 1 ? 's' : ''} &middot;{' '}
                    {s.routingNumberCount} routing number
                    {s.routingNumberCount !== 1 ? 's' : ''}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-ink-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent dark:group-hover:text-accent-light"
                >
                  &rarr;
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  )
}
