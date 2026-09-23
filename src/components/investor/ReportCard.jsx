import { useState } from 'react'
import { Download, Clock, CheckCircle2, FileText } from 'lucide-react'
import { REPORT_STATUS_LABELS } from '../../data/investor'
import Badge from './ui/Badge'
import ActionButton from './ui/ActionButton'

const STATUS_CONFIG = {
  ready: { icon: CheckCircle2, tone: 'verified' },
  in_review: { icon: Clock, tone: 'warning' },
  scheduled: { icon: Clock, tone: 'neutral' },
}

/**
 * An institutional document-centre entry (design-review brief §18) — a
 * report reads as a real document (period, coverage window, evidence
 * coverage, data sources) rather than a generic list row. Designed to sit
 * inside a `<ul className="divide-y divide-line">` in a `ContentCard`, so it
 * carries no border of its own.
 *
 * @param {{ report: import('../../data/investor/types').Report }} props
 */
export default function ReportCard({ report }) {
  const status = STATUS_CONFIG[report.status]
  const StatusIcon = status.icon
  const isReady = report.status === 'ready'
  const [clicked, setClicked] = useState(false)

  return (
    <li className="px-5 py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <FileText className="mt-1 h-6 w-6 shrink-0 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              {report.period}
            </p>
            <p className="mt-0.5 text-[17px] font-semibold text-ink">{report.title}</p>
            <Badge tone={status.tone} icon={StatusIcon} className="mt-2">
              {REPORT_STATUS_LABELS[report.status]}
            </Badge>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ActionButton
            variant="ghost"
            icon={Download}
            iconPosition="left"
            disabled={!isReady}
            onClick={() => setClicked(true)}
            title={isReady ? 'Placeholder — no report pipeline connected yet' : 'Not yet available for download'}
          >
            Export
          </ActionButton>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 pl-10 font-mono text-[11px] sm:grid-cols-4">
        <div>
          <dt className="text-ink-faint">Coverage</dt>
          <dd className="mt-0.5 font-sans font-medium text-ink-muted">{report.coverage}</dd>
        </div>
        <div>
          <dt className="text-ink-faint">Evidence coverage</dt>
          <dd className="mt-0.5 font-sans font-medium tabular-nums text-ink-muted">{report.evidenceCoveragePct}%</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-ink-faint">Data sources</dt>
          <dd className="mt-0.5 font-sans font-medium text-ink-muted">{report.dataSources.join(' · ')}</dd>
        </div>
      </dl>
      <p className="mt-2 pl-10 text-[12px] leading-relaxed text-ink-muted">{report.dataCoverage}</p>
      {clicked && (
        <p className="mt-2 pl-10 font-mono text-[10px] uppercase tracking-[0.1em] text-warning">
          Demo only — connect a reporting pipeline to enable real export
        </p>
      )}
    </li>
  )
}
