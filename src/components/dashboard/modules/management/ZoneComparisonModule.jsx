import { ModuleHeader, Panel, DataTable } from '../../DashboardKit'
import { NTZDC_MANAGEMENT, zoneTotalPay } from '../../../../lib/dashboard/ntzdcManagement'

const STACK = [
  { key: 'baseKesPerKg', label: 'Base rate', className: 'bg-emerald-900' },
  { key: 'qualityPremiumKesPerKg', label: 'Quality premium', className: 'bg-emerald-600' },
  { key: 'conservationPremiumKesPerKg', label: 'Conservation premium', className: 'bg-emerald-400' },
]

/**
 * Segmented base + quality + conservation pay bar on one shared scale (the top
 * payer), so a shorter bar reads as a real shortfall. The three figures repeat
 * below the bar because the premium slivers are, honestly, small.
 */
function PayStack({ pay, max }) {
  const total = pay.baseKesPerKg + pay.qualityPremiumKesPerKg + pay.conservationPremiumKesPerKg
  return (
    <div className="min-w-[200px]">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-2.5 flex-1 overflow-hidden rounded-full bg-line-strong"
          role="img"
          aria-label={`Base ${pay.baseKesPerKg}, quality premium ${pay.qualityPremiumKesPerKg}, conservation premium ${pay.conservationPremiumKesPerKg} shillings per kilo, ${total.toFixed(1)} total`}
        >
          {STACK.map((seg) => (
            <span
              key={seg.key}
              className={'h-full ' + seg.className}
              style={{ width: `${(pay[seg.key] / max) * 100}%` }}
            />
          ))}
        </span>
        <span className="shrink-0 font-mono tabular-nums text-ink">{total.toFixed(1)}</span>
      </div>
      <p className="mt-1 font-mono text-[10px] tabular-nums text-ink-faint">
        {pay.baseKesPerKg.toFixed(0)} base · +{pay.qualityPremiumKesPerKg.toFixed(1)} quality · +
        {pay.conservationPremiumKesPerKg.toFixed(1)} conservation
      </p>
    </div>
  )
}

const COLUMNS = [
  { key: 'name', label: 'Zone', sortAccessor: (r) => r.name },
  { key: 'pay', label: 'Pay · KES/kg', sortAccessor: (r) => r.totalPay },
  { key: 'rejectionRatePct', label: 'Reject rate', align: 'right', mono: true, sortAccessor: (r) => r.rejectionRatePct },
  { key: 'trainingCoveragePct', label: 'Training coverage', align: 'right', mono: true, sortAccessor: (r) => r.trainingCoveragePct },
  { key: 'payGap', label: 'Pay gap', align: 'right', mono: true, sortAccessor: (r) => r.payGap },
]

export default function ZoneComparisonModule() {
  const { zones, season } = NTZDC_MANAGEMENT
  const totals = zones.map(zoneTotalPay)
  const maxPay = Math.max(...totals)
  const minPay = Math.min(...totals)

  // Widest pay gaps first — this screen exists to surface regional disparity.
  const rows = zones
    .map((z) => {
      const totalPay = zoneTotalPay(z)
      return { ...z, totalPay, payGap: +(maxPay - totalPay).toFixed(1) }
    })
    .sort((a, b) => b.payGap - a.payGap)

  const widest = rows[0]

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Zone Comparison"
        sub={`All zones · ${season} · KES ${minPay.toFixed(1)}–${maxPay.toFixed(1)}/kg paid · widest gap KES ${widest.payGap.toFixed(1)}/kg`}
      />

      <Panel
        title="What each zone pays per kilo of green leaf"
        lede={`${widest.name} farmers are paid KES ${widest.payGap.toFixed(1)}/kg less than the top-paying zone — almost all of it a smaller conservation premium. Rows are ordered by that gap; sort any column to re-rank.`}
        actions={
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            {STACK.map((seg) => (
              <li key={seg.key} className="flex items-center gap-1.5">
                <span className={'h-2 w-2 rounded-full ' + seg.className} aria-hidden="true" />
                {seg.label}
              </li>
            ))}
          </ul>
        }
      >
        <DataTable
          columns={COLUMNS}
          rows={rows}
          sortable
          csvName="ForestOS-zone-pay-comparison"
          renderCell={(key, row) => {
            if (key === 'pay') return <PayStack pay={row.pay} max={maxPay} />
            if (key === 'rejectionRatePct') return `${row.rejectionRatePct.toFixed(1)}%`
            if (key === 'trainingCoveragePct') return `${row.trainingCoveragePct}%`
            if (key === 'payGap')
              return row.payGap > 0 ? (
                <span className="text-amber-700">−{row.payGap.toFixed(1)}</span>
              ) : (
                <span className="text-ink-faint">—</span>
              )
            return row[key]
          }}
        />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          Snapshot for {season}. Re-run each season to track whether the spread is closing.
        </p>
      </Panel>
    </div>
  )
}
