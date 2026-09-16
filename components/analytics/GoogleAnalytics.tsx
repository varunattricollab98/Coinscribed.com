'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

/**
 * Google Analytics 4 (gtag.js) loader.
 *
 * Uses next/script with strategy="afterInteractive" so the tag loads after the
 * page is interactive — it never blocks first paint or hurts LCP/INP. The
 * Measurement ID is read from NEXT_PUBLIC_GA_ID; if it's unset (e.g. local dev
 * or previews) nothing is rendered, so analytics only runs where configured.
 *
 * INTERNAL-TRAFFIC EXCLUSION: the tag is NOT loaded on the CMS surfaces
 * (`/admin`, the custom editor, and `/studio`, Sanity Studio). Those pages are
 * only ever visited by the owner/editors, so counting them polluted the public
 * analytics (they showed up as the top "pages" with owner-city sessions). By
 * skipping GA there entirely, the GA4 property reflects real reader traffic
 * only. These routes are already `noindex`, so excluding them from analytics is
 * consistent with them being non-public.
 */

/** Route prefixes that are internal-only and must never be tracked. */
const EXCLUDED_PREFIXES = ['/admin', '/studio', '/preview']

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const pathname = usePathname()

  if (!gaId) return null

  const isInternal = EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`)
  )
  if (isInternal) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
