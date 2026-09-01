import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { BackToTop } from '@/components/motion/BackToTop'

/**
 * Layout for the public-facing site. Wraps every marketing/content page in the
 * shared header and footer, and mounts the scroll experience (momentum
 * scrolling, reading progress, back-to-top).
 *
 * The embedded Sanity Studio at /studio deliberately lives outside this group
 * so it renders full-screen with no site chrome — and, importantly, with no
 * hijacked scrolling, which the Studio's own panes depend on.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SmoothScroll />
      <ScrollProgress />

      {/* Focus target for the back-to-top control and skip link. */}
      <span id="site-top" tabIndex={-1} className="sr-only">
        Top of page
      </span>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-accent focus:bg-surface focus:px-4 focus:py-2 focus:text-eyebrow focus:font-semibold focus:uppercase focus:text-accent dark:focus:bg-elevated"
      >
        Skip to content
      </a>

      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />

      <BackToTop />
    </div>
  )
}
