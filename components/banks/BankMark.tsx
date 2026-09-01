import type { BankMarkStyle } from '@/data/banks'

interface BankMarkProps {
  brand: BankMarkStyle
  /** `sm` for compact rows, `md`/`lg` for cards and page headers. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: { box: 'h-8 w-8 rounded-md', two: 'text-[11px]', three: 'text-[9px]' },
  md: { box: 'h-10 w-10 rounded-lg', two: 'text-[13px]', three: 'text-[10px]' },
  lg: { box: 'h-12 w-12 rounded-lg', two: 'text-[15px]', three: 'text-xs' },
} as const

/** #RGB or #RRGGBB -> [r, g, b]. Falls back to mid grey on anything unexpected. */
function toRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim()
    if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [90, 85, 78]
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

/** Mix toward black (amount 0-1). Used to bring bright brand hues up to AA. */
function darken([r, g, b]: [number, number, number], amount: number) {
  const k = 1 - amount
  return `rgb(${Math.round(r * k)} ${Math.round(g * k)} ${Math.round(b * k)})`
}

/** Mix toward white. Used so dark navies stay legible on graphite. */
function lighten([r, g, b]: [number, number, number], amount: number) {
  const m = (c: number) => Math.round(c + (255 - c) * amount)
  return `rgb(${m(r)} ${m(g)} ${m(b)})`
}

/**
 * A bank's identifying tile: its monogram set in the institution's brand hue on
 * a wash of that same hue.
 *
 * Earlier this was a saturated solid block with white text. At 32-36px that read
 * as a loud sticker and fought the surrounding editorial palette, and the
 * three-letter monograms looked cramped. A tint plus coloured type keeps each
 * bank just as distinguishable while sitting quietly on warm paper.
 *
 * Brand hues vary enormously in luminance — PNC's orange and TD's green would
 * both fail contrast if used as-is for text — so the type colour is mixed toward
 * black for light mode and toward white for dark mode rather than used raw. The
 * four values are handed to CSS as custom properties, which is what lets a
 * single class carry both colour schemes; Tailwind cannot generate variants for
 * a runtime hex.
 *
 * Always decorative: the bank's name is rendered next to this everywhere it
 * appears, so announcing the monogram too would only repeat it.
 */
export function BankMark({ brand, size = 'lg', className = '' }: BankMarkProps) {
  const { box, two, three } = SIZES[size]
  const rgb = toRgb(brand.color)
  const monogram = brand.monogram.slice(0, 3)

  return (
    <span
      aria-hidden="true"
      className={`bank-mark inline-flex shrink-0 items-center justify-center ${box} ${className}`}
      style={
        {
          '--bank-tint': `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]} / 0.11)`,
          '--bank-tint-dark': `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]} / 0.20)`,
          '--bank-ring': `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]} / 0.28)`,
          '--bank-ink': darken(rgb, 0.24),
          '--bank-ink-dark': lighten(rgb, 0.5),
        } as React.CSSProperties
      }
    >
      <span
        className={`font-sans font-bold uppercase leading-none tracking-[0.02em] ${
          monogram.length > 2 ? three : two
        }`}
      >
        {monogram}
      </span>
    </span>
  )
}
