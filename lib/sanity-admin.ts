import { createClient } from '@sanity/client'

/**
 * Authenticated, browser-usable Sanity client for the /admin editor.
 *
 * AUTH MODEL (do NOT change without re-reading the task's auth_architecture):
 * This client performs reads, mutations and asset uploads AS THE LOGGED-IN
 * SANITY USER, never via a project-wide write token. The mechanism is
 * `withCredentials: true`, which makes the browser attach the Sanity session
 * cookie to every request, so the API applies that user's own roles and the
 * change is attributed to them in the project's audit trail.
 *
 * Because of this there is deliberately NO `SANITY_WRITE_TOKEN` / `token`
 * option anywhere in this file. Identity comes exclusively from the user's
 * Sanity session.
 *
 * REQUIRED project configuration (manage.sanity.io > API > CORS Origins): the
 * app origin(s) must be added with "Allow credentials" CHECKED, otherwise the
 * browser will not send the session cookie on cross-site requests.
 *
 * The read-only client in `lib/sanity.ts` (useCdn:true) is intentionally left
 * untouched; this is an additive, separate client for the admin area.
 */

export const adminProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h0xv92n1'
export const adminDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

/**
 * Browser Sanity client that acts as the logged-in user.
 *
 * - `useCdn: false` so writes and freshly-edited drafts are never served stale
 *   from the CDN.
 * - `withCredentials: true` so the Sanity session cookie is sent and the
 *   request runs under the user's identity/roles.
 */
export const adminSanityClient = createClient({
  projectId: adminProjectId,
  dataset: adminDataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  withCredentials: true,
})

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

/**
 * Return the currently logged-in Sanity user, or `null` when the request is
 * not authenticated (401) or fails for any other reason.
 *
 * Uses `client.request` against `/users/me`, which is resolved relative to the
 * project's API host and carries the session cookie thanks to
 * `withCredentials`.
 */
export async function getCurrentUser(): Promise<SanityUser | null> {
  try {
    // The client is configured with withCredentials:true, so the session
    // cookie is sent automatically; no per-request auth is needed.
    const user = await adminSanityClient.request<SanityUser | null>({
      url: '/users/me',
    })
    // `/users/me` returns the user object when authenticated. A missing id
    // means no active session.
    if (user && typeof user === 'object' && 'id' in user && user.id) {
      return user
    }
    return null
  } catch {
    return null
  }
}

/**
 * Build the URL of Sanity's hosted login page.
 *
 * After the user authenticates, Sanity sets the session cookie for the project
 * API host and redirects the browser back to `origin`. Pass the app origin
 * (e.g. `window.location.origin`) so the user lands back on this site.
 *
 * @param origin   Absolute app origin to return to after login.
 * @param provider Sanity auth provider (`google`, `github`, `sanity`, ...).
 *                 Defaults to `google`.
 */
export function getLoginUrl(origin: string, provider = 'google'): string {
  const encodedOrigin = encodeURIComponent(origin)
  return `https://${adminProjectId}.api.sanity.io/v1/auth/login/${provider}?origin=${encodedOrigin}`
}

/**
 * Log the current user out of their Sanity session for this project.
 *
 * Posts to `/auth/logout`, which clears the session cookie. Resolves to `true`
 * on success and `false` if the request fails, so callers can still redirect.
 */
export async function logout(): Promise<boolean> {
  try {
    await adminSanityClient.request({
      url: '/auth/logout',
      method: 'POST',
    })
    return true
  } catch {
    return false
  }
}
