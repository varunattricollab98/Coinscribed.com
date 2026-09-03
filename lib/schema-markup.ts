import { siteConfig } from '@/config/site'

/**
 * Generates Organization JSON-LD schema markup
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    sameAs: [
      siteConfig.social.twitter,
      siteConfig.social.facebook,
      siteConfig.social.linkedin,
    ],
  }
}

/**
 * Generates WebSite JSON-LD schema markup
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  }
}

/**
 * Generates Article JSON-LD schema markup
 */
export function generateArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  image,
}: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  author?: {
    name: string
    url?: string
    jobTitle?: string
    sameAs?: string[]
    image?: string
  }
  image?: string
}) {
  // Attribute authorship to a named Person for E-E-A-T when we have one, so
  // Google can connect the article to a real, credentialed human. Fall back to
  // the publishing Organization only when no author is supplied.
  const authorSchema = author?.name
    ? {
        '@type': 'Person',
        name: author.name,
        ...(author.url && { url: author.url }),
        ...(author.jobTitle && { jobTitle: author.jobTitle }),
        ...(author.image && { image: author.image }),
        ...(author.sameAs?.length && { sameAs: author.sameAs }),
      }
    : {
        '@type': 'Organization',
        name: siteConfig.name,
      }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: authorSchema,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    image: image || siteConfig.ogImage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}

/**
 * Generates FAQPage JSON-LD schema markup
 */
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generates HowTo JSON-LD schema markup for calculator pages
 */
export function generateHowToSchema({
  name,
  description,
  steps,
}: {
  name: string
  description: string
  steps: { name: string; text: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

/**
 * Generates BreadcrumbList JSON-LD schema markup
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
