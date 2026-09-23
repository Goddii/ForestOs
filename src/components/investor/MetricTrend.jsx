import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const CONFIG = {
  up: { icon: TrendingUp, color: 'var(--color-forest-accent)' },
  down: { icon: TrendingDown, color: 'var(--color-danger)' },
  flat: { icon: Minus, color: 'var(--color-ink-faint)' },
}

/**
 * Direction-only trend chip. Never claims a magnitude the data model doesn't
 * calculate — callers pass the plain baseline/current numbers alongside this
 * for the reader to compare themselves.
 *
 * @param {{ trend: 'up' | 'down' | 'flat', className?: string }} props
 */
export default function MetricTrend({ trend, className = '' }) {
  const config = CONFIG[trend] ?? CONFIG.flat
  const Icon = config.icon
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${className}`}
      style={{ backgroundColor: `color-mix(in oklab, ${config.color} 16%, transparent)` }}
      aria-hidden="true"
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} style={{ color: config.color }} />
    </span>
  )
}
