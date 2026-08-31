import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Coinscribed is your trusted source for financial intelligence: crypto and market news, financial calculators, and US bank routing references built for informed decisions.',
  openGraph: {
    title: `About | ${siteConfig.name}`,
    description:
      'Coinscribed is your trusted source for financial intelligence: crypto and market news, financial calculators, and US bank routing references.',
    url: `${siteConfig.url}/about`,
    type: 'website',
  },
}

const coverage: { title: string; description: string; href: string }[] = [
  {
    title: 'Crypto',
    description:
      'Bitcoin, Ethereum, DeFi, and blockchain coverage focused on what moves the market, not the noise.',
    href: '/news/category/crypto',
  },
  {
    title: 'Economy',
    description:
      'Macroeconomic reporting on inflation, employment, GDP, and the fiscal and monetary decisions that shape them.',
    href: '/news/category/economy',
  },
  {
    title: 'Markets',
    description:
      'Equities, bonds, commodities, and forex analysis for readers who need signal over spectacle.',
    href: '/news/category/markets',
  },
  {
    title: 'Banking',
    description:
      'Banking, fintech, and regulation reporting, alongside a reference library of US bank routing numbers.',
    href: '/news/category/banking',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Masthead */}
      <div className="hairline-b">
        <div className="container-page py-12 sm:py-16">
          <span className="eyebrow-accent">About Coinscribed</span>
          <h1 className="page-title mt-2 max-w-3xl">{siteConfig.tagline}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-body dark:text-ink-inverse-body">
            {siteConfig.description}
          </p>
        </div>
      </div>

      {/* Editorial statement */}
      <div className="hairline-b">
        <div className="container-page section-padding">
          <div className="section-header mb-6">
            <div>
              <span className="eyebrow">Our approach</span>
              <h2 className="section-title mt-1.5">Intelligence, not noise</h2>
            </div>
          </div>
          <div className="container-prose">
            <p className="text-base leading-relaxed text-ink-body dark:text-ink-inverse-body">
              Coinscribed exists to help readers make informed financial
              decisions. We treat finance the way a newsroom treats a beat:
              carefully reported, plainly written, and free of hype. Whether the
              subject is a Federal Reserve decision, a moving crypto market, or
              the mechanics of a mortgage, our aim is the same &mdash; give you
              the facts and the tools, then get out of your way.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-body dark:text-ink-inverse-body">
              Alongside our reporting, we build practical calculators for
              mortgages, retirement, compound interest, and loans, and we
              maintain a reference library of US bank routing numbers. Everything
              we publish is for informational purposes only and is not financial
              advice.
            </p>
          </div>
        </div>
      </div>

      {/* What we cover */}
      <div className="hairline-b">
        <div className="container-page section-padding">
          <div className="section-header mb-8">
            <div>
              <span className="eyebrow">Coverage</span>
              <h2 className="section-title mt-1.5">What we cover</h2>
            </div>
            <Link href="/news" className="link-accent hidden sm:inline-block">
              Read the newsroom &rarr;
            </Link>
          </div>
          <div className="rule-grid sm:grid-cols-2">
            {coverage.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="group rule-cell-hover flex flex-col px-5 py-6 sm:px-6"
              >
                <span className="eyebrow-accent">{topic.title}</span>
                <p className="mt-2 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                  {topic.description}
                </p>
                <span className="eyebrow-accent mt-4 inline-block">
                  Explore {topic.title} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="container-page section-padding">
        <NewsletterSignup />
      </div>
    </>
  )
}
