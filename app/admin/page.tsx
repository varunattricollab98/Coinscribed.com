'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getAdminClient } from '@/lib/sanity-admin'
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
 * Date + time (with weekday) in US Eastern — the timezone the scheduler treats
 * the publishedAt field as. Shown on the schedule column so the author can see
 * exactly when each queued article goes live (e.g. "Thu, Sep 11, 8:00 AM ET").
 */
function formatDateTimeET(value?: string): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  const s = d.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${s} ET`
}

/**
 * The published id for a document. A draft's id is `drafts.<id>`; stripping the
 * prefix yields the id the edit route uses so a draft and its published version
 * do not appear as two rows.
 */
function baseId(id: string): string {
  return id.startsWith('drafts.') ? id.slice('drafts.'.length) : id
}

type ArticleStatus = 'published' | 'scheduled' | 'draft'

/**
 * Single source of truth for an article's status, so the badge, the filter and
 * the counts all agree. A draft is `draft`; a published (non-draft) document
 * whose publishedAt is still in the future is `scheduled`; otherwise it's live
 * `published`.
 */
function getStatus(item: AdminArticleListItem): ArticleStatus {
  if (item.isDraft) return 'draft'
  if (item.publishedAt && new Date(item.publishedAt).getTime() > Date.now()) {
    return 'scheduled'
  }
  return 'published'
}

/**
 * Turn a Sanity delete error into an actionable message, mirroring the editor's
 * `describeError` so the two admin surfaces read the same to the operator.
 */
function describeDeleteError(err: unknown): string {
  const status =
    (err as { statusCode?: number; response?: { statusCode?: number } })
      ?.statusCode ??
    (err as { response?: { statusCode?: number } })?.response?.statusCode
  const message =
    err instanceof Error ? err.message : typeof err === 'string' ? err : ''
  if (status === 401) {
    return 'Your Sanity session has expired or is not being sent. Sign in again, and make sure this site\u2019s origin has "Allow credentials" checked in manage.sanity.io > API > CORS Origins.'
  }
  if (status === 403) {
    return 'Your Sanity role does not have permission to delete this document. Ask a project admin to grant Editor/Admin access.'
  }
  if (/cors|credential/i.test(message)) {
    return 'A CORS / credentials error blocked the delete. In manage.sanity.io > API > CORS Origins, add this site\u2019s origin with "Allow credentials" checked.'
  }
  return `Delete failed: ${message || 'unknown error'}. Please try again.`
}

export default function AdminDashboardPage() {
  const [rows, setRows] = useState<RawArticleRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Base id (drafts.-stripped) of the row whose delete is in flight, so its
  // buttons show a "Deleting..." state and cannot fire a second request.
  const [deletingId, setDeletingId] = useState<string | null>(null)
  // Per-row delete error, keyed by base id, kept next to the row that failed.
  const [deleteErrors, setDeleteErrors] = useState<Record<string, string>>({})
  // Client-side search + filters over the already-fetched list.
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ArticleStatus>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    let active = true
    getAdminClient()
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

  // Article counts by status, for the summary pills at the top.
  const counts = useMemo(() => {
    const c = { total: items.length, published: 0, scheduled: 0, draft: 0 }
    for (const item of items) c[getStatus(item)] += 1
    return c
  }, [items])

  // Distinct categories present in the list, for the category filter dropdown.
  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(items.map((i) => i.category).filter((c): c is string => !!c))
      ).sort((a, b) => a.localeCompare(b)),
    [items]
  )

  // Apply the search box + status/category filters to the list.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((item) => {
      if (statusFilter !== 'all' && getStatus(item) !== statusFilter) return false
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
      if (q) {
        const haystack = `${item.title ?? ''} ${item.slug ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [items, search, statusFilter, categoryFilter])

  const hasActiveFilters =
    search.trim() !== '' || statusFilter !== 'all' || categoryFilter !== 'all'

  /**
   * Delete an article as the logged-in Sanity user. Both the draft
   * (`drafts.<id>`) and the published document (`<id>`) are removed in a SINGLE
   * transaction. Sanity `delete` mutations are idempotent - deleting an id that
   * does not exist is a no-op rather than an error - so the same transaction
   * cleanly covers the draft-only, published-only and draft+published cases.
   * Requires an explicit confirmation first so nothing is removed by accident.
   */
  const handleDelete = async (item: AdminArticleListItem) => {
    const id = baseId(item._id)
    const title = item.title || 'Untitled'
    const confirmed = window.confirm(
      `Delete "${title}"? This permanently removes the article (and its draft) and cannot be undone.`
    )
    if (!confirmed) return

    // Clear any previous error for this row and mark it in flight.
    setDeleteErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setDeletingId(id)

    try {
      await getAdminClient()
        .transaction()
        .delete(`drafts.${id}`)
        .delete(id)
        .commit({ visibility: 'async' })
      // Success: drop every raw row (draft and/or published) for this article
      // so the list reflects the delete without a full reload.
      setRows((prev) =>
        prev ? prev.filter((row) => baseId(row._id) !== id) : prev
      )
    } catch (err) {
      // Keep the row and surface an actionable inline error.
      setDeleteErrors((prev) => ({ ...prev, [id]: describeDeleteError(err) }))
    } finally {
      setDeletingId((current) => (current === id ? null : current))
    }
  }

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

      {/* Count summary pills — a quick read on how many articles are live,
          queued, or still drafts. */}
      {items.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-hairline px-3 py-1.5 font-sans text-caption font-semibold text-ink-body dark:border-hairline-dark dark:text-ink-inverse-body">
            Total
            <span className="text-ink dark:text-ink-inverse">{counts.total}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-up/10 px-3 py-1.5 font-sans text-caption font-semibold uppercase tracking-wide text-up dark:text-up-light">
            Published
            <span>{counts.published}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-accent/10 px-3 py-1.5 font-sans text-caption font-semibold uppercase tracking-wide text-accent dark:text-accent-light">
            Scheduled
            <span>{counts.scheduled}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-gold-soft px-3 py-1.5 font-sans text-caption font-semibold uppercase tracking-wide text-gold dark:bg-wash-dark dark:text-gold-light">
            Draft
            <span>{counts.draft}</span>
          </span>
        </div>
      )}

      {/* Search + filters — all client-side over the already-loaded list. */}
      {items.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or slug&hellip;"
              aria-label="Search articles"
              className="w-full rounded-sm border border-hairline bg-surface px-3 py-2 font-sans text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none dark:border-hairline-dark dark:bg-elevated dark:text-ink-inverse dark:placeholder:text-ink-inverse-muted"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | ArticleStatus)
            }
            aria-label="Filter by status"
            className="rounded-sm border border-hairline bg-surface px-3 py-2 font-sans text-sm text-ink-body focus:border-accent focus:outline-none dark:border-hairline-dark dark:bg-elevated dark:text-ink-inverse-body"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="rounded-sm border border-hairline bg-surface px-3 py-2 font-sans text-sm text-ink-body focus:border-accent focus:outline-none dark:border-hairline-dark dark:bg-elevated dark:text-ink-inverse-body"
          >
            <option value="all">All categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

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

      {/* Filters active but nothing matched. */}
      {items.length > 0 && filtered.length === 0 && (
        <div className="mt-8 rounded-sm border border-dashed border-hairline bg-surface px-6 py-10 text-center dark:border-hairline-dark dark:bg-elevated">
          <p className="font-sans text-sm text-ink-body dark:text-ink-inverse-body">
            No articles match your search or filters.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                setCategoryFilter('all')
              }}
              className="mt-4 inline-flex items-center rounded-sm border border-hairline px-3 py-1.5 font-sans text-sm font-semibold text-ink-body transition-colors hover:border-accent hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-body"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-sm border border-hairline dark:border-hairline-dark">
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
                  Publish date
                </th>
                <th className="px-4 py-3 font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink dark:text-ink-inverse">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
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
                    {(() => {
                      // A published (non-draft) doc whose publishedAt is in the
                      // future is SCHEDULED: it won't appear on the site until
                      // that time. Show a distinct badge so the author can see
                      // what's queued vs already live.
                      const scheduled =
                        !item.isDraft &&
                        item.publishedAt &&
                        new Date(item.publishedAt).getTime() > Date.now()
                      if (item.isDraft) {
                        return (
                          <span className="inline-flex items-center rounded-sm bg-gold-soft px-2 py-1 font-sans text-caption font-semibold uppercase tracking-wide text-gold dark:bg-wash-dark dark:text-gold-light">
                            Draft
                          </span>
                        )
                      }
                      if (scheduled) {
                        return (
                          <span className="flex flex-col gap-1">
                            <span className="inline-flex w-fit items-center rounded-sm bg-accent/10 px-2 py-1 font-sans text-caption font-semibold uppercase tracking-wide text-accent dark:text-accent-light">
                              Scheduled
                            </span>
                            {/* Go-live date+time shown right under the badge so
                                it's visible even on mobile where the Publish
                                date column is hidden. */}
                            <span className="text-caption text-accent dark:text-accent-light lg:hidden">
                              {formatDateTimeET(item.publishedAt)}
                            </span>
                          </span>
                        )
                      }
                      return (
                        <span className="inline-flex items-center rounded-sm bg-up/10 px-2 py-1 font-sans text-caption font-semibold uppercase tracking-wide text-up dark:text-up-light">
                          Published
                        </span>
                      )
                    })()}
                  </td>
                  <td className="hidden px-4 py-3 align-top text-ink-body dark:text-ink-inverse-body sm:table-cell">
                    {item.category || '—'}
                  </td>
                  <td className="hidden px-4 py-3 align-top text-ink-body dark:text-ink-inverse-body md:table-cell">
                    {item.author || '—'}
                  </td>
                  <td className="hidden px-4 py-3 align-top lg:table-cell">
                    {(() => {
                      const scheduled =
                        !item.isDraft &&
                        item.publishedAt &&
                        new Date(item.publishedAt).getTime() > Date.now()
                      if (scheduled) {
                        // Queued to go live — show the exact date + time (ET).
                        return (
                          <span className="text-accent dark:text-accent-light">
                            {formatDateTimeET(item.publishedAt)}
                          </span>
                        )
                      }
                      if (!item.isDraft && item.publishedAt) {
                        // Already live — show when it published.
                        return (
                          <span className="text-ink-muted dark:text-ink-inverse-muted">
                            {formatDate(item.publishedAt)}
                          </span>
                        )
                      }
                      // Draft — no publish date yet; fall back to last edit.
                      return (
                        <span className="text-ink-muted dark:text-ink-inverse-muted">
                          {formatDate(item._updatedAt)}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    {(() => {
                      const id = baseId(item._id)
                      const isDeleting = deletingId === id
                      const rowError = deleteErrors[id]
                      return (
                        <>
                          <div className="flex items-center justify-end gap-4">
                            {/* Preview the article as it will look, in a new
                                tab. Works for any saved doc (draft, scheduled,
                                or published) via the authenticated preview
                                route — especially useful for drafts and
                                scheduled rows, which have no live URL yet. */}
                            <a
                              href={`/preview/articles/${encodeURIComponent(id)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-sans text-sm font-semibold text-ink-body underline-offset-2 hover:text-accent hover:underline dark:text-ink-inverse-body dark:hover:text-accent-light"
                            >
                              Preview
                            </a>
                            {/* View the live published page in a new tab. Only
                                shown for a published, LIVE article with a slug —
                                a draft or a still-scheduled (future) article has
                                no live URL yet, so we hide View for those. */}
                            {!item.isDraft &&
                              item.slug &&
                              !(
                                item.publishedAt &&
                                new Date(item.publishedAt).getTime() > Date.now()
                              ) && (
                                <a
                                  href={`/news/${item.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-sans text-sm font-semibold text-ink-body underline-offset-2 hover:text-accent hover:underline dark:text-ink-inverse-body dark:hover:text-accent-light"
                                >
                                  View
                                </a>
                              )}
                            <Link
                              href={`/admin/articles/${encodeURIComponent(
                                id
                              )}/edit`}
                              aria-disabled={isDeleting}
                              tabIndex={isDeleting ? -1 : undefined}
                              className={`font-sans text-sm font-semibold text-accent underline-offset-2 hover:underline dark:text-accent-light${
                                isDeleting ? ' pointer-events-none opacity-50' : ''
                              }`}
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={isDeleting}
                              className="font-sans text-sm font-semibold text-down underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-down-light"
                            >
                              {isDeleting ? 'Deleting\u2026' : 'Delete'}
                            </button>
                          </div>
                          {rowError && (
                            <p className="mt-2 text-caption text-down dark:text-down-light">
                              {rowError}
                            </p>
                          )}
                        </>
                      )
                    })()}
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
