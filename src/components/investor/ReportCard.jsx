import { useState } from 'react'
import { Download, Clock, CheckCircle2, FileText } from 'lucide-react'
import { REPORT_STATUS_LABELS } from '../../data/funder/reports'
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
            <p className="font-mono text-label uppercase tracking-label-wide text-ink-faint">
              {report.period}
            </p>
            <p className="mt-0.5 text-lg font-semibold text-ink">{report.title}</p>
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

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 pl-10 font-mono text-label sm:grid-cols-4">
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
      <p className="mt-2 pl-10 text-xs leading-relaxed text-ink-muted">{report.dataCoverage}</p>

      {report.snapshot && (
        <dl className="mt-4 ml-10 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-line bg-canvas-sunk p-4 sm:grid-cols-3">
          {report.snapshot.map((figure) => (
            <div key={figure.label}>
              <dt className="text-label text-ink-faint">{figure.label}</dt>
              <dd className="mt-0.5 font-sans text-base font-bold tabular-nums text-ink">{figure.value}</dd>
            </div>
          ))}
          <p className="col-span-full font-mono text-label uppercase tracking-label text-ink-faint">Frozen at issue</p>
        </dl>
      )}

      <ol className="mt-4 ml-10 flex flex-wrap gap-x-5 gap-y-1.5" aria-label="Approval chain">
        {report.approvals.map((approval) => (
          <li key={approval.step} className="flex items-center gap-1.5 text-xs">
            {approval.at ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-forest-accent" strokeWidth={2.25} aria-hidden="true" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-ink-faint" strokeWidth={2.25} aria-hidden="true" />
            )}
            <span className={approval.at ? 'text-ink-muted' : 'text-ink-faint'}>
              {approval.step}
              {approval.at ? ` ${approval.at}` : ', pending'}
            </span>
          </li>
        ))}
      </ol>
      {clicked && (
        <p className="mt-2 pl-10 font-mono text-label uppercase tracking-label text-warning">
          Demo only — connect a reporting pipeline to enable real export
        </p>
      )}
    </li>
  )
}
