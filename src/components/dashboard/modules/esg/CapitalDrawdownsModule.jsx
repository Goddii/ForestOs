import { ModuleHeader, Panel, StatTile, Sparkline, DataTable, StatusPill } from '../../DashboardKit'
import { ESG } from '../../../../lib/dashboard/esg'

const KES = (n) => `KES ${(n / 1_000_000).toFixed(0)}M`
const QUARTERS = ['Q4·24', 'Q1·25', 'Q2·25', 'Q3·25', 'Q4·25', 'Q3·26']

const COLUMNS = [
  { key: 'id', label: 'Tranche', mono: true, sortAccessor: (r) => r.id },
  { key: 'date', label: 'Date', mono: true, sortAccessor: (r) => r.date },
  { key: 'purpose', label: 'Purpose', sortAccessor: (r) => r.purpose },
  { key: 'amountKes', label: 'Amount', align: 'right', mono: true, sortAccessor: (r) => r.amountKes },
  { key: 'status', label: '', align: 'right', sortAccessor: (r) => r.status },
]

export default function CapitalDrawdownsModule() {
  const { drawdowns, cumulativeDrawnKesM } = ESG
  const drawn = drawdowns.filter((d) => d.status === 'drawn').reduce((s, d) => s + d.amountKes, 0)
  const scheduled = drawdowns
    .filter((d) => d.status === 'scheduled' || d.status === 'pending')
    .reduce((s, d) => s + d.amountKes, 0)
  const next = drawdowns.find((d) => d.status === 'scheduled')

  return (
    <div className="space-y-5">
      <ModuleHeader title="Capital Drawdowns" sub="LP capital calls against fund milestones" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Drawn to date" value={KES(drawn)} unit={`${drawdowns.filter((d) => d.status === 'drawn').length} tranches`} tone="positive" />
        <StatTile label="Scheduled" value={KES(scheduled)} unit="next 2 quarters" />
        <StatTile label="Next call" value={next ? next.date : '—'} unit={next ? KES(next.amountKes) : ''} tone="warn" />
        <StatTile label="Avg tranche" value={KES(drawn / drawdowns.filter((d) => d.status === 'drawn').length)} />
      </div>

      <Panel title="Cumulative capital drawn" lede="Running total of released tranches, KES millions.">
        <Sparkline values={cumulativeDrawnKesM} />
        <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          {QUARTERS.map((q) => (
            <span key={q}>{q}</span>
          ))}
        </div>
      </Panel>

      <Panel title="Tranche ledger" lede="Every capital call and its milestone.">
        <DataTable
          columns={COLUMNS}
          rows={drawdowns}
          sortable
          csvName="ForestOS-capital-drawdowns"
          renderCell={(key, row) => {
            if (key === 'amountKes') return KES(row.amountKes)
            if (key === 'status') return <StatusPill status={row.status} />
            return row[key]
          }}
        />
      </Panel>
    </div>
  )
}
