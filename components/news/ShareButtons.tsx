'use client'

import { useState } from 'react'
import { siteConfig } from '@/config/site'

/**
 * Article share buttons: X/Twitter, LinkedIn, and copy-link.
 *
 * Traffic-safe and privacy-friendly: these are plain share-intent links (no
 * third-party tracking scripts, no engagement-manipulation). Sharing sends a
 * reader's followers back TO the article, so it grows reach without leaking the
 * current reader away. The absolute URL is built from siteConfig.url so it
 * works regardless of where the component renders.
 */
export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const url = `${siteConfig.url}/news/${slug}`
  const text = encodeURIComponent(title)
  const enc = encodeURIComponent(url)

  const xHref = `https://twitter.com/intent/tweet?text=${text}&url=${enc}`
  const liHref = `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (e.g. insecure context) — silently ignore.
    }
  }

  const btn =
    'inline-flex items-center gap-1.5 rounded-sm border border-hairline px-3 py-1.5 text-caption font-semibold text-ink-body transition-colors hover:border-accent/40 hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-body dark:hover:text-accent-light'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-caption font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
        Share
      </span>
      <a href={xHref} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Share on X">
        <span aria-hidden="true" className="font-bold">𝕏</span>
        <span className="hidden sm:inline">Post</span>
      </a>
      <a href={liHref} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Share on LinkedIn">
        <span aria-hidden="true" className="font-bold">in</span>
        <span className="hidden sm:inline">Share</span>
      </a>
      <button type="button" onClick={copy} className={btn} aria-label="Copy link">
        <span aria-hidden="true">🔗</span>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}
