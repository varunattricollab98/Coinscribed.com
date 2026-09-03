import { createClient, type SanityClient } from '@sanity/client'

/**
 * Authenticated, browser-usable Sanity client for the /admin editor.
 *
 * AUTH MODEL (do NOT change without re-reading the task's auth_architecture):
 * every read, mutation and asset upload runs AS THE LOGGED-IN SANITY USER,
 * never via a project-wide / master write token. Identity comes from that
 * user's own Sanity session, so the API applies their roles and attributes the
 * change to them in the project's audit trail.
 *
 * There are TWO complementary mechanisms, in priority order:
 *
 *  1. PER-USER SESSION TOKEN (primary). The sign-in flow sends the user to
 *     Sanity's hosted login with `?type=token`, and Sanity returns the browser
 *     to the app with a per-user session token (the `sid` query parameter).
 *     That token is a PER-USER credential tied to the signed-in identity and
 *     roles - it is NOT a master token and grants nothing the user could not do
 *     in Studio. We hold it in memory (mirrored to sessionStorage so a reload
 *     keeps the session) and attach it to the client via `withConfig({token})`.
 *     This is first-party and does not depend on third-party cookies, so it
 *     works from a custom app on coinscribed.com / the Vercel origin.
 *
 *  2. `withCredentials: true` (secondary / optimistic). If the browser still
 *     sends the Sanity session cookie cross-site (e.g. same-site setups or
 *     browsers that have not phased out third-party cookies), the cookie also
 *     authenticates the request. We keep this on so both paths can work, but we
 *     never RELY on it alone - the token above is what makes the flow robust.
 *
 * Deliberately there is NO `SANITY_WRITE_TOKEN` env var and no hard-coded token
 * anywhere in this file. The only token that ever reaches the client is the
 * per-user `sid` captured from the user's own login.
 *
 * REQUIRED project configuration (manage.sanity.io > API > CORS Origins): the
 * app origin(s) must be added, and "Allow credentials" should be CHECKED so the
 * credentialed path (2) works and so token requests are not blocked by CORS.
 *
 * The read-only client in `lib/sanity.ts` (useCdn:true) is intentionally left
 * untouched; this is an additive, separate client for the admin area.
 */

export const adminProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h0xv92n1'
export const adminDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const API_VERSION = '2024-01-01'

/** Key under which the per-user session token is mirrored in sessionStorage. */
const TOKEN_STORAGE_KEY = 'coinscribed:admin:sid'

/**
 * Base browser Sanity client. It is configured with `withCredentials:true` for
 * the optimistic cookie path; the per-user token (when present) is layered on
 * per call via `withConfig({token})` in `getAdminClient()`.
 */
const baseClient: SanityClient = createClient({
  projectId: adminProjectId,
  dataset: adminDataset,
  apiVersion: API_VERSION,
  useCdn: false,
  withCredentials: true,
})

// ============================================================
// Per-user session token store
// ============================================================

let sessionToken: string | null = null

/** Read the persisted token from sessionStorage (browser only). */
function readStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

/** Persist the token to sessionStorage (browser only, best-effort). */
function writeStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return
  try {
    if (token) window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
    else window.sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    /* storage may be unavailable (private mode); memory copy still works */
  }
}

/** Return the current per-user session token, hydrating from storage once. */
export function getSessionToken(): string | null {
  if (sessionToken) return sessionToken
  const stored = readStoredToken()
  if (stored) sessionToken = stored
  return sessionToken
}

/** Store a captured per-user session token (memory + sessionStorage). */
export function setSessionToken(token: string | null): void {
  sessionToken = token
  writeStoredToken(token)
}

/**
 * The Sanity client to use for every admin request. When a per-user token has
 * been captured it is attached via `withConfig({token})` so the request is
 * authenticated as that user without depending on cross-site cookies; otherwise
 * the base (cookie-only) client is returned.
 */
export function getAdminClient(): SanityClient {
  const token = getSessionToken()
  return token ? baseClient.withConfig({ token }) : baseClient
}

/**
 * Backwards-compatible export. Historically callers imported
 * `adminSanityClient` directly; it now points at the base client, but callers
 * that need the token-authenticated client should use `getAdminClient()`.
 * Kept so existing imports keep compiling.
 */
export const adminSanityClient = baseClient

// ============================================================
// Login return handling
// ============================================================

/**
 * Capture the per-user session token Sanity appends to the return URL after a
 * `?type=token` hosted login, store it, and strip it from the address bar.
 *
 * Sanity's hosted login redirects back to `origin` with the token in the `sid`
 * query parameter (it may also appear as `token`; both are handled). Returns
 * the captured token, or null when the URL carries none.
 *
 * Safe to call on every admin mount: it is a no-op when there is no token in
 * the URL.
 */
export function captureTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  let token: string | null = null
  try {
    const url = new URL(window.location.href)
    token = url.searchParams.get('sid') || url.searchParams.get('token')
    if (token) {
      setSessionToken(token)
      // Remove the token from the visible URL / history so it is not leaked in
      // shares, logs or the back button.
      url.searchParams.delete('sid')
      url.searchParams.delete('token')
      const clean =
        url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : '') + url.hash
      window.history.replaceState(null, '', clean)
    }
  } catch {
    return null
  }
  return token
}

// ============================================================
// User / session
// ============================================================

/**
 * The shape of the object returned by Sanity's `/users/me` endpoint. Only the
 * fields the admin UI needs are typed; the endpoint returns more.
 */
export interface SanityUser {
  id: string
  name?: string
  email?: string
  profileImage?: string
  role?: string
  roles?: { name: string; title?: string }[]
}

