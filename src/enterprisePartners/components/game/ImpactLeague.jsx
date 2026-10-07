import { Users } from 'lucide-react'
import { BRANDS } from '../../data/brands'
import { COMMUNITY_BOARDS, LEAGUE_COHORTS, STREAK_COPY } from '../../data/social'
import {
  activeWeeksFromStamps,
  lastActiveFromStamps,
  rankCohorts,
  weeklyStreak,
} from '../../lib/adoption'
import { ConceptTag } from '../ui'

/**
 * Conservation Impact League + community boards (brief 5.7). The headline
 * copy is deliberately institutional rather than personal: contributors are
 * counted, never named (brief 5.9), and both brand layers are PROPOSED.
 *
 * The streak is weekly, not daily, and a missed week is a pause rather than a
 * loss — including a grace window before anything changes at all (brief 5.10).
 */
export default function ImpactLeague({ stamps = [], className = '' }) {
  const ranked = rankCohorts(LEAGUE_COHORTS)
  const streak = weeklyStreak({
    activeWeeks: activeWeeksFromStamps(stamps),
    lastActiveAt: lastActiveFromStamps(stamps),
  })

  return (
    <section className={className} aria-label="Conservation Impact League">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
          Conservation Impact League
        </p>
        <ConceptTag variant="proposed">Proposed cohorts</ConceptTag>
      </div>

      <ul className="mt-3 space-y-3">
        {ranked.map((cohort) => {
          const brand = BRANDS[cohort.brandId]
          return (
            <li key={cohort.id} className="rounded-xl border border-bone/12 bg-forest-900/50 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-sans text-[14px] font-semibold text-bone">
                  <span className="mr-2 font-mono text-[11px] text-sage-500">{cohort.rank}</span>
                  {cohort.label}
                </p>
                <p className="font-mono text-[11px] tabular-nums text-bone-500">
                  {cohort.treesFunded.toLocaleString()} trees
                </p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-forest-800">
                <div
                  className="h-full rounded-full ep-motion"
                  style={{ width: `${cohort.pct}%`, backgroundColor: brand?.accentHex }}
                />
              </div>
              <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-sage-500">
                <Users className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                {cohort.members} {cohort.kind === 'cafe' ? 'cafés' : 'shops'} ·{' '}
                {cohort.stamps.toLocaleString()} interactions
              </p>
            </li>
          )
        })}
      </ul>

      <p className="mt-3 text-[11px] leading-relaxed text-bone-500">
        Counted in aggregate only — participants are never named or identified.
      </p>

      {/* Community boards */}
      <div className="mt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
          Community boards
        </p>
        <ul className="mt-2 divide-y divide-bone/10 rounded-xl border border-bone/12 bg-forest-900/40">
          {COMMUNITY_BOARDS.map((board) => (
            <li key={board.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-[13px] text-bone-300">{board.label}</span>
              <span className="font-mono text-[10px] tabular-nums text-sage-500">
                {board.members} members · {board.stamps} interactions
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weekly streak — gentle by design */}
      <div className="mt-6 rounded-2xl border border-bone/12 bg-forest-900/50 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
            Weekly streak
          </p>
          <p className="font-display text-2xl text-bone">
            {streak.weeks}
            <span className="ml-1 font-sans text-[12px] text-bone-500">
              {streak.weeks === 1 ? 'week' : 'weeks'}
            </span>
          </p>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-bone-300">{STREAK_COPY[streak.state]}</p>
        {streak.state === 'grace' ? (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-amber-400">
            {streak.graceDaysLeft} day{streak.graceDaysLeft === 1 ? '' : 's'} of grace
          </p>
        ) : null}
        <p className="mt-2 text-[11px] leading-relaxed text-bone-500">
          A missed week is a pause, never a loss. No countdowns, nothing to buy.
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <ConceptTag variant="illustrative">Illustrative standings</ConceptTag>
        <ConceptTag>Opt-in nickname only</ConceptTag>
      </div>
    </section>
  )
}
