// Market data strip for major indices.
//
// NOTE: Free real-time index data requires an API key, so these values are
// static, realistic illustrations. To wire live data later, fetch from a
// market data provider (e.g. Twelve Data, Alpha Vantage, Finnhub) in a client
// component or a cached server route and map the response into `indices` below.

interface IndexRow {
  name: string
  value: string
  change: string
  percent: string
  up: boolean
}

const indices: IndexRow[] = [
  { name: 'S&P 500', value: '5,308.13', change: '+18.75', percent: '+0.35%', up: true },
  { name: 'Dow Jones', value: '39,872.99', change: '-38.62', percent: '-0.10%', up: false },
  { name: 'Nasdaq', value: '16,801.54', change: '+52.34', percent: '+0.31%', up: true },
  { name: 'Gold', value: '$2,417.40', change: '+9.10', percent: '+0.38%', up: true },
  { name: '10Y Treasury', value: '4.42%', change: '-0.03', percent: '-0.68%', up: false },
]

export function MarketDataWidget() {
  return (
    <div className="card">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {indices.map((item) => (
          <div
            key={item.name}
            className="flex flex-col gap-1 border-b border-brand-border-gray pb-3 last:border-b-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 sm:last:border-r-0 dark:border-zinc-800"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {item.name}
            </span>
            <span className="font-serif text-lg font-bold text-zinc-900 tabular-nums dark:text-zinc-100">
              {item.value}
            </span>
            <span
              className={`flex items-center gap-1 text-xs font-medium tabular-nums ${
                item.up ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              <span aria-hidden="true">{item.up ? '▲' : '▼'}</span>
              {item.change} ({item.percent})
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
        Illustrative values shown for demonstration. Not live market data.
      </p>
    </div>
  )
}
