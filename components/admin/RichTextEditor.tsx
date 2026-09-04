'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { genKey } from '@/lib/portable-text'
import type {
  EditorBlock,
  EditorImageBlock,
  EditorLink,
  EditorMark,
  EditorSpan,
  EditorTextBlock,
  EditorBlockStyle,
  EditorListItem,
} from '@/lib/admin-types'
import { ImageUploader, type UploaderImageValue } from '@/components/admin/ImageUploader'
import { TableEditor } from '@/components/admin/TableEditor'
import type { EditorTableBlock } from '@/lib/admin-types'

/**
 * Hand-rolled, dependency-free rich-text body editor.
 *
 * DESIGN CHOICE (documented per FEAT-002): this is a STRUCTURED BLOCK-LIST
 * editor rather than one big contentEditable surface. Each block is a typed row
 * (paragraph / H2 / H3 / H4 / quote / bullet-item / number-item / image /
 * table) that maps 1:1 onto a Portable Text block. Text rows use a small
 * contentEditable region whose HTML is serialized into Portable Text spans on
 * every edit, so inline marks (strong/em/underline/code) and link annotations
 * round-trip through `components/news/PortableTextRenderer.tsx` exactly. This
 * approach was chosen over a single free-form contentEditable because it makes
 * the exact block/span/markDef shape deterministic and easy to verify.
 *
 * The editor operates directly on `EditorBlock[]` (the model in
 * `lib/admin-types.ts`); serialization to the final Portable Text array is done
 * by `serializeBody` in `lib/portable-text.ts` when the article is saved.
 *
 * TABLE INSERTION: the toolbar's "Insert table" action (via `onInsertTable`)
 * appends a new `tableBlock`, and each `tableBlock` row renders the full,
 * spreadsheet-style `TableEditor` (FEAT-003) so both freshly-inserted and
 * existing (parsed) tables can be edited inline, reordered and deleted like any
 * other block.
 */

interface RichTextEditorProps {
  value: EditorBlock[]
  onChange: (blocks: EditorBlock[]) => void
  /**
   * Enables the "Insert table" toolbar action. The new `tableBlock` is appended
   * to the body by this component (it owns value/onChange); this callback is an
   * optional notification the host can use (e.g. to mark unsaved changes). When
   * omitted the table button is hidden.
   */
  onInsertTable?: () => void
  /** Optional inline validation error for the body. */
  error?: string
}

// ============================================================
// DOM <-> span serialization
// ============================================================

/** Map an inline decorator to the HTML tag used inside the contentEditable. */
const MARK_TAGS: Record<EditorMark, string> = {
  strong: 'STRONG',
  em: 'EM',
  underline: 'U',
  code: 'CODE',
}

const TAG_TO_MARK: Record<string, EditorMark> = {
  STRONG: 'strong',
  B: 'strong',
  EM: 'em',
  I: 'em',
  U: 'underline',
  CODE: 'code',
}

/**
 * Serialize the child nodes of a contentEditable element into Portable Text
 * spans plus the link annotations they reference.
 *
 * Post-processing:
 * - Adjacent spans with identical marks are MERGED (reduces span noise and
 *   brings the output closer to what Studio produces).
 * - Each span's `marks` array is sorted (decorator names first
 *   alphabetically, then link keys) so the order is deterministic.
 * - `<BR>` elements are DROPPED rather than emitted as a `\n` span, because
 *   Sanity does not model hard breaks as literal newline text and the public
 *   renderer would display it as visible whitespace.
 */
