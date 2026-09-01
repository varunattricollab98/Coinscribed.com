'use client'

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

/**
 * A 2px gilt-to-accent reading rule pinned to the very top of the viewport.
 *
 * Driven entirely by `scaleX`, so it never triggers layout or paint work — the
 * compositor handles it. It sits above the sticky masthead and is decorative,
 * so it is hidden from assistive technology.
 */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // A touch of spring keeps the bar from twitching on trackpads without
  // letting it lag noticeably behind the page.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduceMotion ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent-gradient"
    />
  )
}
