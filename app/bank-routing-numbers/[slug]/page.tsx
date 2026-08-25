import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { banks, getBankBySlug, getAllBankSlugs } from '@/data/banks'
import { siteConfig } from '@/config/site'
import { RoutingNumberTable } from '@/components/banks/RoutingNumberTable'

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
      addressLocality: bank.headquarters.split(', ')[0],
      addressRegion: bank.headquarters.split(', ')[1],
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
        className="border-b border-brand-border-gray bg-brand-off-white dark:border-zinc-700 dark:bg-zinc-900"
        aria-label="Breadcrumb"
      >
        <div className="container-page py-3">
          <ol className="flex items-center space-x-2 text-sm text-brand-medium-gray dark:text-zinc-400">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-brand-near-black dark:hover:text-white"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/bank-routing-numbers"
                className="transition-colors hover:text-brand-near-black dark:hover:text-white"
              >
                Bank Routing Numbers
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-brand-near-black dark:text-white">
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {bank.name} Routing Numbers
            </h1>
            <p className="mt-4 text-lg text-brand-medium-gray dark:text-zinc-400">
              {bank.description}
            </p>

            {/* Routing Number Table */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold">
                All Routing Numbers
              </h2>
              <RoutingNumberTable routingNumbers={bank.routingNumbers} />
            </div>

            {/* Usage Info */}
            <div className="mt-10 rounded-lg border border-brand-border-gray bg-brand-off-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
              <h2 className="text-lg font-semibold">
                How to Use {bank.name} Routing Numbers
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-brand-dark-gray dark:text-zinc-300">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-zinc" />
                  <span>
                    <strong>Direct Deposits:</strong> Use the electronic or paper
                    routing number for your state to set up payroll direct
                    deposit.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-zinc" />
                  <span>
                    <strong>Wire Transfers:</strong> Use the wire routing number
                    for domestic wire transfers. International wires may require
                    a SWIFT code.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-zinc" />
                  <span>
                    <strong>ACH Payments:</strong> Use the electronic routing
                    number to set up automatic bill payments and transfers.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-zinc" />
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
            <div className="rounded-lg border border-brand-border-gray bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
              <h2 className="text-lg font-semibold">Bank Details</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-brand-medium-gray dark:text-zinc-400">
                    Headquarters
                  </dt>
                  <dd className="mt-1 text-brand-near-black dark:text-zinc-200">
                    {bank.headquarters}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-brand-medium-gray dark:text-zinc-400">
                    Founded
                  </dt>
                  <dd className="mt-1 text-brand-near-black dark:text-zinc-200">
                    {bank.founded}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-brand-medium-gray dark:text-zinc-400">
                    Website
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={bank.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-zinc transition-colors hover:text-brand-near-black dark:text-zinc-400 dark:hover:text-white"
                    >
                      {bank.website.replace('https://', '').replace('www.', '')}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-brand-medium-gray dark:text-zinc-400">
                    Routing Numbers
                  </dt>
                  <dd className="mt-1 text-brand-near-black dark:text-zinc-200">
                    {bank.routingNumbers.length} total
                  </dd>
                </div>
              </dl>
            </div>

            {/* Related Banks */}
            <div className="mt-6 rounded-lg border border-brand-border-gray bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
              <h2 className="text-lg font-semibold">Other Banks</h2>
              <ul className="mt-4 space-y-3">
                {relatedBanks.map((relatedBank) => (
                  <li key={relatedBank.slug}>
                    <Link
                      href={`/bank-routing-numbers/${relatedBank.slug}`}
                      className="text-sm text-brand-zinc transition-colors hover:text-brand-near-black dark:text-zinc-400 dark:hover:text-white"
                    >
                      {relatedBank.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/bank-routing-numbers"
                className="mt-4 inline-block text-sm font-medium text-brand-zinc transition-colors hover:text-brand-near-black dark:text-zinc-400 dark:hover:text-white"
              >
                View All Banks &rarr;
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
