import { ArrowUpRight } from 'lucide-react'
import CountUp from '../ui/CountUp'
import ConfidenceIndicator from './ConfidenceIndicator'
import { useEvidenceDrawer } from './EvidenceDrawerContext'

/**
 * A drillable outcome metric — the evidence-first interaction the whole
 * product is built around (build brief §10): click the number, see the
 * evidence behind it, not just a bigger version of the same figure.
 *
 * Its own card, not a borderless cell (visual-system brief §1/§2): a subtle
 * border/shadow at rest, a lift + accent-glow border on hover, so it reads
 * as a distinctly clickable object rather than a static stat sitting on the
 * page canvas. The number is bold sans-serif with tabular figures — serif
 * stays reserved for section titles, never data (brief §3).
 *
 * @param {{
 *   metric: import('../../data/investor/types').ConservationMetric,
 * }} props
 */
export default function MetricCard({ metric }) {
  const { openEvidence } = useEvidenceDrawer()

  return (
    <button
      type="button"
      onClick={() => openEvidence(metric.evidenceId)}
      className="group flex cursor-pointer flex-col items-start gap-3 rounded-2xl border border-line bg-card p-6 text-left shadow-card transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-[0_1px_2px_rgba(20,32,25,0.05),0_16px_32px_-14px_rgba(20,32,25,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
        {metric.eyebrow}
      </p>
      <p className="font-sans text-[2.75rem] font-bold leading-none tabular-nums text-ink">
        <CountUp to={metric.value} duration={1.4} separator="," />
        {metric.unit && <span className="ml-1.5 text-2xl font-semibold text-ink-muted">{metric.unit}</span>}
      </p>
      <p className="text-[13px] leading-snug text-ink-muted">{metric.label}</p>
      <div className="mt-1 flex w-full items-center gap-2 border-t border-line pt-3 text-[11px]">
        <ConfidenceIndicator status={metric.confidence} />
        <span className="ml-auto inline-flex items-center gap-1 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-forest-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          View evidence
          <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
        </span>
      </div>
    </button>
  )
}
