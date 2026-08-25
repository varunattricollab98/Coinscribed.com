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
      <div className="border-b border-brand-border-gray bg-gradient-to-r from-teal-pale/30 to-white dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-900">
        <div className="container-page py-8 sm:py-12">
          <nav className="mb-4 text-sm text-brand-medium-gray dark:text-zinc-400">
            <Link
              href="/"
              className="transition-colors hover:text-teal-primary dark:hover:text-teal-medium"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/calculators"
              className="transition-colors hover:text-teal-primary dark:hover:text-teal-medium"
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
          <div className="rounded-xl border border-brand-border-gray bg-white p-6 shadow-card dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="mb-6 flex items-center text-xl font-semibold">
              <span className="mr-2 inline-block h-5 w-1 rounded-full bg-teal-primary" />
              Input Details
            </h2>
            {children}
          </div>

          {/* Results Area */}
          <div className="rounded-xl border border-brand-border-gray bg-white p-6 shadow-card dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="mb-6 flex items-center text-xl font-semibold">
              <span className="mr-2 inline-block h-5 w-1 rounded-full bg-teal-primary" />
              Results
            </h2>
            {results || (
              <p className="text-brand-medium-gray dark:text-zinc-400">
                Enter your details and click calculate to see results.
              </p>
            )}
          </div>
        </div>

        {/* Educational Content */}
        {educationalContent && (
          <div className="mt-12 rounded-xl border border-brand-border-gray bg-brand-off-white p-6 shadow-card sm:p-8 dark:border-zinc-700 dark:bg-zinc-900">
            {educationalContent}
          </div>
        )}
      </div>
    </>
  )
}
