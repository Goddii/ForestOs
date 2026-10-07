import { describe, expect, it } from 'vitest'
import {
  applicableQuestEntries,
  buildStampBoard,
  hasBothBrandStamps,
  hasOtherBrandStamp,
  nextBestAction,
  questProgress,
  questXp,
  selectSessionQuests,
  stampBookBonusXp,
  tierForXp,
  tierProgress,
  nextTierForXp,
  totalCanopyXp,
} from './game'
import { CANOPY_TIERS, QUESTS, XP_AWARDS } from '../data/game'

const stampless = []
const bothStamps = [
  { brand: 'safaricom', tenantSlug: 'enterprise-safaricom' },
  { brand: 'java-house', tenantSlug: 'enterprise-java-house' },
]

describe('tier ladder', () => {
  it('holds the highest tier whose threshold is reached', () => {
    expect(tierForXp(0).id).toBe('visitor')
    expect(tierForXp(74).id).toBe('visitor')
    expect(tierForXp(75).id).toBe('explorer')
    expect(tierForXp(249).id).toBe('explorer')
    expect(tierForXp(250).id).toBe('guardian')
    expect(tierForXp(500).id).toBe('custodian')
    expect(tierForXp(9999).id).toBe('custodian')
  })

  it('reports the next tier, or null at the top', () => {
    expect(nextTierForXp(0).id).toBe('explorer')
    expect(nextTierForXp(250).id).toBe('custodian')
    expect(nextTierForXp(500)).toBeNull()
  })

  it('measures ring progress from the current tier floor', () => {
    // Explorer floor is 75, Custodian ceiling is 250 — 10 XP in is 10/175.
    const mid = tierProgress(85)
    expect(mid.tier.id).toBe('explorer')
    expect(mid.toNext).toBe(165)
    expect(mid.pct).toBeCloseTo(10 / 175, 5)
  })

  it('is a full ring at the top of the ladder', () => {
    expect(tierProgress(500)).toMatchObject({ nextTier: null, toNext: 0, pct: 1 })
  })
})

describe('quest resolution', () => {
  const ctx = {
    beatsOpened: 4,
    canopyExplored: true,
    plotsVerified: 1,
    pledgeDone: false,
    bothBrands: false,
  }

  it('reads flow context against the quest target', () => {
    const origin = QUESTS.find((q) => q.id === 'origin-explorer')
    expect(questProgress(origin, ctx).complete).toBe(true)
    const pledge = QUESTS.find((q) => q.id === 'pledge-plant')
    expect(questProgress(pledge, ctx).complete).toBe(false)
  })

  it('caps progress at the target so the bar cannot overflow', () => {
    const origin = QUESTS.find((q) => q.id === 'origin-explorer')
    expect(questProgress(origin, { beatsOpened: 99 }).current).toBe(4)
  })

  it('scopes the pledge to the brand being played', () => {
    const saf = selectSessionQuests({ brandId: 'safaricom', ctx, limit: 10 })
    const jh = selectSessionQuests({ brandId: 'java-house', ctx, limit: 10 })
    expect(saf.map((e) => e.quest.id)).toContain('pledge-plant')
    expect(saf.map((e) => e.quest.id)).not.toContain('pledge-cup')
    expect(jh.map((e) => e.quest.id)).toContain('pledge-cup')
    expect(jh.map((e) => e.quest.id)).not.toContain('pledge-plant')
  })

  it('only offers the origin quest where the four beats exist', () => {
    const saf = selectSessionQuests({ brandId: 'safaricom', ctx, limit: 10 })
    const jh = selectSessionQuests({ brandId: 'java-house', ctx, limit: 10 })
    expect(saf.map((e) => e.quest.id)).not.toContain('origin-explorer')
    expect(jh.map((e) => e.quest.id)).toContain('origin-explorer')
  })

  it('never shows more than three quests in a session', () => {
    const entries = selectSessionQuests({
      brandId: 'safaricom',
      ctx,
      hasOtherBrandStamp: true,
      limit: 3,
    })
    expect(entries).toHaveLength(3)
  })

  it('hides crossover until the other brand stamp exists', () => {
    const without = selectSessionQuests({ brandId: 'safaricom', ctx, limit: 10 })
    expect(without.map((e) => e.quest.id)).not.toContain('crossover')
    const withOther = selectSessionQuests({
      brandId: 'safaricom',
      ctx,
      hasOtherBrandStamp: true,
      limit: 10,
    })
    expect(withOther.map((e) => e.quest.id)).toContain('crossover')
  })

  it('puts open quests ahead of finished ones', () => {
    const entries = selectSessionQuests({ brandId: 'safaricom', ctx, limit: 3 })
    expect(entries[0].complete).toBe(false)
  })

  it('always keeps the crossover payoff in the session when it is available', () => {
    // Three other quests outrank it, so priority alone would crowd it out.
    const entries = selectSessionQuests({
      brandId: 'java-house',
      ctx: { beatsOpened: 4, canopyExplored: true, plotsVerified: 1, pledgeDone: false },
      hasOtherBrandStamp: true,
      limit: 3,
    })
    expect(entries.map((e) => e.quest.id)).toContain('crossover')
    expect(entries).toHaveLength(3)
  })

  it('pays a completed quest even when it is off the visible board', () => {
    // Origin Explorer completes on the Java House trail, but with the
    // crossover payoff reserved and three other quests open it does not fit in
    // the three shown — it must still pay.
    const params = {
      brandId: 'java-house',
      ctx: { beatsOpened: 4, canopyExplored: false, plotsVerified: 0, pledgeDone: false },
      hasOtherBrandStamp: true,
    }
    const visible = selectSessionQuests({ ...params, limit: 3 })
    const earned = applicableQuestEntries(params)

    expect(visible.map((e) => e.quest.id)).not.toContain('origin-explorer')
    expect(earned.map((e) => e.quest.id)).toContain('origin-explorer')
    expect(questXp(earned)).toBeGreaterThan(questXp(visible))
  })

  it('nudges exactly one next best action', () => {
    const entries = selectSessionQuests({ brandId: 'safaricom', ctx, limit: 3 })
    const nudge = nextBestAction(entries)
    expect(nudge.quest.id).toBe('pledge-plant')
  })

  it('nudges nothing once every session quest is done', () => {
    const done = selectSessionQuests({
      brandId: 'safaricom',
      ctx: { ...ctx, pledgeDone: true },
      limit: 3,
    })
    expect(nextBestAction(done)).toBeNull()
  })

  it('sums XP only for completed quests', () => {
    // Safaricom session: ridge-witness and plot-detective are done, the pledge
    // is still open, so exactly two quest awards are owed.
    const entries = selectSessionQuests({ brandId: 'safaricom', ctx, limit: 10 })
    expect(entries).toHaveLength(3)
    expect(questXp(entries)).toBe(XP_AWARDS.quest * 2)
  })
})

