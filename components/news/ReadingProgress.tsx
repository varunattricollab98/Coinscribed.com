'use client'

import { useEffect, useState } from 'react'

/**
 * Thin scroll-progress bar fixed to the top of the viewport on article pages.
 * A common cue on modern long-read finance/editorial sites — it signals article
 * length and gives a subtle sense of momentum, nudging readers to finish (which
 * helps dwell time). Uses the accent gradient, is purely decorative
 * (aria-hidden), and respects reduced-motion by simply not animating width
 * transitions (the width still updates, just without easing).
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop || document.body.scrollTop
      const height = el.scrollHeight - el.clientHeight
      const pct = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0
      setProgress(pct)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-accent-gradient transition-[width] duration-150 ease-out motion-reduce:transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
