import { describe, expect, it } from 'vitest'
import {
  activeWeeksFromStamps,
  adoptedPlot,
  daysToNextRefresh,
  lastActiveFromStamps,
  plotScale,
  plotTrend,
  rankCohorts,
  tierAtLeast,
  weeklyStreak,
} from './adoption'
import { COVENANT_CANOPY_PCT, PLOTS, REFRESH_CADENCE_DAYS } from '../data/plots'
import { CANOPY_TIERS } from '../data/game'
import { LEAGUE_COHORTS } from '../data/social'

const plot = PLOTS[0]
const rising = { refreshes: [{ canopyPct: 41 }, { canopyPct: 48 }] }
const falling = { refreshes: [{ canopyPct: 50 }, { canopyPct: 47 }] }
const belowFloor = { refreshes: [{ canopyPct: 30 }, { canopyPct: 35 }] }

describe('plot adoption', () => {
  it('resolves an adopted plot, and null for an unknown or absent id', () => {
    expect(adoptedPlot(plot.id).name).toBe(plot.name)
    expect(adoptedPlot('nope')).toBeNull()
    expect(adoptedPlot(null)).toBeNull()
  })

  it('reads the move between the first and latest satellite check', () => {
    const trend = plotTrend(rising)
    expect(trend.deltaPct).toBe(7)
    expect(trend.rising).toBe(true)
    expect(trend.aboveCovenant).toBe(true)
  })

  it('handles a declining plot without calling it rising', () => {
    const trend = plotTrend(falling)
    expect(trend.deltaPct).toBe(-3)
    expect(trend.rising).toBe(false)
  })

  it('flags a plot sitting below the covenant floor', () => {
    expect(plotTrend(belowFloor).aboveCovenant).toBe(false)
    expect(plotTrend(belowFloor).latest.canopyPct).toBeLessThan(COVENANT_CANOPY_PCT)
  })

  it('degrades safely when there is no plot or no history', () => {
    expect(plotTrend(null)).toMatchObject({ deltaPct: 0, rising: false, aboveCovenant: false })
    expect(plotTrend({ refreshes: [] }).deltaPct).toBe(0)
    expect(plotScale(null)).toBe(1)
  })

  it('scales bars against the tallest reading', () => {
    expect(plotScale({ refreshes: [{ canopyPct: 41 }, { canopyPct: 48 }] })).toBe(48)
  })

  it('counts down to the next illustrative refresh', () => {
    const last = new Date(`${plot.lastRefreshISO}T00:00:00Z`)
    const due = new Date(last.getTime() + REFRESH_CADENCE_DAYS * 86_400_000)
    const thirtyDaysBefore = new Date(due.getTime() - 30 * 86_400_000)
    expect(daysToNextRefresh(plot, thirtyDaysBefore)).toBe(30)
  })

  it('clamps an overdue refresh at zero instead of going negative', () => {
    const wayPast = new Date('2030-01-01T00:00:00Z')
    expect(daysToNextRefresh(plot, wayPast)).toBe(0)
  })

  it('returns null when a plot has no refresh date at all', () => {
    expect(daysToNextRefresh({}, new Date())).toBeNull()
    expect(daysToNextRefresh({ lastRefreshISO: 'not-a-date' }, new Date())).toBeNull()
  })
})

describe('conservation impact league', () => {
  it('ranks cohorts by conservation funded, highest first', () => {
    const ranked = rankCohorts(LEAGUE_COHORTS)
    expect(ranked[0].rank).toBe(1)
    expect(ranked[0].treesFunded).toBeGreaterThanOrEqual(ranked[1].treesFunded)
    expect(ranked[0].pct).toBe(100)
  })

  it('scales every bar against the leader', () => {
    const ranked = rankCohorts([
      { id: 'a', treesFunded: 100 },
      { id: 'b', treesFunded: 50 },
    ])
    expect(ranked.find((c) => c.id === 'a').pct).toBe(100)
    expect(ranked.find((c) => c.id === 'b').pct).toBe(50)
  })

  it('does not divide by zero on an empty league', () => {
    expect(rankCohorts([])).toEqual([])
  })
})

