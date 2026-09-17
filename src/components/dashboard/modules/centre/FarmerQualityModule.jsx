import { useMemo } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import {
  DataTable,
  ExplainPanel,
  MiniSparkline,
  ModuleHeader,
  Panel,
  StatTile,
  StatusPill,
} from '../../DashboardKit'
import {
  TRIGGERS,
  centreQualitySummary,
  farmerQualityTable,
} from '../../../../lib/dashboard/centre'

const pct = (n) => `${(n * 100).toFixed(1)}%`

const COLUMNS = [
  { key: 'farmerId', label: 'Farmer ID', mono: true, sortAccessor: (r) => r.farmerId },
  { key: 'centre', label: 'Centre', sortAccessor: (r) => r.centre },
  { key: 'volume', label: 'Delivered', align: 'right', mono: true, sortAccessor: (r) => r.totalKg },
  { key: 'rejectionRate', label: 'Rejected', align: 'right', mono: true, sortAccessor: (r) => r.rejectionRate },
  { key: 'trend', label: 'Per delivery', align: 'right' },
  { key: 'topReason', label: 'Most common reason' },
  { key: 'training', label: 'Training', align: 'right' },
]

/**
 * Farmer Quality — Q11: "ForestOS should track quality performance by farmer."
 *
 * The existing Quality & Rejections module aggregates by centre and zone, which
 * can say the Tinet centre has a problem but not which farmer to help. This
 * reads the per-farmer delivery history, so the rejection rate sits next to the
 * person who controls it — which is also Edwin's reason for putting the quality
 * incentive on the farmer rather than the sorter.
 *
 * The Training column answers Q12's second half: where a session already
 * happened, it shows whether the rejection rate actually fell afterwards. A
 * farmer who was trained and did not improve is flagged, because repeating the
 * same session would be the wrong response.
 */
export default function FarmerQualityModule() {
  const rows = useMemo(() => farmerQualityTable(), [])
  const summary = useMemo(() => centreQualitySummary(), [])

  function renderCell(key, row) {
    if (key === 'volume') return `${row.totalKg.toLocaleString()} kg`
    if (key === 'rejectionRate') {
      const hot = row.rejectionRate >= TRIGGERS.highRejectionRate
      return (
        <span className={hot ? 'font-semibold text-amber-700' : 'text-ink'}>
          {pct(row.rejectionRate)}
        </span>
      )
    }
    if (key === 'trend') {
      return (
        <span className="inline-flex justify-end">
          <MiniSparkline
            values={row.series}
            tone={row.series[row.series.length - 1] > row.series[0] ? 'amber' : 'emerald'}
          />
        </span>
      )
    }
    if (key === 'topReason') {
      if (!row.topReason) return <span className="text-ink-faint">—</span>
      return (
        <span>
          {row.topReason}
          {row.topReasonCount >= TRIGGERS.repeatReasonCount && (
            <span className="ml-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-amber-700">
              {row.topReasonCount}× repeat
            </span>
          )}
        </span>
      )
    }
    if (key === 'training') {
      if (!row.lastTraining) {
        return row.needsTraining ? (
          <StatusPill status="watch" />
        ) : (
          <span className="text-ink-faint">—</span>
        )
      }
      if (row.improved === null) {
        return <span className="font-mono text-[11px] text-ink-muted">{row.lastTraining.date}</span>
      }
      const Icon = row.improved ? ArrowDown : ArrowUp
      return (
        <span
          className={
            'inline-flex items-center gap-1 font-mono text-[11px] tabular-nums ' +
            (row.improved ? 'text-emerald-700' : 'text-amber-700')
          }
        >
          <Icon className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
          <span className="sr-only">{row.improved ? 'improved from' : 'worsened from'}</span>
          {pct(row.beforeRate)} → {pct(row.afterRate)}
        </span>
      )
    }
    return row[key]
  }

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Farmer Quality"
        sub={`${summary.farmers} farmers · last 6 deliveries each · quality tracked per farmer`}
        prototype
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Centre rejection rate"
          value={pct(summary.rejectionRate)}
          unit={`${summary.rejectedKg.toLocaleString()} kg of ${summary.totalKg.toLocaleString()} kg`}
          tone={summary.rejectionRate >= TRIGGERS.highRejectionRate ? 'warn' : 'default'}
        />
        <StatTile
          label="Flagged by data"
          value={String(summary.triggerCount)}
          unit="farmers needing intervention"
          tone={summary.triggerCount > 0 ? 'warn' : 'default'}
        />
        <StatTile
          label="Trained"
          value={String(summary.trainedCount)}
          unit="sessions attended in window"
        />
        <StatTile
          label="Improved after training"
          value={`${summary.improvedCount}/${summary.trainedCount}`}
          unit="rejection rate fell"
          tone={summary.improvedCount === summary.trainedCount ? 'positive' : 'warn'}
          share={summary.trainedCount ? summary.improvedCount / summary.trainedCount : 0}
        />
      </div>

      <Panel
        title="Quality by farmer"
        lede="Worst rejection rate first. A farmer who was trained and did not improve is flagged rather than re-enrolled."
      >
        <DataTable
          columns={COLUMNS}
          rows={rows}
          renderCell={renderCell}
          sortable
          csvName="ForestOS-farmer-quality"
        />
      </Panel>

      <ExplainPanel
        lines={[
          `Quality is measured per farmer because plucking is where quality is decided. A farmer is flagged when rejection passes ${pct(TRIGGERS.highRejectionRate)} of delivered weight, or when the same reason recurs ${TRIGGERS.repeatReasonCount} times or more.`,
          'Where a training session has already happened, the rejection rate before it is compared with the rate after it. That comparison is the point: it says whether the intervention worked, not just whether it was delivered.',
          'The sorter who grades the leaf is measured separately, on grading accuracy — not rewarded on how much they accept.',
        ]}
      />
    </div>
  )
}
