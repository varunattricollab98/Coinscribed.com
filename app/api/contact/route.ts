import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

/**
 * Contact form endpoint.
 *
 * Stores each submission as a `contactMessage` document in Sanity so the owner
 * can read and reply to enquiries from Studio/admin. Mirrors the newsletter
 * route exactly: writing requires the server-only `SANITY_WRITE_TOKEN` (set in
 * Vercel → Project Settings → Environment Variables); when it is absent we
 * return an honest 503 so the UI can show a clear message and offer the direct
 * email address as a fallback, rather than silently dropping the message.
 *
 * No email provider is needed for the form to work: the owner replies from
 * their real inbox to the address captured here. An email/Slack notification
 * can be layered on later without changing this contract.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const writeToken = process.env.SANITY_WRITE_TOKEN || ''

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let name = ''
  let email = ''
  let subject = ''
  let message = ''
  let source = 'contact-page'
  let honeypot = ''

  try {
    const body = await request.json()
    name = typeof body?.name === 'string' ? body.name.trim() : ''
    email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    subject = typeof body?.subject === 'string' ? body.subject.trim() : ''
    message = typeof body?.message === 'string' ? body.message.trim() : ''
    if (typeof body?.source === 'string' && body.source) source = body.source
    // Simple spam honeypot: real users never fill this hidden field.
    honeypot = typeof body?.company === 'string' ? body.company.trim() : ''
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  // Silently accept-and-drop obvious bot submissions (honeypot filled).
  if (honeypot) {
    return NextResponse.json({ ok: true })
  }

  if (!name || name.length > 120) {
    return NextResponse.json(
      { ok: false, error: 'Please enter your name.' },
      { status: 400 }
    )
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email address.' },
      { status: 400 }
    )
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a message (at least 10 characters).' },
      { status: 400 }
    )
  }
  if (subject.length > 160) {
    return NextResponse.json(
      { ok: false, error: 'Subject is too long.' },
      { status: 400 }
    )
  }

  if (!projectId || !writeToken) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'The contact form is temporarily unavailable. Please email us directly instead.',
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
    await writeClient.create({
      _type: 'contactMessage',
      name,
      email,
      ...(subject ? { subject } : {}),
      message,
      receivedAt: new Date().toISOString(),
      source,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Could not send your message. Please try again.' },
      { status: 500 }
    )
  }
}
