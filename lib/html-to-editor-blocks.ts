import { genKey } from '@/lib/portable-text'
import type {
  EditorBlock,
  EditorBlockStyle,
  EditorLink,
  EditorListItem,
  EditorSpan,
  EditorTableBlock,
  EditorTextBlock,
  EditorMark,
} from '@/lib/admin-types'

/**
 * Dependency-free HTML -> editor-block converter for the admin editor.
 *
 * PURPOSE: lets an author paste a full HTML article (the paste-ready HTML the
 * SEO workflow produces) and have it turned into the SAME `EditorBlock[]` model
 * the block editor produces. Because the output is the editor model, it flows
 * through the existing `serializeBody` (`lib/portable-text.ts`) -> Sanity
 * Portable Text -> `PortableTextRenderer` path UNCHANGED. Nothing about the
 * schema, the save logic, or the public renderer is touched, so there is no
 * risk to already-published content: this only adds a new INPUT path.
 *
 * SUPPORTED HTML (everything the article schema can represent):
 *   - <p>                                  -> paragraph
 *   - <h1>/<h2>/<h3>/<h4>/<h5>/<h6>        -> h2/h3/h4 (h1->h2, h5/h6->h4)
 *   - <blockquote>                         -> quote (each child paragraph = 1 quote block)
 *   - <ul><li> / <ol><li>                  -> bullet / number list items
 *   - <table><thead/tbody><tr><th/td>      -> tableBlock (+ optional <caption>)
 *   - inline <strong>/<b>, <em>/<i>, <u>,
 *     <code>, <a href>                     -> marks + link markDefs
 *   - a top-level wrapper <div>/<section>/<article> is unwrapped
 *
 * Anything unsupported (scripts, styles, forms, iframes, images without a
 * Sanity asset, etc.) is safely ignored. Text is taken via textContent, so no
 * raw HTML is ever injected anywhere — this is parse-only.
 *
 * Runs in the browser only (uses `DOMParser`), matching how the editor already
 * relies on the DOM for its contentEditable serialization.
 */

const HEADING_MAP: Record<string, EditorBlockStyle> = {
  H1: 'h2', // demote a stray <h1> — the page renders its own H1 title
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h4',
  H6: 'h4',
}

const TAG_TO_MARK: Record<string, EditorMark> = {
  STRONG: 'strong',
  B: 'strong',
  EM: 'em',
  I: 'em',
  U: 'underline',
  CODE: 'code',
}

/** Block-level tags we know how to convert; used to detect nesting/leaks. */
const BLOCK_TAGS = new Set([
  'P',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'BLOCKQUOTE',
  'UL',
  'OL',
  'LI',
  'TABLE',
  'DIV',
  'SECTION',
  'ARTICLE',
  'HEADER',
  'FOOTER',
  'MAIN',
  'ASIDE',
])

interface InlineResult {
  spans: EditorSpan[]
  links: EditorLink[]
}

/**
 * Walk the inline children of an element and produce Portable-Text-style spans
 * plus the link annotations they reference. Mirrors the normalization the
 * block editor's `domToSpans` performs (merge adjacent equal-mark spans, sort
 * marks) so pasted content and hand-typed content serialize identically.
 */
function inlineFromNode(node: Node): InlineResult {
  const rawSpans: EditorSpan[] = []
  const links: EditorLink[] = []

  const walk = (n: Node, marks: string[]) => {
    if (n.nodeType === Node.TEXT_NODE) {
      const text = (n.textContent ?? '').replace(/\s+/g, ' ')
      if (text.length > 0) {
        rawSpans.push({ _key: genKey(), text, marks: [...marks] })
      }
      return
    }
    if (n.nodeType !== Node.ELEMENT_NODE) return

    const el = n as HTMLElement
    const tag = el.tagName

    if (tag === 'BR') return // hard breaks aren't modelled as newline spans

    let nextMarks = marks
    if (tag === 'A') {
      const href = (el.getAttribute('href') || '').trim()
      if (href) {
        const link: EditorLink = { _key: genKey(), href }
        links.push(link)
        nextMarks = [...marks, link._key]
      }
    } else if (TAG_TO_MARK[tag]) {
      const mark = TAG_TO_MARK[tag]
      nextMarks = marks.includes(mark) ? marks : [...marks, mark]
    }

    el.childNodes.forEach((child) => walk(child, nextMarks))
  }

  node.childNodes.forEach((child) => walk(child, []))

  // Trim leading/trailing whitespace-only spans, then merge adjacent spans
  // that share the exact same marks.
  const trimmed = trimEdgeWhitespace(rawSpans)
  const merged: EditorSpan[] = []
  for (const span of trimmed) {
    span.marks = normalizeMarks(span.marks)
    const prev = merged.length > 0 ? merged[merged.length - 1] : null
    if (prev && marksEqual(prev.marks, span.marks)) {
      prev.text += span.text
    } else {
      merged.push(span)
    }
  }

  // Keep only links still referenced by a surviving span.
  const usedKeys = new Set(merged.flatMap((s) => s.marks))
  const usedLinks = links.filter((l) => usedKeys.has(l._key))

  return { spans: merged, links: usedLinks }
}

