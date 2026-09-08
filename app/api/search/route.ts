import { NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/sanity-queries'
import { calculators } from '@/data/calculators'
import { banks } from '@/data/banks'

/**
 * Site-search index.
 *
 * Returns a single lightweight JSON payload of everything a visitor might search
 * for — articles, calculators and bank routing pages — which the client-side
 * search modal filters. Assembled server-side because articles live in Sanity;
 * cached so all visitors share one build of the index rather than each querying
 * Sanity. Mirrors the other /api routes' shape (revalidate + Cache-Control).
 */
export const revalidate = 300

export interface SearchItem {
  type: 'Article' | 'Calculator' | 'Bank'
  title: string
  href: string
  description?: string
  category?: string
}

export async function GET() {
  try {
    const articles = await getAllArticles()

    const articleItems: SearchItem[] = articles.map((a) => ({
      type: 'Article',
      title: a.title,
      href: `/news/${a.slug.current}`,
      description: a.excerpt,
      category: a.category?.title,
    }))

    const calcItems: SearchItem[] = calculators.map((c) => ({
      type: 'Calculator',
      title: c.title,
      href: c.href,
      description: c.description,
      category: 'Calculator',
    }))

    const bankItems: SearchItem[] = banks.map((b) => ({
      type: 'Bank',
      title: `${b.name} Routing Numbers`,
      href: `/bank-routing-numbers/${b.slug}`,
      description: b.description,
      category: 'Bank Routing',
    }))

    const items = [...articleItems, ...calcItems, ...bankItems]

    return NextResponse.json(
      { items },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch {
    // On any error, return calculators + banks (static) so search still works.
    const fallback: SearchItem[] = [
      ...calculators.map((c) => ({
        type: 'Calculator' as const,
        title: c.title,
        href: c.href,
        description: c.description,
        category: 'Calculator',
      })),
      ...banks.map((b) => ({
        type: 'Bank' as const,
        title: `${b.name} Routing Numbers`,
        href: `/bank-routing-numbers/${b.slug}`,
        description: b.description,
        category: 'Bank Routing',
      })),
    ]
    return NextResponse.json({ items: fallback })
  }
}
