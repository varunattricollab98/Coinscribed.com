// Trust / social-proof stats rendered as large serif numerals separated by
// hairline dividers. Numbers count up on scroll (AnimatedCounter); non-numeric
// stats render as-is.
import { AnimatedCounter } from '@/components/motion/AnimatedCounter'

interface Stat {
  value: number
  suffix?: string
  staticLabel?: string
  label: string
}

const stats: Stat[] = [
  { value: 7, label: 'Financial Calculators' },
  { value: 12, suffix: '+', label: 'Major US Banks' },
  { value: 0, staticLabel: 'Daily', label: 'Market News' },
  { value: 100, suffix: '%', label: 'Free' },
]

export function TrustSignals() {
  return (
    <div className="rule-grid grid-cols-2 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1 px-4 py-8 text-center"
        >
          <AnimatedCounter
            value={stat.value}
            suffix={stat.suffix}
            staticLabel={stat.staticLabel}
            className="bg-accent-gradient bg-clip-text font-serif text-display-1 font-bold tabular-nums text-transparent"
          />
          <span className="eyebrow text-ink-muted dark:text-ink-inverse-muted">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}
