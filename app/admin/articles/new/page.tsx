'use client'

import { ArticleEditor } from '@/components/admin/ArticleEditor'

/**
 * "New article" screen. Renders the shared editor with no document id so it
 * starts empty. The actual save/publish write is wired up in FEAT-003 via the
 * editor's `onSave` hook.
 */
export default function NewArticlePage() {
  return <ArticleEditor />
}