describe('crossover detection', () => {
  it('is true only with a stamp from both brands', () => {
    expect(hasBothBrandStamps([])).toBe(false)
    expect(hasBothBrandStamps([bothStamps[0]])).toBe(false)
    expect(hasBothBrandStamps(bothStamps)).toBe(true)
  })

  it('is false for a passport that is empty', () => {
    expect(hasOtherBrandStamp(stampless, 'safaricom')).toBe(false)
  })

  it('detects a stamp from the brand not being played', () => {
    expect(hasOtherBrandStamp(bothStamps, 'safaricom')).toBe(true)
    expect(hasOtherBrandStamp([bothStamps[0]], 'safaricom')).toBe(false)
  })
})

describe('stamp book', () => {
  it('shows one value-holding series per brand and an honest empty series', () => {
    const board = buildStampBoard([bothStamps[0]])
    const mau = board.find((s) => s.id === 'mau-ridge')
    const tea = board.find((s) => s.id === 'tea-belt')
    const water = board.find((s) => s.id === 'water-towers')
    expect(mau.filled).toBe(1)
    expect(mau.complete).toBe(false)
    expect(tea.filled).toBe(0)
    // No brand occupies Water Towers yet — it must stay empty, not fake a stamp.
    expect(water.filled).toBe(0)
  })

  it('pays the set-completion bonus only when a series fills', () => {
    const partial = buildStampBoard([bothStamps[0]])
    expect(stampBookBonusXp(partial)).toBe(0)
    const threeSaf = [
      { brand: 'safaricom' },
      { brand: 'safaricom' },
      { brand: 'safaricom' },
    ]
    expect(stampBookBonusXp(threeSaf)).toBe(XP_AWARDS.setComplete)
  })

  it('caps a filled series at its slot count', () => {
    const fiveSaf = Array.from({ length: 5 }, () => ({ brand: 'safaricom' }))
    const mau = buildStampBoard(fiveSaf).find((s) => s.id === 'mau-ridge')
    expect(mau.filled).toBe(mau.slots)
    expect(mau.earned).toBe(5)
  })
})

describe('total canopy XP', () => {
  it('adds trail, quest and set-completion XP', () => {
    const quests = selectSessionQuests({
      brandId: 'safaricom',
      ctx: { beatsOpened: 4, canopyExplored: true, plotsVerified: 1 },
      limit: 3,
    })
    const total = totalCanopyXp({ trailXp: 100, quests, stamps: [] })
    // Only the quests actually finished pay out (pledge is still open here).
    expect(total).toBe(100 + questXp(quests))
  })

  it('lands a first full journey on the Explorer tier', () => {
    const trailXp = 195
    expect(tierForXp(trailXp).id).toBe('explorer')
    expect(tierForXp(trailXp)).not.toBe(CANOPY_TIERS[0])
  })
})
