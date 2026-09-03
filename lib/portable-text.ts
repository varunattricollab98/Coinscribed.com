import type { PortableTextBlock } from '@/lib/sanity-queries'
import type {
  EditorBlock,
  EditorImageBlock,
  EditorLink,
  EditorListItem,
  EditorSpan,
  EditorTableBlock,
  EditorTextBlock,
  EditorBlockStyle,
  EditorMark,
} from '@/lib/admin-types'

/**
 * Pure, dependency-free helpers for converting between the editor's internal
 * document model (`lib/admin-types.ts`) and Sanity Portable Text.
 *
 * The output shapes here match, EXACTLY:
 *   - `data/sample-news.ts` (buildBody / textBlock) for text and list blocks,
 *   - `sanity/schemas/tableBlock.ts` + the `TableValue` in
 *     `components/news/PortableTextRenderer.tsx` for `tableBlock`,
 *   - the `PortableTextBlock` interface in `lib/sanity-queries.ts`.
 *
 * No third-party serializer is used so the admin bundle stays lean and the
 * project adds zero new dependencies.
 */

// ============================================================
// Keys
// ============================================================

const HEX = '0123456789abcdef'

/**
 * Generate a short random key for a Portable Text node's `_key`.
 *
 * Sanity only requires keys to be unique within their array, so 12 hex chars
 * is ample. Uses `crypto.getRandomValues` when available (browser/modern Node),
 * falling back to `Math.random`.
 *
 * @param length Number of hex characters (default 12).
 */
export function genKey(length = 12): string {
  const cryptoObj =
    typeof globalThis !== 'undefined'
      ? (globalThis.crypto as Crypto | undefined)
      : undefined

  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(length)
    cryptoObj.getRandomValues(bytes)
    let out = ''
    for (let i = 0; i < length; i += 1) {
      out += HEX[bytes[i] % 16]
    }
    return out
  }

  let out = ''
  for (let i = 0; i < length; i += 1) {
    out += HEX[Math.floor(Math.random() * 16)]
  }
  return out
}

// ============================================================
// Span / mark / link builders
// ============================================================

/**
 * Build a single Portable Text span.
 *
 * @param text  The span text.
 * @param marks Decorator names (`strong`/`em`/...) and/or link markDef keys.
 * @param key   Optional explicit `_key` (generated when omitted).
 */
export function buildSpan(
  text: string,
  marks: string[] = [],
  key?: string
): EditorSpan {
  return { _key: key ?? genKey(), text, marks }
}

/**
 * Build a link annotation (markDef). Spans that fall inside the link reference
 * its `_key` in their `marks` array.
 *
 * @param href The URL.
 * @param key  Optional explicit `_key` (generated when omitted).
 */
export function buildLink(href: string, key?: string): EditorLink {
  return { _key: key ?? genKey(), href }
}

// ============================================================
// Block builders (match data/sample-news.ts exactly)
// ============================================================

/**
 * Build a text (paragraph / heading / quote / list-item) block.
 *
 * The emitted object matches `data/sample-news.ts` `textBlock`:
 *   { _key, _type:'block', style, [listItem, level:1], children, markDefs }
 * List blocks add `listItem` and `level: 1`; link annotations go in `markDefs`.
 *
 * @param style    Block style (`normal`|`h2`|`h3`|`h4`|`blockquote`).
 * @param children Inline spans.
 * @param options  Optional `listItem` (adds `level:1`), `links` (markDefs) and
 *                 an explicit `_key`.
 */
export function buildBlock(
  style: EditorBlockStyle,
  children: EditorSpan[],
  options: {
    listItem?: EditorListItem
    links?: EditorLink[]
    key?: string
  } = {}
): PortableTextBlock {
  const { listItem, links = [], key } = options
  return {
    _key: key ?? genKey(),
    _type: 'block',
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    children: children.map((c) => ({
      _key: c._key,
      _type: 'span',
      text: c.text,
      marks: c.marks,
    })),
    markDefs: links.map((l) => ({ _key: l._key, _type: 'link', href: l.href })),
  }
}

/**
 * Convenience: build a plain single-span text block (no inline formatting),
 * mirroring the common case in `data/sample-news.ts`.
 */
export function buildTextBlock(
  style: EditorBlockStyle,
  text: string,
  listItem?: EditorListItem
): PortableTextBlock {
  return buildBlock(style, [buildSpan(text)], { listItem })
}

// ============================================================
// Table builder (matches sanity/schemas/tableBlock.ts exactly)
// ============================================================

/**
 * Build a `tableBlock` matching `sanity/schemas/tableBlock.ts` and the
 * `TableValue` consumed by `components/news/PortableTextRenderer.tsx`:
 *
 *   { _key, _type:'tableBlock', caption?, header:string[],
 *     rows:[{ _key, _type:'row', cells:string[] }] }
 *
 * `caption` is only included when non-empty (the schema field is optional).
 *
 * @param caption Optional caption shown above the table.
 * @param header  Column titles.
 * @param rows    Each row's cells, in the same order as `header`.
 * @param key     Optional explicit `_key` for the block.
 */
