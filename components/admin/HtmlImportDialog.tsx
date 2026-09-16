'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { htmlToEditorBlocks } from '@/lib/html-to-editor-blocks'
import type { EditorBlock } from '@/lib/admin-types'

/**
 * "Import from HTML" dialog for the admin editor.
 *
 * Lets an author paste a full HTML article body and convert it into editor
 * blocks (via `htmlToEditorBlocks`). The converted blocks are the SAME model
 * the block editor produces, so they serialize to Portable Text and render on
 * the public site with no special handling.
 *
 * The author chooses whether to APPEND the imported blocks to the existing
 * body or REPLACE the body entirely. A live summary (how many paragraphs,
 * headings, lists, tables, quotes were detected) is shown before importing so
 * the result is predictable.
 */
export function HtmlImportDialog({
  hasExistingBody,
  onImport,
  onCancel,
}: {
  /** Whether the body already has blocks (controls append/replace default). */
  hasExistingBody: boolean
  /** Called with the converted blocks and the chosen mode. */
  onImport: (blocks: EditorBlock[], mode: 'append' | 'replace') => void
  onCancel: () => void
}) {
  const [html, setHtml] = useState('')
  const [mode, setMode] = useState<'append' | 'replace'>(
    hasExistingBody ? 'append' : 'replace'
  )
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Convert on every change so the summary preview stays live. Conversion is
  // cheap (parse-only) and safe (never throws).
  const result = useMemo(() => htmlToEditorBlocks(html), [html])
  const { summary } = result
  const canImport = summary.total > 0

  const doImport = () => {
    if (!canImport) return
    onImport(result.blocks, mode)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="flex w-full max-w-2xl flex-col rounded-sm border border-hairline bg-paper p-4 shadow-lg dark:border-hairline-dark dark:bg-graphite">
        <h3 className="mb-1 font-sans text-sm font-semibold text-ink dark:text-ink-inverse">
          Import article from HTML
        </h3>
        <p className="mb-3 text-caption text-ink-muted dark:text-ink-inverse-muted">
          Paste an HTML article body. Supported: paragraphs, H2–H4 headings,
          bullet/numbered lists, blockquotes, tables, and inline{' '}
          <code className="font-mono">bold</code>,{' '}
          <code className="font-mono">italic</code>, links and code. Anything
          else (scripts, styles, raw images) is ignored. The text is converted
          into normal editor blocks — no raw HTML is stored.
        </p>

        <textarea
          ref={textareaRef}
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="<p>Paste your article HTML here…</p>"
          rows={12}
          className="w-full resize-y rounded-sm border border-hairline bg-paper px-3 py-2 font-mono text-caption text-ink focus:border-accent focus:outline-none dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse"
        />

        {/* Live detection summary */}
        <div className="mt-2 min-h-[1.25rem] text-caption text-ink-muted dark:text-ink-inverse-muted">
          {html.trim().length === 0 ? (
            <span>Nothing pasted yet.</span>
          ) : canImport ? (
            <span>
              Detected {summary.total} block{summary.total === 1 ? '' : 's'}:{' '}
              {summary.paragraphs} paragraph{summary.paragraphs === 1 ? '' : 's'},{' '}
              {summary.headings} heading{summary.headings === 1 ? '' : 's'},{' '}
              {summary.lists} list item{summary.lists === 1 ? '' : 's'},{' '}
              {summary.quotes} quote{summary.quotes === 1 ? '' : 's'},{' '}
              {summary.tables} table{summary.tables === 1 ? '' : 's'}.
            </span>
          ) : (
            <span className="text-down dark:text-down-light">
              No convertible content found. Make sure the text is inside tags
              like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt; or &lt;table&gt;.
            </span>
          )}
        </div>

        {/* Append vs replace */}
        {hasExistingBody && (
          <fieldset className="mt-3 flex flex-wrap items-center gap-4">
            <legend className="sr-only">Import mode</legend>
            <label className="flex items-center gap-2 font-sans text-caption text-ink-body dark:text-ink-inverse-body">
              <input
                type="radio"
                name="html-import-mode"
                checked={mode === 'append'}
                onChange={() => setMode('append')}
              />
              Add to end of current body
            </label>
            <label className="flex items-center gap-2 font-sans text-caption text-ink-body dark:text-ink-inverse-body">
              <input
                type="radio"
                name="html-import-mode"
                checked={mode === 'replace'}
                onChange={() => setMode('replace')}
              />
              Replace current body
            </label>
          </fieldset>
        )}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-sm border border-hairline bg-paper px-3 py-1.5 font-sans text-caption text-ink-body transition-colors hover:border-accent hover:text-accent dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse-body dark:hover:border-accent-light dark:hover:text-accent-light"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={doImport}
            disabled={!canImport}
            className="rounded-sm border border-accent bg-accent px-3 py-1.5 font-sans text-caption font-semibold text-paper transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:border-accent-light dark:bg-accent-light dark:text-graphite"
          >
            {mode === 'replace' ? 'Replace body' : 'Add to body'}
          </button>
        </div>
      </div>
    </div>
  )
}
