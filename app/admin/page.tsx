'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { adminSanityClient } from '@/lib/sanity-admin'
import type { AdminArticleListItem } from '@/lib/admin-types'

/**
 * Raw row shape returned by the dashboard GROQ query. `_id` distinguishes a
 * draft (`drafts.<id>`) from a published document.
 */
interface RawArticleRow {
  _id: string
  title?: string
  slug?: string
  publishedAt?: string
  _updatedAt?: string
  category?: string
  author?: string
}

// Fetch both published documents and drafts. Sanity stores drafts as separate
// documents whose ids are prefixed with `drafts.`; the authenticated client
// (session cookie) is allowed to read drafts, the public read client is not.
const ARTICLES_QUERY = `*[_type=='article']|order(_updatedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  _updatedAt,
  "category": category->title,
  "author": author->name
}`

function formatDate(value?: string): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * The published id for a document. A draft's id is `drafts.<id>`; stripping the
 * prefix yields the id the edit route uses so a draft and its published version
 * do not appear as two rows.
 */
function baseId(id: string): string {
  return id.startsWith('drafts.') ? id.slice('drafts.'.length) : id
}

export default function AdminDashboardPage() {
  const [rows, setRows] = useState<RawArticleRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    adminSanityClient
      .fetch<RawArticleRow[]>(ARTICLES_QUERY)
      .then((result) => {
        if (!active) return
        setRows(Array.isArray(result) ? result : [])
      })
      .catch(() => {
        if (!active) return
        setError('Could not load articles. Check your Sanity permissions.')
        setRows([])
      })
    return () => {
      active = false
    }
  }, [])

  // Collapse draft + published pairs into one row per article, preferring the
  // draft (most recent edit) when both exist, and flag drafts for the badge.
  const items = useMemo<AdminArticleListItem[]>(() => {
    if (!rows) return []
    const byBase = new Map<string, AdminArticleListItem>()

    for (const row of rows) {
      const isDraft = row._id.startsWith('drafts.')
      const id = baseId(row._id)
      const existing = byBase.get(id)
      // Prefer the draft version when a document has both.
      if (!existing || isDraft) {
        byBase.set(id, {
          _id: row._id,
          title: row.title,
          slug: row.slug,
          publishedAt: row.publishedAt,
          _updatedAt: row._updatedAt,
          category: row.category,
          author: row.author,
          isDraft: existing ? existing.isDraft && isDraft : isDraft,
        })
      } else if (existing && isDraft === false) {
        existing.isDraft = existing._id.startsWith('drafts.')
      }
    }

    return Array.from(byBase.values()).sort((a, b) => {
      const at = a._updatedAt ? Date.parse(a._updatedAt) : 0
      const bt = b._updatedAt ? Date.parse(b._updatedAt) : 0
      return bt - at
    })
  }, [rows])

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-display-2 font-bold text-ink dark:text-ink-inverse">
            Articles
          </h1>
          <p className="mt-1 text-caption text-ink-muted dark:text-ink-inverse-muted">
            Every article in the dataset, including unpublished drafts.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center rounded-sm bg-accent px-4 py-2.5 font-sans text-sm font-semibold text-surface transition-colors hover:bg-accent-hover"
        >
          New Article
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-sm border border-down/40 bg-down/5 px-4 py-3 text-sm text-down dark:text-down-light">
          {error}
        </p>
      )}

      {rows === null && !error && (
        <div className="mt-10 flex items-center gap-3 text-ink-muted dark:text-ink-inverse-muted">
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-hairline border-t-accent dark:border-hairline-dark dark:border-t-accent-light"
            aria-hidden="true"
          />
          <span className="text-sm">Loading articles&hellip;</span>
        </div>
      )}

      {rows !== null && items.length === 0 && !error && (
        <div className="mt-10 rounded-sm border border-dashed border-hairline bg-surface px-6 py-12 text-center dark:border-hairline-dark dark:bg-elevated">
          <p className="font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
            No articles yet
          </p>
          <p className="mt-2 text-ink-body dark:text-ink-inverse-body">
            Create your first article to get started.
          </p>
          <Link
            href="/admin/articles/new"
            className="mt-6 inline-flex items-center justify-center rounded-sm bg-accent px-4 py-2.5 font-sans text-sm font-semibold text-surface transition-colors hover:bg-accent-hover"
          >
            New Article
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-sm border border-hairline dark:border-hairline-dark">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-hairline bg-wash dark:border-hairline-dark dark:bg-elevated">
                <th className="px-4 py-3 font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink dark:text-ink-inverse">
                  Title
                </th>
                <th className="px-4 py-3 font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink dark:text-ink-inverse">
                  Status
                </th>
                <th className="hidden px-4 py-3 font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink dark:text-ink-inverse sm:table-cell">
                  Category
                </th>
                <th className="hidden px-4 py-3 font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink dark:text-ink-inverse md:table-cell">
                  Author
                </th>
                <th className="hidden px-4 py-3 font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink dark:text-ink-inverse lg:table-cell">
                  Updated
                </th>
                <th className="px-4 py-3 font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink dark:text-ink-inverse">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-hairline last:border-0 hover:bg-wash dark:border-hairline-dark dark:hover:bg-wash-dark"
                >
                  <td className="px-4 py-3 align-top">
                    <span className="font-sans font-semibold text-ink dark:text-ink-inverse">
                      {item.title || 'Untitled'}
                    </span>
                    {item.slug && (
                      <span className="mt-0.5 block text-caption text-ink-muted dark:text-ink-inverse-muted">
                        /{item.slug}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {item.isDraft ? (
                      <span className="inline-flex items-center rounded-sm bg-gold-soft px-2 py-1 font-sans text-caption font-semibold uppercase tracking-wide text-gold dark:bg-wash-dark dark:text-gold-light">
                        Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-sm bg-up/10 px-2 py-1 font-sans text-caption font-semibold uppercase tracking-wide text-up dark:text-up-light">
                        Published
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 align-top text-ink-body dark:text-ink-inverse-body sm:table-cell">
                    {item.category || '—'}
                  </td>
                  <td className="hidden px-4 py-3 align-top text-ink-body dark:text-ink-inverse-body md:table-cell">
                    {item.author || '—'}
                  </td>
                  <td className="hidden px-4 py-3 align-top text-ink-muted dark:text-ink-inverse-muted lg:table-cell">
                    {formatDate(item._updatedAt)}
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <Link
                      href={`/admin/articles/${encodeURIComponent(
                        baseId(item._id)
                      )}/edit`}
                      className="font-sans text-sm font-semibold text-accent underline-offset-2 hover:underline dark:text-accent-light"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
