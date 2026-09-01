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

/** WCAG relative luminance, 0 (black) to 1 (white). */
function luminance([r, g, b]: [number, number, number]) {
  const f = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

function mixToBlack([r, g, b]: [number, number, number], amount: number) {
  const k = 1 - amount
  return `rgb(${Math.round(r * k)} ${Math.round(g * k)} ${Math.round(b * k)})`
}

function mixToWhite([r, g, b]: [number, number, number], amount: number) {
  const m = (c: number) => Math.round(c + (255 - c) * amount)
  return `rgb(${m(r)} ${m(g)} ${m(b)})`
}

/**
 * Type colour for the light theme.
 *
 * Brand hues span a huge luminance range — PNC's orange and TD's green are far
 * brighter than Citi's navy — so a single fixed darkening step would either wash
 * out the bright ones or crush the dark ones to near-black. Darkening is scaled
 * by measured luminance instead, which keeps every mark comfortably legible on
 * its own tint while preserving the hue.
 */
function inkFor(rgb: [number, number, number]) {
  const l = luminance(rgb)
  // Bright hues need a lot of darkening; already-dark ones need almost none.
  const amount = l > 0.5 ? 0.55 : l > 0.3 ? 0.45 : l > 0.15 ? 0.3 : 0.12
  return mixToBlack(rgb, amount)
}

/** Type colour for the dark theme: lift dark hues far enough off graphite. */
function inkInverseFor(rgb: [number, number, number]) {
  const l = luminance(rgb)
  const amount = l < 0.1 ? 0.68 : l < 0.25 ? 0.55 : 0.4
  return mixToWhite(rgb, amount)
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
          '--bank-ink': inkFor(rgb),
          '--bank-ink-dark': inkInverseFor(rgb),
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
