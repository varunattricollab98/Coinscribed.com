'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminSanityClient } from '@/lib/sanity-admin'
import { genKey, parseBody, serializeBody } from '@/lib/portable-text'
import {
  ARTICLE_LIMITS,
  type ArticleDraft,
  type EditorBlock,
  type EditorFaq,
  type SanityReference,
} from '@/lib/admin-types'
import type { PortableTextBlock } from '@/lib/sanity-queries'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { ReferencePicker } from '@/components/admin/ReferencePicker'
import { ImageUploader, type UploaderImageValue } from '@/components/admin/ImageUploader'

/** Save intent passed to the (FEAT-003) save handler. */
export type SaveMode = 'draft' | 'publish'

interface ArticleEditorProps {
  /**
   * Document id to load and edit. When omitted the editor starts empty (the
   * "new article" screen). The draft (`drafts.<id>`) is preferred over the
   * published document when both exist.
   */
  documentId?: string
  /**
   * Save handler. Implemented by FEAT-003 (Draft/Publish + write wiring). This
   * feature only validates and hands over a fully-built `ArticleDraft`; when no
   * handler is supplied the Save/Publish buttons explain that saving arrives
   * with FEAT-003.
   */
  onSave?: (model: ArticleDraft, mode: SaveMode) => Promise<void> | void
}

/**
 * Slugify a title the way Sanity's default slugifier does: lowercase, trim,
 * collapse whitespace to single hyphens, strip characters that are not
 * url-safe, and cap at the schema's 96-char max.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, ARTICLE_LIMITS.slugMax)
}

// Raw shape returned when loading an existing document for editing. Drafts are
// read with the authenticated client (session cookie); the public read client
// cannot see them.
interface RawArticleDoc {
  _id: string
  title?: string
  slug?: { current?: string }
  excerpt?: string
  body?: PortableTextBlock[]
  author?: { _ref?: string }
  category?: { _ref?: string }
  publishedAt?: string
  mainImage?: {
    _type?: 'image'
    asset?: { _ref?: string; _type?: 'reference' }
    alt?: string
  }
  seoTitle?: string
  seoDescription?: string
  faqs?: { question?: string; answer?: string }[]
}

// Fetch the draft first, then fall back to the published doc. Keep raw
// references (`author`, `category`, `mainImage.asset`) rather than resolving so
// the editor can round-trip them back on save.
const LOAD_QUERY = `
  coalesce(
    *[_id == $draftId][0],
    *[_id == $id][0]
  ){
    _id, title, slug, excerpt, body, author, category, publishedAt,
    mainImage, seoTitle, seoDescription, faqs
  }
`

function emptyDraft(): ArticleDraft {
  return {
    title: '',
    slug: '',
    excerpt: '',
    bodyModel: [],
    publishedAt: '',
    faqs: [],
  }
}

/** Convert an ISO datetime to the value a <input type="datetime-local"> wants. */
function toDatetimeLocal(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  // Adjust to local time then trim to minutes (yyyy-MM-ddTHH:mm).
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

/** Convert a datetime-local value back to an ISO string. */
function fromDatetimeLocal(value: string): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString()
}

type Errors = Partial<Record<string, string>>

