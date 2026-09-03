import type { Metadata, Viewport } from 'next'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { AdminShell } from '@/components/admin/AdminShell'

/**
 * Dedicated layout for the WordPress-style admin editor at /admin.
 *
 * Like the Studio layout, this deliberately does NOT render the public site's
 * Header/Footer, and it marks the whole area noindex/nofollow so the editing
 * tool is never crawled or indexed.
 *
 * Access is gated by `AdminAuthGate` (logged-in Sanity user), and the chrome
 * (sidebar + top bar) is provided by `AdminShell`.
 */
export const metadata: Metadata = {
  title: 'Coinscribed Admin',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthGate>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGate>
  )
}
