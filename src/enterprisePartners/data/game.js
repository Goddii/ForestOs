// ── The gamification layer — data ───────────────────────────────────────────
// Brief section 5: "Gamification is core scope, not decoration." This module
// holds the illustrative rules; `lib/game.js` holds the pure functions that
// resolve them, and `components/game/` renders them.
//
// Two currencies, strictly separate (brief 5.1):
//   · Canopy XP  — ForestOS-native progress. Non-transferable, no cash value.
//                  Drives tiers, quests and leagues in both brands.
//   · Bonga      — partner reward, CONCEPT only. Never awarded per scan.
//
// Every number here is ILLUSTRATIVE and must be labelled as such on screen.
// No loot boxes, no random drops, no paid boosts (brief 5.8/5.10): every award
// below is deterministic and shown in the XP table on the investor frame.

import { COP32 } from '../../lib/brands'

/** XP per action. Deterministic, transparent, per brief 5.8. */
export const XP_AWARDS = {
  verifiedScan: 25,
  quest: 20,
  miniGame: 30,
  pledge: 15,
  setComplete: 50,
}

/**
 * Canopy XP tiers (thresholds ILLUSTRATIVE, per brief 5.5). Tiers unlock
 * content, never discounts — and each `unlocks` line describes something that
 * actually exists in this prototype. Plot adoption itself stays open to every
 * tier; what Guardian adds is the field officer's note on the plot you adopted.
 */
export const CANOPY_TIERS = [
  { id: 'visitor', label: 'Visitor', atXp: 0, unlocks: 'The QR journey and your first stamp.' },
  { id: 'explorer', label: 'Explorer', atXp: 75, unlocks: 'The origin beats and the stamp book.' },
  { id: 'guardian', label: 'Guardian', atXp: 250, unlocks: 'Field-officer notes on your adopted plot.' },
  { id: 'custodian', label: 'Custodian', atXp: 500, unlocks: 'Your full conservation record, held in the passport.' },
]

/**
 * Quests (brief 5.4). Each is tied to a real feature in the journey, so the
 * game cannot drift away from the product. `appliesTo` scopes a quest to the
 * brands that actually have the feature.
 *
 * `key` names the piece of flow context that satisfies it — `lib/game.js`
 * owns the reading of that context, so a quest never reaches into the DOM.
 */
export const QUESTS = [
  {
    id: 'origin-explorer',
    title: 'Origin Explorer',
    description: 'Open all four story beats on the tea trail.',
    key: 'beatsOpened',
    target: 4,
    xp: XP_AWARDS.quest,
    // The four story beats live on the Java House origin trail (brief 7·3),
    // so this quest only appears there rather than offering a target the
    // Safaricom journey has no way to reach.
    appliesTo: ['java-house'],
    priority: 1,
  },
  {
    id: 'ridge-witness',
    title: 'Ridge Witness',
    description: 'Use the 2015-versus-today canopy reveal.',
    key: 'canopyExplored',
    target: 1,
    xp: XP_AWARDS.quest,
    appliesTo: ['safaricom', 'java-house'],
    priority: 2,
  },
  {
    id: 'plot-detective',
    title: 'Plot Detective',
    description: 'Finish Claim vs Fact on a live plot.',
    key: 'plotsVerified',
    target: 1,
    xp: XP_AWARDS.quest,
    appliesTo: ['safaricom', 'java-house'],
    priority: 3,
  },
  {
    id: 'pledge-plant',
    title: 'Plant with Bonga',
    description: 'Turn your impact into a conservation action.',
    key: 'pledgeDone',
    target: 1,
    xp: XP_AWARDS.pledge,
    appliesTo: ['safaricom'],
    priority: 4,
  },
  {
    id: 'pledge-cup',
    title: 'Pledge your cup',
    description: 'Make the café visit a conservation action.',
    key: 'pledgeDone',
    target: 1,
    xp: XP_AWARDS.pledge,
    appliesTo: ['java-house'],
    priority: 4,
  },
  {
    id: 'crossover',
    title: 'Crossover',
    description: 'Collect a stamp from both brands to unlock the joined ridge-line.',
    key: 'bothBrands',
    target: 1,
    xp: XP_AWARDS.setComplete,
    appliesTo: ['safaricom', 'java-house'],
    priority: 5,
    // Only surfaced once a stamp from the other brand already exists — a
    // quest a first-time visitor provably cannot finish is a nag, not a game.
    requiresOtherBrand: true,
  },
]

