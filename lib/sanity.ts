import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

/**
 * Check if Sanity is properly configured with environment variables
 */
export const isSanityConfigured = Boolean(projectId)

/**
 * Sanity client for fetching content.
 * Only use when isSanityConfigured is true.
 */
export const sanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
})

/**
 * Image URL builder for Sanity image assets
 */
const builder = createImageUrlBuilder({
  projectId: projectId || 'placeholder',
  dataset,
})

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Types for Sanity image references
export interface SanityImageSource {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}
