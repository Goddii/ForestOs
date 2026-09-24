import { Fragment, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import SectionHeading from '../SectionHeading'
import ActivityList from '../ActivityList'
import CapitalOutcomes from '../CapitalOutcomes'
import ContentCard from '../ui/ContentCard'
import { COMPONENTS } from '../../../data/funder/programme'
import { formatNumber } from '../../../lib/investor/format'
import { progressPct } from '../../../lib/programme/indicators'
import { useWorkspace } from '../FunderWorkspaceContext'

function ProgressBar({ value, target }) {
  const pct = progressPct(value, target)
  if (pct === null) return null
  return (
    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-canvas-sunk" aria-hidden="true">
      <div className="h-full rounded-full bg-forest-accent" style={{ width: `${pct}%` }} />
    </div>
  )
}

function IndicatorRow({ row, isOpen, onToggle }) {
  const { indicator, target, verified, reported, fundedVerified } = row
  const inReview = reported - verified
  const pct = progressPct(verified, target)
  return (
    <>
      <tr id={indicator.id} className="scroll-mt-24 align-top">
        <td className="py-4 pl-5 pr-4">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="flex items-start gap-1.5 text-left text-sm font-semibold text-ink hover:text-forest-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          >
            <ChevronDown
              className={`mt-0.5 h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              strokeWidth={2}
              aria-hidden="true"
            />
            {indicator.label}
          </button>
        </td>
        <td className="px-4 py-4 text-right font-mono text-xs tabular-nums text-ink-muted">
          {target === null ? 'None set' : `${formatNumber(target)} ${indicator.unit}`}
        </td>
        <td className="px-4 py-4 text-right">
          <span className="font-mono text-compact font-semibold tabular-nums text-ink">{formatNumber(verified)}</span>
          {pct !== null && <span className="ml-1 font-mono text-label tabular-nums text-ink-faint">{pct}%</span>}
          <ProgressBar value={verified} target={target} />
        </td>
        <td className="px-4 py-4 text-right font-mono text-xs tabular-nums text-ink-muted">
          {inReview > 0 ? formatNumber(inReview) : '0'}
        </td>
        <td className="py-4 pl-4 pr-5 text-right font-mono text-compact font-semibold tabular-nums text-forest-accent">
          {formatNumber(fundedVerified)}
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={5} className="px-5 pb-6">
            <div className="rounded-xl border border-line bg-canvas-sunk p-5">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-xs sm:grid-cols-[10rem_1fr]">
                <dt className="font-mono text-label font-semibold uppercase tracking-label text-ink-faint">Method</dt>
                <dd className="text-ink-muted">{indicator.method}</dd>
                <dt className="font-mono text-label font-semibold uppercase tracking-label text-ink-faint">Verified through</dt>
                <dd className="text-ink-muted">{indicator.meansOfVerification.join('; ')}</dd>
                <dt className="font-mono text-label font-semibold uppercase tracking-label text-ink-faint">Target date</dt>
                <dd className="text-ink-muted">{indicator.targetDate}</dd>
              </dl>
              <div className="mt-5 border-t border-line pt-5">
                <ActivityList
                  rows={row.activities.map(({ activity, value }) => ({ activity, value, unit: indicator.unit }))}
                  emptyMessage="No activities have reported against this indicator yet."
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

/**
 * Progress: the programme's output indicators against their targets, each
 * value summed from activity records (lib/programme/indicators.js). Verified
 * is the headline; work in review is shown beside it, never inside it; the
 * last column is what this funder's own payments paid for, attributed
 * directly. Open a row for its method and the activities behind it.
 */
export default function ProgressPage() {
  const { progress, terms } = useWorkspace()
  const { hash } = useLocation()
  const [openId, setOpenId] = useState(() => (hash ? hash.slice(1) : null))

  // A deep link from the Overview (`#ind-…`) opens that row on mount (the
  // initial state above) and scrolls to it.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [hash])

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <section>
        <SectionHeading
          title="Outputs against targets"
          description="Every figure is summed from field activity records. Only verified work counts toward a target; work still in review is shown separately, and rejected claims are listed but never counted."
        />
        <ContentCard className="overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line font-mono text-label uppercase tracking-label text-ink-faint">
                <th scope="col" className="py-3 pl-5 pr-4 font-semibold">Indicator</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Target</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Verified, programme</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">In review</th>
                <th scope="col" className="py-3 pl-4 pr-5 text-right font-semibold">Verified, funded by you</th>
              </tr>
            </thead>
            <tbody>
              {COMPONENTS.map((component) => {
                const rows = progress.filter((row) => row.indicator.componentId === component.id)
                if (rows.length === 0) return null
                return (
                  <Fragment key={component.id}>
                    <tr className="border-t border-line bg-canvas-sunk/60">
                      <th scope="rowgroup" colSpan={5} className="px-5 py-2 text-left text-xs font-semibold text-ink-muted">
                        {component.code} · {component.title}
                      </th>
                    </tr>
                    {rows.map((row) => (
                      <IndicatorRow
                        key={row.indicator.id}
                        row={row}
                        isOpen={openId === row.indicator.id}
                        onToggle={() => setOpenId(openId === row.indicator.id ? null : row.indicator.id)}
                      />
                    ))}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </ContentCard>
        <p className="mt-3 text-xs text-ink-faint">Targets are illustrative (demo data) until the programme's results framework is confirmed with NTZDC.</p>
      </section>

      {terms.showsAttribution && (
        <section>
          <SectionHeading
            title="Programme-wide outcomes, attributed pro-rata"
            description="For outcomes that every funder contributes to, a share proportional to committed capital. This is an allocation convention, not direct attribution, and the method is stated below."
          />
          <ContentCard>
            <CapitalOutcomes />
          </ContentCard>
        </section>
      )}
    </div>
  )
}