function domToSpans(root: HTMLElement): {
  spans: EditorSpan[]
  links: EditorLink[]
} {
  const rawSpans: EditorSpan[] = []
  const links: EditorLink[] = []

  const walk = (node: Node, marks: string[]) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? ''
      if (text.length > 0) {
        rawSpans.push({ _key: genKey(), text, marks: [...marks] })
      }
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return

    const el = node as HTMLElement
    const tag = el.tagName

    // Drop <BR> entirely: Sanity represents hard breaks as separate blocks,
    // not as literal '\n' spans. Inside a single contentEditable row, a <BR>
    // would otherwise produce a span with '\n' text that the renderer shows
    // as a visible newline character, which is a shape divergence.
    if (tag === 'BR') {
      return
    }

    let nextMarks = marks
    if (tag === 'A') {
      const href = el.getAttribute('href') || ''
      const link: EditorLink = { _key: genKey(), href }
      links.push(link)
      nextMarks = [...marks, link._key]
    } else if (TAG_TO_MARK[tag]) {
      const mark = TAG_TO_MARK[tag]
      nextMarks = marks.includes(mark) ? marks : [...marks, mark]
    }

    el.childNodes.forEach((child) => walk(child, nextMarks))
  }

  root.childNodes.forEach((child) => walk(child, []))

  // --- Normalization pass ---
  // 1. Sort each span's marks for deterministic output.
  // 2. Merge adjacent spans that share the exact same marks set.
  const normalized: EditorSpan[] = []
  for (const span of rawSpans) {
    span.marks = normalizeMarks(span.marks)
    const prev = normalized.length > 0 ? normalized[normalized.length - 1] : null
    if (prev && marksEqual(prev.marks, span.marks)) {
      // Merge into the previous span.
      prev.text += span.text
    } else {
      normalized.push(span)
    }
  }

  if (normalized.length === 0) {
    normalized.push({ _key: genKey(), text: '', marks: [] })
  }
  return { spans: normalized, links }
}

/**
 * Sort marks deterministically: decorator names (alphabetical) first, then
 * link annotation keys (which are random hex strings). Deduplicate.
 */
function normalizeMarks(marks: string[]): string[] {
  const unique = Array.from(new Set(marks))
  const decorators = unique.filter((m): m is EditorMark => m in MARK_TAGS).sort()
  const linkKeys = unique.filter((m) => !(m in MARK_TAGS)).sort()
  return [...decorators, ...linkKeys]
}

/** Check whether two sorted, deduplicated marks arrays are equal. */
function marksEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/** Render spans (+ link annotations) back to HTML for the contentEditable. */
function spansToHtml(spans: EditorSpan[], links: EditorLink[]): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  return spans
    .map((span) => {
      let html = escape(span.text)
      const linkKey = span.marks.find((m) =>
        links.some((l) => l._key === m)
      )
      const decorators = span.marks.filter(
        (m): m is EditorMark => m in MARK_TAGS
      )
      for (const mark of decorators) {
        const tag = MARK_TAGS[mark].toLowerCase()
        html = `<${tag}>${html}</${tag}>`
      }
      if (linkKey) {
        const link = links.find((l) => l._key === linkKey)
        html = `<a href="${escape(link?.href ?? '')}">${html}</a>`
      }
      return html
    })
    .join('')
}

// ============================================================
// Block helpers
// ============================================================

function newTextBlock(
  style: EditorBlockStyle,
  listItem?: EditorListItem
): EditorTextBlock {
  return {
    _key: genKey(),
    _type: 'block',
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    children: [{ _key: genKey(), text: '', marks: [] }],
    links: [],
  }
}

const BLOCK_LABELS: { value: EditorBlockStyle; label: string }[] = [
  { value: 'normal', label: 'Paragraph' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'blockquote', label: 'Quote' },
]

// ============================================================
// Component
// ============================================================

