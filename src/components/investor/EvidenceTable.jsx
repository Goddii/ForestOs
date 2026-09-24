import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ConfidenceIndicator from './ConfidenceIndicator'
import EmptyState from './EmptyState'
import { useEvidenceDrawer } from './EvidenceDrawerContext'

const PAGE_SIZE = 8
const TYPE_LABEL = {
  satellite: 'Satellite',
  gis: 'GIS',
  field_audit: 'Field audit',
  gps: 'GPS',
  photo: 'Photo',
  farmer_record: 'Farmer record',
  conservation_activity: 'Conservation activity',
  payment_record: 'Payment record',
  verification_document: 'Verification document',
}

/**
 * Paginated evidence table (build brief §15). 10 demo records don't warrant
 * list virtualization, but pagination keeps the pattern correct for when a
 * real evidence store has thousands.
 *
 * @param {{ records: import('../../data/investor/types').EvidenceRecord[] }} props
 */
export default function EvidenceTable({ records }) {
  const { openEvidence } = useEvidenceDrawer()
  const [page, setPage] = useState(0)

  if (records.length === 0) {
    return <EmptyState message="No verified evidence available for this filter." />
  }

  const pageCount = Math.ceil(records.length / PAGE_SIZE)
  const currentPage = Math.min(page, pageCount - 1)
  const pageRecords = records.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-card">
        <table className="w-full min-w-[46rem] border-collapse text-left text-compact">
          <thead>
            <tr className="border-b border-line font-mono text-label font-semibold uppercase tracking-label text-ink-faint">
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Record</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {pageRecords.map((record) => (
              <tr
                key={record.id}
                tabIndex={0}
                role="button"
                onClick={() => openEvidence(record.id)}
                onKeyDown={(event) => event.key === 'Enter' && openEvidence(record.id)}
                className="cursor-pointer border-b border-line transition-colors duration-150 ease-in-out last:border-b-0 hover:bg-canvas-sunk focus-visible:outline-none focus-visible:bg-canvas-sunk focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/50"
              >
                <td className="px-4 py-3 font-mono text-label uppercase tracking-label text-ink-muted">
                  {TYPE_LABEL[record.type]}
                </td>
                <td className="px-4 py-3 font-medium text-ink">{record.title}</td>
                <td className="px-4 py-3 text-ink-muted">{record.location}</td>
                <td className="px-4 py-3 font-mono text-label tabular-nums text-ink-muted">{record.date}</td>
                <td className="px-4 py-3">
                  <ConfidenceIndicator status={record.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="mt-3 flex items-center justify-between font-mono text-label text-ink-faint">
          <span>
            Page {currentPage + 1} of {pageCount} · {records.length} records
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
              className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-line text-ink-muted transition-all duration-200 ease-in-out hover:border-emerald-500/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink-muted"
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <button
              type="button"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
              className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-line text-ink-muted transition-all duration-200 ease-in-out hover:border-emerald-500/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink-muted"
            >
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
