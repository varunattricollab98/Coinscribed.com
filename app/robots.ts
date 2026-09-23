import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

// Non-content surfaces to keep out of every crawler's budget and index: the
// JSON API, the custom admin, the embedded Sanity Studio, and draft previews
// are app tooling, not pages we want read or ranked.
const DISALLOW = ['/api/', '/admin/', '/studio/', '/preview/']

// Major AI/LLM crawlers we explicitly welcome to read the public content
// (GEO / AI-discoverability). They still inherit the same disallow list, so
// admin/api/studio stay private. Listing them by name removes any ambiguity
// for agents deciding whether they may crawl us, and is additive to the
// wildcard rule below (which already allows all other bots).
const AI_CRAWLERS = [
  'GPTBot', // OpenAI / ChatGPT
  'OAI-SearchBot', // OpenAI search
  'ChatGPT-User', // ChatGPT browsing on a user's behalf
  'ClaudeBot', // Anthropic
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot', // Perplexity
  'Perplexity-User',
  'Google-Extended', // Google Gemini / Vertex grounding
  'Applebot-Extended', // Apple Intelligence
  'CCBot', // Common Crawl (feeds many models)
  'Bytespider', // TikTok / ByteDance
  'Amazonbot',
  'cohere-ai',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
      // Explicitly allow the AI crawlers to read public content, while keeping
      // the same private surfaces off-limits. Being named + allowed helps AI
      // answer engines confidently discover and cite Coinscribed.
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
