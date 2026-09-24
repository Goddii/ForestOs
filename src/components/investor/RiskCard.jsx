import { AlertTriangle, AlertOctagon, Info } from 'lucide-react'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import { useWorkspacePath } from './FunderWorkspaceContext'
import Badge from './ui/Badge'
import ActionButton from './ui/ActionButton'

const SEVERITY_CONFIG = {
  low: { icon: Info, label: 'Low', tone: 'verified' },
  medium: { icon: AlertTriangle, label: 'Medium', tone: 'warning' },
  high: { icon: AlertOctagon, label: 'High', tone: 'danger' },
}

const STATUS_LABEL = {
  open: 'Open',
  monitoring: 'Monitoring',
  mitigated: 'Mitigated',
  closed: 'Closed',
}

/**
 * One risk register entry (design-review brief §16) — contextual, not
 * administrative: which area it affects and what evidence backs it sit
 * right alongside status and severity. Severity always ships as a real
 * badge (icon + label + fill), never color alone, and there is no single
 * aggregate risk score anywhere in this feature, by design. Designed to sit
 * inside a `<ul className="divide-y divide-line">` in a `ContentCard`.
 *
 * @param {{ risk: import('../../data/investor/types').RiskRecord }} props
 */
export default function RiskCard({ risk }) {
  const { openEvidence } = useEvidenceDrawer()
  const path = useWorkspacePath()
  const severity = SEVERITY_CONFIG[risk.severity]

  return (
    <li className="px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-label font-semibold uppercase tracking-label text-forest-accent">
            {risk.affectedArea}
          </p>
          <p className="mt-1 max-w-[52ch] text-base font-medium leading-snug text-ink">{risk.description}</p>
        </div>
        <Badge tone={severity.tone} icon={severity.icon} className="shrink-0">
          {severity.label}
        </Badge>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-label sm:grid-cols-3">
        <div>
          <dt className="text-ink-faint">Status</dt>
          <dd className="mt-0.5 font-sans font-medium text-ink-muted">{STATUS_LABEL[risk.status]}</dd>
        </div>
        <div>
          <dt className="text-ink-faint">Owner</dt>
          <dd className="mt-0.5 font-sans font-medium text-ink-muted">{risk.owner}</dd>
        </div>
        <div>
          <dt className="text-ink-faint">Last reviewed</dt>
          <dd className="mt-0.5 font-sans font-medium text-ink-muted">{risk.lastReviewed}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        <span className="text-ink-faint">Mitigation — </span>
        {risk.mitigation}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {risk.relatedEvidenceId && (
          <ActionButton variant="ghost" onClick={() => openEvidence(risk.relatedEvidenceId)}>
            View related evidence
          </ActionButton>
        )}
        {risk.zoneId && (
          <ActionButton variant="ghost" to={path()}>
            View on map
          </ActionButton>
        )}
      </div>
    </li>
  )
}