function trimEdgeWhitespace(spans: EditorSpan[]): EditorSpan[] {
  const copy = spans.map((s) => ({ ...s }))
  if (copy.length > 0) copy[0].text = copy[0].text.replace(/^\s+/, '')
  if (copy.length > 0) {
    const last = copy[copy.length - 1]
    last.text = last.text.replace(/\s+$/, '')
  }
  return copy.filter((s) => s.text.length > 0)
}

function normalizeMarks(marks: string[]): string[] {
  const unique = Array.from(new Set(marks))
  const decorators = unique
    .filter((m): m is EditorMark => isDecorator(m))
    .sort()
  const linkKeys = unique.filter((m) => !isDecorator(m)).sort()
  return [...decorators, ...linkKeys]
}

function isDecorator(mark: string): mark is EditorMark {
  return mark === 'strong' || mark === 'em' || mark === 'underline' || mark === 'code'
}

function marksEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/** Build a text block from an already-computed inline result. */
function textBlock(
  style: EditorBlockStyle,
  inline: InlineResult,
  listItem?: EditorListItem
): EditorTextBlock {
  const children =
    inline.spans.length > 0 ? inline.spans : [{ _key: genKey(), text: '', marks: [] }]
  return {
    _key: genKey(),
    _type: 'block',
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    children,
    links: inline.links,
  }
}

/** Convert a <table> element into an editor tableBlock (or null if empty). */
function tableFromElement(table: HTMLTableElement): EditorTableBlock | null {
  const captionEl = table.querySelector('caption')
  const caption = captionEl?.textContent?.trim() || undefined

  const allRows = Array.from(table.querySelectorAll('tr'))
  if (allRows.length === 0) return null

  const cellsOf = (tr: Element): string[] =>
    Array.from(tr.querySelectorAll('th,td')).map(
      (c) => (c.textContent ?? '').replace(/\s+/g, ' ').trim()
    )

  // Header = the first row that contains <th>, else the first row.
  const headerRowIndex = allRows.findIndex((tr) => tr.querySelector('th'))
  const headerIdx = headerRowIndex === -1 ? 0 : headerRowIndex
  const header = cellsOf(allRows[headerIdx])

  const rows = allRows
    .filter((_, i) => i !== headerIdx)
    .map((tr) => cellsOf(tr))
    .filter((cells) => cells.length > 0)

  if (header.length === 0 && rows.length === 0) return null

  return {
    _key: genKey(),
    _type: 'tableBlock',
    ...(caption ? { caption } : {}),
    header,
    rows: rows.map((cells) => ({ _key: genKey(), cells })),
  }
}

