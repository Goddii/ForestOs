import SectionHeading from '../SectionHeading'
import RiskRegister from '../RiskRegister'
import ActivityList from '../ActivityList'
import SurvivalChecks from '../SurvivalChecks'
import ContentCard from '../ui/ContentCard'
import { useWorkspace } from '../FunderWorkspaceContext'
import { currentState } from '../../../lib/programme/verificationState'

const FOLLOW_UP_STATES = new Set(['correction_required', 'rejected', 'under_review', 'submitted'])

/**
 * Risk & Controls (build brief §16) — the full register, grouped by
 * category, never reduced to a single score.
 */
export default function RisksPage() {
  const { fundedActivities } = useWorkspace()
  const followUps = fundedActivities
    .filter((activity) => FOLLOW_UP_STATES.has(currentState(activity.verification)))
    .map((activity) => ({ activity }))

  return (
    <div className="mx-auto max-w-5xl space-y-14">
      <section>
        <SectionHeading
          eyebrow="Verification"
          title="Funded work not yet verified"
          description="Activities your payments paid for that are still in review, were returned for correction, or were rejected. Rejected work is never counted toward a target."
        />
        <ContentCard className="p-5">
          <ActivityList rows={followUps} emptyMessage="Every activity you funded has been verified." />
        </ContentCard>
      </section>

      <section>
        <SectionHeading
          eyebrow="Follow-up"
          title="Survival checks"
          description="Planting counts as an output. Survival is checked on a schedule afterwards, and an overdue check is shown here, not hidden."
        />
        <ContentCard>
          <SurvivalChecks />
        </ContentCard>
      </section>

      <section>
      <SectionHeading
        eyebrow="Risk & controls"
        title="Risk register"
        description="Environmental, social, operational, financial and data risk, each with its own owner, mitigation and last review — not a single aggregate score."
      />
      <RiskRegister />
      </section>
    </div>
  )
}
