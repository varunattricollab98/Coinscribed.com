'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface AnimatedCounterProps {
  /** Numeric target to count up to. */
  value: number
  /** Text shown after the number (e.g. "+", "%"). */
  suffix?: string
  /** Text shown before the number. */
  prefix?: string
  /** If the stat is not numeric (e.g. "Daily"), pass it here and it renders as-is. */
  staticLabel?: string
  durationMs?: number
  className?: string
}

/**
 * Counts up from 0 to `value` the first time it scrolls into view. Falls back
 * to the final value immediately when reduced motion is preferred, or when a
 * non-numeric `staticLabel` is provided.
 */
export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  staticLabel,
  durationMs = 1200,
  className,
}: AnimatedCounterProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(
    reduceMotion || staticLabel ? value : 0
  )
  const started = useRef(false)

  useEffect(() => {
    if (staticLabel) return
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / durationMs, 1)
            // easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.round(eased * value))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, durationMs, reduceMotion, staticLabel])

  return (
    <span ref={ref} className={className}>
      {staticLabel ?? `${prefix}${display.toLocaleString('en-US')}${suffix}`}
    </span>
  )
}
