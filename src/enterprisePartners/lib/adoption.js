// ── Plot adoption + league logic — pure rules ───────────────────────────────
// No React and no DOM, so the return hooks can be unit tested. `data/plots.js`
// and `data/social.js` hold the illustrative numbers; this file reads them.

import { COVENANT_CANOPY_PCT, REFRESH_CADENCE_DAYS, resolvePlot } from '../data/plots'
import { LEAGUE_COHORTS, STREAK } from '../data/social'

const DAY_MS = 86_400_000

/** The adopted plot's full record, or null when nothing is adopted yet. */
export function adoptedPlot(plotId) {
  return plotId ? resolvePlot(plotId) : null
}

/**
 * What changed between the first and latest satellite checks. `deltaPct` is the
 * percentage-point move, which is what a reader actually compares.
 */
export function plotTrend(plot) {
  if (!plot || !plot.refreshes?.length) {
    return { first: null, latest: null, deltaPct: 0, rising: false, aboveCovenant: false }
  }
  const first = plot.refreshes[0]
  const latest = plot.refreshes[plot.refreshes.length - 1]
  const deltaPct = latest.canopyPct - first.canopyPct
  return {
    first,
    latest,
    deltaPct,
    rising: deltaPct > 0,
    aboveCovenant: latest.canopyPct >= COVENANT_CANOPY_PCT,
  }
}

/** The tallest reading in the series — the scale every bar is drawn against. */
export function plotScale(plot) {
  if (!plot?.refreshes?.length) return 1
  return Math.max(...plot.refreshes.map((r) => r.canopyPct), 1)
}

/**
 * Days until the next illustrative satellite refresh, floored at zero. A
 * negative number would read as "overdue", which the prototype cannot know, so
 * it clamps to "due now" instead.
 */
export function daysToNextRefresh(plot, now = new Date()) {
  if (!plot?.lastRefreshISO) return null
  const last = new Date(`${plot.lastRefreshISO}T00:00:00Z`)
  if (Number.isNaN(last.getTime())) return null
  const due = new Date(last.getTime() + REFRESH_CADENCE_DAYS * DAY_MS)
  const days = Math.ceil((due.getTime() - now.getTime()) / DAY_MS)
  return Math.max(days, 0)
}

/** Cohorts ranked by conservation funded, with the maximum used for bar widths. */
export function rankCohorts(cohorts = LEAGUE_COHORTS) {
  const ranked = [...cohorts].sort((a, b) => b.treesFunded - a.treesFunded)
  const max = Math.max(...ranked.map((c) => c.treesFunded), 1)
  return ranked.map((cohort, i) => ({
    ...cohort,
    rank: i + 1,
    pct: Math.round((cohort.treesFunded / max) * 100),
  }))
}

/** The Monday that starts the week containing `date`, at local midnight. */
function startOfWeek(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const isoDow = (d.getDay() + 6) % 7 // Monday = 0
  d.setDate(d.getDate() - isoDow)
  return d
}

/**
 * The weekly streak. Three states, and none of them punishes a missed week:
 *   · current — already active this week
 *   · grace   — this week has not been touched yet, but the grace window is open
 *   · ready   — a fresh start; the count resets to one, with no loss language
 *
 * A first-ever visit reports `ready` with a streak of one, because arriving is
 * the achievement rather than something to be caught up on.
 */
export function weeklyStreak({ activeWeeks = 1, lastActiveAt = null, now = new Date() } = {}) {
  const graceDays = STREAK.graceDays
  const last = lastActiveAt ? new Date(lastActiveAt) : null

  if (!last || Number.isNaN(last.getTime())) {
    return { weeks: 1, state: 'ready', graceDaysLeft: graceDays }
  }

  const thisWeek = startOfWeek(now)
  const lastWeek = startOfWeek(last)
  const weeksApart = Math.round((thisWeek.getTime() - lastWeek.getTime()) / (7 * DAY_MS))

  if (weeksApart <= 0) {
    return { weeks: Math.max(activeWeeks, 1), state: 'current', graceDaysLeft: graceDays }
  }

  if (weeksApart === 1) {
    const graceEndsAt = lastWeek.getTime() + (7 + graceDays) * DAY_MS
    const daysLeft = Math.ceil((graceEndsAt - now.getTime()) / DAY_MS)
    if (daysLeft > 0) {
      return { weeks: Math.max(activeWeeks, 1), state: 'grace', graceDaysLeft: daysLeft }
    }
  }

  return { weeks: 1, state: 'ready', graceDaysLeft: graceDays }
}

/** The most recent activity timestamp across the collected stamps, or null. */
export function lastActiveFromStamps(stamps = []) {
  const times = stamps
    .map((stamp) => new Date(stamp.lastScanAt ?? stamp.earnedAt ?? NaN).getTime())
    .filter((t) => Number.isFinite(t))
  return times.length ? new Date(Math.max(...times)).toISOString() : null
}

/**
 * How many distinct weeks the visitor has actually been active in, so the
 * streak is derived from the passport rather than invented. Never below one:
 * arriving is the achievement (brief 5.10).
 */
export function activeWeeksFromStamps(stamps = []) {
  const weeks = new Set()
  for (const stamp of stamps) {
    const iso = stamp.lastScanAt ?? stamp.earnedAt
    if (!iso) continue
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) continue
    weeks.add(startOfWeek(date).getTime())
  }
  return Math.max(weeks.size, 1)
}

/**
 * Has `currentTierId` reached at least `requiredTierId`? Used to hold back the
 * tier-gated detail — the field-officer note is the one thing the tier copy
 * actually promises, so it is the one thing gated. Everything else stays open:
 * hiding a whole feature behind a tier makes it undemonstrable.
 */
export function tierAtLeast(currentTierId, requiredTierId, tiers = []) {
  const current = tiers.findIndex((t) => t.id === currentTierId)
  const required = tiers.findIndex((t) => t.id === requiredTierId)
  return current >= 0 && required >= 0 && current >= required
}
