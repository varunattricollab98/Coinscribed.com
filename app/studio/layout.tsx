import type { Metadata, Viewport } from 'next'

/**
 * Dedicated layout for the embedded Sanity Studio.
 *
 * The Studio manages its own full-screen UI, so this layout deliberately does
 * NOT render the public site's header/footer. It also marks the admin as
 * noindex so search engines never index the editing tool.
 */
export const metadata: Metadata = {
  title: 'Coinscribed Studio',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  // Studio requires the full viewport with no user scaling for its editors.
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
