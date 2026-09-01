import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import { Reveal } from '@/components/motion/Reveal'
import { LineIcon, type LineIconName } from '@/components/icons/LineIcon'

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
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

const coverage: {
  title: string
  description: string
  href: string
  icon: LineIconName
}[] = [
  {
    title: 'Crypto',
    description:
      'Bitcoin, Ethereum, DeFi, and blockchain coverage focused on what moves the market, not the noise.',
    href: '/news/category/crypto',
    icon: 'coins',
  },
  {
    title: 'Economy',
    description:
      'Macroeconomic reporting on inflation, employment, GDP, and the fiscal and monetary decisions that shape them.',
    href: '/news/category/economy',
    icon: 'globe',
  },
  {
    title: 'Markets',
    description:
      'Equities, bonds, commodities, and forex analysis for readers who need signal over spectacle.',
    href: '/news/category/markets',
    icon: 'bars',
  },
  {
    title: 'Banking',
    description:
      'Banking, fintech, and regulation reporting, alongside a reference library of US bank routing numbers.',
    href: '/news/category/banking',
    icon: 'bank',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Masthead */}
      <div className="relative overflow-hidden border-b border-hairline bg-hero-radial dark:border-hairline-dark dark:bg-hero-radial-dark">
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
          <Reveal className="section-header mb-8">
            <div>
              <span className="eyebrow">Coverage</span>
              <h2 className="section-title mt-1.5">What we cover</h2>
            </div>
            <Link href="/news" className="link-accent hidden sm:inline-block">
              Read the newsroom &rarr;
            </Link>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {coverage.map((topic, i) => (
              <Reveal key={topic.href} delay={i * 0.05}>
                <Link
                  href={topic.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 motion-reduce:transform-none dark:border-hairline-dark dark:bg-elevated dark:hover:border-accent-light/40"
                >
                  {/* Soft accent glow on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/0 blur-2xl transition-colors duration-300 group-hover:bg-accent/10"
                  />
                  {/* Gradient icon badge */}
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-sm">
                    <LineIcon name={topic.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
                    <span className="title-link">{topic.title}</span>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-body dark:text-ink-inverse-body">
                    {topic.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-eyebrow font-semibold uppercase text-accent transition-transform duration-150 group-hover:gap-2 motion-reduce:transform-none dark:text-accent-light">
                    Explore {topic.title}
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              </Reveal>
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
