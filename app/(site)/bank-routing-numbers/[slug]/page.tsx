import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { banks, getBankBySlug, getAllBankSlugs } from '@/data/banks'
import { siteConfig } from '@/config/site'
import { RoutingNumberTable } from '@/components/banks/RoutingNumberTable'
import { BankMark } from '@/components/banks/BankMark'
import { Reveal } from '@/components/motion/Reveal'

interface BankPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllBankSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: BankPageProps): Metadata {
  const bank = getBankBySlug(params.slug)

  if (!bank) {
    return {
      title: 'Bank Not Found',
    }
  }

  const title = `${bank.name} Routing Numbers - ABA Routing Number Lookup`
  const description = `Find all ${bank.name} routing numbers by state. ${bank.routingNumbers.length} routing numbers for wire transfers, ACH payments, and direct deposits. Headquarters: ${bank.headquarters}.`

  return {
    title,
    description,
    alternates: { canonical: `/bank-routing-numbers/${bank.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/bank-routing-numbers/${bank.slug}`,
      type: 'website',
    },
  }
}

export default function BankPage({ params }: BankPageProps) {
  const bank = getBankBySlug(params.slug)

  if (!bank) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: bank.name,
    description: bank.description,
    url: bank.website,
    foundingDate: bank.founded.toString(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: bank.mainOffice.street,
      addressLocality: bank.mainOffice.city,
      addressRegion: bank.mainOffice.state,
      postalCode: bank.mainOffice.zip,
      addressCountry: 'US',
    },
    parentOrganization: {
      '@type': 'Organization',
      name: bank.name,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Bank Routing Numbers',
        item: `${siteConfig.url}/bank-routing-numbers`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: bank.name,
        item: `${siteConfig.url}/bank-routing-numbers/${bank.slug}`,
      },
    ],
  }

  // Find related banks (exclude current)
  const relatedBanks = banks
    .filter((b) => b.slug !== bank.slug)
    .slice(0, 4)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav
        className="border-b border-hairline bg-wash dark:border-hairline-dark dark:bg-graphite"
        aria-label="Breadcrumb"
      >
        <div className="container-page py-3">
          <ol className="flex items-center space-x-2 text-sm text-ink-muted dark:text-ink-inverse-muted">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-accent dark:hover:text-accent-light"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/bank-routing-numbers"
                className="transition-colors hover:text-accent dark:hover:text-accent-light"
              >
                Bank Routing Numbers
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-ink dark:text-white">
              {bank.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-page section-padding">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2">
            <Reveal>
              <span className="eyebrow">Reference</span>
              <div className="mt-1.5 flex items-center gap-4">
                <BankMark brand={bank.brand} size="lg" />
                <h1 className="page-title">
                  {bank.name} Routing Numbers
                </h1>
              </div>
              <p className="mt-4 text-lg text-ink-body dark:text-ink-inverse-body">
                {bank.description}
              </p>
            </Reveal>

            {/* Routing Number Table */}
            <div className="mt-8">
              <h2 className="mb-4 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                All Routing Numbers
              </h2>
              <RoutingNumberTable
                routingNumbers={bank.routingNumbers}
                bankName={bank.name}
              />
            </div>

            {/* Usage Info */}
            <div className="mt-10 rounded-2xl border border-hairline bg-surface p-6 dark:border-hairline-dark dark:bg-elevated">
              <h2 className="font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                How to Use {bank.name} Routing Numbers
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-ink-body dark:text-ink-inverse-body">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong>Direct Deposits:</strong> Use the electronic or paper
                    routing number for your state to set up payroll direct
                    deposit.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong>Wire Transfers:</strong> Use the wire routing number
                    for domestic wire transfers. International wires may require
                    a SWIFT code.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong>ACH Payments:</strong> Use the electronic routing
                    number to set up automatic bill payments and transfers.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong>Check Processing:</strong> The paper routing number is
                    printed on the bottom left of your checks.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="mt-8 lg:mt-0">
            <div className="rounded-2xl border border-hairline bg-surface p-6 dark:border-hairline-dark dark:bg-elevated">
              <h2 className="font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">Bank Details</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-ink-muted dark:text-ink-inverse-muted">
                    Registered main office
                  </dt>
                  {/* The charter's main office. Marked up as a postal address so
                      it can be copied or parsed, and kept visually distinct from
                      the parent company's corporate HQ below. */}
                  <dd className="mt-1 text-ink dark:text-ink-inverse">
                    <address className="not-italic leading-relaxed">
                      {bank.mainOffice.street}
                      <br />
                      {bank.mainOffice.city}, {bank.mainOffice.state}{' '}
                      <span className="tabular-nums">{bank.mainOffice.zip}</span>
                    </address>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-ink-muted dark:text-ink-inverse-muted">
                    Corporate headquarters
                  </dt>
                  <dd className="mt-1 text-ink dark:text-ink-inverse">
                    {bank.headquarters}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-ink-muted dark:text-ink-inverse-muted">
                    Founded
                  </dt>
                  <dd className="mt-1 text-ink dark:text-ink-inverse">
                    {bank.founded}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-ink-muted dark:text-ink-inverse-muted">
                    Website
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={bank.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent transition-colors hover:text-accent/80 dark:text-accent-light dark:hover:text-accent-light/80"
                    >
                      {bank.website.replace('https://', '').replace('www.', '')}
                    </a>
                  </dd>
                </div>
                {bank.wireInfoUrl && (
                  <div>
                    <dt className="font-medium text-ink-muted dark:text-ink-inverse-muted">
                      Official wire &amp; routing info
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={bank.wireInfoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent transition-colors hover:text-accent/80 dark:text-accent-light dark:hover:text-accent-light/80"
                      >
                        {bank.name} wire guidance
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="font-medium text-ink-muted dark:text-ink-inverse-muted">
                    Routing Numbers
                  </dt>
                  <dd className="mt-1 text-ink dark:text-ink-inverse">
                    {bank.routingNumbers.length} total
                  </dd>
                </div>
              </dl>

              {/*
                A corporate address is not a payment address. Someone landing on
                a routing-number page is often mid-transfer, so the distinction
                is stated where the address is read rather than buried in a
                site-wide disclaimer.
              */}
              <p className="mt-5 border-t border-hairline pt-4 text-caption leading-relaxed text-ink-muted dark:border-hairline-dark dark:text-ink-inverse-muted">
                <strong className="font-semibold text-ink dark:text-ink-inverse">
                  Do not use this address for a wire.
                </strong>{' '}
                Banks publish separate instructions for incoming transfers, and
                the correct address depends on the transfer type. Always confirm
                the routing number and address with {bank.name} before sending
                funds.
              </p>
              <p className="mt-3 text-caption leading-relaxed text-ink-muted dark:text-ink-inverse-muted">
                Address verified September 2026 against {bank.mainOffice.source}.
              </p>
            </div>

            {/* Related Banks */}
            <div className="mt-6 rounded-2xl border border-hairline bg-surface p-6 dark:border-hairline-dark dark:bg-elevated">
              <h2 className="font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">Other Banks</h2>
              <ul className="mt-4 space-y-3">
                {relatedBanks.map((relatedBank) => (
                  <li key={relatedBank.slug}>
                    <Link
                      href={`/bank-routing-numbers/${relatedBank.slug}`}
                      className="flex items-center gap-2.5 text-sm text-ink-body transition-colors hover:text-accent dark:text-ink-inverse-muted dark:hover:text-accent-light"
                    >
                      <BankMark brand={relatedBank.brand} size="sm" />
                      {relatedBank.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/bank-routing-numbers"
                className="mt-4 inline-flex items-center gap-1 text-eyebrow font-semibold uppercase text-accent transition-[gap] duration-150 hover:gap-2 motion-reduce:transform-none dark:text-accent-light"
              >
                View All Banks
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
