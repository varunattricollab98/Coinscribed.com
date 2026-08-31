import type { ReactNode } from 'react'

/**
 * Thin-stroke line icons (1.5 stroke, currentColor) used in place of emoji.
 * All glyphs share the same 24x24 grid, cap/join treatment and weight so they
 * read as one consistent set.
 */
export type LineIconName =
  | 'house'
  | 'trend-up'
  | 'card'
  | 'bars'
  | 'coins'
  | 'target'
  | 'umbrella'
  | 'globe'
  | 'bank'

const PATHS: Record<LineIconName, ReactNode> = {
  house: (
    <>
      <path d="M3 10.5 12 3.5l9 7" />
      <path d="M5.5 9.75V20.5h13V9.75" />
      <path d="M9.75 20.5v-6h4.5v6" />
    </>
  ),
  'trend-up': (
    <>
      <path d="M3 20.5h18" />
      <path d="M4.5 16 9.5 11l3.5 3.5L20 7" />
      <path d="M15 7h5v5" />
    </>
  ),
  card: (
    <>
      <rect x="2.75" y="6" width="18.5" height="12" />
      <path d="M2.75 10.25h18.5" />
      <path d="M6 14.25h4.5" />
    </>
  ),
  bars: (
    <>
      <path d="M3 20.5h18" />
      <path d="M6.75 20.5v-6.5" />
      <path d="M11.25 20.5V9" />
      <path d="M15.75 20.5v-9" />
      <path d="M20.25 20.5V4.5" />
    </>
  ),
  coins: (
    <>
      <path d="M4 7c0-1.38 3.58-2.5 8-2.5s8 1.12 8 2.5-3.58 2.5-8 2.5S4 8.38 4 7Z" />
      <path d="M4 7v10c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5V7" />
      <path d="M4 12c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="12" cy="12" r="0.75" />
    </>
  ),
  umbrella: (
    <>
      <path d="M12 3.5V5" />
      <path d="M3.5 12.5a8.5 8.5 0 0 1 17 0Z" />
      <path d="M12 12.5v5.5a2.5 2.5 0 0 0 5 0" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.3 3.75 5.3 3.75 8.5S14.4 18.2 12 20.5c-2.4-2.3-3.75-5.3-3.75-8.5S9.6 5.8 12 3.5Z" />
    </>
  ),
  bank: (
    <>
      <path d="M3.5 9 12 4l8.5 5" />
      <path d="M3.5 9h17" />
      <path d="M5.5 9.5v8" />
      <path d="M9.5 9.5v8" />
      <path d="M14.5 9.5v8" />
      <path d="M18.5 9.5v8" />
      <path d="M3.5 20.5h17" />
    </>
  ),
}

interface LineIconProps {
  name: LineIconName
  className?: string
}

export function LineIcon({ name, className = 'h-6 w-6' }: LineIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}
