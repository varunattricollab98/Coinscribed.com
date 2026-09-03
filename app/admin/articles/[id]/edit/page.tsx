'use client'

import { ArticleEditor } from '@/components/admin/ArticleEditor'

interface EditArticlePageProps {
  params: { id: string }
}

/**
 * "Edit article" screen. Passes the route id to the shared editor, which loads
 * the existing document (preferring the `drafts.<id>` version) and hydrates all
 * fields. The id is url-decoded because the dashboard link encodes it.
 */
export default function EditArticlePage({ params }: EditArticlePageProps) {
  return <ArticleEditor documentId={decodeURIComponent(params.id)} />
}
