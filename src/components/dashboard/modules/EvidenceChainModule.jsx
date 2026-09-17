import { useMemo } from 'react'
import { CircleCheck, CircleX, Lock, LockOpen, TriangleAlert } from 'lucide-react'
import {
  DataTable,
  ExplainPanel,
  ModuleHeader,
  Panel,
  StatTile,
  StatusPill,
} from '../DashboardKit'
import {
  BONUS_SPLIT,
  CORROBORATION,
  DAY_LOTS,
  PAYMENTS,
  STATED_LIMITS,
  WORK_TICKETS,
  exportGate,
  survivalAdjusted,
} from '../../../lib/dashboard/fieldRecords'

const KES = (n) => `KES ${Math.round(n).toLocaleString()}`
const HARVEST_ID = 'HRV-2026-0412'
const HARVEST_DATE = '2026-08-20'

const LOT_COLUMNS = [
  { key: 'lotId', label: 'Day lot', mono: true, sortAccessor: (r) => r.lotId },
  { key: 'blockId', label: 'Block', mono: true, sortAccessor: (r) => r.blockId },
  { key: 'ticketCount', label: 'Tickets', align: 'right', mono: true, sortAccessor: (r) => r.ticketCount },
  { key: 'ticketsTotalKg', label: 'Σ tickets', align: 'right', mono: true, sortAccessor: (r) => r.ticketsTotalKg },
  { key: 'weighedKg', label: 'Weighed', align: 'right', mono: true, sortAccessor: (r) => r.weighedKg },
  { key: 'varianceKg', label: 'Variance', align: 'right', mono: true, sortAccessor: (r) => Math.abs(r.varianceKg) },
  { key: 'varianceStatus', label: '', align: 'right', sortAccessor: (r) => r.varianceStatus },
]

const PAY_COLUMNS = [
  { key: 'paymentId', label: 'Payment', mono: true, sortAccessor: (r) => r.paymentId },
  { key: 'baseKes', label: 'Base', align: 'right', mono: true, sortAccessor: (r) => r.baseKes },
  { key: 'qualityPremiumKes', label: 'Quality', align: 'right', mono: true, sortAccessor: (r) => r.qualityPremiumKes },
  { key: 'conservationPremiumKes', label: 'Conservation', align: 'right', mono: true, sortAccessor: (r) => r.conservationPremiumKes },
  { key: 'totalKes', label: 'Total', align: 'right', mono: true, sortAccessor: (r) => r.totalKes },
  { key: 'mpesaRef', label: 'M-Pesa ref', mono: true, sortAccessor: (r) => r.mpesaRef },
  { key: 'workerNotifiedAt', label: 'Worker notified', align: 'right', sortAccessor: (r) => r.workerNotifiedAt ?? '' },
]

/**
 * Evidence Chain — what every number in this portal actually rests on.
 *
 * ForestOS could always show a verified batch. It could not show the substrate:
 * `FAIR_PAY` was premium-per-kg with nothing beneath it, and a harvest carried
 * `pluckers: 1240` as a bare integer. An auditor asking "show me the 1,240
 * payments" had nothing to look at.
 *
 * The records rendered here arrive from Forest Line, the field capture layer
 * (sibling repo, branch `presentation-v2`) — work tickets, the day-lot
 * reconciliation, payments, survival checks and the zone sign-off. Their shapes
 * are declared in `contracts/shapes.js`.
 *
 * The module is built around one idea from that repo: every number shown to an
 * outsider must decompose into records carrying an identity, a location, a time
 * and an *independent corroboration*. The corroboration table and the stated
 * limits are therefore part of the screen, not an appendix — naming your own
 * attack surface is what makes an assurance claim believable.
 */
