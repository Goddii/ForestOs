import SectionHeading from '../SectionHeading'
import ReportCard from '../ReportCard'
import EmptyState from '../EmptyState'
import ContentCard from '../ui/ContentCard'
import { useWorkspace } from '../FunderWorkspaceContext'

/**
 * Reporting Centre (build brief §19).
 */
export default function ReportsPage() {
  const { reports: REPORTS } = useWorkspace()
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SectionHeading
        eyebrow="Reporting centre"
        title="Reports issued to you"
        description="Each report is reviewed by NTZDC's implementation unit and approved by the technical committee before it is issued. Its figures are frozen at issue, so a report reads the same later even as live data changes."
      />
      {REPORTS.length > 0 ? (
        <ContentCard>
          <ul className="divide-y divide-line">
            {REPORTS.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </ul>
        </ContentCard>
      ) : (
        <EmptyState message="No reports have been generated for this reporting period yet." />
      )}
    </div>
  )
}
