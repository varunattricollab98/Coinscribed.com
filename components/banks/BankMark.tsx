import type { BankMarkStyle } from '@/data/banks'

interface BankMarkProps {
  brand: BankMarkStyle
  /** `lg` for cards, `sm` for compact lists and the detail header. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: { box: 'h-9 w-9 rounded-md', text: 'text-[10px]' },
  md: { box: 'h-11 w-11 rounded-lg', text: 'text-xs' },
  lg: { box: 'h-12 w-12 rounded-lg', text: 'text-sm' },
} as const

/**
 * A bank's identifying tile: its monogram on its brand colour.
 *
 * Always decorative. The bank's name is rendered next to this in every place it
 * is used, so announcing the monogram too would just repeat the same
 * information — hence `aria-hidden`.
 *
 * The colour is applied inline because it comes from data, not from the design
 * system; Tailwind cannot generate a class for an arbitrary runtime hex. A thin
 * inset highlight and a translucent ring keep the tile reading as an object on
 * both paper and graphite backgrounds, including for the lighter brand colours
 * where a flat swatch would otherwise wash out.
 */
export function BankMark({ brand, size = 'lg', className = '' }: BankMarkProps) {
  const { box, text } = SIZES[size]

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ring-1 ring-inset ring-white/15 ${box} ${className}`}
      style={{
        backgroundColor: brand.color,
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.28), 0 1px 2px rgba(11,11,12,0.10)',
      }}
    >
      <span
        className={`font-sans font-bold uppercase leading-none tracking-wide text-white ${text}`}
        style={{ textShadow: '0 1px 1px rgba(0,0,0,0.22)' }}
      >
        {brand.monogram}
      </span>
    </span>
  )
}
