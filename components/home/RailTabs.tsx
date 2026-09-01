'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { getCategoryTone } from '@/lib/category-styles'
import type { ArticleCard as ArticleCardType } from '@/lib/sanity-queries'

interface RailTabsProps {
  /** Newest stories not already carried by the lead or the headline column. */
  latest: ArticleCardType[]
  /**
   * A stable rotation of the same pool, produced by `rankByReadership`. This is
   * not measured traffic and the UI never claims it is.
   */
  mostRead: ArticleCardType[]
}

type TabId = 'latest' | 'most-read'

const TABS: { id: TabId; label: string }[] = [
  { id: 'latest', label: 'Latest' },
  { id: 'most-read', label: 'Most Read' },
]

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * The right-rail headline widget: two tabs over two dense, thumbnail-free lists.
 *
 * Interaction contract (this is a real tab widget, not two buttons that toggle
 * a class):
 *  - `role="tablist"` / `role="tab"` / `role="tabpanel"`, wired with
 *    `aria-controls` and `aria-labelledby` in both directions.
 *  - Roving tabindex: exactly one tab is in the tab order, so Tab moves past
 *    the widget in one press and Left/Right/Home/End move between tabs, which
 *    is what the WAI-ARIA tabs pattern specifies.
 *  - Automatic activation — moving focus selects — matching the pattern's
 *    recommendation for panels this cheap to render.
 *  - The inactive panel carries the `hidden` attribute rather than a utility
 *    class, so it is removed from the accessibility tree and its links leave
 *    the tab order. No display utility is applied to the panels, which would
 *    otherwise beat `hidden` on specificity and silently show both.
 */
export function RailTabs({ latest, mostRead }: RailTabsProps) {
  const [active, setActive] = useState<TabId>('latest')
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const index = TABS.findIndex((tab) => tab.id === active)
    let next = -1

    if (event.key === 'ArrowRight') next = (index + 1) % TABS.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = TABS.length - 1
    else return

    event.preventDefault()
    const target = TABS[next]
    setActive(target.id)
    tabRefs.current[target.id]?.focus()
  }

  return (
    <section aria-labelledby="rail-tabs-heading">
      <h2 id="rail-tabs-heading" className="sr-only">
        More headlines
      </h2>

      <div
        role="tablist"
        aria-label="Headline lists"
        className="flex items-stretch gap-6 border-b border-ink/15 dark:border-ink-inverse/15"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node
              }}
              type="button"
              role="tab"
              id={`rail-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`rail-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={handleKeyDown}
              className={`relative pb-3 text-eyebrow font-semibold uppercase transition-colors duration-150 ${
                isActive
                  ? 'text-accent dark:text-accent-light'
                  : 'text-ink-muted hover:text-ink dark:text-ink-inverse-muted dark:hover:text-ink-inverse'
              }`}
            >
              {tab.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-accent-gradient"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Latest — chronological, section-tagged. */}
      <div
        role="tabpanel"
        id="rail-panel-latest"
        aria-labelledby="rail-tab-latest"
        hidden={active !== 'latest'}
      >
        <ul className="divide-y divide-hairline dark:divide-hairline-dark">
          {latest.map((article) => {
            const tone = getCategoryTone(article.category?.slug.current)
            return (
              <li key={article._id} className="py-3.5">
                <Link
                  href={`/news/${article.slug.current}`}
                  className="group block"
                 prefetch={false}>
                  <span className="flex items-center gap-2">
                    {article.category && (
                      <span
                        className={`text-eyebrow font-semibold uppercase ${tone.label}`}
                      >
                        {article.category.title}
                      </span>
                    )}
                    <span
                      aria-hidden="true"
                      className="text-caption text-ink-muted opacity-50 dark:text-ink-inverse-muted"
                    >
                      &middot;
                    </span>
                    <time
                      dateTime={article.publishedAt}
                      className="text-caption text-ink-muted dark:text-ink-inverse-muted"
                    >
                      {formatShortDate(article.publishedAt)}
                    </time>
                  </span>
                  <span className="mt-1.5 block text-sm font-semibold leading-snug text-ink dark:text-ink-inverse">
                    <span className="title-link">{article.title}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Most Read — a seeded rotation of the same pool, labelled honestly. */}
      <div
        role="tabpanel"
        id="rail-panel-most-read"
        aria-labelledby="rail-tab-most-read"
        hidden={active !== 'most-read'}
      >
        <ol className="divide-y divide-hairline dark:divide-hairline-dark">
          {mostRead.map((article, index) => (
            <li key={article._id} className="py-3.5">
              <Link
                href={`/news/${article.slug.current}`}
                className="group flex items-baseline gap-3"
               prefetch={false}>
                <span
                  aria-hidden="true"
                  className="w-5 shrink-0 font-serif text-display-4 font-bold tabular-nums text-gold dark:text-gold-light"
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-ink dark:text-ink-inverse">
                  <span className="title-link">{article.title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {/* We have no traffic data, so we say so rather than implying we do. */}
        <p className="mt-3 text-caption text-ink-muted dark:text-ink-inverse-muted">
          A curated rotation from the newsroom, not a traffic ranking.
        </p>
      </div>
    </section>
  )
}
