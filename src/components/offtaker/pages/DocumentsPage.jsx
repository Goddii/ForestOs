import { useState } from 'react'
import { DOCUMENT_KIND_LABELS } from '../../../data/supply/documents'
import { useOfftaker } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import DocumentTable from '../DocumentTable'

const TABS = [['', 'All documents'], ...Object.entries(DOCUMENT_KIND_LABELS).map(([kind, label]) => [kind, `${label}s`])]

export default function DocumentsPage() {
  const ws = useOfftaker()
  const [tab, setTab] = useState('')
  const count = (kind) => ws.documents.filter((document) => !kind || document.kind === kind).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Certificates, batch documents, quality and traceability reports and verification records your role may open. Withdrawn documents stay listed so a copy you already hold can be checked."
      />
      <div role="tablist" aria-label="Document type" className="flex flex-wrap gap-1.5">
        {TABS.map(([kind, label]) => (
          <button
            key={kind || 'all'}
            role="tab"
            type="button"
            aria-selected={tab === kind}
            onClick={() => setTab(kind)}
            className={`rounded-full border px-3.5 py-1.5 text-compact transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
              tab === kind ? 'border-forest-accent bg-forest-accent font-semibold text-white' : 'border-line text-ink-muted hover:border-line-strong hover:text-ink'
            }`}
          >
            {label} <span className="tabular-nums opacity-70">{count(kind)}</span>
          </button>
        ))}
      </div>
      <DocumentTable key={tab} documents={ws.documents} kinds={tab ? [tab] : undefined} />
      <p className="text-xs text-ink-faint">
        {ws.withheldDocumentCount} further documents about your supply are limited to other roles in your organisation. Downloads are
        placeholders until a document store is connected.
      </p>
    </div>
  )
}
