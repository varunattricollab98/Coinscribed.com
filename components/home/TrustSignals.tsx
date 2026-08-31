// Trust / social-proof stats rendered as typography — large serif numerals
// separated by hairline dividers. No cards, no shadows, no emoji.

interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: '7', label: 'Financial Calculators' },
  { value: '12+', label: 'Major US Banks' },
  { value: 'Daily', label: 'Market News' },
  { value: '100%', label: 'Free' },
]

export function TrustSignals() {
  return (
    <div className="rule-grid grid-cols-2 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1 px-4 py-6 text-center"
        >
          <span className="font-serif text-display-1 font-bold tabular-nums text-ink dark:text-ink-inverse">
            {stat.value}
          </span>
          <span className="eyebrow text-ink-muted dark:text-ink-inverse-muted">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}
