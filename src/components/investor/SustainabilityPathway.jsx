import { ArrowRight } from 'lucide-react'

const STAGES = [
  { label: 'ESG / impact capital', state: 'complete' },
  { label: 'Initial conservation intervention', state: 'complete' },
  { label: 'Verified conservation outcomes', state: 'complete' },
  { label: 'Traceable agricultural production', state: 'complete' },
  { label: 'Buyer / brand participation', state: 'active' },
  { label: 'Conservation value', state: 'upcoming' },
  { label: 'Reinvestment', state: 'upcoming' },
]

const STATE_STYLE = {
  complete: 'border-risk-low/40 bg-risk-low/10 text-ink',
  active: 'border-forest-accent/50 bg-forest-accent/10 text-ink',
  upcoming: 'border-line text-ink-faint',
}

/**
 * Target operating model (build brief §21) — labeled explicitly as a
 * pathway, not a claim that the model already closes the loop. Two stages
 * read "active" / "upcoming" here because the demo data genuinely doesn't
 * show them reached yet (2 buyer partners, KSh 0 reinvestment) — this
 * component reflects that data rather than asserting the full loop works.
 */
export default function SustainabilityPathway() {
  return (
    <div>
      <p className="font-mono text-label uppercase tracking-label-wide text-ink-faint">
        Sustainability pathway · Target operating model
      </p>
      <ol className="mt-4 flex flex-wrap items-center gap-2">
        {STAGES.map((stage, index) => (
          <li key={stage.label} className="flex items-center gap-2">
            <span
              className={`rounded-full border px-3.5 py-2 text-xs font-medium leading-tight shadow-sm ${STATE_STYLE[stage.state]}`}
            >
              {stage.label}
            </span>
            {index < STAGES.length - 1 && (
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-faint" strokeWidth={1.75} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <p className="mt-4 max-w-[62ch] text-xs leading-relaxed text-ink-muted">
        The goal is a system where conservation increasingly supports itself through verified
        economic value, not a recurring subsidy. Capital funds the bridge — the outcomes and value
        stages above have not yet been reached on this project; the impact and capital pages track
        the actual verified progress toward them.
      </p>
    </div>
  )
}
