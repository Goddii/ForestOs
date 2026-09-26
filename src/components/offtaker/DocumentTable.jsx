import { useMemo, useState } from 'react'
import { Download, Paperclip } from 'lucide-react'
import FilterBar from '../investor/FilterBar'
import { useEvidenceDrawer } from '../investor/EvidenceDrawerContext'
import VerificationStateBadge from '../investor/VerificationStateBadge'
import { DOCUMENT_KIND_LABELS } from '../../data/supply/documents'
import { DOCUMENT_STATUS_LABELS } from '../../lib/offtaker/documentStatus'
import { currentState } from '../../lib/programme/verificationState'
import DataTable from './DataTable'
import { DocumentStatusBadge } from './StatusBadges'

/**
 * The document library table: every document with its status, issuer, issue
 * and expiry dates, evidence and verification state, as the brief requires.
 * Evidence ids open the shared evidence drawer. Downloads are placeholders
 * until a document store exists, and say so.
 *
 * @param {{ documents: any[], kinds?: string[], showFilters?: boolean }} props
 */
export default function DocumentTable({ documents, kinds, showFilters = true }) {
  const { openEvidence } = useEvidenceDrawer()
  const [search, setSearch] = useState('')
  const [kind, setKind] = useState('')
  const [status, setStatus] = useState('')

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return documents.filter(
      (document) =>
        (!kinds || kinds.includes(document.kind)) &&
        (!kind || document.kind === kind) &&
        (!status || document.status === status) &&
        (!q || `${document.title} ${document.id} ${document.issuer} ${document.scopeRef ?? ''}`.toLowerCase().includes(q)),
    )
  }, [documents, kinds, kind, status, search])

  const kindOptions = Object.entries(DOCUMENT_KIND_LABELS)
    .filter(([value]) => !kinds || kinds.includes(value))
    .map(([value, label]) => ({ value, label }))

  return (
    <div className="space-y-3">
      {showFilters && (
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search documents, issuers, batches…"
          filters={[
            ...(kindOptions.length > 1 ? [{ key: 'kind', label: 'All types', value: kind, options: kindOptions, onChange: setKind }] : []),
            {
              key: 'status',
              label: 'Any status',
              value: status,
              options: Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
              onChange: setStatus,
            },
          ]}
        />
      )}
      <DataTable
        caption="Documents"
        rows={rows}
        rowKey={(document) => document.id}
        minWidth="64rem"
        empty="No documents match these filters for your role."
        columns={[
          {
            key: 'title',
            header: 'Document',
            cell: (document) => (
              <>
                <p className="font-medium text-ink">{document.title}</p>
                <p className="mt-0.5 font-mono text-label text-ink-faint">
                  {document.id} · {DOCUMENT_KIND_LABELS[document.kind]}
                </p>
                {document.withdrawnReason && <p className="mt-1 text-xs text-ink-muted">{document.withdrawnReason}</p>}
              </>
            ),
          },
          { key: 'status', header: 'Status', cell: (document) => <DocumentStatusBadge status={document.status} /> },
          { key: 'issuer', header: 'Issuer', cell: (document) => <span className="text-ink-muted">{document.issuer}</span> },
          { key: 'issued', header: 'Issued', cell: (document) => <span className="font-mono text-label tabular-nums text-ink-muted">{document.issuedDate}</span> },
          {
            key: 'expiry',
            header: 'Expires',
            cell: (document) => <span className="font-mono text-label tabular-nums text-ink-muted">{document.expiryDate ?? 'No expiry'}</span>,
          },
          {
            key: 'evidence',
            header: 'Evidence',
            cell: (document) =>
              document.evidenceIds.length ? (
                <div className="flex flex-wrap gap-1">
                  {document.evidenceIds.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => openEvidence(id)}
                      className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 font-mono text-label text-forest-accent hover:border-forest-accent/40 hover:bg-forest-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                    >
                      <Paperclip className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                      {id}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-ink-faint">Document only</span>
              ),
          },
          { key: 'verification', header: 'Verification', cell: (document) => <VerificationStateBadge state={currentState(document.verification)} /> },
          {
            key: 'download',
            header: '',
            cell: (document) => (
              <button
                type="button"
                disabled={document.status === 'withdrawn'}
                title="Placeholder: no document store is connected yet"
                aria-label={`Download ${document.title} (placeholder)`}
                className="grid h-7 w-7 place-items-center rounded-full border border-line text-ink-muted hover:border-forest-accent/40 hover:text-forest-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </button>
            ),
          },
        ]}
      />
    </div>
  )
}
