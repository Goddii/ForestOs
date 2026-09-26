import { useEvidenceDrawer } from './EvidenceDrawerContext'
import { useWorkspace } from './FunderWorkspaceContext'
import { IMPACT_GOALS } from '../../data/funder/programme'
import ActionButton from './ui/ActionButton'
import Badge from './ui/Badge'

const pct = (value) => `${Math.max(0, Math.min(100, value))}%`

/** Threshold track: 0–100% with the target line, programme and funded-site markers. */
function ThresholdTrack({ target, programme, funded, unit }) {
  const isMeasured = programme !== null && programme !== undefined
  const hasFunded = funded !== null && funded !== undefined
  return (
    <div aria-hidden="true">
      <div
        className="relative mt-5 mb-1.5 h-2.5 rounded bg-canvas-sunk"
        style={isMeasured ? undefined : { backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 4px, var(--color-canvas) 4px 8px)' }}
      >
        {isMeasured && <div className="absolute inset-y-0 left-0 rounded bg-forest-accent-soft" style={{ width: pct(programme) }} />}
        {Number.isFinite(target) && (
        <div className="absolute -inset-y-1.5 w-0.5 bg-ink" style={{ left: pct(target) }}>
          <span className="absolute -top-4.5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-label tabular-nums text-ink-muted">
            Target {target}{unit}
          </span>
        </div>
        )}
        {isMeasured && (
          <div className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-forest-accent" style={{ left: pct(programme) }} />
        )}
        {hasFunded && (
          <div className="absolute top-full mt-0.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-white bg-forest-accent-dark" style={{ left: pct(funded) }} />
        )}
      </div>
      <div className="flex justify-between font-mono text-label tabular-nums text-ink-faint">
        <span>0{unit}</span>
        <span>100{unit}</span>
      </div>
    </div>
  )
}

function OutcomeCard({ outcome, yours, onEvidence }) {
  const { indicator, programme, funded, pending, evidenceId, asOf } = outcome
  const { unit, target } = indicator
  const isMeasured = programme !== null && programme !== undefined
  const hasDelta = isMeasured && Number.isFinite(target)
  const delta = hasDelta ? programme - target : 0
  const summary = isMeasured
    ? `Programme ${programme}${unit} against a target of ${target}${unit}; on sites ${yours} funded ${funded ?? 'not yet measured'}${funded != null ? unit : ''}.`
    : `Not yet measured. Target ${target}${unit}.`
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-line bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">{indicator.label}</h3>
          <p className="mt-1 max-w-[52ch] text-xs leading-relaxed text-ink-muted">{indicator.method}</p>
        </div>
        <div className="shrink-0 text-right">
          {isMeasured ? (
            <>
              <p className="font-mono text-2xl font-semibold leading-none tabular-nums text-ink">{programme}{unit}</p>
              {hasDelta && <p className={`mt-1 font-mono text-label tabular-nums ${delta >= 0 ? 'text-forest-accent' : 'text-amber-700'}`}>
                {delta >= 0 ? '+' : '−'}{Math.abs(delta)}{unit === '%' ? ' pts' : ` ${unit}`} vs target
              </p>}
            </>
          ) : (
            <p className="font-mono text-label text-ink-faint">Not yet measured</p>
          )}
        </div>
      </div>
      <p className="sr-only">{summary}</p>
      <ThresholdTrack target={target} programme={programme} funded={funded} unit={unit} />
      <div className="mt-auto flex flex-wrap items-center gap-2">
        {isMeasured ? <Badge tone="verified">Measured · as of {asOf}</Badge> : <Badge tone="neutral">Awaiting first count</Badge>}
        {pending > 0 && <Badge tone="warning">{pending} check{pending === 1 ? '' : 's'} still to come</Badge>}
        <span className="font-mono text-label tabular-nums text-ink-muted">
          Your sites: {funded != null ? `${funded}${unit}` : 'not yet measured'}
        </span>
        {evidenceId && (
          <span className="ml-auto">
            <ActionButton variant="text" onClick={() => onEvidence(evidenceId)}>Evidence</ActionButton>
          </span>
        )}
      </div>
    </li>
  )
}

/**
 * Outcomes are reported only where a method has been applied to real
 * counts or audits; everything else says "not yet measured". Impact goals
 * are named so a funder can see them, never given a number (audit §12).
 */
export default function OutcomesPanel() {
  const { outcomes, terms } = useWorkspace()
  const { openEvidence } = useEvidenceDrawer()

  return (
    <div className="space-y-6">
      <div>
        <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted" aria-label="Chart key">
          <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-forest-accent" />Programme</li>
          <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-forest-accent-dark" />On sites {terms.yours} funded</li>
          <li className="flex items-center gap-1.5"><span className="h-3 w-0.5 bg-ink" />Target</li>
        </ul>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {outcomes.map((outcome) => (
            <OutcomeCard key={outcome.indicator.id} outcome={outcome} yours={terms.yours} onEvidence={openEvidence} />
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold text-ink">Long-term impact</h3>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {IMPACT_GOALS.map((goal) => (
            <li key={goal.id} className="rounded-xl border border-dashed border-line-strong p-4">
              <p className="text-compact font-semibold text-ink">{goal.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{goal.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
