import SectionHeading from '../SectionHeading'
import GovernancePanel from '../GovernancePanel'
import ContentCard from '../ui/ContentCard'
import { useWorkspace } from '../FunderWorkspaceContext'

function DisclosureTerms() {
  const { policy, org } = useWorkspace()
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ContentCard className="p-5">
        <h3 className="text-base font-semibold text-ink">What {org.name} can see</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-compact leading-relaxed text-ink-muted">
          {policy.visible.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ContentCard>
      <ContentCard className="p-5">
        <h3 className="text-base font-semibold text-ink">What stays with NTZDC</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-compact leading-relaxed text-ink-muted">
          {policy.withheld.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ContentCard>
    </div>
  )
}

/**
 * Project governance (build brief §18).
 */
export default function GovernancePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <section>
        <SectionHeading
          title="What this workspace shows, and what it withholds"
          description="Field records hold personal data about farmers and staff. This workspace applies the disclosure terms below before anything reaches you."
        />
        <DisclosureTerms />
      </section>

      <SectionHeading
        title="Who is accountable for what"
        description="Implementing organization, conservation manager, field teams, verification partner, technology partner and funder — and the reporting, verification, escalation and data-ownership processes that connect them."
      />
      <GovernancePanel />
    </div>
  )
}
