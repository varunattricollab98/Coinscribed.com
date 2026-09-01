'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

/**
 * The live instance, shared with the handful of controls that need to drive
 * scrolling themselves (back-to-top). Kept as module state rather than on
 * `window` so it stays typed and does not leak into the global namespace.
 */
let activeLenis: Lenis | null = null

/** Returns the running Lenis instance, or null under reduced motion. */
export function getLenis(): Lenis | null {
  return activeLenis
}

/**
 * Sitewide momentum scrolling.
 *
 * Deliberate choices, because "smooth scroll" is the easiest thing on a site to
 * get wrong:
 *
 *  - Lenis runs in its *native* mode: it eases `window.scrollTo` rather than
 *    transforming a wrapper element. Nothing is taken out of the normal flow,
 *    so `position: sticky` (the masthead), `100vh` sizing and the browser's own
 *    scrollbar all behave exactly as they did before.
 *  - `syncTouch` stays off. Touch devices already have hardware-accelerated
 *    momentum; re-implementing it in JavaScript is the single biggest source of
 *    mobile jank. Phones keep native scrolling.
 *  - Keyboard scrolling (space, arrows, Page Up/Down, Home/End) is left to the
 *    browser, so focus and caret behaviour are untouched.
 *  - Anchor links keep working: `scroll-padding-top` in globals.css clears the
 *    sticky header, and we never call `preventDefault` on link clicks.
 *  - Under `prefers-reduced-motion: reduce` the instance is destroyed entirely
 *    and the browser scrolls natively. The listener is live, so toggling the OS
 *    setting takes effect without a reload.
 *  - On route change we snap to the top immediately, matching the App Router's
 *    default scroll restoration instead of animating through a new document.
 */
export function SmoothScroll() {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const start = () => {
      if (lenisRef.current) return

      const lenis = new Lenis({
        // `lerp` rather than `duration`+`easing`.
        //
        // A fixed duration restarts a ~0.9s animation on every wheel tick, so
        // during a normal scroll the page is permanently animating toward a
        // target the wheel has already moved past — which reads as lag, not
        // smoothness. lerp interpolates a fixed fraction of the remaining
        // distance each frame instead, so fast input is followed immediately
        // while the motion still eases.
        //
        // 0.14 lands between "syrupy" (~0.05) and "basically native" (~0.3).
        lerp: 0.14,

        // Was 0.9, i.e. each wheel tick travelled *less* than the browser's own
        // scroll. Combined with the long duration that was the main reason
        // scrolling felt heavy. Slightly above 1 so it keeps pace with the
        // wheel.
        wheelMultiplier: 1.1,

        touchMultiplier: 1.8,
        syncTouch: false,
        autoRaf: false,
      })

      lenisRef.current = lenis
      activeLenis = lenis
      document.documentElement.classList.add('lenis-active')

      const raf = (time: number) => {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
    }

    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
      lenisRef.current?.destroy()
      lenisRef.current = null
      activeLenis = null
      document.documentElement.classList.remove('lenis-active')
    }

    const sync = () => (query.matches ? stop() : start())

    sync()
    query.addEventListener('change', sync)

    return () => {
      query.removeEventListener('change', sync)
      stop()
    }
  }, [])

  // Land at the top of a new route without animating the whole document.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  return null
}
