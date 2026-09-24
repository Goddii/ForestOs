import { useEvidenceDrawer } from './EvidenceDrawerContext'
import { useWorkspace } from './FunderWorkspaceContext'
import { IMPACT_GOALS } from '../../data/funder/programme'
import ContentCard from './ui/ContentCard'
import ActionButton from './ui/ActionButton'
import Badge from './ui/Badge'

function Value({ value, unit }) {
  if (value === null || value === undefined) return <span className="text-ink-faint">Not yet measured</span>
  return (
    <span className="tabular-nums">
      {value}
      {unit}
    </span>
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
      <ContentCard className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-mono text-label uppercase tracking-label text-ink-faint">
              <th scope="col" className="py-3 pl-5 pr-4 font-semibold">Outcome</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Target</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Programme</th>
              <th scope="col" className="py-3 pl-4 pr-5 text-right font-semibold">On sites {terms.yours} funded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {outcomes.map(({ indicator, programme, funded, pending, evidenceId, asOf }) => (
              <tr key={indicator.id} className="align-top">
                <td className="py-4 pl-5 pr-4">
                  <p className="text-sm font-semibold text-ink">{indicator.label}</p>
                  <p className="mt-1 max-w-[52ch] text-xs leading-relaxed text-ink-muted">{indicator.method}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {programme !== null ? <Badge tone="verified">Measured · as of {asOf}</Badge> : <Badge tone="neutral">Not yet measured</Badge>}
                    {pending > 0 && <Badge tone="warning">{pending} check{pending === 1 ? '' : 's'} still to come</Badge>}
                    {evidenceId && (
                      <ActionButton variant="text" onClick={() => openEvidence(evidenceId)}>
                        Evidence
                      </ActionButton>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-right font-mono text-xs tabular-nums text-ink-muted">
                  {indicator.target}
                  {indicator.unit}
                </td>
                <td className="px-4 py-4 text-right font-mono text-sm font-semibold text-ink">
                  <Value value={programme} unit={indicator.unit} />
                </td>
                <td className="py-4 pl-4 pr-5 text-right font-mono text-sm font-semibold text-forest-accent">
                  <Value value={funded} unit={indicator.unit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ContentCard>

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
