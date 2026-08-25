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
      <div className="border-b border-brand-border-gray bg-brand-off-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="container-page py-8 sm:py-12">
          <nav className="mb-4 text-sm text-brand-medium-gray dark:text-zinc-400">
            <Link
              href="/"
              className="transition-colors hover:text-brand-near-black dark:hover:text-white"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/calculators"
              className="transition-colors hover:text-brand-near-black dark:hover:text-white"
            >
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <span className="text-brand-near-black dark:text-zinc-100">
              {title}
            </span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-brand-medium-gray dark:text-zinc-400">
            {description}
          </p>
        </div>
      </div>

      <div className="container-page py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form Area */}
          <div className="rounded-lg border border-brand-border-gray bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="mb-6 text-xl font-semibold">Input Details</h2>
            {children}
          </div>

          {/* Results Area */}
          <div className="rounded-lg border border-brand-border-gray bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="mb-6 text-xl font-semibold">Results</h2>
            {results || (
              <p className="text-brand-medium-gray dark:text-zinc-400">
                Enter your details and click calculate to see results.
              </p>
            )}
          </div>
        </div>

        {/* Educational Content */}
        {educationalContent && (
          <div className="mt-12 rounded-lg border border-brand-border-gray bg-brand-off-white p-6 sm:p-8 dark:border-zinc-700 dark:bg-zinc-900">
            {educationalContent}
          </div>
        )}
      </div>
    </>
  )
}
