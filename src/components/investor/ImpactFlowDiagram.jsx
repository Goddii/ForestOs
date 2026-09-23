import { ArrowRight } from 'lucide-react'

const STAGES = [
  {
    label: 'Capital',
    detail: 'KSh 50M committed',
  },
  {
    label: 'Conservation activities',
    detail: 'Field operations · Farmer incentives · Restoration · Monitoring · Technology',
  },
  {
    label: 'Verified evidence',
    detail: 'GPS · Photos · Satellite · Field audits',
  },
  {
    label: 'Outcomes',
    detail: 'Protected area · Participation · Compliance · Restoration',
  },
  {
    label: 'Impact',
    detail: 'Landscape protection · Community value · Supply-chain resilience',
  },
]

/**
 * The product's core model, made visible (build brief §12): capital doesn't
 * just fund "a project" — it traces through named activities to evidence to
 * measurable outcomes. Editorial column, not a card grid.
 */
export default function ImpactFlowDiagram() {
  return (
    <ol className="flex flex-col">
      {STAGES.map((stage, index) => (
        <li key={stage.label}>
          <div className="flex items-start gap-4 py-4">
            <span className="mt-1 font-mono text-[11px] text-ink-faint tnum">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="text-xl font-bold text-ink">{stage.label}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{stage.detail}</p>
            </div>
          </div>
          {index < STAGES.length - 1 && (
            <div className="ml-1 flex h-6 items-center">
              <ArrowRight
                className="h-4 w-4 rotate-90 text-ink-faint"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
