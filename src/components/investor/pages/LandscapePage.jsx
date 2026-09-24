import SectionHeading from '../SectionHeading'
import EvidenceChain from '../EvidenceChain'
import CanopyComparison from '../CanopyComparison'
import SeedlingBatchDiary from '../SeedlingBatchDiary'
import ActionButton from '../ui/ActionButton'
import ContentCard from '../ui/ContentCard'
import { CORE_OUTCOMES, LANDSCAPE_SUMMARY, getEvidenceById } from '../../../data/investor'
import { BUFFER_SEGMENTS, LAND_USE_LABELS, TENURE_LABELS } from '../../../data/funder/geography'
import { useWorkspace, useWorkspacePath } from '../FunderWorkspaceContext'
import { currentState } from '../../../lib/programme/verificationState'

const km = (value) => value.toFixed(1)

function BufferSegments() {
  const { activities, allocationIds } = useWorkspace()
  const totals = BUFFER_SEGMENTS.reduce(
    (sum, segment) => ({ ...sum, [segment.tenure]: (sum[segment.tenure] ?? 0) + segment.lengthKm }),
    {},
  )
  return (
    <ContentCard className="overflow-x-auto">
      <table className="w-full min-w-[44rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            <th scope="col" className="py-3 pl-5 pr-4 font-semibold">Segment</th>
            <th scope="col" className="px-4 py-3 font-semibold">Tenure</th>
            <th scope="col" className="px-4 py-3 font-semibold">Land use</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">Length</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">Area</th>
            <th scope="col" className="py-3 pl-4 pr-5 text-right font-semibold">Your verified activities</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {BUFFER_SEGMENTS.map((segment) => {
            const funded = activities.filter(
              (activity) =>
                activity.segmentId === segment.id &&
                allocationIds.has(activity.allocationId) &&
                currentState(activity.verification) === 'verified',
            )
            return (
              <tr key={segment.id}>
                <td className="py-3 pl-5 pr-4 text-[13px] font-medium text-ink">{segment.label}</td>
                <td className="px-4 py-3 text-[12px] text-ink-muted">{TENURE_LABELS[segment.tenure]}</td>
                <td className="px-4 py-3 text-[12px] text-ink-muted">{LAND_USE_LABELS[segment.landUse]}</td>
                <td className="px-4 py-3 text-right font-mono text-[12px] tabular-nums text-ink">{km(segment.lengthKm)} km</td>
                <td className="px-4 py-3 text-right font-mono text-[12px] tabular-nums text-ink-muted">{Math.round(segment.areaHa)} ha</td>
                <td className="py-3 pl-4 pr-5 text-right font-mono text-[12px] tabular-nums text-forest-accent">{funded.length}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="border-t border-line px-5 py-3 text-[12px] text-ink-faint">
        {Object.entries(totals)
          .map(([tenure, length]) => `${km(length)} km ${TENURE_LABELS[tenure].toLowerCase()}`)
          .join('; ')}
        . Length and area are computed from each segment's centre line at a nominal 100 m width. Demo geometry, not a surveyed boundary.
      </p>
    </ContentCard>
  )
}

/**
 * Landscape evidence — what the ground itself shows. The interactive map
 * has one home (the Overview) and isn't repeated here; this page carries
 * the visual evidence behind the landscape claims instead: canopy
 * before/after per conservation zone, the evidence chain for the
 * active-conservation figure, and every seedling batch's photo diary.
 */
export default function LandscapePage() {
  const conservationMetric = CORE_OUTCOMES.find((m) => m.id === 'conservation')
  const path = useWorkspacePath()
  const conservationEvidence = ['ev-002', 'ev-001', 'ev-003', 'ev-007'].map(getEvidenceById).filter(Boolean)

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <section>
        <SectionHeading
          eyebrow="Canopy"
          title="Before and after, zone by zone"
          description="Dated satellite imagery of each conservation zone, earliest archive capture against the latest."
          action={
            <ActionButton to={path()} variant="text">
              Interactive map
            </ActionButton>
          }
        />
        <CanopyComparison />
      </section>

      {conservationMetric && (
        <section>
          <SectionHeading
            eyebrow="How do we know?"
            title={`${conservationMetric.value.toLocaleString('en-US')} ha under active conservation`}
          />
          <div className="rounded-2xl border border-line bg-card p-6 shadow-card">
            <EvidenceChain records={conservationEvidence} lastVerified={LANDSCAPE_SUMMARY.lastVerified} />
          </div>
        </section>
      )}

      <section>
        <SectionHeading
          eyebrow="Buffer belt"
          title="The buffer, segment by segment"
          description="NTZDC reports its buffer in kilometres of forest boundary as well as hectares. Each segment is either NTZDC buffer inside the gazetted reserve or community land beside it."
        />
        <BufferSegments />
      </section>

      <section>
        <SectionHeading
          eyebrow="Restoration"
          title="Seedling batches, nursery to survival check"
          description="Each batch's whole life on one timeline — dated photos at every stage, tied to the payments that funded it."
        />
        <SeedlingBatchDiary />
      </section>
    </div>
  )
}
