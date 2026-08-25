import Link from 'next/link'

interface CategoryBadgeProps {
  title: string
  slug: string
  linked?: boolean
}

export function CategoryBadge({ title, slug, linked = true }: CategoryBadgeProps) {
  const badgeClasses =
    'inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'

  if (linked) {
    return (
      <Link href={`/news/category/${slug}`} className={badgeClasses}>
        {title}
      </Link>
    )
  }

  return <span className={badgeClasses}>{title}</span>
}