export function RichTextEditor({
  value,
  onChange,
  onInsertTable,
  error,
}: RichTextEditorProps) {
  // Refs to each text block's contentEditable, keyed by block _key, so we can
  // apply marks to the current selection via document.execCommand.
  const editableRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // When Enter splits a list item into a new sibling block, the new block's
  // contentEditable only mounts on the NEXT render (after onChange). We stash
  // its _key here and move focus/caret into it from an effect once it exists.
  const [pendingFocusKey, setPendingFocusKey] = useState<string | null>(null)

  useEffect(() => {
    if (!pendingFocusKey) return
    const el = editableRefs.current[pendingFocusKey]
    if (el) {
      el.focus()
      // Place the caret inside the (empty) new block.
      const sel = window.getSelection()
      if (sel) {
        const range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
    setPendingFocusKey(null)
  }, [pendingFocusKey, value])

  const updateBlock = useCallback(
    (key: string, updater: (block: EditorBlock) => EditorBlock) => {
      onChange(value.map((b) => (b._key === key ? updater(b) : b)))
    },
    [onChange, value]
  )

  const removeBlock = useCallback(
    (key: string) => {
      onChange(value.filter((b) => b._key !== key))
    },
    [onChange, value]
  )

  const moveBlock = useCallback(
    (index: number, dir: -1 | 1) => {
      const target = index + dir
      if (target < 0 || target >= value.length) return
      const next = [...value]
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      onChange(next)
    },
    [onChange, value]
  )

  const addBlock = useCallback(
    (block: EditorBlock) => {
      onChange([...value, block])
    },
    [onChange, value]
  )

  /**
   * Insert a block immediately AFTER the given index (mirrors `addBlock`, which
   * appends). Used by the per-block inline "add" controls so the author can add
   * the next block without scrolling back up to the top toolbar.
   */
  const insertBlockAfter = useCallback(
    (index: number, block: EditorBlock) => {
      const next = [...value]
      next.splice(index + 1, 0, block)
      onChange(next)
    },
    [onChange, value]
  )

  /** Read the contentEditable DOM for a text block and store the spans. */
  const syncTextBlock = useCallback(
    (key: string) => {
      const el = editableRefs.current[key]
      if (!el) return
      const { spans, links } = domToSpans(el)
      updateBlock(key, (block) => {
        if (block._type !== 'block') return block
        return { ...block, children: spans, links }
      })
    },
    [updateBlock]
  )

  /** Apply an inline decorator / link to the current selection then re-sync. */
  const applyInline = useCallback(
    (key: string, command: 'bold' | 'italic' | 'underline' | 'code' | 'link') => {
      const el = editableRefs.current[key]
      if (!el) return
      el.focus()
      if (command === 'link') {
        const href = window.prompt('Enter the link URL (https://…)')
        if (href) {
          document.execCommand('createLink', false, href)
        }
      } else if (command === 'code') {
        // execCommand has no "code" — wrap the selection in a <code> element.
        const sel = window.getSelection()
        if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
          const range = sel.getRangeAt(0)
          const code = document.createElement('code')
          code.appendChild(range.extractContents())
          range.insertNode(code)
          sel.removeAllRanges()
        }
      } else {
        document.execCommand(command)
      }
      syncTextBlock(key)
    },
    [syncTextBlock]
  )

  const setBlockStyle = useCallback(
    (key: string, style: EditorBlockStyle) => {
      updateBlock(key, (block) => {
        if (block._type !== 'block') return block
        // Switching to a plain style clears any list marker.
        const { listItem: _listItem, level: _level, ...rest } = block
        void _listItem
        void _level
        return { ...rest, style }
      })
    },
    [updateBlock]
  )

  const setListItem = useCallback(
    (key: string, listItem: EditorListItem | undefined) => {
      updateBlock(key, (block) => {
        if (block._type !== 'block') return block
        if (!listItem) {
          const { listItem: _li, level: _lvl, ...rest } = block
          void _li
          void _lvl
          return rest
        }
        return { ...block, style: 'normal', listItem, level: 1 }
      })
    },
    [updateBlock]
  )

  /**
   * Enter pressed inside a LIST item. Because the contentEditable drops <BR>s
   * on serialization, a native Enter would produce nothing useful (all lines
   * collapse into one bullet). Instead we model Enter as a structural split:
   *
   * - If the current item still has text, capture that text (read the live DOM)
   *   and insert a NEW empty list block of the SAME kind right after it, then
   *   move the caret into the new block (via `pendingFocusKey`).
   * - If the current item is EMPTY, "exit the list": convert this block back to
   *   a normal paragraph instead of adding another empty bullet. This mirrors
   *   the familiar Word/Docs behaviour and prevents runaway empty bullets.
   *
   * Both branches are expressed as a SINGLE `onChange` computed from the
   * current `value`, so the freshly-read DOM text and the structural change are
   * applied together (never off a stale closure).
   */
  const handleListEnter = useCallback(
    (key: string, listItem: EditorListItem) => {
      const el = editableRefs.current[key]
      if (!el) return
      const { spans, links } = domToSpans(el)
      const isEmpty = spans.every((s) => s.text.trim().length === 0)

      const index = value.findIndex((b) => b._key === key)
      if (index === -1) return

      if (isEmpty) {
        // Exit the list: this item becomes a normal paragraph in place.
        onChange(
          value.map((b) => {
            if (b._key !== key || b._type !== 'block') return b
            const { listItem: _li, level: _lvl, ...rest } = b
            void _li
            void _lvl
            return { ...rest, style: 'normal', children: spans, links }
          })
        )
        return
      }

      // Persist what was typed into the current item, then splice a new empty
      // sibling of the same list kind directly after it.
      const newBlock = newTextBlock('normal', listItem)
      const next = value.map((b) =>
        b._key === key && b._type === 'block'
          ? { ...b, children: spans, links }
          : b
      )
      next.splice(index + 1, 0, newBlock)
      onChange(next)
      setPendingFocusKey(newBlock._key)
    },
    [onChange, value]
  )

  const handleInsertTable = useCallback(() => {
    addBlock(newTableBlock())
    // Notify the host (e.g. to scroll to / flag unsaved changes). The append
    // itself is owned here since this component holds the body value/onChange.
    onInsertTable?.()
  }, [addBlock, onInsertTable])

  const handleInsertTableAfter = useCallback(
    (index: number) => {
      insertBlockAfter(index, newTableBlock())
      onInsertTable?.()
    },
    [insertBlockAfter, onInsertTable]
  )

  const handleInsertImage = useCallback(
    (img: UploaderImageValue | undefined) => {
      if (!img) return
      const block: EditorImageBlock = {
        _key: genKey(),
        _type: 'image',
        asset: img.asset,
        alt: img.alt,
        caption: img.caption,
      }
      addBlock(block)
    },
    [addBlock]
  )

  return (
    <div>
      {/* Add-block toolbar — sticky so it stays reachable while scrolling the
          body blocks. Uses a solid opaque background so body text does not show
          through when it overlaps the blocks beneath it. */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1.5 rounded-t-sm border border-hairline bg-wash px-2 py-2 dark:border-hairline-dark dark:bg-elevated">
        <span className="mr-1 font-sans text-caption font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
          Add
        </span>
        <AddBlockButtons
          onAdd={addBlock}
          onInsertTable={onInsertTable ? handleInsertTable : undefined}
        />
      </div>

      {/* Blocks */}
      <div
        className={`space-y-3 rounded-b-sm border border-t-0 p-3 ${
          error
            ? 'border-down dark:border-down-light'
            : 'border-hairline dark:border-hairline-dark'
        }`}
      >
        {value.length === 0 && (
          <p className="py-6 text-center text-caption text-ink-muted dark:text-ink-inverse-muted">
            Empty body. Use the buttons above to add a paragraph, heading, list,
            image{onInsertTable ? ', table' : ''} and more.
          </p>
        )}

        {value.map((block, index) => (
          <div
            key={block._key}
            className="rounded-sm border border-hairline bg-paper p-3 dark:border-hairline-dark dark:bg-graphite"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <BlockTypeBadge block={block} />
              <div className="ml-auto flex items-center gap-1">
                <IconButton
                  label="Move up"
                  onClick={() => moveBlock(index, -1)}
                  disabled={index === 0}
                >
                  ↑
                </IconButton>
                <IconButton
                  label="Move down"
                  onClick={() => moveBlock(index, 1)}
                  disabled={index === value.length - 1}
                >
                  ↓
                </IconButton>
                <IconButton label="Delete block" onClick={() => removeBlock(block._key)}>
                  ✕
                </IconButton>
              </div>
            </div>

            {block._type === 'block' && (
              <TextBlockRow
                block={block}
                editableRef={(el) => {
                  editableRefs.current[block._key] = el
                }}
                onSync={() => syncTextBlock(block._key)}
                onStyle={(style) => setBlockStyle(block._key, style)}
                onList={(li) => setListItem(block._key, li)}
                onInline={(cmd) => applyInline(block._key, cmd)}
                onListEnter={(li) => handleListEnter(block._key, li)}
              />
            )}

            {block._type === 'image' && (
              <ImageBlockRow
                block={block}
                onChange={(img) =>
                  updateBlock(block._key, () => ({
                    _key: block._key,
                    _type: 'image',
                    asset: img?.asset,
                    alt: img?.alt,
                    caption: img?.caption,
                  }))
                }
              />
            )}

            {block._type === 'tableBlock' && (
              <TableEditor
                value={block}
                onChange={(next) => updateBlock(block._key, () => next)}
              />
            )}

            {/* Inline "add block after this one" affordance so the author can
                keep writing without scrolling back up to the top toolbar. */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-dashed border-hairline pt-2 dark:border-hairline-dark">
              <span className="mr-1 font-sans text-caption font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
                Add below
              </span>
              <AddBlockButtons
                onAdd={(newBlock) => insertBlockAfter(index, newBlock)}
                onInsertTable={
                  onInsertTable ? () => handleInsertTableAfter(index) : undefined
                }
              />
            </div>
          </div>
        ))}

        {/* Persistent add-bar at the bottom of the block list — same actions as
            the top toolbar, so the next block can be added right where the
            author is working. */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-sm border border-dashed border-hairline bg-wash px-2 py-2 dark:border-hairline-dark dark:bg-elevated">
          <span className="mr-1 font-sans text-caption font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
            Add
          </span>
          <AddBlockButtons
            onAdd={addBlock}
            onInsertTable={onInsertTable ? handleInsertTable : undefined}
          />
        </div>

        {/* Inline image insert */}
        <div className="rounded-sm border border-dashed border-hairline p-3 dark:border-hairline-dark">
          <ImageUploader
            label="Insert image into body"
            withCaption
            onChange={handleInsertImage}
          />
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-caption text-down dark:text-down-light">
          {error}
        </p>
      )}
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================

/**
 * The shared set of "add block" actions rendered by the sticky top toolbar,
 * the per-block "Add below" control, and the bottom add-bar. `onAdd` receives a
 * freshly constructed block; the caller decides whether to append it or splice
 * it in after a given index. `onInsertTable`, when provided, adds the table.
 */
function AddBlockButtons({
  onAdd,
  onInsertTable,
}: {
  onAdd: (block: EditorBlock) => void
  onInsertTable?: () => void
}) {
  return (
    <>
      <ToolbarButton onClick={() => onAdd(newTextBlock('normal'))}>
        Paragraph
      </ToolbarButton>
      <ToolbarButton onClick={() => onAdd(newTextBlock('h2'))}>H2</ToolbarButton>
      <ToolbarButton onClick={() => onAdd(newTextBlock('h3'))}>H3</ToolbarButton>
      <ToolbarButton onClick={() => onAdd(newTextBlock('h4'))}>H4</ToolbarButton>
      <ToolbarButton onClick={() => onAdd(newTextBlock('blockquote'))}>
        Quote
      </ToolbarButton>
      <ToolbarButton onClick={() => onAdd(newTextBlock('normal', 'bullet'))}>
        • List
      </ToolbarButton>
      <ToolbarButton onClick={() => onAdd(newTextBlock('normal', 'number'))}>
        1. List
      </ToolbarButton>
      {onInsertTable && (
        <ToolbarButton onClick={onInsertTable}>Insert table</ToolbarButton>
      )}
    </>
  )
}

function ToolbarButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-sm border border-hairline bg-paper px-2 py-1 font-sans text-caption text-ink-body transition-colors hover:border-accent hover:text-accent dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse-body dark:hover:border-accent-light dark:hover:text-accent-light"
    >
      {children}
    </button>
  )
}

function IconButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex h-6 w-6 items-center justify-center rounded-sm border border-hairline text-caption text-ink-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40 dark:border-hairline-dark dark:text-ink-inverse-muted dark:hover:border-accent-light dark:hover:text-accent-light"
    >
      {children}
    </button>
  )
}