/** Discriminated result of a session check, so the UI can react precisely. */
export type SessionResult =
  | { status: 'authed'; user: SanityUser }
  | { status: 'anon' }
  | { status: 'error'; message: string }

/**
 * Verify the current session against `/users/me`.
 *
 * Returns:
 *  - `{ status: 'authed', user }` when the token/cookie authenticates;
 *  - `{ status: 'anon' }` on a clean 401 (genuinely not signed in);
 *  - `{ status: 'error', message }` when the request could not be completed
 *    (network / CORS / blocked credentials) - a DIFFERENT situation from being
 *    anonymous, which the gate surfaces with an actionable message instead of
 *    silently showing the sign-in screen.
 */
export async function getSession(): Promise<SessionResult> {
  // No token AND no chance of a cookie -> treat as anonymous fast-path only if
  // we also have no cookie possibility. We still try the request so a valid
  // cookie session is honoured.
  try {
    const user = await getAdminClient().request<SanityUser | null>({
      url: '/users/me',
    })
    if (user && typeof user === 'object' && 'id' in user && user.id) {
      return { status: 'authed', user }
    }
    // `/users/me` returns null/empty for an anonymous request (HTTP 200 with no
    // user, or 401 handled below).
    return { status: 'anon' }
  } catch (err) {
    const status = extractStatus(err)
    if (status === 401) {
      // A clean 401 means the server reached us and reports no valid session:
      // genuinely anonymous.
      return { status: 'anon' }
    }
    // 0 / network error / CORS rejection / 403: the request could not be
    // trusted to answer "are you signed in". Surface it distinctly so the
    // operator can fix CORS "Allow credentials" or roles rather than assuming
    // they are logged out.
    return {
      status: 'error',
      message: describeSessionError(status, err),
    }
  }
}

/**
 * Legacy helper retained for compatibility: returns the user or null. Prefer
 * `getSession()` which distinguishes anonymous from a CORS/credentials error.
 */
export async function getCurrentUser(): Promise<SanityUser | null> {
  const result = await getSession()
  return result.status === 'authed' ? result.user : null
}

/** Pull an HTTP status code out of a Sanity/client error, if present. */
function extractStatus(err: unknown): number | undefined {
  const e = err as {
    statusCode?: number
    response?: { statusCode?: number }
  }
  return e?.statusCode ?? e?.response?.statusCode
}

/** Build an actionable message for a non-401 session check failure. */
function describeSessionError(status: number | undefined, err: unknown): string {
  const message = err instanceof Error ? err.message : ''
  if (status === 403) {
    return 'Signed in, but your Sanity account is not permitted here. Ask a project admin to grant you the Editor or Administrator role.'
  }
  if (/cors|credential/i.test(message) || status === undefined || status === 0) {
    return 'Could not verify your session. This origin likely needs "Allow credentials" CHECKED under manage.sanity.io > API > CORS Origins. Add it, then reload.'
  }
  return `Could not verify your Sanity session (error ${status}). Check your connection and the project CORS settings, then reload.`
}

// ============================================================
// Login / logout
// ============================================================

/**
 * Build the URL of Sanity's hosted login page for the per-user TOKEN flow.
 *
 * We point at the GENERIC hosted-login entry point
 * (`/v1/auth/login`), NOT a provider-specific path such as
 * `/v1/auth/login/google`. The generic endpoint is what makes the OAuth flow
 * valid end to end:
 *
 *   1. Sanity renders its own hosted login page and, crucially, ESTABLISHES the
 *      OAuth `state` (CSRF) cookie on `api.sanity.io` before redirecting the
 *      browser out to the chosen identity provider (Google, GitHub, ...).
 *   2. The provider redirects back to
 *      `.../v1/auth/callback/<provider>?state=...`, and Sanity can now verify
 *      that `state` against the cookie it set in step 1.
 *   3. On success Sanity returns the browser to `origin` with the per-user
 *      session token in the `sid` query parameter, which
 *      `captureTokenFromUrl()` reads on return.
 *
 * Hitting `/v1/auth/login/<provider>` directly SKIPS step 1: the browser jumps
 * straight into the provider hand-off without Sanity ever setting the state
 * cookie, so the callback fails with HTTP 400 "Unable to verify authorization
 * request state." That was the login bug this function fixes.
 *
 * `type=token` asks Sanity to return control to `origin` with a per-user
 * session token in the `sid` query parameter (rather than relying on a
 * first-party cookie the SPA cannot see cross-site). The token is scoped to the
 * signed-in user and their roles - it is not a project/master token.
 *
 * The user picks their provider (e.g. Google) on Sanity's hosted page. We do
 * not force a provider via the path segment because that is exactly what broke
 * the state handshake.
 *
 * @param origin Absolute app origin to return to after login (e.g.
 *               `${window.location.origin}/admin`).
 */
export function getLoginUrl(origin: string): string {
  const encodedOrigin = encodeURIComponent(origin)
  return `https://${adminProjectId}.api.sanity.io/v1/auth/login?origin=${encodedOrigin}&type=token`
}

/**
 * Log the current user out: drop the per-user token locally and, best-effort,
 * clear any Sanity session cookie. Resolves to `true` on success and `false` if
 * the network request failed, so callers can still redirect.
 */
export async function logout(): Promise<boolean> {
  const hadToken = Boolean(getSessionToken())
  // Always clear the local per-user token first so the client stops acting as
  // the user even if the network call fails.
  setSessionToken(null)
  try {
    await getAdminClient().request({
      url: '/auth/logout',
      method: 'POST',
    })
    return true
  } catch {
    // If we only ever had a token (no cookie), logging out locally is enough.
    return hadToken
  }
}
