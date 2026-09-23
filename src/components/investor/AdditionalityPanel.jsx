import { Check, Minus } from 'lucide-react'
import { ADDITIONALITY_SCENARIOS } from '../../data/investor'

function ScenarioCard({ scenario, tone }) {
  const Icon = tone === 'with' ? Check : Minus
  return (
    <div
      className={`rounded-2xl border p-6 shadow-card ${
        tone === 'with' ? 'border-forest-accent/30 bg-forest-accent-soft' : 'border-line bg-card'
      }`}
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
        {scenario.sublabel}
      </p>
      <h3 className="mt-1 text-xl font-bold text-ink">{scenario.label}</h3>
      <ul className="mt-4 space-y-2.5">
        {scenario.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-muted">
            <Icon
              className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone === 'with' ? 'text-forest-accent' : 'text-ink-faint'}`}
              strokeWidth={2}
              aria-hidden="true"
            />
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * What changes because of this capital (build brief §17). Careful language
 * throughout — "expected pathway", "monitored change" — never a causality
 * claim the project's methodology doesn't support (see the disclosure note
 * in src/data/investor/additionality.js).
 */
export default function AdditionalityPanel() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ScenarioCard scenario={ADDITIONALITY_SCENARIOS.without} tone="without" />
        <ScenarioCard scenario={ADDITIONALITY_SCENARIOS.with} tone="with" />
      </div>
      <p className="mt-4 max-w-[68ch] text-[12px] leading-relaxed text-ink-muted">
        {ADDITIONALITY_SCENARIOS.note}
      </p>
    </div>
  )
}
