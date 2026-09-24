import SectionHeading from '../SectionHeading'
import ImpactFlowDiagram from '../ImpactFlowDiagram'
import ProgrammeShowcase from '../ProgrammeShowcase'
import ActionButton from '../ui/ActionButton'
import { INVESTOR_PROJECT } from '../../../data/investor'
import { useWorkspace, useWorkspacePath } from '../FunderWorkspaceContext'

/**
 * The programme showcase — the story a fund manager can tell outside the
 * console. Why this landscape matters, how capital becomes impact, then
 * share-ready programme stories with photos, live headline figures,
 * evidence links and copyable captions. The project's numbers, map, capital
 * and risk summaries each have their own home (Overview, Capital, Risks)
 * and aren't repeated here.
 */
export default function ProjectPage() {
  const { programme, terms } = useWorkspace()
  const path = useWorkspacePath()
  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <SectionHeading
        title={programme.name}
        description={`${programme.location} · ${programme.startDate} to ${programme.endDate}`}
      />

      <section>
        <SectionHeading title="The buffer belt" />
        <p className="max-w-[68ch] text-sm leading-relaxed text-ink-muted">{INVESTOR_PROJECT.problem}</p>
        <p className="mt-4 max-w-[68ch] text-compact leading-relaxed text-ink-muted">
          Implemented by {INVESTOR_PROJECT.implementer}. {INVESTOR_PROJECT.beneficiaries}
        </p>
        <ActionButton to={path('organisation')} variant="text" className="mt-2">
          Full governance structure
        </ActionButton>
      </section>

      <section>
        <SectionHeading title="How capital becomes impact" />
        <ImpactFlowDiagram />
      </section>

      <section>
        <SectionHeading
          title="On the ground"
          description={`Share-ready stories for ${terms.storyAudience}. Each figure is pulled live from the record, with its evidence and a caption you can copy.`}
        />
        <ProgrammeShowcase />
      </section>
    </div>
  )
}
