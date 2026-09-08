import { Check, MapPin, Satellite } from 'lucide-react'

// Shared renderer for a redacted batch chain (see `lib/batchChain.js`
// `redactBatchRecord`). Both the buyer dashboard's Batch Lookup and — once it
// migrates off the legacy flat shape — the public QR site render this same
// view-model; only the redaction level passed upstream differs.
//
// Styled with the light-console (`.dash`) tokens it currently renders inside. A
// future dark public-site mount needs a tone variant; the data contract does not
// change.

const BADGE = {
  field: { Icon: MapPin, label: 'Field' },
  satellite: { Icon: Satellite, label: 'Satellite' },
}

function VerificationBadge({ kind, detail }) {
  const { Icon, label } = BADGE[kind]
  const ok = detail?.status === 'Verified'
  return (
    <span
      className={
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ' +
        (ok
          ? 'border-emerald-600/30 bg-emerald-600/[0.10] text-emerald-700'
          : 'border-line-strong bg-paper-sunk text-ink-muted')
      }
    >
      <Icon className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden="true" />
      {label} {ok ? 'verified' : 'not tracked'}
    </span>
  )
}

export default function BatchProvenanceChain({ view }) {
  const { stages, verification } = view

  return (
    <div>
      <ol className="relative space-y-0">
        {stages.map((stage, i) => (
          <li key={stage.key} className="relative flex gap-4 pb-6 last:pb-0">
            {/* rail */}
            <div className="flex flex-col items-center">
              <span
                className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-emerald-600 bg-emerald-600 text-[10px] font-semibold text-white"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              {i < stages.length - 1 && <span className="mt-1 w-px flex-1 bg-line-strong" aria-hidden="true" />}
            </div>

            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                  {stage.label}
                </span>
                <span className="font-display text-lg leading-tight text-ink">{stage.title}</span>
              </div>

              <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {stage.rows.map((row) => (
                  <div key={row.k} className="flex flex-wrap justify-between gap-x-3 border-b border-line py-1 text-[13px] last:border-0 sm:border-0">
                    <dt className="text-ink-faint">{row.k}</dt>
                    <dd className="font-mono tabular-nums text-ink">{row.v}</dd>
                  </div>
                ))}
              </dl>

              {stage.badges && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {stage.badges.map((kind) => (
                    <VerificationBadge key={kind} kind={kind} detail={verification[kind]} />
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-2 rounded-lg border border-emerald-900/10 bg-paper-sunk/50 p-4">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-700" strokeWidth={2.5} aria-hidden="true" />
          {verification.standard} · {verification.status}
        </p>
        <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 font-mono text-[11px] sm:grid-cols-2">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-faint">Field check</dt>
            <dd className="text-ink">{verification.field.status} · {verification.field.date}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-faint">Satellite check</dt>
            <dd className="text-ink">{verification.satellite.status} · {verification.satellite.date}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-faint">Recorded</dt>
            <dd className="text-ink">{verification.timestamp}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-faint">Reference</dt>
            <dd className="text-ink">{verification.reference}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
