import { GOVERNANCE_MEMBERS, GOVERNANCE_PROCESS } from '../../data/investor'
import { useWorkspace } from './FunderWorkspaceContext'
import ContentCard from './ui/ContentCard'

const FUNCTION_LABEL = {
  implementing_organization: 'Implementing organization',
  conservation_manager: 'Conservation manager',
  field_team: 'Field team',
  verification_partner: 'Verification partner',
  technology_partner: 'Technology / data partner',
  funder: 'Funder',
}

const PROCESS_ROWS = [
  ['Reporting frequency', 'reportingFrequency'],
  ['Verification process', 'verificationProcess'],
  ['Escalation process', 'escalationProcess'],
  ['Data ownership', 'dataOwnership'],
  ['Accountability', 'accountability'],
]

/**
 * Project governance (build brief §18) — who's responsible for what, and
 * the accountability structure behind the numbers on every other page.
 * Purely informational (no member card links anywhere), so these carry a
 * resting shadow for depth but no hover-interactive treatment — a fake
 * clickable affordance on a non-clickable card is worse than none.
 */
export default function GovernancePanel() {
  const { org } = useWorkspace()
  // The generic funder row names whoever is looking at this workspace.
  const members = GOVERNANCE_MEMBERS.map((member) => (member.function === 'funder' ? { ...member, name: org.name } : member))
  return (
    <div className="space-y-10">
      <section>
        <h3 className="font-mono text-label font-semibold uppercase tracking-label-wide text-ink-faint">
          Roles & responsibilities
        </h3>
        <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {members.map((member) => (
            <ContentCard as="li" key={member.name} className="p-5">
              <p className="font-mono text-label font-semibold uppercase tracking-label text-forest-accent">
                {FUNCTION_LABEL[member.function]}
              </p>
              <p className="mt-1.5 text-lg font-bold text-ink">{member.name}</p>
              <p className="text-xs text-ink-muted">{member.role}</p>
              <p className="mt-2 text-compact leading-relaxed text-ink-muted">
                {member.responsibility}
              </p>
            </ContentCard>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-mono text-label font-semibold uppercase tracking-label-wide text-ink-faint">
          Process
        </h3>
        <ContentCard className="mt-3">
          <dl className="divide-y divide-line">
            {PROCESS_ROWS.map(([label, key]) => (
              <div key={key} className="px-5 py-4">
                <dt className="font-mono text-label font-semibold uppercase tracking-label text-ink-faint">
                  {label}
                </dt>
                <dd className="mt-1.5 max-w-[68ch] text-compact leading-relaxed text-ink-muted">
                  {GOVERNANCE_PROCESS[key]}
                </dd>
              </div>
            ))}
          </dl>
        </ContentCard>
      </section>
    </div>
  )
}
