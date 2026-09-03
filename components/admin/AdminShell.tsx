'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/sanity-admin'
import { useAdminUser } from '@/components/admin/AdminUserContext'

interface NavItem {
  href: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Articles' },
  { href: '/admin/articles/new', label: 'New Article' },
]

/**
 * Studio-like chrome for the admin area: a left sidebar (brand + nav) and a top
 * bar (current user + Sign out), wrapping a main content pane. Styled with the
 * site's design tokens so it feels like part of Coinscribed while resembling
 * the Sanity Studio layout.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const user = useAdminUser()
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = useCallback(async () => {
    setSigningOut(true)
    await logout()
    // After clearing the Sanity session, return to /admin, which the auth gate
    // will render as the sign-in screen.
    window.location.href = '/admin'
  }, [])

  const displayName = user.name || user.email || 'Signed in'

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div className="flex min-h-screen bg-paper text-ink dark:bg-graphite dark:text-ink-inverse">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-hairline bg-surface dark:border-hairline-dark dark:bg-elevated md:flex">
        <div className="border-b border-hairline px-6 py-5 dark:border-hairline-dark">
          <Link href="/admin" className="block">
            <span className="font-sans text-eyebrow font-semibold uppercase tracking-wide text-accent dark:text-accent-light">
              Coinscribed
            </span>
            <span className="mt-0.5 block font-serif text-display-4 font-bold text-ink dark:text-ink-inverse">
              Admin
            </span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-sm px-3 py-2 font-sans text-sm transition-colors ${
                isActive(item.href)
                  ? 'bg-accent-soft font-semibold text-accent dark:bg-wash-dark dark:text-accent-light'
                  : 'text-ink-body hover:bg-wash dark:text-ink-inverse-body dark:hover:bg-wash-dark'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-hairline px-6 py-4 dark:border-hairline-dark">
          <Link
            href="/studio"
            className="font-sans text-caption text-ink-muted underline-offset-2 transition-colors hover:text-accent hover:underline dark:text-ink-inverse-muted dark:hover:text-accent-light"
          >
            Open Sanity Studio
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 border-b border-hairline bg-surface px-6 py-4 dark:border-hairline-dark dark:bg-elevated">
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/admin"
              className="font-serif text-display-4 font-bold text-ink dark:text-ink-inverse"
            >
              Coinscribed Admin
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-caption text-ink-muted dark:text-ink-inverse-muted sm:inline">
              Signed in as
            </span>
            <span className="max-w-[12rem] truncate font-sans text-sm font-semibold text-ink dark:text-ink-inverse">
              {displayName}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="rounded-sm border border-hairline px-3 py-1.5 font-sans text-sm text-ink-body transition-colors hover:border-accent hover:text-accent disabled:opacity-60 dark:border-hairline-dark dark:text-ink-inverse-body dark:hover:border-accent-light dark:hover:text-accent-light"
            >
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 border-b border-hairline bg-surface px-3 py-2 dark:border-hairline-dark dark:bg-elevated md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-sm px-3 py-1.5 font-sans text-sm transition-colors ${
                isActive(item.href)
                  ? 'bg-accent-soft font-semibold text-accent dark:bg-wash-dark dark:text-accent-light'
                  : 'text-ink-body hover:bg-wash dark:text-ink-inverse-body dark:hover:bg-wash-dark'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  )
}
