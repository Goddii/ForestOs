import SectionHeading from '../SectionHeading'
import GovernancePanel from '../GovernancePanel'

/**
 * Project governance (build brief §18).
 */
export default function GovernancePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <SectionHeading
        eyebrow="Governance"
        title="Who is accountable for what"
        description="Implementing organization, conservation manager, field teams, verification partner, technology partner and funder — and the reporting, verification, escalation and data-ownership processes that connect them."
      />
      <GovernancePanel />
    </div>
  )
}
