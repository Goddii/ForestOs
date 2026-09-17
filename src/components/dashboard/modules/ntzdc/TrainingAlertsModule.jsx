import { useMemo } from 'react'
import { ArrowDown, ArrowUp, CalendarPlus, TriangleAlert } from 'lucide-react'
import {
  DataTable,
  ExplainPanel,
  ModuleHeader,
  Panel,
  StatTile,
  StatusPill,
} from '../../DashboardKit'
import { NTZDC } from '../../../../lib/dashboard/ntzdc'
import {
  TRIGGERS,
  centreQualitySummary,
  farmerQualityTable,
  trainingTriggers,
} from '../../../../lib/dashboard/centre'

const pct = (n) => `${(n * 100).toFixed(1)}%`

const TRIGGER_COLUMNS = [
  { key: 'farmerId', label: 'Farmer ID', mono: true, sortAccessor: (r) => r.farmerId },
  { key: 'centre', label: 'Centre', sortAccessor: (r) => r.centre },
  { key: 'because', label: 'Why the data flagged this', sortAccessor: (r) => r.rejectionRate },
  { key: 'history', label: 'Prior training', align: 'right' },
  { key: 'action', label: '', align: 'right', sortAccessor: (r) => r.action },
]

const SESSION_COLUMNS = [
  { key: 'topic', label: 'Session', sortAccessor: (r) => r.topic },
  { key: 'centre', label: 'Centre', sortAccessor: (r) => r.centre },
  { key: 'date', label: 'Date', mono: true, sortAccessor: (r) => r.date },
  { key: 'enrolled', label: 'Enrolled', align: 'right', mono: true, sortAccessor: (r) => r.enrolled / r.capacity },
  { key: 'status', label: '', align: 'right', sortAccessor: (r) => r.status },
]

/**
 * Farmer Training — rebuilt around Q12: "Training should be triggered by data.
 * ForestOS should identify high rejection rates, repeat quality problems,
 * farmers requiring intervention. The system should then track whether quality
 * improves after training."
 *
 * The previous version of this module was an attendance roster: sessions,
 * dates, seats filled. It could say training happened; it could not say who
 * needed it or whether it worked. Both halves of Edwin's answer now lead the
 * module, and the schedule has been demoted to context beneath them.
 *
 * A farmer who was trained and did not improve is separated out as an
 * escalation rather than being re-enrolled in the same session — repeating an
 * intervention that already failed is the thing this screen exists to prevent.
 */
export default function TrainingAlertsModule() {
  const { training } = NTZDC
  const triggers = useMemo(() => trainingTriggers(), [])
  const rows = useMemo(() => farmerQualityTable(), [])
  const summary = useMemo(() => centreQualitySummary(), [])

  const toSchedule = triggers.filter((t) => t.action === 'schedule')
  const toEscalate = triggers.filter((t) => t.action === 'escalate')
  const trained = rows.filter((r) => r.improved !== null)

  function renderTrigger(key, row) {
    if (key === 'history') {
      if (!row.lastTraining) return <span className="text-ink-faint">None</span>
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
    if (key === 'action') {
      return row.action === 'escalate' ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/25 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-amber-700">
          <TriangleAlert className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
          Escalate — training did not work
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/15 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-700">
          <CalendarPlus className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
          Schedule training
        </span>
      )
    }
    return row[key]
  }

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Farmer Training"
        sub={`${triggers.length} farmers flagged by delivery data · ${training.trainedYtd.toLocaleString()} trained YTD`}
        prototype
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Flagged by data"
          value={String(triggers.length)}
          unit="from rejection history"
          tone={triggers.length > 0 ? 'warn' : 'default'}
        />
        <StatTile label="To schedule" value={String(toSchedule.length)} unit="not yet trained" />
        <StatTile
          label="To escalate"
          value={String(toEscalate.length)}
          unit="trained, no improvement"
          tone={toEscalate.length > 0 ? 'warn' : 'default'}
        />
        <StatTile
          label="Training effectiveness"
          value={`${summary.improvedCount}/${trained.length}`}
          unit="sessions that lowered rejection"
          tone={trained.length && summary.improvedCount === trained.length ? 'positive' : 'warn'}
          share={trained.length ? summary.improvedCount / trained.length : 0}
        />
      </div>

      <Panel
        title="Triggered by the data"
        lede={`A farmer is flagged at ${pct(TRIGGERS.highRejectionRate)} rejection or ${TRIGGERS.repeatReasonCount} repeats of one reason. Nobody is enrolled by hand.`}
      >
        {triggers.length === 0 ? (
          <p className="text-[13px] text-ink-muted">
            No farmer currently crosses a trigger threshold.
          </p>
        ) : (
          <DataTable
            columns={TRIGGER_COLUMNS}
            rows={triggers}
            renderCell={renderTrigger}
            sortable
            csvName="ForestOS-training-triggers"
          />
        )}
      </Panel>

      <Panel
        title="Did it work?"
        lede="Rejection rate before the session against the rate after it — the only test that matters."
      >
        {trained.length === 0 ? (
          <p className="text-[13px] text-ink-muted">No completed sessions with enough deliveries either side yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {trained.map((row) => (
              <li key={row.farmerId} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className="block font-mono text-[12px] text-ink">{row.farmerId}</span>
                  <span className="block text-[11px] text-ink-muted">
                    {row.lastTraining.topic} · {row.lastTraining.date}
                  </span>
                </span>
                <span
                  className={
                    'inline-flex items-center gap-1.5 font-mono text-[12px] tabular-nums ' +
                    (row.improved ? 'text-emerald-700' : 'text-amber-700')
                  }
                >
                  {pct(row.beforeRate)} → {pct(row.afterRate)}
                  <span className="font-sans text-[11px]">
                    {row.improved ? 'improved' : 'no improvement'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Scheduled sessions" lede="Context only — the queue above is what drives enrolment.">
        <DataTable
          columns={SESSION_COLUMNS}
          rows={training.sessions}
          sortable
          csvName="ForestOS-training-schedule"
          renderCell={(key, row) => {
            if (key === 'topic')
              return (
                <span>
                  <span className="block font-medium text-ink">{row.topic}</span>
                  <span className="block font-mono text-[11px] text-ink-faint">{row.id}</span>
                </span>
              )
            if (key === 'enrolled') return `${row.enrolled}/${row.capacity}`
            if (key === 'status') return <StatusPill status={row.status} />
            return row[key]
          }}
        />
      </Panel>

      <ExplainPanel
        lines={[
          'Training used to be planned as a schedule and reported as attendance. This screen inverts that: the delivery record decides who needs help, and the rejection rate afterwards decides whether the help worked.',
          'That distinction matters for funding. An ESG funder paying for farmer training can be shown the rate falling, not the seats filled.',
          'A farmer who was trained and whose rejection rate did not move is escalated, not re-enrolled — the second session would likely fail for the same unaddressed reason.',
        ]}
      />
    </div>
  )
}
