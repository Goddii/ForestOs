import { useEffect, useState } from 'react'
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

const REVIEW_STRIPES = {
  backgroundImage:
    'repeating-linear-gradient(135deg, var(--color-amber-500) 0 3px, color-mix(in srgb, var(--color-amber-500) 30%, white) 3px 6px)',
}

const shareOf = (value, target) => `${Math.min(100, (value / target) * 100)}%`

/** Bullet bar: funded-by-you, then other verified, then in review (never counted). */
function OutputBar({ target, verified, inReview, fundedVerified }) {
  if (!target) return <div className="h-3.5 rounded bg-canvas-sunk" aria-hidden="true" />
  const others = Math.max(0, verified - fundedVerified)
  return (
    <div className="flex h-3.5 gap-0.5 overflow-hidden rounded bg-canvas-sunk" aria-hidden="true">
      {fundedVerified > 0 && <div className="h-full bg-forest-accent-dark" style={{ width: shareOf(fundedVerified, target) }} />}
      {others > 0 && <div className="h-full bg-forest-accent" style={{ width: shareOf(others, target) }} />}
      {inReview > 0 && <div className="h-full" style={{ ...REVIEW_STRIPES, width: shareOf(inReview, target) }} />}
    </div>
  )
}

function IndicatorRow({ row, isOpen, onToggle }) {
  const { indicator, target, verified, reported, fundedVerified } = row
  const inReview = Math.max(0, reported - verified)
  const pct = progressPct(verified, target)
  const { unit } = indicator
  return (
    <li id={indicator.id} className="scroll-mt-24">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-3.5 hover:bg-canvas/50 md:grid-cols-[minmax(0,15rem)_4rem_minmax(0,1fr)_9rem]">
        <div>
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
          <p className="ml-5.5 font-mono text-label tabular-nums text-ink-faint">
            {target === null ? 'No target set' : `Target ${formatNumber(target)} ${unit}`}
          </p>
        </div>
        <p className={`text-right font-mono text-lg font-semibold tabular-nums ${pct ? 'text-ink' : 'text-ink-faint'}`}>
          {pct === null ? '–' : `${pct}%`}
        </p>
        <div className="col-span-2 md:col-span-1">
          <OutputBar target={target} verified={verified} inReview={inReview} fundedVerified={fundedVerified} />
          <p className="mt-1 flex justify-between font-mono text-label tabular-nums text-ink-muted">
            <span>{formatNumber(verified)}{target ? ` of ${formatNumber(target)}` : ''} verified</span>
            {inReview > 0 && <span>+{formatNumber(inReview)} in review</span>}
          </p>
        </div>
        <div className="col-span-2 text-xs text-ink-muted md:col-span-1 md:text-right">
          {fundedVerified > 0 ? (
            <>
              <span className="font-mono text-compact font-semibold tabular-nums text-forest-accent-dark">
                {formatNumber(fundedVerified)} {unit}
              </span>{' '}
              <span className="md:block">funded by you</span>
            </>
          ) : (
            <span className="text-ink-faint">Not in your funding</span>
          )}
          {verified === 0 && inReview > 0 && (
            <span className="mt-1 block text-label font-medium text-amber-700">Awaiting first verification</span>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="px-5 pb-6">
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
        </div>
      )}
    </li>
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
        <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted" aria-label="Bar key">
          <li className="flex items-center gap-1.5"><span className="h-2.5 w-3.5 rounded-sm bg-forest-accent-dark" />Verified, funded by you</li>
          <li className="flex items-center gap-1.5"><span className="h-2.5 w-3.5 rounded-sm bg-forest-accent" />Verified, other funders</li>
          <li className="flex items-center gap-1.5"><span className="h-2.5 w-3.5 rounded-sm" style={REVIEW_STRIPES} />In review, not counted</li>
          <li className="flex items-center gap-1.5"><span className="h-2.5 w-3.5 rounded-sm bg-canvas-sunk" />Remaining to target</li>
        </ul>
        <ContentCard className="overflow-hidden">
          {COMPONENTS.map((component) => {
            const rows = progress.filter((row) => row.indicator.componentId === component.id)
            if (rows.length === 0) return null
            const avg = Math.round(
              rows.reduce((sum, r) => sum + (r.target ? Math.min(1, r.verified / r.target) : 0), 0) / rows.length * 100,
            )
            return (
              <section key={component.id} className="border-t border-line first:border-t-0" aria-label={component.title}>
                <header className="flex items-baseline justify-between gap-4 bg-canvas-sunk/60 px-5 py-2">
                  <h3 className="text-xs font-semibold text-ink-muted">{component.code} · {component.title}</h3>
                  <span className="shrink-0 font-mono text-label tabular-nums text-ink-faint">{avg}% avg</span>
                </header>
                <ul className="divide-y divide-line/60">
                  {rows.map((row) => (
                    <IndicatorRow
                      key={row.indicator.id}
                      row={row}
                      isOpen={openId === row.indicator.id}
                      onToggle={() => setOpenId(openId === row.indicator.id ? null : row.indicator.id)}
                    />
                  ))}
                </ul>
              </section>
            )
          })}
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
