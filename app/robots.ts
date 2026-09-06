import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep non-content surfaces out of the index and out of crawl budget:
        // the JSON API, the custom admin, the embedded Sanity Studio, and draft
        // previews are all app tooling, not pages we want ranked.
        disallow: ['/api/', '/admin/', '/studio/', '/preview/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
