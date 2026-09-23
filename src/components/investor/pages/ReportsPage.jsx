import SectionHeading from '../SectionHeading'
import ReportCard from '../ReportCard'
import EmptyState from '../EmptyState'
import ContentCard from '../ui/ContentCard'
import { REPORTS } from '../../../data/investor'

/**
 * Reporting Centre (build brief §19).
 */
export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SectionHeading
        eyebrow="Reporting centre"
        title="Reports for this project"
        description="Quarterly impact, financial deployment, conservation evidence, verification and ESG / nature metrics — each with its reporting period, data coverage and status."
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
