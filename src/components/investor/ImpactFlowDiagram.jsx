import { ArrowRight } from 'lucide-react'
import { formatCurrencyShort } from '../../lib/investor/format'
import { useWorkspace } from './FunderWorkspaceContext'

// The Capital stage is built per workspace (see capitalStage); these are the same for every funder.
const LATER_STAGES = [
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
 * The viewing funder's own commitment, from the workspace's agreement data
 * rather than a fixed figure. The programme-wide total (all funders plus
 * in-kind) is added only where the funder's terms disclose programme-wide
 * figures (`showsAttribution`), as on the Funding and Progress pages.
 */
function capitalStage({ capital, programmeFunding, terms }) {
  const { committed, currency } = capital.position
  const whose = terms.yours.charAt(0).toUpperCase() + terms.yours.slice(1)
  const own = `${whose}: ${formatCurrencyShort(committed, currency)} committed`
  if (!terms.showsAttribution) return { label: 'Capital', detail: own }
  const programmeTotal = programmeFunding.sources.reduce((sum, source) => sum + source.amount, 0)
  return { label: 'Capital', detail: `${own}, of ${formatCurrencyShort(programmeTotal, currency)} across the programme` }
}

/**
 * The product's core model, made visible (build brief §12): capital doesn't
 * just fund "a project" — it traces through named activities to evidence to
 * measurable outcomes. Editorial column, not a card grid.
 */
export default function ImpactFlowDiagram() {
  const workspace = useWorkspace()
  const STAGES = [capitalStage(workspace), ...LATER_STAGES]
  return (
    <ol className="flex flex-col">
      {STAGES.map((stage, index) => (
        <li key={stage.label}>
          <div className="flex items-start gap-4 py-4">
            <span className="mt-1 font-mono text-label text-ink-faint tnum">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="text-xl font-bold text-ink">{stage.label}</p>
              <p className="mt-1 text-compact leading-relaxed text-ink-muted">{stage.detail}</p>
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