/** Quest ids that belong to the "pledge" idea — completing either counts. */
export const PLEDGE_QUEST_IDS = ['pledge-plant', 'pledge-cup']

/**
 * Stamp series (brief 5.6). Each series holds three stamps; a completed set
 * pays the set-completion bonus once. `brandId` is the brand whose stamp
 * occupies the series in this prototype — the second and third slots are
 * honestly shown as empty until more brands join.
 */
export const STAMP_SERIES = [
  { id: 'mau-ridge', label: 'Mau Ridge', brandId: 'safaricom', slots: 3, glyph: 'signal' },
  { id: 'tea-belt', label: 'Tea Belt', brandId: 'java-house', slots: 3, glyph: 'cup' },
  { id: 'water-towers', label: 'Water Towers', brandId: null, slots: 3, glyph: 'mountain' },
]

/** Both stamps the crossover quest needs. */
export const CROSSOVER_BRAND_IDS = ['safaricom', 'java-house']

/**
 * Claim vs Fact — the signature mini-game (brief 5.3). A field report is
 * dragged onto the satellite layer; it only becomes a stamped Fact when the
 * ground and the satellite agree. `satelliteConfirmed: false` is the
 * ghost-planting variant: the claim stays grey, which is the whole point —
 * the game *is* the trust model.
 *
 * ILLUSTRATIVE content; replayable by cycling the plots.
 */
export const CLAIM_PLOTS = [
  {
    id: 'mau-kpt-0802',
    label: 'Mau buffer · KPT-0802',
    claims: [
      {
        id: 'c1',
        text: '42 seedlings planted along the block edge',
        satelliteConfirmed: true,
        note: 'Canopy gain on the satellite layer matches the planting record.',
      },
      {
        id: 'c2',
        text: 'Erosion-control trench cut on the lower slope',
        satelliteConfirmed: true,
        note: 'Bare-soil signature on the slope matches the field report.',
      },
      {
        id: 'c3',
        text: '60 seedlings planted beyond the surveyed polygon',
        satelliteConfirmed: false,
        note: 'No canopy change on the satellite layer for that polygon.',
      },
    ],
  },
  {
    id: 'aberdares-1140',
    label: 'Aberdare edge · ABR-1140',
    claims: [
      {
        id: 'c1',
        text: 'Invasive removal across three buffer hectares',
        satelliteConfirmed: true,
        note: 'Texture change on the satellite layer confirms the clearing.',
      },
      {
        id: 'c2',
        text: 'Nursery stocked with 500 indigenous seedlings',
        satelliteConfirmed: false,
        note: 'A nursery is not visible from orbit — nothing to corroborate.',
      },
      {
        id: 'c3',
        text: 'River-line replanting on the fog belt',
        satelliteConfirmed: true,
        note: 'Green-up along the waterline matches the report.',
      },
    ],
  },
]

/**
 * Season 1 — "Road to COP32" community goal (brief 5.2). Reuses the one
 * confirmed COP32 record so the prototype cannot drift from the rest of the
 * site; the progress figure itself is ILLUSTRATIVE.
 */
export const SEASON = {
  id: 'cop32',
  label: 'Season 1 · Road to COP32',
  place: COP32.label,
  dateLabel: COP32.dateLabel,
  goal: COP32.packsGoal,
  now: COP32.packsNow,
  treesAtGoal: COP32.treesAtGoal,
}
