/**
 * "Key Takeaways" summary box for the top of an article.
 *
 * A signature element of the best explainer sites (Investopedia et al.): a
 * short, scannable bullet summary right under the intro. It helps readers who
 * skim, improves accessibility, and is strongly favoured by Google's AI
 * Overviews / featured snippets, which love a clean extractable summary.
 *
 * Styled as a gilt callout to match the editorial-notice aside. Renders nothing
 * if no points are supplied, so it's optional per article.
 */
export function KeyTakeaways({ points }: { points?: string[] }) {
  if (!points || points.length === 0) return null

  return (
    <aside className="mb-10 rounded-sm border-l-2 border-gold bg-gold-soft px-5 py-5 dark:border-gold-light dark:bg-gold/10">
      <p className="eyebrow-royal">Key takeaways</p>
      <ul className="mt-3 space-y-2.5">
        {points.map((point, i) => (
          <li
            key={i}
            className="relative pl-6 leading-relaxed text-ink-body before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:bg-gold before:content-[''] dark:text-ink-inverse-body dark:before:bg-gold-light"
          >
            {point}
          </li>
        ))}
      </ul>
    </aside>
  )
}
