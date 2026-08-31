// Trust / social-proof stat blocks (NerdWallet / Bankrate style).

interface Stat {
  value: string
  label: string
  icon: JSX.Element
}

const iconClasses = 'h-8 w-8 text-teal-primary dark:text-teal-medium'

const stats: Stat[] = [
  {
    value: '7',
    label: 'Financial Calculators',
    icon: (
      <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M8 6h8M8 10h2M12 10h2M16 10h.01M8 14h2M12 14h2M16 14h2M8 18h2M12 18h2M16 18h2" />
      </svg>
    ),
  },
  {
    value: '12+',
    label: 'Major US Banks',
    icon: (
      <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M3 21h18M4 10h16M5 10l7-6 7 6M6 10v11M10 10v11M14 10v11M18 10v11" />
      </svg>
    ),
  },
  {
    value: 'Daily',
    label: 'Market News',
    icon: (
      <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M4 4h13a2 2 0 0 1 2 2v12a2 2 0 0 0 2-2M4 4v14a2 2 0 0 0 2 2h13M7 8h8M7 12h8M7 16h5" />
      </svg>
    ),
  },
  {
    value: '100%',
    label: 'Free',
    icon: (
      <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
]

export function TrustSignals() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-2 text-center"
        >
          {stat.icon}
          <span className="font-serif text-3xl font-bold text-teal-primary dark:text-teal-medium sm:text-4xl">
            {stat.value}
          </span>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}
