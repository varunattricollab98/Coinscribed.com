import Script from 'next/script'

/**
 * Google Analytics 4 (gtag.js) loader.
 *
 * Uses next/script with strategy="afterInteractive" so the tag loads after the
 * page is interactive — it never blocks first paint or hurts LCP/INP. The
 * Measurement ID is read from NEXT_PUBLIC_GA_ID; if it's unset (e.g. local dev
 * or previews) nothing is rendered, so analytics only runs where configured.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  if (!gaId) return null

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
