'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { CurrencySelect } from './CurrencySelect'

interface CalculatorLayoutProps {
  title: string
  description: string
  children: ReactNode
  results?: ReactNode
  educationalContent?: ReactNode
  jsonLd?: object
}

export function CalculatorLayout({
  title,
  description,
  children,
  results,
  educationalContent,
  jsonLd,
}: CalculatorLayoutProps) {
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="hairline-b">
        <div className="container-page py-8 sm:py-12">
          <nav className="mb-4 text-caption text-ink-muted dark:text-ink-inverse-muted">
            <Link
              href="/"
              className="transition-colors hover:text-accent dark:hover:text-accent-light"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/calculators"
              className="transition-colors hover:text-accent dark:hover:text-accent-light"
            >
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink dark:text-ink-inverse">
              {title}
            </span>
          </nav>
          <span className="text-eyebrow font-semibold uppercase text-accent dark:text-accent-light">
            Calculator
          </span>
          <h1 className="page-title mt-1.5">{title}</h1>
          <p className="mt-3 max-w-2xl text-ink-body dark:text-ink-inverse-body">
            {description}
          </p>
        </div>
      </div>

      <div className="container-page py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form Area */}
          <div className="rounded-2xl border border-hairline bg-surface p-6 dark:border-hairline-dark dark:bg-elevated">
            <h2 className="mb-6 flex items-center font-serif text-display-3 font-bold">
              <span className="mr-3 h-6 w-0.5 rounded-full bg-accent-gradient" />
              Input Details
            </h2>
            {/*
              Currency leads the form. It is the unit every field below is
              entered in, so it belongs with the inputs rather than up beside the
              page title — and reading it first tells you what the fields mean.
            */}
            <div className="mb-5 border-b border-hairline pb-5 dark:border-hairline-dark">
              <CurrencySelect />
            </div>
            {children}
          </div>

          {/* Results Area */}
          <div className="rounded-2xl border border-hairline bg-surface p-6 dark:border-hairline-dark dark:bg-elevated">
            <h2 className="mb-6 flex items-center font-serif text-display-3 font-bold">
              <span className="mr-3 h-6 w-0.5 rounded-full bg-accent-gradient" />
              Results
            </h2>
            {results || (
              <p className="text-ink-muted dark:text-ink-inverse-muted">
                Enter your details and click calculate to see results.
              </p>
            )}
          </div>
        </div>

        {/* Educational Content */}
        {educationalContent && (
          <div className="mt-12 rounded-2xl border border-hairline bg-wash p-6 dark:border-hairline-dark dark:bg-elevated sm:p-8">
            {educationalContent}
          </div>
        )}

        {/*
          The disclaimer sits with the results, not only on a linked page. Someone
          about to act on a figure should read the caveat where they read the
          figure.
        */}
        <aside className="mt-8 border-t border-hairline pt-6 dark:border-hairline-dark">
          <p className="eyebrow">Important</p>
          <p className="mt-2 text-caption leading-relaxed text-ink-muted dark:text-ink-inverse-muted">
            This calculator is provided for general information and education
            only and is <strong>not</strong> financial, investment, tax, or legal
            advice. Results are estimates produced from the figures you enter and
            are not a quotation, an offer of credit, or a guarantee. They
            generally exclude fees, taxes, insurance, rate changes, inflation,
            and eligibility limits, so an actual figure from a provider may
            differ materially. Selecting a currency changes the unit only — no
            amount is converted. Speak to a licensed professional before making
            a decision. See our{' '}
            <Link href="/disclaimer" className="link-accent">
              full disclaimer
            </Link>
            .
          </p>
        </aside>
      </div>
    </>
  )
}