describe('weekly streak with a grace period', () => {
  const now = new Date(2026, 9, 7, 12, 0, 0)
  const days = (n) => new Date(now.getTime() + n * 86_400_000)

  it('starts someone who has never visited at a streak of one, not zero', () => {
    const s = weeklyStreak({ lastActiveAt: null, now })
    expect(s).toMatchObject({ weeks: 1, state: 'ready' })
  })

  it('counts a visit in the current week as current', () => {
    const s = weeklyStreak({ activeWeeks: 3, lastActiveAt: days(0), now })
    expect(s.state).toBe('current')
    expect(s.weeks).toBe(3)
  })

  it('holds the streak during the grace window', () => {
    const s = weeklyStreak({ activeWeeks: 4, lastActiveAt: days(-7), now })
    expect(s.state).toBe('grace')
    expect(s.weeks).toBe(4)
    expect(s.graceDaysLeft).toBeGreaterThan(0)
  })

  it('resets to a fresh start past the grace window, without a zero', () => {
    const s = weeklyStreak({ activeWeeks: 9, lastActiveAt: days(-7), now: days(4) })
    expect(s.state).toBe('ready')
    expect(s.weeks).toBe(1)
  })

  it('treats a long absence as a fresh start, never as a loss', () => {
    const s = weeklyStreak({ activeWeeks: 12, lastActiveAt: days(-40), now })
    expect(s.state).toBe('ready')
    expect(s.weeks).toBe(1)
  })

  it('ignores an unparseable date rather than throwing', () => {
    expect(weeklyStreak({ lastActiveAt: 'garbage', now })).toMatchObject({ weeks: 1, state: 'ready' })
  })
})

describe('streak derived from the passport', () => {
  it('reads the most recent stamp as the last active moment', () => {
    const stamps = [
      { earnedAt: '2026-09-30T10:00:00Z' },
      { earnedAt: '2026-10-05T10:00:00Z' },
      { lastScanAt: '2026-10-06T10:00:00Z' },
    ]
    expect(lastActiveFromStamps(stamps)).toBe(new Date('2026-10-06T10:00:00Z').toISOString())
  })

  it('is null with no stamps, and skips unparseable dates', () => {
    expect(lastActiveFromStamps([])).toBeNull()
    expect(lastActiveFromStamps([{ earnedAt: 'garbage' }])).toBeNull()
  })

  it('counts distinct active weeks, never below one', () => {
    expect(activeWeeksFromStamps([])).toBe(1)
    const sameWeek = [
      { earnedAt: '2026-10-05T10:00:00Z' },
      { earnedAt: '2026-10-06T10:00:00Z' },
    ]
    expect(activeWeeksFromStamps(sameWeek)).toBe(1)
  })

  it('counts two separate weeks as two', () => {
    // 14 days apart is always exactly two ISO weeks, whichever weekday it is.
    const twoWeeks = [
      { earnedAt: '2026-09-22T10:00:00Z' },
      { earnedAt: '2026-10-06T10:00:00Z' },
    ]
    expect(activeWeeksFromStamps(twoWeeks)).toBe(2)
  })
})

describe('tier gating', () => {
  it('treats a tier as reached only at or above its threshold', () => {
    expect(tierAtLeast('guardian', 'guardian', CANOPY_TIERS)).toBe(true)
    expect(tierAtLeast('custodian', 'guardian', CANOPY_TIERS)).toBe(true)
    expect(tierAtLeast('explorer', 'guardian', CANOPY_TIERS)).toBe(false)
    expect(tierAtLeast('visitor', 'guardian', CANOPY_TIERS)).toBe(false)
  })

  it('is false for an unknown tier rather than defaulting to unlocked', () => {
    expect(tierAtLeast('mystery', 'guardian', CANOPY_TIERS)).toBe(false)
    expect(tierAtLeast('guardian', 'mystery', CANOPY_TIERS)).toBe(false)
  })
})
