'use client'

import { useCallback, useEffect, useState } from 'react'
import { getLenis } from './SmoothScroll'

/**
 * "Back to top" affordance that fades in once the reader is a viewport or so
 * down the page.
 *
 * Scroll handling is delegated to Lenis when it is running, so the return trip
 * uses the same easing as the rest of the page. Without Lenis — reduced motion,
 * or before hydration completes — it falls back to the browser's own smooth
 * scrolling, which respects the OS motion preference automatically.
 *
 * It is a real <button> with a label, reachable by keyboard, and it moves focus
 * back to the top of the document so screen reader and caret position follow
 * the visual jump.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let queued = false

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 800)
        queued = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = useCallback(() => {
    const lenis = getLenis()

    if (lenis) {
      lenis.scrollTo(0)
    } else {
      // No Lenis means reduced motion is on (or hydration is still pending):
      // let the browser decide, which honours the OS preference for us.
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Keep keyboard focus in step with the viewport.
    document.getElementById('site-top')?.focus({ preventScroll: true })
  }, [])

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-4 z-50 grid h-11 w-11 place-items-center border border-hairline bg-surface/90 text-ink-muted shadow-lift backdrop-blur transition-all duration-300 ease-editorial hover:border-accent/50 hover:text-accent motion-reduce:transition-none sm:right-6 dark:border-hairline-dark dark:bg-elevated/90 dark:text-ink-inverse-muted dark:hover:border-accent-light/50 dark:hover:text-accent-light ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
      </svg>
    </button>
  )
}
