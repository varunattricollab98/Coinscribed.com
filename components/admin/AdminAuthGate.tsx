'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  getCurrentUser,
  getLoginUrl,
  type SanityUser,
} from '@/lib/sanity-admin'
import { AdminUserContext } from '@/components/admin/AdminUserContext'

type AuthState =
  | { status: 'loading' }
  | { status: 'authed'; user: SanityUser }
  | { status: 'anon' }

/**
 * Gate for the entire /admin area.
 *
 * On mount it verifies the Sanity session via `getCurrentUser()`:
 *   - while checking, shows a centered loading state;
 *   - if authenticated, provides the user through `AdminUserContext` and
 *     renders the admin shell (children);
 *   - if not, shows a "Sign in with Sanity" screen that redirects to Sanity's
 *     hosted login, returning to the current app origin (i.e. /admin).
 *
 * Auth is entirely session-cookie based (see `lib/sanity-admin.ts`); no token
 * is ever handled here.
 */
export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    getCurrentUser().then((user) => {
      if (!active) return
      setState(user ? { status: 'authed', user } : { status: 'anon' })
    })
    return () => {
      active = false
    }
  }, [])

  const handleSignIn = useCallback(() => {
    // Return the browser to the current origin after Sanity login so the user
    // lands back on /admin. `window` is available: this is a client component
    // and the handler only fires on user interaction.
    const origin = window.location.origin
    window.location.href = getLoginUrl(origin)
  }, [])

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-graphite">
        <div className="flex flex-col items-center gap-4">
          <span
            className="h-8 w-8 animate-spin rounded-full border-2 border-hairline border-t-accent dark:border-hairline-dark dark:border-t-accent-light"
            aria-hidden="true"
          />
          <p className="text-caption text-ink-muted dark:text-ink-inverse-muted">
            Checking your Sanity session&hellip;
          </p>
        </div>
      </div>
    )
  }

  if (state.status === 'anon') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 dark:bg-graphite">
        <div className="w-full max-w-md rounded-sm border border-hairline bg-surface p-8 dark:border-hairline-dark dark:bg-elevated">
          <p className="font-sans text-eyebrow font-semibold uppercase tracking-wide text-accent dark:text-accent-light">
            Coinscribed Admin
          </p>
          <h1 className="mt-3 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">
            Sign in to continue
          </h1>
          <p className="mt-3 leading-relaxed text-ink-body dark:text-ink-inverse-body">
            The editor uses your own Sanity account, so every change is made
            under your name and roles. Sign in with the same account you use for
            the Studio.
          </p>
          <button
            type="button"
            onClick={handleSignIn}
            className="mt-6 inline-flex w-full items-center justify-center rounded-sm bg-accent px-5 py-3 font-sans text-sm font-semibold text-surface transition-colors hover:bg-accent-hover"
          >
            Sign in with Sanity
          </button>
          <p className="mt-4 text-caption text-ink-muted dark:text-ink-inverse-muted">
            You will be redirected to Sanity&rsquo;s secure login and returned
            here afterwards.
          </p>
        </div>
      </div>
    )
  }

  return (
    <AdminUserContext.Provider value={{ user: state.user }}>
      {children}
    </AdminUserContext.Provider>
  )
}
