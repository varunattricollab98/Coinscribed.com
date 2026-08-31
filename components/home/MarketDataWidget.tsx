// Market data table for major indices.
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
    <div className="panel-flush overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Index</th>
            <th className="text-right">Last</th>
            <th className="text-right">Change</th>
            <th className="text-right">% Change</th>
          </tr>
        </thead>
        <tbody>
          {indices.map((item) => (
            <tr key={item.name}>
              <td className="font-medium text-ink dark:text-ink-inverse">
                {item.name}
              </td>
              <td className="text-right font-serif font-bold text-ink dark:text-ink-inverse">
                {item.value}
              </td>
              <td
                className={`text-right ${
                  item.up ? 'text-up dark:text-up-light' : 'text-down dark:text-down-light'
                }`}
              >
                {item.change}
              </td>
              <td
                className={`text-right ${
                  item.up ? 'text-up dark:text-up-light' : 'text-down dark:text-down-light'
                }`}
              >
                {item.percent}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-hairline px-4 py-3 text-caption text-ink-muted dark:border-hairline-dark dark:text-ink-inverse-muted">
        Illustrative values shown for demonstration. Not live market data.
      </p>
    </div>
  )
}
