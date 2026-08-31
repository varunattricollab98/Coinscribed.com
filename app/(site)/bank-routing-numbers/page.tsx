import type { Metadata } from 'next'
import { banks } from '@/data/banks'
import { siteConfig } from '@/config/site'
import { BankSearch } from '@/components/banks/BankSearch'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'US Bank Routing Numbers - Find ABA Routing Numbers',
  description:
    'Find routing numbers for all major US banks including Chase, Bank of America, Wells Fargo, Citibank, Capital One, and more. Verify ABA routing numbers for wire transfers, ACH, and direct deposits.',
  openGraph: {
    title: 'US Bank Routing Numbers - Find ABA Routing Numbers',
    description:
      'Find routing numbers for all major US banks. Verify ABA routing numbers for wire transfers, ACH payments, and direct deposits.',
    url: `${siteConfig.url}/bank-routing-numbers`,
    type: 'website',
  },
}

export default function BankRoutingNumbersPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'US Bank Routing Numbers',
    description:
      'Complete directory of routing numbers for major US banks. Find ABA routing numbers for wire transfers, ACH payments, and direct deposits.',
    url: `${siteConfig.url}/bank-routing-numbers`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: banks.map((bank, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: bank.name,
        url: `${siteConfig.url}/bank-routing-numbers/${bank.slug}`,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
                className="transition-colors hover:text-oxblood dark:hover:text-oxblood-lighter"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-ink dark:text-white">
              Bank Routing Numbers
            </li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <section className="hairline-b">
        <div className="container-page section-padding">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Reference</span>
            <h1 className="page-title mt-1.5">
              US Bank Routing Numbers
            </h1>
            <p className="mt-4 text-lg text-ink-body dark:text-ink-inverse-body">
              Find and verify ABA routing numbers for major US banks. Use these
              numbers for wire transfers, ACH payments, direct deposits, and
              electronic transactions.
            </p>
          </div>
        </div>
      </section>

      {/* Bank Grid with Search */}
      <section className="bg-wash dark:bg-graphite">
        <div className="container-page section-padding">
          <BankSearch banks={banks} />
        </div>
      </section>

      {/* Info Section */}
      <section className="border-t border-hairline dark:border-hairline-dark">
        <div className="container-page section-padding">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold">
              What is a Routing Number?
            </h2>
            <p className="mt-4 text-ink-body dark:text-ink-inverse-body">
              A routing number (also known as an ABA routing number or routing
              transit number) is a nine-digit code used to identify the financial
              institution in a transaction. Routing numbers are used for direct
              deposits, wire transfers, bill payments, and other electronic
              transactions.
            </p>
            <h3 className="mt-6 text-lg font-semibold">
              Types of Routing Numbers
            </h3>
            <ul className="mt-3 space-y-2 text-ink-body dark:text-ink-inverse-body">
              <li className="flex items-start">
                <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-oxblood" />
                <span>
                  <strong>Paper (ACH):</strong> Used for check processing and
                  paper transactions
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-oxblood" />
                <span>
                  <strong>Electronic (ACH):</strong> Used for electronic
                  transfers like direct deposits and online bill pay
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-oxblood" />
                <span>
                  <strong>Wire:</strong> Used specifically for domestic and
                  international wire transfers
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