function BlockTypeBadge({ block }: { block: EditorBlock }) {
  let label = 'Paragraph'
  if (block._type === 'image') label = 'Image'
  else if (block._type === 'tableBlock') label = 'Table'
  else if (block.listItem === 'bullet') label = 'Bullet item'
  else if (block.listItem === 'number') label = 'Numbered item'
  else if (block.style !== 'normal') {
    label =
      BLOCK_LABELS.find((b) => b.value === block.style)?.label ?? block.style
  }
  return (
    <span className="rounded-sm bg-wash px-2 py-0.5 font-sans text-caption font-semibold uppercase tracking-wide text-ink-muted dark:bg-elevated dark:text-ink-inverse-muted">
      {label}
    </span>
  )
}

function TextBlockRow({
  block,
  editableRef,
  onSync,
  onStyle,
  onList,
  onInline,
  onListEnter,
}: {
  block: EditorTextBlock
  editableRef: (el: HTMLDivElement | null) => void
  onSync: () => void
  onStyle: (style: EditorBlockStyle) => void
  onList: (li: EditorListItem | undefined) => void
  onInline: (cmd: 'bold' | 'italic' | 'underline' | 'code' | 'link') => void
  /** Plain Enter inside a list item: split into a new sibling list block. */
  onListEnter: (li: EditorListItem) => void
}) {
  // The contentEditable is UNCONTROLLED: its innerHTML is initialised exactly
  // once on mount and thereafter owned by the browser. React must never rewrite
  // it on subsequent renders or the caret would jump on every keystroke (the
  // model is updated via onSync instead). `block._key` keys the row upstream,
  // so a genuinely different block gets a fresh mount.
  const localRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = localRef.current
    if (el) {
      el.innerHTML = spansToHtml(block.children, block.links)
    }
    // Intentionally run only on mount; see comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setRef = (el: HTMLDivElement | null) => {
    localRef.current = el
    editableRef(el)
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <select
          value={block.listItem ? '' : block.style}
          onChange={(e) => onStyle(e.target.value as EditorBlockStyle)}
          disabled={Boolean(block.listItem)}
          className="rounded-sm border border-hairline bg-paper px-2 py-1 font-sans text-caption text-ink disabled:opacity-50 dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse"
        >
          {BLOCK_LABELS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <MarkButton onClick={() => onInline('bold')} title="Bold">
          <strong>B</strong>
        </MarkButton>
        <MarkButton onClick={() => onInline('italic')} title="Italic">
          <em>I</em>
        </MarkButton>
        <MarkButton onClick={() => onInline('underline')} title="Underline">
          <u>U</u>
        </MarkButton>
        <MarkButton onClick={() => onInline('code')} title="Code">
          <span className="font-mono">{'<>'}</span>
        </MarkButton>
        <MarkButton onClick={() => onInline('link')} title="Add link">
          Link
        </MarkButton>
        <span className="mx-1 h-4 w-px bg-hairline dark:bg-hairline-dark" />
        <MarkButton
          onClick={() =>
            onList(block.listItem === 'bullet' ? undefined : 'bullet')
          }
          title="Bullet list"
          active={block.listItem === 'bullet'}
        >
          •
        </MarkButton>
        <MarkButton
          onClick={() =>
            onList(block.listItem === 'number' ? undefined : 'number')
          }
          title="Numbered list"
          active={block.listItem === 'number'}
        >
          1.
        </MarkButton>
      </div>
      <div
        ref={setRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        onInput={onSync}
        onBlur={onSync}
        onKeyDown={(e) => {
          // Enter inside a LIST item must create a NEW sibling list item rather
          // than a browser <BR> (which domToSpans drops, collapsing every line
          // into one bullet). Shift+Enter keeps its native behaviour. Non-list
          // blocks are left alone so paragraph editing is unchanged.
          if (
            e.key === 'Enter' &&
            !e.shiftKey &&
            !e.nativeEvent.isComposing &&
            block.listItem
          ) {
            e.preventDefault()
            onListEnter(block.listItem)
          }
        }}
        onPaste={(e) => {
          // Paste as PLAIN TEXT: pulling in source HTML carries inline
          // background-color/color/font styles (the black box the author saw)
          // and stray markup. We insert only the plain text at the caret via
          // execCommand('insertText'), which preserves the caret and native
          // undo, then re-sync the model. The pasted text then adopts the
          // editor's own bg-paper/text-ink styling.
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
          onSync()
        }}
        className="min-h-[2.5rem] w-full rounded-sm border border-hairline bg-paper px-3 py-2 font-sans text-sm leading-relaxed text-ink focus:border-accent focus:outline-none dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse"
      />
    </div>
  )
}

function MarkButton({
  onClick,
  title,
  active,
  children,
}: {
  onClick: () => void
  title: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`flex h-7 min-w-[1.75rem] items-center justify-center rounded-sm border px-1.5 font-sans text-caption transition-colors ${
        active
          ? 'border-accent bg-accent-soft text-accent dark:border-accent-light dark:bg-wash-dark dark:text-accent-light'
          : 'border-hairline text-ink-body hover:border-accent hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-body dark:hover:border-accent-light dark:hover:text-accent-light'
      }`}
    >
      {children}
    </button>
  )
}

function ImageBlockRow({
  block,
  onChange,
}: {
  block: EditorImageBlock
  onChange: (img: UploaderImageValue | undefined) => void
}) {
  const value: UploaderImageValue | undefined = block.asset
    ? {
        _type: 'image',
        asset: block.asset,
        alt: block.alt,
        caption: block.caption,
      }
    : undefined
  return (
    <ImageUploader
      label="Body image"
      withCaption
      value={value}
      onChange={onChange}
    />
  )
}

/**
 * Build a fresh, empty `tableBlock` for the "Insert table" action: 2 columns ×
 * 1 row of empty strings, kept rectangular. The user then fills in the header
 * and cells and adds more rows/columns in the spreadsheet-style TableEditor.
 */
export function newTableBlock(): EditorTableBlock {
  return {
    _key: genKey(),
    _type: 'tableBlock',
    header: ['', ''],
    rows: [{ _key: genKey(), cells: ['', ''] }],
  }
}
