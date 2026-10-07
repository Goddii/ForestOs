// ── The gamification layer — pure rules ─────────────────────────────────────
// Everything the game decides, with no React and no DOM, so it can be unit
// tested and so `useEnterpriseFlow` stays a thin state holder. The sibling
// `data/game.js` holds the illustrative numbers; this file reads them.

import {
  CANOPY_TIERS,
  CROSSOVER_BRAND_IDS,
  QUESTS,
  STAMP_SERIES,
  XP_AWARDS,
} from '../data/game'

/** The tier held at an amount of Canopy XP. */
export function tierForXp(xp = 0, tiers = CANOPY_TIERS) {
  return [...tiers].reverse().find((tier) => xp >= tier.atXp) ?? tiers[0]
}

/** The next tier up, or null at the top of the ladder. */
export function nextTierForXp(xp = 0, tiers = CANOPY_TIERS) {
  return tiers.find((tier) => xp < tier.atXp) ?? null
}

/**
 * Everything the XP ring draws: the tier held, the tier it is climbing
 * toward, and how far along that climb we are. Progress is measured from the
 * current tier's floor, not from zero, so a Guardian at 260 XP reads as
 * "10 / 250 into Guardian", not as a sliver of a Custodian bar.
 */
export function tierProgress(xp = 0, tiers = CANOPY_TIERS) {
  const tier = tierForXp(xp, tiers)
  const nextTier = nextTierForXp(xp, tiers)
  if (!nextTier) {
    return { tier, nextTier: null, toNext: 0, pct: 1 }
  }
  const span = nextTier.atXp - tier.atXp
  const done = xp - tier.atXp
  return {
    tier,
    nextTier,
    toNext: nextTier.atXp - xp,
    pct: span > 0 ? Math.min(done / span, 1) : 0,
  }
}

/** Read one piece of quest context as a number, so targets compare cleanly. */
function contextValue(ctx, key) {
  const raw = ctx?.[key]
  if (typeof raw === 'number') return raw
  return raw ? 1 : 0
}

/** A quest's progress against the current flow context. */
export function questProgress(quest, ctx) {
  const current = contextValue(ctx, quest.key)
  return {
    quest,
    current: Math.min(current, quest.target),
    target: quest.target,
    complete: current >= quest.target,
    pct: quest.target > 0 ? Math.min(current / quest.target, 1) : 1,
  }
}

/**
 * Every quest that applies to this session, at any length: the brand's own
 * quests plus the crossover quest once the other brand's stamp exists. This is
 * the economy's view (what can be earned), which is deliberately wider than
 * the drawer's view (what is shown) — a quest that scrolls off the three-slot
 * board still pays when it is completed.
 */
export function applicableQuestEntries({ brandId, ctx, hasOtherBrandStamp = false } = {}) {
  return QUESTS.filter((quest) => {
    if (!quest.appliesTo.includes(brandId)) return false
    if (quest.requiresOtherBrand && !hasOtherBrandStamp) return false
    return true
  }).map((quest) => questProgress(quest, ctx))
}

/**
 * The quests worth showing this session — at most `limit` (brief 5.4), tied
 * to the brand actually being played, and never including the crossover quest
 * before the visitor holds a stamp from the other brand.
 *
 * Two rules decide the set:
 *   · the crossover payoff always holds a slot when it is available — it is
 *     the cross-brand moment the whole passport exists for, and priority
 *     ordering alone would squeeze it out at the three-quest cap;
 *   · open quests come first, so the drawer is actionable rather than a
 *     trophy case, then completed ones in priority order.
 */
export function selectSessionQuests({
  brandId,
  ctx,
  hasOtherBrandStamp = false,
  limit = 3,
} = {}) {
  const applicable = applicableQuestEntries({ brandId, ctx, hasOtherBrandStamp })

  const byPriority = (a, b) => a.quest.priority - b.quest.priority
  const open = applicable.filter((entry) => !entry.complete).sort(byPriority)
  const done = applicable.filter((entry) => entry.complete).sort(byPriority)

  const chosen = []
  const crossover = applicable.find((entry) => entry.quest.requiresOtherBrand)
  if (crossover && limit > 0) chosen.push(crossover)
  for (const entry of [...open, ...done]) {
    if (chosen.length >= limit) break
    if (!chosen.includes(entry)) chosen.push(entry)
  }

  return chosen.slice(0, limit)
}

/**
 * One nudge, never more (brief 5.4): the highest-priority quest still open, or
 * null when the session's quests are all done.
 */
export function nextBestAction(questEntries = []) {
  const open = questEntries
    .filter((entry) => !entry.complete)
    .sort((a, b) => a.quest.priority - b.quest.priority)
  return open[0] ?? null
}

/** Canopy XP earned from the quests that are complete. */
export function questXp(questEntries = []) {
  return questEntries.reduce((sum, entry) => sum + (entry.complete ? entry.quest.xp : 0), 0)
}

/** Does the passport now hold a stamp from both brands? (Crossover, 5.6) */
export function hasBothBrandStamps(stamps = []) {
  const brands = new Set(stamps.map((stamp) => stamp.brand).filter(Boolean))
  return CROSSOVER_BRAND_IDS.every((id) => brands.has(id))
}

/** Does the passport hold a stamp from a brand other than this one? */
export function hasOtherBrandStamp(stamps = [], brandId) {
  return stamps.some((stamp) => stamp.brand && stamp.brand !== brandId)
}

/**
 * The stamp book (brief 5.6): each series, how many of its slots are filled
 * by the collected stamps, and whether the set-completion bonus is owed.
 * Series with no brand yet stay empty and say so — the book never fakes a
 * stamp the visitor did not collect.
 */
export function buildStampBoard(stamps = []) {
  return STAMP_SERIES.map((series) => {
    const earned = series.brandId
      ? stamps.filter((stamp) => stamp.brand === series.brandId).length
      : 0
    const filled = Math.min(earned, series.slots)
    const complete = filled >= series.slots
    return {
      ...series,
      earned,
      filled,
      complete,
      bonusXp: complete ? XP_AWARDS.setComplete : 0,
    }
  })
}

/** Set-completion bonuses owed across the whole book. */
export function stampBookBonusXp(stamps = []) {
  return buildStampBoard(stamps).reduce((sum, series) => sum + series.bonusXp, 0)
}

/**
 * The full Canopy XP total: trail stages already banked, plus the quests and
 * set completions the current passport pays. Kept as one function so the XP
 * ring, the passport and the investor XP table cannot disagree.
 */
export function totalCanopyXp({ trailXp = 0, quests = [], stamps = [] } = {}) {
  return trailXp + questXp(quests) + stampBookBonusXp(stamps)
}
