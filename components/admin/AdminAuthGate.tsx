'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  captureTokenFromUrl,
  getLoginUrl,
  getSession,
  type SanityUser,
  type SessionResult,
} from '@/lib/sanity-admin'
import { AdminUserContext } from '@/components/admin/AdminUserContext'

type AuthState =
  | { status: 'loading' }
  | { status: 'authed'; user: SanityUser }
  | { status: 'anon' }
  | { status: 'error'; message: string }

/**
 * Gate for the entire /admin area.
 *
 * On mount:
 * 1. Capture a per-user session token from the URL if this is a login return
 *    (`?sid=...`, appended by Sanity's hosted login with `type=token`).
 * 2. Verify the session via `getSession()`:
 *    - while checking, shows a centered loading state;
 *    - if authenticated, provides the user through `AdminUserContext` and
 *      renders the admin shell (children);
 *    - if genuinely anonymous (clean 401), shows the sign-in screen;
 *    - if the check failed for another reason (CORS misconfiguration, network
 *      error, roles), shows an **actionable diagnostic** rather than the plain
 *      sign-in screen, so the operator can distinguish "not signed in" from
 *      "signed in but the request was blocked".
 */
export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  useEffect(() => {
    let active = true

    // 1) If the browser just landed here from the Sanity hosted login, the URL
    //    contains the per-user token. Capture it first, then verify.
    captureTokenFromUrl()

    // 2) Verify the session (uses the token when present, or the cookie).
    getSession().then((result: SessionResult) => {
      if (!active) return
      if (result.status === 'authed') {
        setState({ status: 'authed', user: result.user })
      } else if (result.status === 'error') {
        setState({ status: 'error', message: result.message })
      } else {
        setState({ status: 'anon' })
      }
    })
    return () => {
      active = false
    }
    // Mount only: the session check runs once and the user re-triggers it by
    // navigating back from the login redirect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignIn = useCallback(() => {
    // Return the browser to /admin on this origin after Sanity login so the
    // token capture runs on mount. `window` is available: this is a client
    // component and the handler only fires on user interaction.
    const returnTo = window.location.origin + '/admin'
    window.location.href = getLoginUrl(returnTo)
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

  // Error state: signed-in-but-blocked, CORS misconfiguration, or roles issue.
  // Shows a distinct, actionable message instead of the bare sign-in screen.
  if (state.status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 dark:bg-graphite">
        <div className="w-full max-w-md rounded-sm border border-gold bg-surface p-8 dark:border-gold-light dark:bg-elevated">
          <p className="font-sans text-eyebrow font-semibold uppercase tracking-wide text-gold dark:text-gold-light">
            Configuration Issue
          </p>
          <h1 className="mt-3 font-serif text-display-3 font-bold text-ink dark:text-ink-inverse">
            Session could not be verified
          </h1>
          <p className="mt-3 leading-relaxed text-ink-body dark:text-ink-inverse-body">
            {state.message}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex w-full items-center justify-center rounded-sm border border-hairline px-5 py-3 font-sans text-sm font-semibold text-ink-body transition-colors hover:border-accent hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-body dark:hover:border-accent-light dark:hover:text-accent-light"
            >
              Reload page
            </button>
            <button
              type="button"
              onClick={handleSignIn}
              className="inline-flex w-full items-center justify-center rounded-sm bg-accent px-5 py-3 font-sans text-sm font-semibold text-surface transition-colors hover:bg-accent-hover"
            >
              Sign in again
            </button>
          </div>
          <p className="mt-4 text-caption text-ink-muted dark:text-ink-inverse-muted">
            If you just signed in, the most likely cause is that this site&rsquo;s
            origin is missing or does not have &ldquo;Allow credentials&rdquo;
            checked in{' '}
            <a
              href="https://manage.sanity.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-accent dark:hover:text-accent-light"
            >
              manage.sanity.io
            </a>
            {' '}&gt; API &gt; CORS Origins.
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
