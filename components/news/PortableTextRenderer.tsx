'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@/lib/sanity-queries'

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-4 mt-8 font-serif text-2xl font-bold text-ink dark:text-ink-inverse">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-6 font-serif text-xl font-bold text-ink dark:text-ink-inverse">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-4 font-serif text-lg font-bold text-ink dark:text-ink-inverse">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-ink-body dark:text-ink-inverse-body">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-hairline pl-4 italic text-ink-body dark:border-hairline-dark dark:text-ink-inverse-muted">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink dark:text-ink-inverse">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    code: ({ children }) => (
      <code className="rounded bg-wash px-1.5 py-0.5 font-mono text-sm text-ink dark:bg-elevated dark:text-ink-inverse">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = value?.href || '#'
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          className="text-ink-body underline decoration-hairline underline-offset-2 transition-colors hover:text-oxblood hover:decoration-oxblood dark:text-ink-inverse-body dark:decoration-hairline-dark dark:hover:text-ink-inverse"
          {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-1 text-ink-body dark:text-ink-inverse-body">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1 text-ink-body dark:text-ink-inverse-body">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
}

interface PortableTextRendererProps {
  content: PortableTextBlock[]
}

export function PortableTextRenderer({ content }: PortableTextRendererProps) {
  if (!content || content.length === 0) {
    return null
  }

  // Cast to match PortableText expected input type
  const portableTextValue = content as Parameters<typeof PortableText>[0]['value']

  return (
    <div className="prose-custom">
      <PortableText value={portableTextValue} components={components} />
    </div>
  )
}
