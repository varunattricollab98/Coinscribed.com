import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

/**
 * Newsletter subscription endpoint.
 *
 * Stores each signup as a `subscriber` document in Sanity so the owner can see
 * and export the list from Studio/admin — and later connect a real email
 * service (Mailchimp/Resend/etc.) by exporting these addresses.
 *
 * Writing to Sanity requires a server-side write token. It is read from
 * `SANITY_WRITE_TOKEN` (set in Vercel → Project Settings → Environment
 * Variables). This token is server-only and is NEVER exposed to the browser.
 * When the token is absent we return a clear 503 so the UI can show an honest
 * "temporarily unavailable" message instead of silently dropping the email.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const writeToken = process.env.SANITY_WRITE_TOKEN || ''

// Basic, permissive email shape check. The Sanity schema validates too; this is
// just to reject obvious junk before hitting the API.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  // Parse body defensively.
  let email = ''
  let source = 'unknown'
  try {
    const body = await request.json()
    email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (typeof body?.source === 'string' && body.source) source = body.source
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email address.' },
      { status: 400 }
    )
  }

  // No write token configured (e.g. env var not set yet) — fail honestly rather
  // than pretend the signup worked.
  if (!projectId || !writeToken) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Subscriptions are temporarily unavailable. Please try again later.',
      },
      { status: 503 }
    )
  }

  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token: writeToken,
    useCdn: false,
  })

  try {
    // Dedupe: if this email already subscribed, treat it as success (idempotent)
    // rather than creating duplicate documents.
    const existing = await writeClient.fetch<string | null>(
      `*[_type == "subscriber" && email == $email][0]._id`,
      { email }
    )
    if (existing) {
      return NextResponse.json({ ok: true, already: true })
    }

    await writeClient.create({
      _type: 'subscriber',
      email,
      subscribedAt: new Date().toISOString(),
      source,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Could not complete your subscription. Please try again.' },
      { status: 500 }
    )
  }
}
