// ── Conservation Impact League + community boards (brief 5.7) ───────────────
// "Opt-in nickname only. Conservation Impact League: Safaricom shops vs Java
// House cafés, plus community boards. Shareable achievement card. Weekly
// streak (not daily) with a grace period and no punishing copy."
//
// Both brand layers are PROPOSED partnerships, so the cohorts below are
// PROPOSED too and every figure is ILLUSTRATIVE — this prototype has no real
// shops, cafés or community members behind it. Copy must never imply that
// Safaricom or Java House are running this today.

export const LEAGUE_COHORTS = [
  {
    id: 'saf-shops',
    brandId: 'safaricom',
    kind: 'shop',
    label: 'Safaricom shops',
    members: 42,
    stamps: 1204,
    treesFunded: 860,
  },
  {
    id: 'jh-cafes',
    brandId: 'java-house',
    kind: 'cafe',
    label: 'Java House cafés',
    members: 28,
    stamps: 986,
    treesFunded: 640,
  },
]

/** Community boards — the smaller, local standings under the league. */
export const COMMUNITY_BOARDS = [
  { id: 'mau-ridge', label: 'Mau Ridge', members: 118, stamps: 402 },
  { id: 'tea-belt', label: 'Tea Belt', members: 96, stamps: 331 },
  { id: 'water-towers', label: 'Water Towers', members: 74, stamps: 246 },
]

/**
 * Weekly streak (not daily). Deliberately gentle: a missed week is a pause,
 * never a loss, and there is a grace window before anything changes at all
 * (brief 5.10 — no FOMO, no punishment).
 */
export const STREAK = {
  unit: 'week',
  graceDays: 3,
}

/** Capture the tone the whole feature has to hold. */
export const STREAK_COPY = {
  current: 'This week is in the passport.',
  grace: 'Still time this week — nothing is lost.',
  ready: 'A new week starts whenever you come back.',
}