export function buildTableBlock(
  caption: string | undefined,
  header: string[],
  rows: string[][],
  key?: string
): PortableTextBlock {
  const trimmedCaption = caption?.trim()
  return {
    _key: key ?? genKey(),
    _type: 'tableBlock',
    ...(trimmedCaption ? { caption: trimmedCaption } : {}),
    header,
    rows: rows.map((cells) => ({
      _key: genKey(),
      _type: 'row',
      cells,
    })),
  } as PortableTextBlock
}

// ============================================================
// Editor model -> Portable Text (serialize)
// ============================================================

/** Serialize a single editor block into a Portable Text block. */
export function serializeBlock(block: EditorBlock): PortableTextBlock {
  if (block._type === 'tableBlock') {
    return buildTableBlock(
      block.caption,
      block.header,
      block.rows.map((r) => r.cells),
      block._key
    )
  }

  if (block._type === 'image') {
    // Images are stored much like Sanity emits them: an image object with an
    // asset reference plus optional alt/caption fields.
    const img = block as EditorImageBlock
    return {
      _key: img._key,
      _type: 'image',
      ...(img.asset ? { asset: img.asset } : {}),
      ...(img.alt ? { alt: img.alt } : {}),
      ...(img.caption ? { caption: img.caption } : {}),
    } as unknown as PortableTextBlock
  }

  const text = block as EditorTextBlock
  return buildBlock(text.style, text.children, {
    listItem: text.listItem,
    links: text.links,
    key: text._key,
  })
}

/** Serialize the editor body model into a Portable Text array for `article.body`. */
export function serializeBody(model: EditorBlock[]): PortableTextBlock[] {
  return model.map(serializeBlock)
}

// ============================================================
// Portable Text -> editor model (parse / inverse)
// ============================================================

const KNOWN_STYLES: EditorBlockStyle[] = [
  'normal',
  'h2',
  'h3',
  'h4',
  'blockquote',
]

const KNOWN_MARKS: EditorMark[] = ['strong', 'em', 'underline', 'code']

/** Whether a decorator name is one of the article schema's decorators. */
export function isKnownMark(mark: string): mark is EditorMark {
  return (KNOWN_MARKS as string[]).includes(mark)
}

/** Parse a Portable Text block into an editor text block. */
function parseTextBlock(block: PortableTextBlock): EditorTextBlock {
  const style: EditorBlockStyle = KNOWN_STYLES.includes(
    block.style as EditorBlockStyle
  )
    ? (block.style as EditorBlockStyle)
    : 'normal'

  const links: EditorLink[] = (block.markDefs ?? [])
    .filter((def) => def._type === 'link')
    .map((def) => ({ _key: def._key, href: def.href ?? '' }))

  const children: EditorSpan[] = (block.children ?? [])
    .filter((child) => child._type === 'span')
    .map((child) => ({
      _key: child._key ?? genKey(),
      text: child.text ?? '',
      marks: Array.isArray(child.marks) ? child.marks : [],
    }))

  const listItem =
    block.listItem === 'bullet' || block.listItem === 'number'
      ? (block.listItem as EditorListItem)
      : undefined

  return {
    _key: block._key ?? genKey(),
    _type: 'block',
    style,
    ...(listItem ? { listItem, level: block.level ?? 1 } : {}),
    children,
    links,
  }
}

/** Parse a `tableBlock` Portable Text value into an editor table block. */
function parseTableBlock(block: PortableTextBlock): EditorTableBlock {
  const raw = block as unknown as {
    _key?: string
    caption?: string
    header?: string[]
    rows?: { _key?: string; cells?: string[] }[]
  }
  return {
    _key: raw._key ?? genKey(),
    _type: 'tableBlock',
    ...(raw.caption ? { caption: raw.caption } : {}),
    header: Array.isArray(raw.header) ? raw.header : [],
    rows: (Array.isArray(raw.rows) ? raw.rows : []).map((row) => ({
      _key: row._key ?? genKey(),
      cells: Array.isArray(row.cells) ? row.cells : [],
    })),
  }
}

/** Parse an image Portable Text value into an editor image block. */
function parseImageBlock(block: PortableTextBlock): EditorImageBlock {
  const raw = block as unknown as {
    _key?: string
    asset?: { _ref: string; _type: 'reference' }
    alt?: string
    caption?: string
  }
  return {
    _key: raw._key ?? genKey(),
    _type: 'image',
    ...(raw.asset ? { asset: raw.asset } : {}),
    ...(raw.alt ? { alt: raw.alt } : {}),
    ...(raw.caption ? { caption: raw.caption } : {}),
  }
}

/**
 * Parse a Portable Text array (an existing `article.body`) into the editor's
 * internal model so the edit screen can load and modify existing content.
 * Unknown block types are skipped.
 */
export function parseBody(blocks: PortableTextBlock[] | undefined): EditorBlock[] {
  if (!Array.isArray(blocks)) return []

  return blocks.reduce<EditorBlock[]>((acc, block) => {
    if (!block || typeof block !== 'object') return acc

    if (block._type === 'tableBlock') {
      acc.push(parseTableBlock(block))
    } else if (block._type === 'image') {
      acc.push(parseImageBlock(block))
    } else if (block._type === 'block') {
      acc.push(parseTextBlock(block))
    }
    return acc
  }, [])
}
