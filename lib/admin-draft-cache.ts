/**
 * Local draft auto-save / recovery for the custom /admin article editor.
 *
 * The editor keeps its working document (`ArticleDraft`) in React state. If the
 * author accidentally hits browser Back, refreshes, or the tab crashes before
 * saving to Sanity, that in-progress work is normally lost. To prevent this we
 * mirror the draft into `localStorage` as they type, and offer to restore it the
 * next time the same editor screen opens.
 *
 * Design notes:
 * - Storage is best-effort. Every access is guarded for SSR (`window`
 *   undefined) and wrapped in try/catch, so a disabled/full localStorage never
 *   breaks the editor (mirrors the defensive pattern in `lib/sanity-admin.ts`).
 * - Entries carry a timestamp and expire after `MAX_AGE_MS`, so we never offer
 *   to restore stale week-old content.
 * - The whole `ArticleDraft` (including `bodyModel: EditorBlock[]`) is plain
 *   JSON, so it round-trips losslessly through JSON.stringify/parse.
 * - Keys are namespaced `coinscribed:admin:draft:<scope>` to match the existing
 *   `coinscribed:admin:*` convention. `scope` is the document id in edit mode,
 *   or the literal `"new"` for the new-article screen.
 */

import type { ArticleDraft } from '@/lib/admin-types'

const KEY_PREFIX = 'coinscribed:admin:draft:'

/** Cached drafts older than this are ignored and cleaned up (24 hours). */
const MAX_AGE_MS = 24 * 60 * 60 * 1000

/** Shape stored in localStorage: the draft plus a save timestamp. */
export interface CachedDraft {
  draft: ArticleDraft
  savedAt: number
}

/**
 * Build the storage key for a given editor scope.
 * @param documentId the id being edited, or undefined for a new article.
 */
function keyFor(documentId?: string): string {
  const scope = documentId ? documentId.replace(/^drafts\./, '') : 'new'
  return `${KEY_PREFIX}${scope}`
}

/** True when localStorage is usable (client-side and not blocked). */
function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

/**
 * Persist the current draft for later recovery. Best-effort; silently no-ops if
 * storage is unavailable.
 */
export function saveCachedDraft(documentId: string | undefined, draft: ArticleDraft): void {
  if (!hasStorage()) return
  try {
    const payload: CachedDraft = { draft, savedAt: Date.now() }
    window.localStorage.setItem(keyFor(documentId), JSON.stringify(payload))
  } catch {
    // Quota exceeded or serialization issue — recovery is a nice-to-have, so
    // we intentionally swallow the error rather than disrupt editing.
  }
}

/**
 * Read a previously cached draft for this scope, if one exists and has not
 * expired. Expired or malformed entries are removed and `null` is returned.
 */
export function loadCachedDraft(documentId?: string): CachedDraft | null {
  if (!hasStorage()) return null
  const key = keyFor(documentId)
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedDraft
    if (
      !parsed ||
      typeof parsed.savedAt !== 'number' ||
      typeof parsed.draft !== 'object' ||
      parsed.draft === null
    ) {
      window.localStorage.removeItem(key)
      return null
    }
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
      window.localStorage.removeItem(key)
      return null
    }
    return parsed
  } catch {
    // Corrupt JSON — drop it so it can't keep failing.
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
    return null
  }
}

/** Remove the cached draft for this scope (called after a successful save). */
export function clearCachedDraft(documentId?: string): void {
  if (!hasStorage()) return
  try {
    window.localStorage.removeItem(keyFor(documentId))
  } catch {
    /* ignore */
  }
}
