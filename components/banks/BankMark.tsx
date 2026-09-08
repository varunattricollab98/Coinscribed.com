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

function mixToBlack([r, g, b]: [number, number, number], amount: number) {
  const k = 1 - amount
  return `rgb(${Math.round(r * k)} ${Math.round(g * k)} ${Math.round(b * k)})`
}

function mixToWhite([r, g, b]: [number, number, number], amount: number) {
  const m = (c: number) => Math.round(c + (255 - c) * amount)
  return `rgb(${m(r)} ${m(g)} ${m(b)})`
}

/**
 * A brand-coloured monogram tile with a subtle gradient and depth — a
 * catchy, logo-like badge (NOT the bank's actual trademarked logo) that makes
 * every institution instantly recognisable by its own brand hue.
 *
 * The tile is a solid fill of the brand colour with a soft top-to-bottom
 * gradient (a lighter tint of the hue into the hue itself), a hairline inner
 * highlight and a soft drop shadow for lift. The monogram is set in white with
 * a faint shadow so it stays legible on both bright hues (PNC orange, TD green)
 * and dark ones (Citi navy). Values are passed as CSS custom properties because
 * Tailwind cannot generate variants for a runtime hex.
 *
 * Always decorative: the bank's name is rendered next to this everywhere it
 * appears, so announcing the monogram too would only repeat it.
 */
export function BankMark({ brand, size = 'lg', className = '' }: BankMarkProps) {
  const { box, two, three } = SIZES[size]
  const rgb = toRgb(brand.color)
  const monogram = brand.monogram.slice(0, 3)
  const base = `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`
  // A slightly lighter and slightly darker shade of the same hue for a gentle
  // gradient, so the tile has depth without changing the brand colour.
  const lighter = mixToWhite(rgb, 0.18)
  const darker = mixToBlack(rgb, 0.18)

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center shadow-sm ring-1 ring-black/5 ${box} ${className}`}
      style={{
        background: `linear-gradient(150deg, ${lighter} 0%, ${base} 55%, ${darker} 100%)`,
        boxShadow: `0 2px 6px -1px rgb(${rgb[0]} ${rgb[1]} ${rgb[2]} / 0.35)`,
      }}
    >
      <span
        className={`font-sans font-extrabold uppercase leading-none tracking-[0.02em] text-white ${
          monogram.length > 2 ? three : two
        }`}
        style={{ textShadow: '0 1px 1px rgb(0 0 0 / 0.22)' }}
      >
        {monogram}
      </span>
    </span>
  )
}
