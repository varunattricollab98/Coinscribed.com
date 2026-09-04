import type { Metadata, Viewport } from 'next'

/**
 * Layout for the draft-preview segment at /preview.
 *
 * The preview lets an editor see an unpublished draft rendered exactly as the
 * live article page will look. Like the /admin area (and Studio), it must never
 * be crawled or indexed, so this layout marks the whole segment
 * noindex/nofollow via `metadata.robots`.
 *
 * It deliberately renders NEITHER the public site chrome (Header/Footer from
 * app/(site)/layout.tsx) NOR the admin sidebar (AdminShell): the preview should
 * read as a clean, standalone article page. Fonts (--font-inter) and
 * globals.css come from the root app/layout.tsx which wraps every route, so
 * all public typography utility classes work here without extra setup — the
 * wrapper below is intentionally minimal.
 */
export const metadata: Metadata = {
  title: 'Article Preview',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-paper dark:bg-graphite">{children}</div>
}
