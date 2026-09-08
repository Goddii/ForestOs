import { ModuleHeader, Panel, StatTile } from '../../DashboardKit'
import { ESG } from '../../../../lib/dashboard/esg'

const CATEGORY_TONE = {
  MRV: 'border-emerald-600/30 bg-emerald-600/[0.10] text-emerald-700',
  Payment: 'border-emerald-600/30 bg-emerald-600/[0.10] text-emerald-700',
  Certificate: 'border-emerald-600/30 bg-emerald-600/[0.10] text-emerald-700',
  Drawdown: 'border-line-strong bg-paper-sunk text-ink-muted',
  Alert: 'border-amber-700/30 bg-amber-500/[0.12] text-amber-700',
}

export default function ImpactAuditLogsModule() {
  const { auditLog } = ESG
  const byCat = (cat) => auditLog.filter((e) => e.category === cat).length

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Impact Audit Logs"
        sub="Append-only verification trail across MRV, payments and certificates"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Verified events" value={auditLog.length} unit="last 30 days" tone="positive" />
        <StatTile label="Certificates" value={byCat('Certificate')} unit="issued this period" />
        <StatTile label="Open alerts" value={byCat('Alert')} tone="warn" />
        <StatTile label="Last verification" value={auditLog[0].ts.slice(0, 10)} unit={auditLog[0].category} />
      </div>

      <Panel title="Audit trail" lede="Every reconciled event, its reference, and the verifying node.">
        <ul className="divide-y divide-line">
          {auditLog.map((entry) => (
            <li key={entry.id} className="flex flex-wrap items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span
                className={
                  'mt-0.5 inline-flex shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ' +
                  (CATEGORY_TONE[entry.category] ?? CATEGORY_TONE.Drawdown)
                }
              >
                {entry.category}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-ink">{entry.detail}</p>
                <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                  {entry.id} · {entry.ref} · {entry.ts} · {entry.verifier}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
