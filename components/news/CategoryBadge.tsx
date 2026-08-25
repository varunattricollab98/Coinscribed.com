import Link from 'next/link'

interface CategoryBadgeProps {
  title: string
  slug: string
  linked?: boolean
}

const categoryColors: Record<string, { bg: string; text: string; hoverBg: string }> = {
  crypto: {
    bg: 'bg-category-crypto-bg',
    text: 'text-category-crypto',
    hoverBg: 'hover:bg-purple-100',
  },
  economy: {
    bg: 'bg-category-economy-bg',
    text: 'text-category-economy',
    hoverBg: 'hover:bg-teal-100',
  },
  markets: {
    bg: 'bg-category-markets-bg',
    text: 'text-category-markets',
    hoverBg: 'hover:bg-green-100',
  },
  banking: {
    bg: 'bg-category-banking-bg',
    text: 'text-category-banking',
    hoverBg: 'hover:bg-amber-100',
  },
}

const defaultColors = {
  bg: 'bg-teal-pale',
  text: 'text-teal-primary',
  hoverBg: 'hover:bg-teal-100',
}

function getCategoryColors(slug: string) {
  return categoryColors[slug] || defaultColors
}

export function CategoryBadge({ title, slug, linked = true }: CategoryBadgeProps) {
  const colors = getCategoryColors(slug)
  const badgeClasses = `inline-block rounded-full px-3 py-1 text-xs font-semibold transition-colors ${colors.bg} ${colors.text} ${colors.hoverBg} dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700`

  if (linked) {
    return (
      <Link href={`/news/category/${slug}`} className={badgeClasses}>
        {title}
      </Link>
    )
  }

  return <span className={badgeClasses}>{title}</span>
}