export function ArticleEditor({ documentId, onSave }: ArticleEditorProps) {
  const isEdit = Boolean(documentId)
  const router = useRouter()

  const [draft, setDraft] = useState<ArticleDraft>(emptyDraft)
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState<SaveMode | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveOk, setSaveOk] = useState<string | null>(null)

  // Save status shown in the Publish panel.
  //  - 'published' : a published document exists (id without the drafts. prefix)
  //  - 'draft'     : only a draft (drafts.<id>) exists
  //  - 'new'       : nothing saved yet
  const [docStatus, setDocStatus] = useState<'new' | 'draft' | 'published'>(
    isEdit ? 'draft' : 'new'
  )
  // True once the user changes anything after the last save/load.
  const [dirty, setDirty] = useState(false)

  // The stable id shared by a document's draft and published forms, WITHOUT the
  // `drafts.` prefix. Generated once for a new article and reused by both Save
  // Draft (drafts.<baseId>) and Publish (<baseId>), mirroring Studio.
  const baseIdRef = useRef<string>(
    documentId ? documentId.replace(/^drafts\./, '') : genKey(20)
  )

  const markDirty = useCallback(() => {
    setDirty(true)
    setSaveOk(null)
  }, [])

  // ----- Load existing document (edit mode) -----
  useEffect(() => {
    if (!documentId) return
    let active = true
    setLoading(true)
    adminSanityClient
      .fetch<RawArticleDoc | null>(LOAD_QUERY, {
        id: documentId,
        draftId: `drafts.${documentId}`,
      })
      .then((doc) => {
        if (!active) return
        if (!doc) {
          setLoadError('Article not found, or you do not have access to it.')
          setLoading(false)
          return
        }
        const mainImage =
          doc.mainImage?.asset?._ref
            ? {
                _type: 'image' as const,
                asset: {
                  _ref: doc.mainImage.asset._ref,
                  _type: 'reference' as const,
                },
                alt: doc.mainImage.alt ?? '',
              }
            : undefined
        setDraft({
          _id: doc._id,
          title: doc.title ?? '',
          slug: doc.slug?.current ?? '',
          excerpt: doc.excerpt ?? '',
          bodyModel: parseBody(doc.body),
          authorRef: doc.author?._ref
            ? { _type: 'reference', _ref: doc.author._ref }
            : undefined,
          categoryRef: doc.category?._ref
            ? { _type: 'reference', _ref: doc.category._ref }
            : undefined,
          publishedAt: doc.publishedAt ?? '',
          mainImage,
          seoTitle: doc.seoTitle ?? '',
          seoDescription: doc.seoDescription ?? '',
          faqs: Array.isArray(doc.faqs)
            ? doc.faqs.map((f) => ({
                question: f.question ?? '',
                answer: f.answer ?? '',
              }))
            : [],
        })
        // An existing doc already has a slug the user chose; don't overwrite it.
        setSlugTouched(true)
        // Track the published/draft status and lock in the stable base id.
        baseIdRef.current = doc._id.replace(/^drafts\./, '')
        setDocStatus(doc._id.startsWith('drafts.') ? 'draft' : 'published')
        setDirty(false)
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setLoadError('Could not load the article. Check your Sanity permissions.')
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [documentId])

  // ----- Field setters ----- (each marks the draft dirty)
  const patch = useCallback(
    (partial: Partial<ArticleDraft>) => {
      setDraft((prev) => ({ ...prev, ...partial }))
      markDirty()
    },
    [markDirty]
  )

  const handleTitleChange = (title: string) => {
    setDraft((prev) => ({
      ...prev,
      title,
      // Auto-derive the slug from the title until the user edits it manually.
      slug: slugTouched ? prev.slug : slugify(title),
    }))
    markDirty()
  }

  const handleSlugChange = (slug: string) => {
    setSlugTouched(true)
    patch({ slug: slugify(slug) })
  }

  const setBody = useCallback(
    (bodyModel: EditorBlock[]) => {
      setDraft((prev) => ({ ...prev, bodyModel }))
      markDirty()
    },
    [markDirty]
  )

  const setAuthor = useCallback(
    (authorRef: SanityReference | undefined) => patch({ authorRef }),
    [patch]
  )
  const setCategory = useCallback(
    (categoryRef: SanityReference | undefined) => patch({ categoryRef }),
    [patch]
  )

  const setMainImage = useCallback(
    (img: UploaderImageValue | undefined) => {
      patch({
        mainImage: img?.asset
          ? {
              _type: 'image',
              asset: { _ref: img.asset._ref, _type: 'reference' },
              alt: img.alt ?? '',
            }
          : undefined,
      })
    },
    [patch]
  )

  // ----- FAQ handlers -----
  const addFaq = () =>
    patch({ faqs: [...(draft.faqs ?? []), { question: '', answer: '' }] })
  const updateFaq = (index: number, partial: Partial<EditorFaq>) =>
    patch({
      faqs: (draft.faqs ?? []).map((f, i) =>
        i === index ? { ...f, ...partial } : f
      ),
    })
  const removeFaq = (index: number) =>
    patch({ faqs: (draft.faqs ?? []).filter((_, i) => i !== index) })

  // ----- Validation (mirrors sanity/schemas/article.ts) -----
  const validate = useCallback((d: ArticleDraft): Errors => {
    const e: Errors = {}
    if (!d.title.trim()) e.title = 'Title is required.'
    if (!d.slug.trim()) e.slug = 'Slug is required.'
    if (!d.excerpt.trim()) e.excerpt = 'Excerpt is required.'
    else if (d.excerpt.length > ARTICLE_LIMITS.excerptMax)
      e.excerpt = `Excerpt must be ${ARTICLE_LIMITS.excerptMax} characters or fewer.`
    if (!d.authorRef) e.author = 'Author is required.'
    if (!d.categoryRef) e.category = 'Category is required.'
    if (!d.publishedAt) e.publishedAt = 'Published date is required.'
    if ((d.seoTitle?.length ?? 0) > ARTICLE_LIMITS.seoTitleMax)
      e.seoTitle = `SEO title must be ${ARTICLE_LIMITS.seoTitleMax} characters or fewer.`
    if ((d.seoDescription?.length ?? 0) > ARTICLE_LIMITS.seoDescriptionMax)
      e.seoDescription = `SEO description must be ${ARTICLE_LIMITS.seoDescriptionMax} characters or fewer.`
    ;(d.faqs ?? []).forEach((f, i) => {
      if (f.question.trim() && !f.answer.trim())
        e[`faq-${i}`] = 'Answer is required when a question is set.'
      if (!f.question.trim() && f.answer.trim())
        e[`faq-${i}`] = 'Question is required when an answer is set.'
    })
    return e
  }, [])

  const currentErrors = useMemo(() => validate(draft), [draft, validate])
  const isValid = Object.keys(currentErrors).length === 0

  /**
   * Assemble the full Sanity `article` document from the editor model. The
   * shape matches `sanity/schemas/article.ts` EXACTLY so documents created here
   * are fully interchangeable with Studio-authored ones:
   *   { _id, _type:'article', title, slug:{_type:'slug',current}, excerpt,
   *     body (Portable Text), author (ref), publishedAt, category (ref),
   *     mainImage?, seoTitle?, seoDescription?, faqs?[{_key,_type:'faq',...}] }
   * `_id` is supplied by the caller (draft vs published id).
   */
  const buildDocument = useCallback(
    (
      d: ArticleDraft,
      id: string
    ): { _id: string; _type: 'article' } & Record<string, unknown> => {
      const doc: { _id: string; _type: 'article' } & Record<string, unknown> = {
        _id: id,
        _type: 'article',
        title: d.title.trim(),
        slug: { _type: 'slug', current: d.slug.trim() },
        excerpt: d.excerpt.trim(),
        body: serializeBody(d.bodyModel),
        publishedAt: d.publishedAt,
      }
      if (d.authorRef) doc.author = d.authorRef
      if (d.categoryRef) doc.category = d.categoryRef
      if (d.mainImage?.asset) {
        doc.mainImage = {
          _type: 'image',
          asset: d.mainImage.asset,
          ...(d.mainImage.alt ? { alt: d.mainImage.alt } : {}),
        }
      }
      if (d.seoTitle?.trim()) doc.seoTitle = d.seoTitle.trim()
      if (d.seoDescription?.trim())
        doc.seoDescription = d.seoDescription.trim()
      const faqs = (d.faqs ?? []).filter(
        (f) => f.question.trim() && f.answer.trim()
      )
      if (faqs.length > 0) {
        doc.faqs = faqs.map((f) => ({
          _key: genKey(),
          _type: 'faq',
          question: f.question.trim(),
          answer: f.answer.trim(),
        }))
      }
      return doc
    },
    []
  )

  /** Turn a Sanity write error into an actionable message for the user. */
  const describeError = (err: unknown): string => {
    const status = (err as { statusCode?: number; response?: { statusCode?: number } })
      ?.statusCode ??
      (err as { response?: { statusCode?: number } })?.response?.statusCode
    const message =
      err instanceof Error ? err.message : typeof err === 'string' ? err : ''
    if (status === 401) {
      return 'Your Sanity session has expired or is not being sent. Sign in again, and make sure this site\u2019s origin has "Allow credentials" checked in manage.sanity.io > API > CORS Origins.'
    }
    if (status === 403) {
      return 'Your Sanity role does not have permission to write this document. Ask a project admin to grant Editor/Admin access.'
    }
    if (/cors|credential/i.test(message)) {
      return 'A CORS / credentials error blocked the write. In manage.sanity.io > API > CORS Origins, add this site\u2019s origin with "Allow credentials" checked.'
    }
    return `Save failed: ${message || 'unknown error'}. Please try again.`
  }

  const handleSave = async (mode: SaveMode) => {
    setSaveError(null)
    setSaveOk(null)
    const found = validate(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const baseId = baseIdRef.current
    const draftId = `drafts.${baseId}`

    try {
      setSaving(mode)

      // Allow callers to override the write behaviour (e.g. tests); otherwise
      // perform the write directly as the logged-in Sanity user.
      if (onSave) {
        await onSave(draft, mode)
      } else if (mode === 'draft') {
        // SAVE DRAFT -> write drafts.<baseId>, leaving any published copy as-is.
        await adminSanityClient.createOrReplace(buildDocument(draft, draftId))
        setDocStatus((prev) => (prev === 'published' ? 'published' : 'draft'))
      } else {
        // PUBLISH -> write the published doc at <baseId> and delete the draft,
        // in a single transaction (mirrors Studio's publish action).
        await adminSanityClient
          .transaction()
          .createOrReplace(buildDocument(draft, baseId))
          .delete(draftId)
          .commit()
        setDocStatus('published')
      }

      setDirty(false)
      setDraft((prev) => ({
        ...prev,
        _id: mode === 'draft' ? draftId : baseId,
      }))
      setSaveOk(
        mode === 'publish'
          ? 'Published. Redirecting to your articles\u2026'
          : 'Draft saved.'
      )
      if (mode === 'publish') {
        // Give the user a beat to see the confirmation, then return to /admin.
        setTimeout(() => router.push('/admin'), 800)
      }
    } catch (err) {
      setSaveError(describeError(err))
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-ink-muted dark:text-ink-inverse-muted">
        <span
          className="h-5 w-5 animate-spin rounded-full border-2 border-hairline border-t-accent dark:border-hairline-dark dark:border-t-accent-light"
          aria-hidden="true"
        />
        <span className="text-sm">Loading article&hellip;</span>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="rounded-sm border border-down/40 bg-down/5 px-4 py-3 text-sm text-down dark:text-down-light">
          {loadError}
        </p>
        <Link
          href="/admin"
          className="mt-4 inline-block font-sans text-sm font-semibold text-accent hover:underline dark:text-accent-light"
        >
          ← Back to articles
        </Link>
      </div>
    )
  }

  const mainImageValue: UploaderImageValue | undefined = draft.mainImage?.asset
    ? {
        _type: 'image',
        asset: draft.mainImage.asset,
        alt: draft.mainImage.alt,
      }
    : undefined

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin"
            className="font-sans text-caption text-ink-muted hover:text-accent dark:text-ink-inverse-muted dark:hover:text-accent-light"
          >
            ← Articles
          </Link>
          <h1 className="mt-1 font-serif text-display-2 font-bold text-ink dark:text-ink-inverse">
            {isEdit ? 'Edit article' : 'New article'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Main column */}
        <div className="space-y-6">
          {/* Title */}
          <Field label="Title" required error={errors.title}>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article title"
              className={inputClass(Boolean(errors.title))}
            />
          </Field>

          {/* Slug */}
          <Field label="Slug" required error={errors.slug}>
            <div className="flex items-center gap-2">
              <span className="font-sans text-caption text-ink-muted dark:text-ink-inverse-muted">
                /news/
              </span>
              <input
                type="text"
                value={draft.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="article-slug"
                className={inputClass(Boolean(errors.slug))}
              />
            </div>
            <p className="mt-1 text-caption text-ink-muted dark:text-ink-inverse-muted">
              Auto-generated from the title; edit to override. Max{' '}
              {ARTICLE_LIMITS.slugMax} characters.
            </p>
          </Field>

          {/* Excerpt */}
          <Field
            label="Excerpt"
            required
            error={errors.excerpt}
            counter={{ length: draft.excerpt.length, max: ARTICLE_LIMITS.excerptMax }}
          >
            <textarea
              value={draft.excerpt}
              onChange={(e) => patch({ excerpt: e.target.value })}
              rows={3}
              maxLength={ARTICLE_LIMITS.excerptMax}
              placeholder="A brief summary used on cards and as the meta description."
              className={inputClass(Boolean(errors.excerpt))}
            />
          </Field>

          {/* Body */}
          <Field label="Body">
            <RichTextEditor
              value={draft.bodyModel}
              onChange={setBody}
              onInsertTable={markDirty}
            />
          </Field>

          {/* FAQs */}
          <Field label="FAQs">
            <div className="space-y-3">
              {(draft.faqs ?? []).length === 0 && (
                <p className="text-caption text-ink-muted dark:text-ink-inverse-muted">
                  Optional. Each question/answer renders as an FAQ section and
                  powers Google FAQ rich snippets.
                </p>
              )}
              {(draft.faqs ?? []).map((faq, i) => (
                <div
                  key={i}
                  className="rounded-sm border border-hairline p-3 dark:border-hairline-dark"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) =>
                          updateFaq(i, { question: e.target.value })
                        }
                        placeholder="Question"
                        className={inputClass(Boolean(errors[`faq-${i}`]))}
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(i, { answer: e.target.value })}
                        rows={2}
                        placeholder="Answer"
                        className={inputClass(Boolean(errors[`faq-${i}`]))}
                      />
                      {errors[`faq-${i}`] && (
                        <p className="text-caption text-down dark:text-down-light">
                          {errors[`faq-${i}`]}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFaq(i)}
                      className="rounded-sm border border-hairline px-2 py-1 font-sans text-caption text-ink-muted transition-colors hover:border-down hover:text-down dark:border-hairline-dark dark:text-ink-inverse-muted dark:hover:border-down-light dark:hover:text-down-light"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addFaq}
                className="inline-flex items-center rounded-sm border border-hairline px-3 py-1.5 font-sans text-sm text-ink-body transition-colors hover:border-accent hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-body dark:hover:border-accent-light dark:hover:text-accent-light"
              >
                Add FAQ
              </button>
            </div>
          </Field>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          {/* Publish panel */}
          <div className="rounded-sm border border-hairline bg-surface p-4 dark:border-hairline-dark dark:bg-elevated">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
                Publish
              </h2>
              <StatusBadge status={docStatus} dirty={dirty} />
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleSave('publish')}
                disabled={!isValid || saving !== null}
                className="inline-flex items-center justify-center rounded-sm bg-accent px-4 py-2.5 font-sans text-sm font-semibold text-surface transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {saving === 'publish' ? 'Publishing…' : 'Publish'}
              </button>
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={saving !== null}
                className="inline-flex items-center justify-center rounded-sm border border-hairline px-4 py-2.5 font-sans text-sm font-semibold text-ink-body transition-colors hover:border-accent hover:text-accent disabled:opacity-50 dark:border-hairline-dark dark:text-ink-inverse-body dark:hover:border-accent-light dark:hover:text-accent-light"
              >
                {saving === 'draft' ? 'Saving…' : 'Save draft'}
              </button>
            </div>
            {!isValid && (
              <p className="mt-3 text-caption text-ink-muted dark:text-ink-inverse-muted">
                Fill in all required fields (marked *) to publish.
              </p>
            )}
            {saveError && (
              <p className="mt-3 text-caption text-down dark:text-down-light">
                {saveError}
              </p>
            )}
            {saveOk && (
              <p className="mt-3 text-caption text-up dark:text-up-light">
                {saveOk}
              </p>
            )}
          </div>

          {/* Featured image */}
          <div className="rounded-sm border border-hairline bg-surface p-4 dark:border-hairline-dark dark:bg-elevated">
            <ImageUploader
              label="Featured image"
              value={mainImageValue}
              onChange={setMainImage}
            />
          </div>

          {/* Author + Category */}
          <div className="space-y-4 rounded-sm border border-hairline bg-surface p-4 dark:border-hairline-dark dark:bg-elevated">
            <ReferencePicker
              label="Author"
              kind="author"
              required
              value={draft.authorRef}
              onChange={setAuthor}
              error={errors.author}
            />
            <ReferencePicker
              label="Category"
              kind="category"
              required
              value={draft.categoryRef}
              onChange={setCategory}
              error={errors.category}
            />
          </div>

          {/* Published At */}
          <div className="rounded-sm border border-hairline bg-surface p-4 dark:border-hairline-dark dark:bg-elevated">
            <Field label="Published at" required error={errors.publishedAt}>
              <input
                type="datetime-local"
                value={toDatetimeLocal(draft.publishedAt)}
                onChange={(e) =>
                  patch({ publishedAt: fromDatetimeLocal(e.target.value) })
                }
                className={inputClass(Boolean(errors.publishedAt))}
              />
            </Field>
          </div>

          {/* SEO */}
          <div className="space-y-4 rounded-sm border border-hairline bg-surface p-4 dark:border-hairline-dark dark:bg-elevated">
            <h2 className="font-sans text-eyebrow font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
              SEO
            </h2>
            <Field
              label="SEO title"
              error={errors.seoTitle}
              counter={{
                length: draft.seoTitle?.length ?? 0,
                max: ARTICLE_LIMITS.seoTitleMax,
              }}
            >
              <input
                type="text"
                value={draft.seoTitle ?? ''}
                onChange={(e) => patch({ seoTitle: e.target.value })}
                maxLength={ARTICLE_LIMITS.seoTitleMax}
                placeholder="Overrides the title in search engines"
                className={inputClass(Boolean(errors.seoTitle))}
              />
            </Field>
            <Field
              label="SEO description"
              error={errors.seoDescription}
              counter={{
                length: draft.seoDescription?.length ?? 0,
                max: ARTICLE_LIMITS.seoDescriptionMax,
              }}
            >
              <textarea
                value={draft.seoDescription ?? ''}
                onChange={(e) => patch({ seoDescription: e.target.value })}
                rows={3}
                maxLength={ARTICLE_LIMITS.seoDescriptionMax}
                placeholder="Overrides the excerpt as the meta description"
                className={inputClass(Boolean(errors.seoDescription))}
              />
            </Field>
          </div>
        </aside>
      </div>
    </div>
  )
}

// ============================================================
// Small presentational helpers
// ============================================================

function StatusBadge({
  status,
  dirty,
}: {
  status: 'new' | 'draft' | 'published'
  dirty: boolean
}) {
  let label: string
  let tone: string
  if (dirty) {
    label = 'Unsaved changes'
    tone =
      'bg-gold/10 text-gold dark:bg-gold-light/10 dark:text-gold-light'
  } else if (status === 'published') {
    label = 'Published'
    tone = 'bg-up/10 text-up dark:bg-up-light/10 dark:text-up-light'
  } else if (status === 'draft') {
    label = 'Draft'
    tone =
      'bg-wash text-ink-muted dark:bg-elevated dark:text-ink-inverse-muted'
  } else {
    label = 'New'
    tone =
      'bg-wash text-ink-muted dark:bg-elevated dark:text-ink-inverse-muted'
  }
  return (
    <span
      className={`rounded-sm px-2 py-0.5 font-sans text-caption font-semibold ${tone}`}
    >
      {label}
    </span>
  )
}

function inputClass(hasError: boolean): string {
  return `w-full rounded-sm border bg-paper px-3 py-2 font-sans text-sm text-ink transition-colors focus:border-accent focus:outline-none dark:bg-graphite dark:text-ink-inverse ${
    hasError
      ? 'border-down dark:border-down-light'
      : 'border-hairline dark:border-hairline-dark'
  }`
}

function Field({
  label,
  required,
  error,
  counter,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  counter?: { length: number; max: number }
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label className="font-sans text-caption font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
          {label}
          {required && (
            <span className="ml-1 text-down dark:text-down-light">*</span>
          )}
        </label>
        {counter && (
          <span
            className={`font-sans text-caption ${
              counter.length > counter.max
                ? 'text-down dark:text-down-light'
                : 'text-ink-muted dark:text-ink-inverse-muted'
            }`}
          >
            {counter.length}/{counter.max}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p className="mt-1.5 text-caption text-down dark:text-down-light">
          {error}
        </p>
      )}
    </div>
  )
}
