import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Panel, StatTile } from '../DashboardKit'
import { ORG, EUDR, FAIR_PAY, SATELLITE, QR_ANALYTICS, OVERVIEW_TRENDS } from '../../../lib/dashboardData'

const openAlerts = SATELLITE.encroachmentAlerts.filter(
  (a) => a.status !== 'Resolved — replanted',
).length

const ATTENTION = [
  {
    to: 'eudr',
    count: EUDR.summary.flagged,
    label: 'plots flagged for field verification',
    tone: 'warn',
  },
  {
    to: 'satellite',
    count: openAlerts,
    label: 'encroachment alerts still open',
    tone: 'warn',
  },
  {
    to: 'eudr',
    count: EUDR.summary.watch,
    label: 'plots on the watch list',
    tone: 'neutral',
  },
]

export default function OverviewModule() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-2xl text-emerald-950 sm:text-3xl">Overview</h2>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">
          {ORG.name} · {ORG.sector} · partner since {ORG.since}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Plots in compliance"
          value={`${EUDR.summary.clear}/${EUDR.summary.total}`}
          unit={`${EUDR.summary.hectares} ha audited`}
          delta={OVERVIEW_TRENDS.compliance.delta}
          trend={OVERVIEW_TRENDS.compliance.series}
        />
        <StatTile
          label="Premium above auction"
          value={`+${FAIR_PAY.totalPremiumKesPerKg}`}
          unit="KES / kg"
          tone="positive"
          delta={OVERVIEW_TRENDS.premium.delta}
          trend={OVERVIEW_TRENDS.premium.series}
        />
        <StatTile
          label="NDVI health index"
          value={SATELLITE.ndvi.current}
          tone="positive"
          delta={OVERVIEW_TRENDS.ndvi.delta}
          trend={OVERVIEW_TRENDS.ndvi.series}
        />
        <StatTile
          label="Consumer scans"
          value={`${(QR_ANALYTICS.totalScans / 1000).toFixed(1)}k`}
          unit={QR_ANALYTICS.scanRangeLabel}
          delta={OVERVIEW_TRENDS.scans.delta}
          trend={OVERVIEW_TRENDS.scans.series}
        />
      </div>

      <Panel title="Needs attention" lede="Open items across the sector, most urgent first.">
        <ul className="divide-y divide-line">
          {ATTENTION.map((item, i) => (
            <li key={i}>
              <Link
                to={`/dashboard/${item.to}`}
                className="group flex items-center gap-3 py-3 transition-colors first:pt-0 last:pb-0 hover:text-emerald-700"
              >
                <span
                  className={
                    'grid h-7 w-9 shrink-0 place-items-center rounded-md font-display text-lg tabular-nums ' +
                    (item.tone === 'warn'
                      ? 'bg-amber-500/[0.14] text-amber-700'
                      : 'bg-paper-sunk text-ink-muted')
                  }
                >
                  {item.count}
                </span>
                <span className="flex-1 text-[13px] text-ink">{item.label}</span>
                <ArrowRight
                  className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-700"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