/** Convert a single top-level element into zero or more editor blocks. */
function blocksFromElement(el: HTMLElement): EditorBlock[] {
  const tag = el.tagName

  if (tag === 'P') {
    const inline = inlineFromNode(el)
    return inline.spans.length ? [textBlock('normal', inline)] : []
  }

  if (HEADING_MAP[tag]) {
    const inline = inlineFromNode(el)
    return inline.spans.length ? [textBlock(HEADING_MAP[tag], inline)] : []
  }

  if (tag === 'BLOCKQUOTE') {
    // Each paragraph inside becomes its own quote block; if there are no inner
    // paragraphs, treat the blockquote's own inline content as one quote.
    const paras = Array.from(el.querySelectorAll(':scope > p'))
    if (paras.length > 0) {
      return paras
        .map((p) => inlineFromNode(p))
        .filter((inline) => inline.spans.length > 0)
        .map((inline) => textBlock('blockquote', inline))
    }
    const inline = inlineFromNode(el)
    return inline.spans.length ? [textBlock('blockquote', inline)] : []
  }

  if (tag === 'UL' || tag === 'OL') {
    const listItem: EditorListItem = tag === 'OL' ? 'number' : 'bullet'
    return Array.from(el.querySelectorAll(':scope > li'))
      .map((li) => inlineFromNode(li))
      .filter((inline) => inline.spans.length > 0)
      .map((inline) => textBlock('normal', inline, listItem))
  }

  if (tag === 'TABLE') {
    const table = tableFromElement(el as HTMLTableElement)
    return table ? [table] : []
  }

  // Generic wrapper (div/section/article/etc.): recurse into its children so
  // wrapped article markup (e.g. a <div class="quick-answer">) is flattened.
  if (
    tag === 'DIV' ||
    tag === 'SECTION' ||
    tag === 'ARTICLE' ||
    tag === 'HEADER' ||
    tag === 'FOOTER' ||
    tag === 'MAIN' ||
    tag === 'ASIDE'
  ) {
    return blocksFromChildren(el)
  }

  // Unknown element with block-level text but no known wrapper: if it holds
  // meaningful inline text, keep it as a paragraph so nothing is silently lost.
  const inline = inlineFromNode(el)
  return inline.spans.length ? [textBlock('normal', inline)] : []
}

/** Walk the element children of a container, converting each to blocks. */
function blocksFromChildren(container: HTMLElement): EditorBlock[] {
  const out: EditorBlock[] = []
  container.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      out.push(...blocksFromElement(node as HTMLElement))
    } else if (node.nodeType === Node.TEXT_NODE) {
      // Loose text directly under the container (not wrapped in a block tag):
      // only emit it if it is non-whitespace, as a paragraph.
      const text = (node.textContent ?? '').trim()
      if (text.length > 0) {
        out.push(textBlock('normal', { spans: [{ _key: genKey(), text, marks: [] }], links: [] }))
      }
    }
  })
  return out
}

export interface HtmlImportResult {
  blocks: EditorBlock[]
  /** Human-readable counts for a confirmation summary in the UI. */
  summary: {
    paragraphs: number
    headings: number
    lists: number
    tables: number
    quotes: number
    total: number
  }
}

/**
 * Parse an HTML string into editor blocks.
 *
 * @param html Raw HTML (a full article body — no <html>/<body> wrapper needed,
 *             but tolerated). Only the body content is read.
 * @returns The converted blocks plus a summary for UI confirmation. Returns an
 *          empty result (never throws) when `html` is blank or unparseable, or
 *          when called outside the browser.
 */
export function htmlToEditorBlocks(html: string): HtmlImportResult {
  const empty: HtmlImportResult = {
    blocks: [],
    summary: { paragraphs: 0, headings: 0, lists: 0, tables: 0, quotes: 0, total: 0 },
  }

  if (!html || !html.trim()) return empty
  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    return empty
  }

  let doc: Document
  try {
    doc = new window.DOMParser().parseFromString(html, 'text/html')
  } catch {
    return empty
  }

  // Strip elements that carry no article content (defensive; textContent would
  // ignore <script>/<style> anyway, but this avoids leaking their text).
  doc.querySelectorAll('script,style,noscript,template,iframe,form').forEach((n) => n.remove())

  const blocks = blocksFromChildren(doc.body)

  const summary = blocks.reduce(
    (acc, b) => {
      acc.total += 1
      if (b._type === 'tableBlock') acc.tables += 1
      else if (b._type === 'block') {
        if (b.listItem) acc.lists += 1
        else if (b.style === 'blockquote') acc.quotes += 1
        else if (b.style === 'h2' || b.style === 'h3' || b.style === 'h4')
          acc.headings += 1
        else acc.paragraphs += 1
      }
      return acc
    },
    { paragraphs: 0, headings: 0, lists: 0, tables: 0, quotes: 0, total: 0 }
  )

  return { blocks, summary }
}

/** Exported for tests: whether a tag is treated as block-level. */
export function isBlockTag(tag: string): boolean {
  return BLOCK_TAGS.has(tag.toUpperCase())
}
