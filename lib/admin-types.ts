/**
 * Editor-internal document model for the WordPress/Studio-style admin editor.
 *
 * These types describe the shape the editor works with in the browser. They
 * mirror the field names and validation limits of `sanity/schemas/article.ts`
 * so that a draft can be serialized straight into a Sanity `article` document
 * (via the helpers in `lib/portable-text.ts`).
 *
 * The rich-text body is modelled as a flat list of `EditorBlock`s. This maps
 * one-to-one onto the Portable Text array stored on `article.body` (paragraphs,
 * headings, quotes, list items, images and the dependency-free `tableBlock`).
 */

/** Block-level style, matching the article schema's `block` styles. */
export type EditorBlockStyle =
  | 'normal'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'blockquote'

/** List kind for list blocks, matching Portable Text `listItem`. */
export type EditorListItem = 'bullet' | 'number'

/** Inline decorators, matching the article schema's `marks.decorators`. */
export type EditorMark = 'strong' | 'em' | 'underline' | 'code'

/**
 * An inline span of text within a text block. `marks` holds decorator names
 * (`strong`/`em`/...) and/or the `_key` of a link annotation in the block's
 * `links` array.
 */
export interface EditorSpan {
  _key: string
  text: string
  marks: string[]
}

/** A link annotation referenced by a span's `marks` (stored as a markDef). */
export interface EditorLink {
  _key: string
  href: string
}

/**
 * A text block: paragraph, heading, quote, or a single list item. When
 * `listItem` is set the block renders as a bullet/numbered list entry at
 * `level` (1-based, mirroring Sanity's output).
 */
export interface EditorTextBlock {
  _key: string
  _type: 'block'
  style: EditorBlockStyle
  listItem?: EditorListItem
  level?: number
  children: EditorSpan[]
  links: EditorLink[]
}

/** A table block for the editor, mirroring `sanity/schemas/tableBlock.ts`. */
export interface EditorTableBlock {
  _key: string
  _type: 'tableBlock'
  caption?: string
  header: string[]
  rows: { _key: string; cells: string[] }[]
}

/** An inline image block within the body, mirroring the schema's `image`. */
export interface EditorImageBlock {
  _key: string
  _type: 'image'
  asset?: { _ref: string; _type: 'reference' }
  alt?: string
  caption?: string
}

/** Any block that can appear in an article body inside the editor. */
export type EditorBlock =
  | EditorTextBlock
  | EditorTableBlock
  | EditorImageBlock

/** A reference to another Sanity document (author, category). */
export interface SanityReference {
  _type: 'reference'
  _ref: string
}

/** Featured / main image on the draft, mirroring `article.mainImage`. */
export interface EditorMainImage {
  _type: 'image'
  asset?: { _ref: string; _type: 'reference' }
  alt?: string
}

/** A single FAQ entry, mirroring `article.faqs[]`. */
export interface EditorFaq {
  question: string
  answer: string
}

/**
 * The full editor draft for an article. Field names mirror
 * `sanity/schemas/article.ts`; see the validation limits below.
 */
export interface ArticleDraft {
  /** Sanity document id, e.g. `drafts.<uuid>` or `<uuid>`. Empty for new. */
  _id?: string
  title: string
  /** Slug string (stored on the doc as `{ current: slug }`). */
  slug: string
  /** Required, max 300 chars (article schema `excerpt`). */
  excerpt: string
  /** Rich-text body as editor blocks. */
  bodyModel: EditorBlock[]
  /** Reference to an `author` document. */
  authorRef?: SanityReference
  /** Reference to a `category` document. */
  categoryRef?: SanityReference
  /** ISO datetime string (article schema `publishedAt`). */
  publishedAt?: string
  /** Featured image. */
  mainImage?: EditorMainImage
  /** Optional, max 70 chars (article schema `seoTitle`). */
  seoTitle?: string
  /** Optional, max 160 chars (article schema `seoDescription`). */
  seoDescription?: string
  /** Optional FAQ list. */
  faqs?: EditorFaq[]
}

/**
 * Validation limits copied from `sanity/schemas/article.ts`. Kept as a single
 * source of truth for the editor's client-side validation so the two never
 * drift.
 */
export const ARTICLE_LIMITS = {
  excerptMax: 300,
  seoTitleMax: 70,
  seoDescriptionMax: 160,
  slugMax: 96,
} as const

/** A row in the /admin dashboard article list. */
export interface AdminArticleListItem {
  _id: string
  title?: string
  slug?: string
  publishedAt?: string
  _updatedAt?: string
  category?: string
  author?: string
  /** Derived: an id prefixed with `drafts.` is an unpublished draft. */
  isDraft: boolean
}
