import { useMemo, useState } from 'react'
import { AlertTriangle, Check, MessageSquare, Search } from 'lucide-react'
import { ModuleHeader, Panel, StatusPill } from '../../DashboardKit'
import {
  CENTRES,
  REJECTION_REASONS,
  amountPayable,
  deliverySms,
  farmerQuality,
  findFarmer,
  publishedRate,
} from '../../../../lib/dashboard/centre'

const KES = (n) => `KES ${Math.round(n).toLocaleString()}`
const pct = (n) => `${(n * 100).toFixed(1)}%`

function Field({ label, hint, children, htmlFor }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint"
      >
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-[11px] leading-snug text-ink-muted">{hint}</p>}
    </div>
  )
}

const inputCls =
  'w-full rounded-md border border-line bg-white px-3 py-2 text-[14px] text-ink shadow-sm ' +
  'placeholder:text-ink-faint focus:border-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/30'

/** A read-only computed value, visually distinct from an editable field. */
function Derived({ label, value, sub }) {
  return (
    <div className="rounded-md border border-line bg-paper-sunk px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">{label}</p>
      <p className="mt-0.5 font-display text-lg tabular-nums text-ink">{value}</p>
      {sub && <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">{sub}</p>}
    </div>
  )
}

/**
 * Record Delivery — the collection-centre transaction entry screen.
 *
 * Edwin's Q2 answered directly: centre staff verify and enter the final
 * transaction, capturing his nine fields. Three of them are deliberately not
 * typed by the clerk:
 *
 * - **Buffer zone** is derived from the centre, because Phase 1 traceability
 *   (Q4) is zone → centre → batch and a free-typed zone would break it.
 * - **Rejected kg** is `total − accepted`, so the two figures can never
 *   disagree.
 * - **Price per kg** comes from the operator's published rate (Q2: "must be
 *   configurable" — configured centrally in Price Configurator, not at the
 *   scale), so a centre cannot pay its own number.
 *
 * The SMS is shown as the exact text the farmer receives, with its character
 * count, because SMS is the farmer's only channel and 160 characters is a real
 * constraint rather than an implementation detail.
 */
export default function RecordDeliveryModule() {
  const rate = useMemo(() => publishedRate(), [])

  const [centreId, setCentreId] = useState(CENTRES[0].id)
  const [farmerId, setFarmerId] = useState('')
  const [totalKg, setTotalKg] = useState('')
  const [acceptedKg, setAcceptedKg] = useState('')
  const [reason, setReason] = useState('')
  const [sendSms, setSendSms] = useState(true)
  const [recorded, setRecorded] = useState(null)

  const centre = CENTRES.find((c) => c.id === centreId) ?? CENTRES[0]
  const farmer = useMemo(() => findFarmer(farmerId), [farmerId])
  const history = useMemo(() => (farmer ? farmerQuality(farmer) : null), [farmer])

  const total = Number(totalKg) || 0
  const accepted = Number(acceptedKg) || 0
  const rejected = Math.max(total - accepted, 0)
  const pay = amountPayable(accepted, rate)

  const overAccepted = accepted > total && total > 0
  const needsReason = rejected > 0 && !reason
  const ready =
    Boolean(farmer) && total > 0 && accepted >= 0 && !overAccepted && !needsReason

  const sms = deliverySms({
    farmerId: farmer?.farmerId ?? '—',
    centre: centre.name,
    totalKg: total,
    acceptedKg: accepted,
    rejectedKg: rejected,
    reason: reason || '—',
    rateKes: rate.totalKes.toFixed(1),
    payableKes: Math.round(pay.total),
  })

  function submit(event) {
    event.preventDefault()
    if (!ready) return
    setRecorded({
      farmerId: farmer.farmerId,
      centre: centre.name,
      bufferZone: centre.bufferZone,
      total,
      accepted,
      rejected,
      reason: reason || null,
      payable: pay.total,
      smsSent: sendSms,
      sms,
    })
  }

  function reset() {
    setFarmerId('')
    setTotalKg('')
    setAcceptedKg('')
    setReason('')
    setRecorded(null)
  }

  if (recorded) {
    return (
      <div className="space-y-5">
        <ModuleHeader
          title="Delivery recorded"
          sub={`${recorded.centre} · ${recorded.bufferZone}`}
          prototype
        />
        <Panel title="Transaction" lede="What was written to the collection record.">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {[
              ['Farmer ID', recorded.farmerId],
              ['Collection centre', recorded.centre],
              ['Buffer zone', recorded.bufferZone],
              ['Total delivered', `${recorded.total} kg`],
              ['Accepted', `${recorded.accepted} kg`],
              ['Rejected', `${recorded.rejected} kg`],
              ['Reason for rejection', recorded.reason ?? 'None'],
              ['Price per kg', `KES ${rate.totalKes.toFixed(1)}`],
              ['Amount payable', KES(recorded.payable)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">{label}</dt>
                <dd className="text-right text-[14px] tabular-nums text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel
          title="Farmer confirmation"
          lede={recorded.smsSent ? 'Sent by SMS — the farmer needs no smartphone.' : 'Not sent.'}
        >
          {recorded.smsSent ? (
            <div className="rounded-md border border-line bg-paper-sunk p-3">
              <p className="font-mono text-[12px] leading-relaxed text-ink">{recorded.sms}</p>
            </div>
          ) : (
            <p className="text-[13px] text-ink-muted">
              No confirmation was sent. The farmer has no record of this transaction.
            </p>
          )}
          <p className="mt-3 border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
            Prototype — no SMS gateway is connected
          </p>
        </Panel>

        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-emerald-700 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
        >
          Record another delivery
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Record Delivery"
        sub="Collection centre staff · final transaction entry"
        prototype
      />

      <form onSubmit={submit} className="space-y-5">
        <Panel title="Delivery" lede="Weighed and graded at the centre.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Farmer ID"
              htmlFor="farmer-id"
              hint={
                farmerId && !farmer
                  ? 'No registered farmer with that ID.'
                  : 'Registered farmers only — try RVT-0887.'
              }
            >
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <input
                  id="farmer-id"
                  name="farmer-id"
                  value={farmerId}
                  onChange={(e) => setFarmerId(e.target.value)}
                  placeholder="RVT-0000"
                  autoComplete="off"
                  className={inputCls + ' pl-8 font-mono uppercase'}
                />
              </div>
            </Field>

            <Field label="Collection centre" htmlFor="centre">
              <select
                id="centre"
                name="centre"
                value={centreId}
                onChange={(e) => setCentreId(e.target.value)}
                className={inputCls}
              >
                {CENTRES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Buffer zone" hint="Derived from the centre — Phase 1 traceability level.">
              <div className="rounded-md border border-line bg-paper-sunk px-3 py-2 text-[14px] text-ink">
                {centre.bufferZone} <span className="text-ink-faint">· {centre.block}</span>
              </div>
            </Field>

            <Field label="Total kg delivered" htmlFor="total-kg">
              <input
                id="total-kg"
                name="total-kg"
                type="number"
                min="0"
                step="0.5"
                inputMode="decimal"
                value={totalKg}
                onChange={(e) => setTotalKg(e.target.value)}
                placeholder="0"
                className={inputCls + ' tabular-nums'}
              />
            </Field>

            <Field
              label="Accepted kg"
              htmlFor="accepted-kg"
              hint={overAccepted ? 'Accepted cannot exceed the total delivered.' : undefined}
            >
              <input
                id="accepted-kg"
                name="accepted-kg"
                type="number"
                min="0"
                step="0.5"
                inputMode="decimal"
                value={acceptedKg}
                onChange={(e) => setAcceptedKg(e.target.value)}
                placeholder="0"
                aria-invalid={overAccepted}
                className={
                  inputCls + ' tabular-nums' + (overAccepted ? ' border-amber-700' : '')
                }
              />
            </Field>

            <Field label="Rejected kg" hint="Total minus accepted — never entered by hand.">
              <div className="rounded-md border border-line bg-paper-sunk px-3 py-2 text-[14px] tabular-nums text-ink">
                {rejected}
                {total > 0 && (
                  <span className="ml-2 font-mono text-[11px] text-ink-faint">
                    {pct(rejected / total)}
                  </span>
                )}
              </div>
            </Field>

            {rejected > 0 && (
              <Field
                label="Reason for rejection"
                htmlFor="reason"
                hint={needsReason ? 'Required whenever leaf is rejected.' : undefined}
              >
                <select
                  id="reason"
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  aria-invalid={needsReason}
                  className={inputCls + (needsReason ? ' border-amber-700' : '')}
                >
                  <option value="">Select a reason…</option>
                  {REJECTION_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>

          {history && (
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                {history.farmerId} history
              </span>
              <span className="font-mono text-[11px] tabular-nums text-ink">
                {pct(history.rejectionRate)} rejected over {history.deliveryCount} deliveries
              </span>
              {history.triggered && (
                <StatusPill status={history.trainingIneffective ? 'flagged' : 'watch'} />
              )}
              {history.topReason && (
                <span className="text-[11px] text-ink-muted">
                  Most common: {history.topReason}
                </span>
              )}
            </div>
          )}
        </Panel>

        <Panel
          title="Payment"
          lede="Rate is the operator's published figure — it is not editable at the centre."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Derived
              label="Price per kg"
              value={`KES ${rate.totalKes.toFixed(1)}`}
              sub={`published ${rate.lastPublished}`}
            />
            <Derived label="Accepted" value={`${accepted} kg`} sub="rejected leaf is not paid" />
            <Derived label="Amount payable" value={KES(pay.total)} sub="accepted kg × rate" />
          </div>

          <div className="mt-4 border-t border-line pt-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
              Rate build-up
            </p>
            <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {[
                ['Base green leaf', rate.baseKes, pay.base],
                ['Quality premium', rate.qualityKes, pay.quality],
                ['Conservation premium', rate.conservationKes, pay.conservation],
                ['Prompt-settlement uplift', rate.settlementKes, pay.settlement],
              ].map(([label, perKg, amount]) => (
                <li
                  key={label}
                  className="flex items-baseline justify-between gap-3 font-mono text-[11px] text-ink-muted"
                >
                  <span>{label}</span>
                  <span className="tabular-nums text-ink">
                    {perKg.toFixed(1)}/kg · {KES(amount)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-ink-muted">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-700" strokeWidth={2.25} aria-hidden="true" />
              The conservation premium is conditional — it releases against verified
              conservation, not on delivery. No split is agreed yet; every rate here is
              configurable.
            </p>
          </div>
        </Panel>

        <Panel title="Farmer confirmation" lede="SMS is the farmer's channel — no smartphone needed.">
          <label htmlFor="send-sms" className="flex items-center gap-2.5">
            <input
              id="send-sms"
              name="send-sms"
              type="checkbox"
              checked={sendSms}
              onChange={(e) => setSendSms(e.target.checked)}
              className="h-4 w-4 rounded border-line-strong text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600/30"
            />
            <span className="text-[13px] text-ink">Send SMS confirmation to {farmer?.phoneMasked ?? 'the farmer'}</span>
          </label>

          {sendSms && (
            <div className="mt-3">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3 w-3 text-ink-faint" strokeWidth={2} aria-hidden="true" />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  Message preview · {sms.length} characters
                  {sms.length > 160 && ' · over one SMS'}
                </span>
              </div>
              <div className="mt-1.5 rounded-md border border-line bg-paper-sunk p-3">
                <p className="font-mono text-[12px] leading-relaxed text-ink">{sms}</p>
              </div>
            </div>
          )}
        </Panel>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!ready}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-ink-faint"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            Record delivery
          </button>
          {!ready && (
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
              {!farmer
                ? 'Enter a registered farmer ID'
                : overAccepted
                  ? 'Accepted exceeds total'
                  : needsReason
                    ? 'Select a rejection reason'
                    : 'Enter the delivered weight'}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
