'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@/lib/sanity-queries'

/**
 * Long-form editorial typography.
 *
 * The measure, leading and vertical rhythm here are the main reason an article
 * reads as "premium" rather than as a page of text: generous line height, a
 * clear step between heading and body, and pull-quotes set in the serif with a
 * gilt rule instead of a heavy grey block.
 */
const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 font-serif text-display-3 font-bold leading-tight text-ink first:mt-0 dark:text-ink-inverse">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-9 font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-7 font-sans text-eyebrow font-semibold uppercase text-ink-muted dark:text-ink-inverse-muted">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-6 leading-[1.75] text-ink-body dark:text-ink-inverse-body">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-2 border-gold pl-6 font-serif text-display-4 font-medium italic leading-relaxed text-ink sm:pl-8 dark:border-gold-light dark:text-ink-inverse">
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
      <code className="bg-wash px-1.5 py-0.5 font-mono text-sm text-ink dark:bg-elevated dark:text-ink-inverse">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = value?.href || '#'
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          className="text-ink-body underline decoration-accent/40 decoration-1 underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent dark:text-ink-inverse-body dark:decoration-accent-light/40 dark:hover:text-accent-light"
          {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 space-y-3 text-ink-body dark:text-ink-inverse-body">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-3 pl-6 text-ink-body marker:font-semibold marker:text-gold dark:text-ink-inverse-body dark:marker:text-gold-light">
        {children}
      </ol>
    ),
  },
  listItem: {
    /* Custom gilt marker rather than a browser bullet. */
    bullet: ({ children }) => (
      <li className="relative pl-6 leading-[1.7] before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:bg-gold before:content-[''] dark:before:bg-gold-light">
        {children}
      </li>
    ),
    number: ({ children }) => <li className="leading-[1.7]">{children}</li>,
  },
}

interface PortableTextRendererProps {
  content: PortableTextBlock[]
  /** Suppress the opening drop cap (used where a body starts with a heading). */
  dropCap?: boolean
}

export function PortableTextRenderer({
  content,
  dropCap = true,
}: PortableTextRendererProps) {
  if (!content || content.length === 0) {
    return null
  }

  // Cast to match PortableText expected input type
  const portableTextValue = content as Parameters<typeof PortableText>[0]['value']

  return (
    <div className={`prose-custom ${dropCap ? '' : 'no-dropcap'}`}>
      <PortableText value={portableTextValue} components={components} />
    </div>
  )
}
