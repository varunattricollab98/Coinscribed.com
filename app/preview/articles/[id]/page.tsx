'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAdminClient } from '@/lib/sanity-admin'
import type { Article } from '@/lib/sanity-queries'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { ArticleView } from '@/components/news/ArticleView'

/**
 * GROQ projection for a single article, mirroring `articleFullFields` in
 * lib/sanity-queries.ts field-for-field so the resolved object satisfies the
 * `Article` type that <ArticleView> consumes (author/category references and
 * image assets resolved to the same shape the public page renders).
 *
 * It prefers the DRAFT document (`drafts.<id>`) and falls back to the published
 * one, so an unpublished draft renders. Reading a draft is only possible with
 * the per-user session token that getAdminClient() attaches IN THE BROWSER —
 * which is exactly why this route is a client component (see file header).
 */
const PREVIEW_QUERY = `coalesce(*[_id == $draftId][0], *[_id == $id][0]){
  _id,
  title,
  slug,
  excerpt,
  body,
  publishedAt,
  "imageUrl": mainImage.asset->url,
  "readingTime": round(length(pt::text(body)) / 5 / 200),
  seoTitle,
  seoDescription,
  faqs,
  "author": author->{ _id, name, slug, bio, jobTitle, credentials, sameAs, "imageUrl": image.asset->url },
  "category": category->{ _id, title, slug, description }
}`

type PreviewState =
  | { status: 'loading' }
  | { status: 'ready'; article: Article }
  | { status: 'incomplete'; article: Article }
  | { status: 'missing' }
  | { status: 'error' }

/**
 * Draft-preview route.
 *
 * Why a client component: the browser-only auth model means only
 * getAdminClient() (per-user session token in sessionStorage) can read Sanity
 * drafts. A server component has no access to the logged-in user's session and
 * could never read `drafts.<id>`. Gating with <AdminAuthGate> reuses the exact
 * sign-in screen and session verification used across /admin, so an
 * unauthenticated visitor sees "Sign in to continue" rather than the draft, and
 * only an authorized Sanity user can load it. The /preview segment is marked
 * noindex by app/preview/layout.tsx (a server file); no generateMetadata lives
 * here because that is server-only.
 */
export default function PreviewArticlePage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <AdminAuthGate>
      <PreviewInner id={decodeURIComponent(params.id)} />
    </AdminAuthGate>
  )
}

function PreviewInner({ id }: { id: string }) {
  const [state, setState] = useState<PreviewState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    getAdminClient()
      .fetch<Article | null>(PREVIEW_QUERY, {
        id,
        draftId: `drafts.${id}`,
      })
      .then((article) => {
        if (!active) return
        if (!article) {
          setState({ status: 'missing' })
          return
        }
        // ArticleView reads article.category.title/slug (and the byline reads
        // author), which are required fields the editor enforces before publish
        // — but a raw draft-save may omit them. Surface an actionable message
        // instead of crashing when category is absent.
        if (!article.category) {
          setState({ status: 'incomplete', article })
          return
        }
        setState({ status: 'ready', article })
      })
      .catch(() => {
        if (!active) return
        setState({ status: 'error' })
      })
    return () => {
      active = false
    }
  }, [id])

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-graphite">
        <div className="flex flex-col items-center gap-4">
          <span
            className="h-8 w-8 animate-spin rounded-full border-2 border-hairline border-t-accent dark:border-hairline-dark dark:border-t-accent-light"
            aria-hidden="true"
          />
          <p className="text-caption text-ink-muted dark:text-ink-inverse-muted">
            Loading draft preview&hellip;
          </p>
        </div>
      </div>
    )
  }

  if (state.status === 'missing' || state.status === 'error') {
    return (
      <PreviewMessage
        eyebrow="Preview unavailable"
        heading="Draft not found"
        body="Draft not found, or you do not have access to it. Save the draft in the editor, then try Preview again."
        note="If you are signed in and the draft still will not load, your Sanity account may not be permitted to read it. Ask a project admin to grant you the Editor or Administrator role."
      />
    )
  }

  if (state.status === 'incomplete') {
    return (
      <PreviewMessage
        eyebrow="Incomplete draft"
        heading="Add a category before previewing"
        body="This draft is missing a category (and possibly an author). Those are required before an article can be published and before it can be previewed as it will appear live. Set a category and author in the editor, save the draft, then try Preview again."
        note="The preview renders the article exactly as the public page does, which requires the same fields the public page relies on."
      />
    )
  }

  const { article } = state
  return (
    <>
      {/* Draft-preview banner: preview-only, never on the public page. */}
      <div className="border-b border-gold bg-gold-soft px-6 py-3 dark:border-gold-light dark:bg-gold/10">
        <div className="container-page">
          <p className="eyebrow-royal">Draft preview</p>
          <p className="mt-1 text-caption leading-relaxed text-ink-body dark:text-ink-inverse-body">
            Draft preview &mdash; not published. This is how the article will
            appear once live.
          </p>
        </div>
      </div>
      <ArticleView article={article} authorSlug={article.author?.slug?.current} />
    </>
  )
}

/**
 * Shared actionable message block for the preview's error / not-found /
 * incomplete states. Styling mirrors the /admin messaging patterns.
 */
function PreviewMessage({
  eyebrow,
  heading,
  body,
  note,
}: {
  eyebrow: string
  heading: string
  body: string
  note: string
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 dark:bg-graphite">
      <div className="w-full max-w-md rounded-sm border border-hairline bg-surface p-8 dark:border-hairline-dark dark:bg-elevated">
        <p className="font-sans text-eyebrow font-semibold uppercase tracking-wide text-gold dark:text-gold-light">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">
          {heading}
        </h1>
        <p className="mt-3 leading-relaxed text-ink-body dark:text-ink-inverse-body">
          {body}
        </p>
        <p className="mt-4 text-caption text-ink-muted dark:text-ink-inverse-muted">
          {note}
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex w-full items-center justify-center rounded-sm bg-accent px-5 py-3 font-sans text-sm font-semibold text-surface transition-colors hover:bg-accent-hover"
        >
          Back to Admin
        </Link>
      </div>
    </div>
  )
}
