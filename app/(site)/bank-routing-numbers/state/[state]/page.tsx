import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { getStateRoutingData, getStatesWithData } from '@/data/banks'
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/schema-markup'
import { RoutingNumberTable } from '@/components/banks/RoutingNumberTable'
import { BankMark } from '@/components/banks/BankMark'
import { getBankBySlug } from '@/data/banks'
import { Reveal } from '@/components/motion/Reveal'

interface StatePageProps {
  params: { state: string }
}

/** Pre-render every state that has data. Unknown/empty states 404. */
export function generateStaticParams() {
  return getStatesWithData().map((s) => ({ state: s.state.slug }))
}

export const dynamicParams = false

export function generateMetadata({ params }: StatePageProps): Metadata {
  const data = getStateRoutingData(params.state)
  if (!data) return { title: 'State Not Found' }

  const { state, banks } = data
  const bankList = banks.map((b) => b.bankName).join(', ')
  const title = `${state.name} Bank Routing Numbers`
  const description = `ABA routing numbers for banks in ${state.name}, including ${bankList}. Verify routing numbers for wire transfers, ACH payments, and direct deposits.`

  return {
    title,
    description,
    alternates: { canonical: `/bank-routing-numbers/state/${state.slug}` },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/bank-routing-numbers/state/${state.slug}`,
      type: 'website',
    },
  }
}

export default function StatePage({ params }: StatePageProps) {
  const data = getStateRoutingData(params.state)
  if (!data) notFound()

  const { state, banks } = data
  const totalNumbers = banks.reduce((n, b) => n + b.routingNumbers.length, 0)

  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Bank Routing Numbers', url: `${siteConfig.url}/bank-routing-numbers` },
    { name: 'By State', url: `${siteConfig.url}/bank-routing-numbers/state` },
    { name: state.name, url: `${siteConfig.url}/bank-routing-numbers/state/${state.slug}` },
  ])

  const faqItems = [
    {
      question: `Which routing number do I use for a bank in ${state.name}?`,
      answer: `Your routing number is tied to the state where you opened your account, not simply where you live now. Find your bank below and use the number listed for ${state.name}, and confirm it against a cheque or your bank before sending funds. Wire transfers often use a different number from ACH and direct deposit.`,
    },
    {
      question: `Is a bank's routing number the same across every state?`,
      answer: `No. Large banks use different routing numbers by region because of how they grew through mergers. A number that is correct for an account opened in ${state.name} may be wrong for the same bank in another state.`,
    },
    {
      question: `What is the difference between the paper, electronic, and wire numbers?`,
      answer: `The paper number is printed on your cheques and used for cheque clearing; the electronic (ACH) number is used for direct deposit and automatic payments; the wire number is used for same-day domestic wire transfers. Using the wrong type can delay or reject a transfer.`,
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqItems)) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="hairline-b"
      >
        <div className="container-page py-4 text-caption text-ink-muted dark:text-ink-inverse-muted">
          <Link href="/" className="transition-colors hover:text-accent dark:hover:text-accent-light">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/bank-routing-numbers"
            className="transition-colors hover:text-accent dark:hover:text-accent-light"
          >
            Bank Routing Numbers
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/bank-routing-numbers/state"
            className="transition-colors hover:text-accent dark:hover:text-accent-light"
          >
            By State
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink dark:text-ink-inverse">{state.name}</span>
        </div>
      </nav>

      <section className="hairline-b">
        <div className="container-page section-padding">
          <Reveal className="max-w-3xl">
            <span className="eyebrow">Reference</span>
            <h1 className="page-title mt-1.5">
              {state.name} Bank Routing Numbers
            </h1>
            <p className="mt-4 text-lg text-ink-body dark:text-ink-inverse-body">
              ABA routing numbers for {banks.length} major bank
              {banks.length !== 1 ? 's' : ''} in {state.name} — {totalNumbers}{' '}
              number{totalNumbers !== 1 ? 's' : ''} in total. Use these for wire
              transfers, ACH payments, and direct deposits, and always confirm
              with your bank before initiating a transfer.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container-page section-padding space-y-12">
          {banks.map((b) => {
            const bank = getBankBySlug(b.bankSlug)
            return (
              <div key={b.bankSlug}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {bank && <BankMark brand={bank.brand} size="md" />}
                    <h2 className="font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">
                      {b.bankName}
                    </h2>
                  </div>
                  <Link
                    href={`/bank-routing-numbers/${b.bankSlug}`}
                    className="link-more shrink-0"
                  >
                    All {b.bankName}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
                <RoutingNumberTable
                  routingNumbers={b.routingNumbers}
                  bankName={b.bankName}
                />
              </div>
            )
          })}

          {/* Cross-links: sibling states for discovery + crawl depth. */}
          <div className="hairline-t pt-8">
            <span className="eyebrow">Other states</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {getStatesWithData()
                .filter((s) => s.state.code !== state.code)
                .map((s) => (
                  <Link
                    key={s.state.code}
                    href={`/bank-routing-numbers/state/${s.state.slug}`}
                    className="rounded-md border border-hairline px-3 py-1.5 text-caption text-ink-body transition-colors hover:border-accent/40 hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-body dark:hover:border-accent-light/40 dark:hover:text-accent-light"
                  >
                    {s.state.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
