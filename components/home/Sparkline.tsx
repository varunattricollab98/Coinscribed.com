'use client'

/**
 * Tiny inline SVG sparkline. Pure presentational — it receives an array of
 * numbers and draws a smooth line, coloured green/red by overall direction.
 * No axes, no labels: it's a glanceable trend, CoinDesk/Bloomberg style.
 */
interface SparklineProps {
  data: number[]
  className?: string
  width?: number
  height?: number
}

export function Sparkline({
  data,
  className,
  width = 96,
  height = 32,
}: SparklineProps) {
  if (!data || data.length < 2) {
    return <div className={className} style={{ width, height }} aria-hidden="true" />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)

  const points = data.map((d, i) => {
    const x = i * stepX
    const y = height - ((d - min) / range) * height
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })

  const up = data[data.length - 1] >= data[0]
  const stroke = up ? '#1F6F4A' : '#9B2C2C'
  const fillId = `spark-${up ? 'up' : 'down'}`

  const areaPath = `M0,${height} L${points.join(' L')} L${width},${height} Z`
  const linePath = `M${points.join(' L')}`

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${fillId})`} />
      <path
        d={linePath}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
