'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

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
              className="transition-colors hover:text-oxblood dark:hover:text-oxblood-lighter"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/calculators"
              className="transition-colors hover:text-oxblood dark:hover:text-oxblood-lighter"
            >
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink dark:text-ink-inverse">
              {title}
            </span>
          </nav>
          <h1 className="page-title">{title}</h1>
          <p className="mt-3 max-w-2xl text-ink-body dark:text-ink-inverse-body">
            {description}
          </p>
        </div>
      </div>

      <div className="container-page py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form Area */}
          <div className="panel">
            <h2 className="mb-6 flex items-center font-serif text-display-3 font-bold">
              <span className="accent-rule mr-3 !h-6 !w-0.5" />
              Input Details
            </h2>
            {children}
          </div>

          {/* Results Area */}
          <div className="panel">
            <h2 className="mb-6 flex items-center font-serif text-display-3 font-bold">
              <span className="accent-rule mr-3 !h-6 !w-0.5" />
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
          <div className="mt-12 panel-muted sm:p-8">{educationalContent}</div>
        )}
      </div>
    </>
  )
}
