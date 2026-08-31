'use client'

/**
 * Sanity Studio configuration — powers the embedded admin at /studio.
 *
 * Writers and editors log in here (on your own domain, e.g.
 * coinscribed.com/studio) to create and edit articles, upload featured images,
 * fill SEO fields, set the slug, and publish. Content is stored in the Sanity
 * project below and fetched by the public site via lib/sanity-queries.ts.
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schema-index'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h0xv92n1'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'coinscribed',
  title: 'Coinscribed',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    // Main content editing UI (documents, list panes, editors).
    structureTool(),
    // GROQ query playground for testing/debugging content queries.
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],
})