export default function EvidenceChainModule() {
  const gate = useMemo(() => exportGate(HARVEST_ID, HARVEST_DATE), [])
  const survival = useMemo(() => survivalAdjusted(), [])

  const ticketsShown = WORK_TICKETS.length
  const ticketsTotal = gate.lots.reduce((s, l) => s + l.ticketCount, 0)
  const payTotal = PAYMENTS.reduce((s, p) => s + p.totalKes, 0)

  function renderLot(key, row) {
    if (key === 'ticketsTotalKg' || key === 'weighedKg') return `${row[key].toLocaleString()} kg`
    if (key === 'varianceKg') {
      const bad = row.varianceStatus === 'flagged'
      return (
        <span className={bad ? 'font-semibold text-amber-700' : 'text-ink'}>
          {row.varianceKg > 0 ? '+' : ''}
          {row.varianceKg} kg
        </span>
      )
    }
    if (key === 'varianceStatus')
      return <StatusPill status={row.varianceStatus === 'flagged' ? 'flagged' : 'clear'} />
    return row[key]
  }

  function renderPay(key, row) {
    if (key.endsWith('Kes')) return KES(row[key])
    if (key === 'workerNotifiedAt') {
      return row.workerNotifiedAt ? (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700">
          <CircleCheck className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
          SMS sent
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-700">
          <CircleX className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
          Not notified
        </span>
      )
    }
    return row[key]
  }

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Evidence Chain"
        sub={`Batch 802 · harvest ${HARVEST_ID} · what the verification rests on`}
        prototype
      />

      {/* The gate, first — it is the conclusion the rest of the page supports. */}
      <div
        className={
          'rounded-lg border p-4 shadow-card ' +
          (gate.releasable
            ? 'border-emerald-900/15 bg-emerald-500/[0.06]'
            : 'border-amber-700/25 bg-amber-500/[0.06]')
        }
      >
        <div className="flex flex-wrap items-start gap-3">
          {gate.releasable ? (
            <LockOpen className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" strokeWidth={2} aria-hidden="true" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg text-emerald-950">
              {gate.releasable
                ? 'Releasable as a verified claim'
                : 'Held — not releasable as a verified claim'}
            </p>
            <p className="mt-1 max-w-[70ch] text-[13px] leading-relaxed text-ink-muted">
              Nothing leaves ForestOS as “verified” unless every day lot reconciles and a named
              human has signed off on the period it falls in.
            </p>

            {gate.signOff ? (
              <dl className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {[
                  ['Sign-off', gate.signOff.signOffId],
                  ['Signed by', `${gate.signOff.signedBy} · ${gate.signOff.signedAt.slice(0, 10)}`],
                  ['Period', `${gate.signOff.periodStart} → ${gate.signOff.periodEnd}`],
                  [
                    'Covers',
                    `${gate.signOff.covers.workTickets.toLocaleString()} tickets · ${gate.signOff.covers.dayLots} lots · ${gate.signOff.covers.payments.toLocaleString()} payments`,
                  ],
                  ['Record hash', gate.signOff.hash],
                  ['Exceptions open', String(gate.signOff.exceptionsOpen)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-3 border-b border-line pb-1">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">{label}</dt>
                    <dd className="text-right font-mono text-[11px] text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-amber-700">
                No sign-off covers this period
              </p>
            )}

            {gate.signOff && (
              <blockquote className="mt-3 border-l-2 border-emerald-600/40 pl-3 text-[13px] italic leading-relaxed text-ink">
                “{gate.signOff.attestation}”
              </blockquote>
            )}

            {(gate.blockers.length > 0 || gate.warnings.length > 0) && (
              <ul className="mt-3 space-y-1">
                {gate.blockers.map((b) => (
                  <li key={b} className="flex items-start gap-1.5 text-[12px] text-amber-700">
                    <CircleX className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                    <span className="font-semibold">Blocker:</span> {b}
                  </li>
                ))}
                {gate.warnings.map((w) => (
                  <li key={w} className="flex items-start gap-1.5 text-[12px] text-ink-muted">
                    <TriangleAlert className="mt-0.5 h-3 w-3 shrink-0 text-amber-700" strokeWidth={2.25} aria-hidden="true" />
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Work tickets"
          value={ticketsTotal.toLocaleString()}
          unit="behind this harvest"
        />
        <StatTile
          label="Lots reconciled"
          value={`${gate.lots.length - gate.flagged.length}/${gate.lots.length}`}
          unit="tickets vs weighed lot"
          tone={gate.flagged.length ? 'warn' : 'positive'}
          share={gate.lots.length ? (gate.lots.length - gate.flagged.length) / gate.lots.length : 0}
        />
        <StatTile
          label="Tree survival"
          value={`${Math.round(survival.survivalRate * 100)}%`}
          unit={`${survival.alive} of ${survival.planted} alive at last check`}
          tone={survival.survivalRate >= 0.8 ? 'positive' : 'warn'}
          share={survival.survivalRate}
        />
        <StatTile
          label="Disputed tickets"
          value={String(gate.disputed.length)}
          unit="raised by workers themselves"
          tone={gate.disputed.length ? 'warn' : 'default'}
        />
      </div>

      <Panel
        title="Day-lot reconciliation"
        lede="The seam where product traceability holds or fails: the sum of a day's work tickets against the physically weighed lot."
      >
        <DataTable
          columns={LOT_COLUMNS}
          rows={DAY_LOTS}
          renderCell={renderLot}
          sortable
          csvName="ForestOS-day-lot-reconciliation"
        />
        <p className="mt-3 flex items-start gap-1.5 border-t border-line pt-3 text-[12px] leading-relaxed text-ink-muted">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" strokeWidth={2.25} aria-hidden="true" />
          <span>
            <span className="font-semibold text-ink">LOT-TIN-20260819 is flagged.</span> 508 kg of
            weighed leaf with no work ticket behind it is the shape of leaf bought in from outside
            the buffer to inherit its conservation story. That lot is excluded from this batch and
            cannot be exported as verified.
          </span>
        </p>
      </Panel>

      <Panel
        title="Work tickets"
        lede={`One person, one plot, one day — the atom everything decomposes to. ${ticketsShown} of ${ticketsTotal.toLocaleString()} shown.`}
      >
        <ul className="divide-y divide-line">
          {WORK_TICKETS.map((t) => (
            <li key={t.ticketId} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
              <span className="min-w-0">
                <span className="font-mono text-[12px] text-ink">{t.ticketId}</span>
                <span className="ml-2 font-mono text-[11px] text-ink-faint">
                  {t.plotId} · {t.task} · witnessed by {t.recordedBy}
                </span>
              </span>
              <span className="flex items-center gap-3">
                <span className="font-mono text-[12px] tabular-nums text-ink">
                  {t.quantity} {t.unit} × KES {t.rateKes}
                </span>
                <StatusPill status={t.status} />
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-ink-muted">
          Worker IDs are held internally and stripped at the API boundary — buyer and consumer
          payloads carry aggregate counts only, never a person.
        </p>
      </Panel>

      <Panel
        title="Payments"
        lede="The rows beneath the fair-pay figures. Money lands on the worker's own M-Pesa number, never through a supervisor."
      >
        <DataTable
          columns={PAY_COLUMNS}
          rows={PAYMENTS}
          renderCell={renderPay}
          sortable
          csvName="ForestOS-payment-records"
        />
        <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-ink-muted">
          {KES(payTotal)} across {PAYMENTS.length} workers for one week. The SMS receipt is a
          control, not a courtesy: the person being paid is the cheapest and most reliable check on
          the number. A payment with no receipt is an open gap.
        </p>
      </Panel>

      <Panel
        title="Tree survival, not tree planting"
        lede="A planting claim stays open through scheduled re-checks of the same polygon, and can be downgraded later."
      >
        <div className="flex flex-wrap gap-2">
          {BONUS_SPLIT.map((b) => (
            <span
              key={b.milestone}
              className="rounded-full border border-emerald-900/15 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] text-emerald-700"
            >
              {b.milestone} · {b.sharePct}%
            </span>
          ))}
        </div>
        <p className="mt-3 max-w-[74ch] text-[13px] leading-relaxed text-ink-muted">
          Pay everything at planting and you have bought a planting event. Pay most of it on
          survival and you have bought a forest — for the same money — because the person who
          planted the tree now has a standing reason to protect it.
          {' '}
          {survival.checksPending > 0 && (
            <span className="text-ink">
              {survival.checksPending} check{survival.checksPending === 1 ? '' : 's'} still
              outstanding, covering {survival.pendingTrees} trees not yet counted as surviving.
            </span>
          )}
        </p>
      </Panel>

      <Panel
        title="What independently corroborates each link"
        lede="Identity, location and time are easy. Independent corroboration is what separates this from every verified badge that later embarrassed its issuer."
      >
        <ul className="divide-y divide-line">
          {CORROBORATION.map((c) => (
            <li key={c.link} className="py-2.5">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-emerald-800">{c.link}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink">{c.by}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
                Independent of us: {c.independent}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title="What we state rather than let an auditor find"
        lede="An overclaim that gets caught discards everything else we said."
      >
        <ul className="space-y-2">
          {STATED_LIMITS.map((l) => (
            <li key={l} className="flex items-start gap-2 text-[13px] leading-relaxed text-ink">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" strokeWidth={2.25} aria-hidden="true" />
              {l}
            </li>
          ))}
        </ul>
      </Panel>

      <ExplainPanel
        lines={[
          'Everything on this page arrives from Forest Line, the field app that community workers and block supervisors use. ForestOS does not create these records; it is where they become something a buyer, an auditor or a funder can act on.',
          'The order matters. The gate at the top is the conclusion; the tables below are the evidence. If a lot does not reconcile, or nobody has signed the period, the claim does not leave the building — and the screen says so rather than quietly exporting anyway.',
          'The limits at the bottom are deliberate. A proposal that claims no weaknesses is not trusted by anyone experienced, and an auditor who catches one overclaim discards every other number we showed them.',
        ]}
      />
    </div>
  )
}
