import { useState } from 'react'
import { Lock, MapPin, RefreshCw, Sprout } from 'lucide-react'
import { PLOTS, COVENANT_CANOPY_PCT } from '../../data/plots'
import {
  daysToNextRefresh,
  plotScale,
  plotTrend,
  tierAtLeast,
} from '../../lib/adoption'
import { CANOPY_TIERS } from '../../data/game'
import { ConceptTag, PartnerCta } from '../ui'

/**
 * Plot adoption (brief 5.6) — adopt one named plot and watch it change at each
 * satellite refresh. This is the return hook: the plot persists, and every
 * future visit is a chance to see it move.
 *
 * The officer's note is the one tier-gated detail (Guardian), because that is
 * the one thing the tier copy promises. Adoption itself is open to everyone —
 * hiding the whole feature behind a tier would make it undemonstrable.
 */
export default function PlotAdoption({ adoptedPlotId, onAdopt, tier }) {
  const [choosing, setChoosing] = useState(false)
  const plot = PLOTS.find((p) => p.id === adoptedPlotId) ?? null
  const noteUnlocked = tierAtLeast(tier?.id, 'guardian', CANOPY_TIERS)

  if (!plot || choosing) {
    return (
      <section className="space-y-4" aria-label="Adopt a plot">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
            Plot adoption
          </p>
          <h2 className="mt-2 font-display text-3xl text-bone">Adopt one patch of forest.</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-bone-300">
            Pick a plot and it stays yours across visits. Each satellite refresh shows whether it is
            holding — an illustrative cadence, not a live feed.
          </p>
        </div>

        <ul className="space-y-3">
          {PLOTS.map((option) => {
            const trend = plotTrend(option)
            return (
              <li key={option.id} className="rounded-xl border border-bone/12 bg-forest-900/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-lg text-bone">{option.name}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">
                      <MapPin className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                      {option.blockName} · {option.hectares} ha
                    </p>
                  </div>
                  <ConceptTag>Series · {option.series}</ConceptTag>
                </div>
                <p className="mt-2 font-mono text-[11px] text-bone-400">
                  {trend.first.canopyPct}% → {trend.latest.canopyPct}% canopy across four checks
                </p>
                <PartnerCta
                  variant="secondary"
                  className="mt-3 !w-auto"
                  onClick={() => {
                    onAdopt(option.id)
                    setChoosing(false)
                  }}
                >
                  Adopt {option.name}
                </PartnerCta>
              </li>
            )
          })}
        </ul>
        <ConceptTag variant="illustrative">Illustrative plots and cadence</ConceptTag>
      </section>
    )
  }

  const trend = plotTrend(plot)
  const scale = plotScale(plot)
  const days = daysToNextRefresh(plot)

  return (
    <section className="space-y-4" aria-label="Your adopted plot">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
          Your adopted plot
        </p>
        <h2 className="mt-2 font-display text-3xl text-bone">{plot.name}</h2>
        <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-sage-500">
          <MapPin className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
          {plot.blockName} · {plot.hectares} ha · {plot.series}
        </p>
      </div>

      <div className="rounded-2xl border border-bone/12 bg-forest-900/55 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
            Canopy across refreshes
          </p>
          <p
            className={
              'font-mono text-[12px] tabular-nums ' +
              (trend.rising ? 'text-river-400' : 'text-amber-400')
            }
          >
            {trend.deltaPct >= 0 ? '+' : ''}
            {trend.deltaPct} pts
          </p>
        </div>

        <ul className="mt-4 flex items-end gap-2" aria-hidden="true">
          {plot.refreshes.map((refresh) => (
            <li key={refresh.label} className="flex-1">
              <div
                className={
                  'w-full rounded-t ' +
                  (refresh.canopyPct >= COVENANT_CANOPY_PCT ? 'bg-river-400/70' : 'bg-amber-400/70')
                }
                style={{ height: `${Math.round((refresh.canopyPct / scale) * 96)}px` }}
              />
              <p className="mt-1.5 text-center font-mono text-[9px] tabular-nums text-bone-500">
                {refresh.canopyPct}%
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-1 border-t border-bone/10 pt-3 text-[12px]">
          {plot.refreshes.map((refresh) => (
            <div key={refresh.label} className="flex justify-between gap-3">
              <dt className="text-sage-500">{refresh.label}</dt>
              <dd className="font-mono tabular-nums text-bone-300">{refresh.canopyPct}% canopy</dd>
            </div>
          ))}
        </dl>

        <p className="mt-3 text-[12px] leading-relaxed text-bone-400">
          {trend.aboveCovenant
            ? `Holding above the ${COVENANT_CANOPY_PCT}% covenant floor.`
            : `Below the ${COVENANT_CANOPY_PCT}% covenant floor — flagged for a field visit.`}
        </p>
      </div>

      <div
        className={
          'flex items-start gap-3 rounded-xl border p-4 ' +
          (noteUnlocked ? 'border-river-400/35 bg-river-400/8' : 'border-bone/12 bg-forest-900/40')
        }
      >
        {noteUnlocked ? (
          <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-river-400" strokeWidth={1.9} aria-hidden="true" />
        ) : (
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-bone-500" strokeWidth={1.9} aria-hidden="true" />
        )}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
            Field officer&apos;s note
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-bone-300">
            {noteUnlocked
              ? plot.officerNote
              : 'Unlocks at Guardian — keep exploring the trail and this note opens.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-bone/15 bg-forest-900/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-400">
          <RefreshCw className="mr-1.5 inline h-3 w-3 align-[-1px]" strokeWidth={2} aria-hidden="true" />
          {days === 0 ? 'Next satellite check due' : `Next satellite check in ${days} days`}
        </span>
        <button
          type="button"
          onClick={() => setChoosing(true)}
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500 underline-offset-4 hover:text-bone hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
        >
          Adopt a different plot
        </button>
      </div>

      <ConceptTag variant="illustrative">
        Illustrative cadence · {plot.refreshes.length} checks
      </ConceptTag>
    </section>
  )
}
