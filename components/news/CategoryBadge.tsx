import Link from 'next/link'
import { getCategoryTone } from '@/lib/category-styles'

interface CategoryBadgeProps {
  title: string
  slug: string
  linked?: boolean
}

/**
 * Category label rendered as an eyebrow: tiny uppercase, letter-spaced text
 * over a short 2px accent rule in that category's muted tone. No pill, no
 * background wash.
 */
export function CategoryBadge({ title, slug, linked = true }: CategoryBadgeProps) {
  const tone = getCategoryTone(slug)

  const content = (
    <>
      <span className={`text-eyebrow font-semibold uppercase ${tone.label}`}>
        {title}
      </span>
      <span className={`mt-1.5 block h-0.5 w-7 ${tone.rule}`} aria-hidden="true" />
    </>
  )

  if (linked) {
    return (
      <Link
        href={`/news/category/${slug}`}
        className="group/badge inline-block transition-opacity hover:opacity-70"
      >
        {content}
      </Link>
    )
  }

  return <span className="inline-block">{content}</span>
}
