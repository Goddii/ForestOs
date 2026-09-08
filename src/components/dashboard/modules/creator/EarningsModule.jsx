import { ModuleHeader, Panel, StatTile, BarMeter, DataTable, StatusPill } from '../../DashboardKit'
import { CREATOR } from '../../../../lib/dashboard/creator'

const KES = (n) => `KES ${(n / 1000).toFixed(0)}k`

const COLUMNS = [
  { key: 'id', label: 'Payout', mono: true },
  { key: 'date', label: 'Date', mono: true, sortAccessor: (r) => r.date },
  { key: 'amountKes', label: 'Amount', align: 'right', mono: true, sortAccessor: (r) => r.amountKes },
  { key: 'status', label: 'Status', align: 'right' },
]

export default function EarningsModule() {
  const { earnings, commissionRatePct } = CREATOR
  const total = earnings.breakdown.reduce((s, r) => s + r.kes, 0)
  const maxPart = Math.max(...earnings.breakdown.map((r) => r.kes))
  const lifetime = earnings.paidYtdKes + earnings.pendingKes
  const payouts = [...earnings.payouts].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Commission & Earnings"
        sub={`${commissionRatePct}% edition commission · next payout ${earnings.nextPayout}`}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Pending" value={KES(earnings.pendingKes)} unit={`due ${earnings.nextPayout}`} tone="positive" />
        <StatTile label="Paid YTD" value={`KES ${(earnings.paidYtdKes / 1_000_000).toFixed(2)}M`} unit="to this creator" />
        <StatTile label="Commission rate" value={`${commissionRatePct}%`} unit="per edition" />
        <StatTile label="Lifetime" value={`KES ${(lifetime / 1_000_000).toFixed(2)}M`} unit="paid + pending" tone="positive" />
      </div>

      <Panel title="This cycle’s breakdown" lede="Components stacked into the next payout.">
        <div className="space-y-3">
          {earnings.breakdown.map((row) => (
            <BarMeter key={row.label} label={row.label} value={row.kes} max={maxPart} display={KES(row.kes)} />
          ))}
        </div>
        <div className="mt-4 flex items-baseline gap-2 border-t border-line pt-3">
          <span className="font-display text-3xl tabular-nums text-emerald-700">{KES(total)}</span>
          <span className="font-mono text-[11px] text-ink-muted">pending payout</span>
        </div>
      </Panel>

      <Panel title="Payout history" lede="Settled and scheduled transfers.">
        <DataTable
          columns={COLUMNS}
          rows={payouts}
          sortable
          csvName="ForestOS-creator-payouts"
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
