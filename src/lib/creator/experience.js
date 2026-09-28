/**
 * Claim control and experience rules for the Creator Portal. Pure functions:
 * a creator edits the creative layer only; the verified ForestOS layer is
 * read from records and cannot be written through anything here.
 */

/** The only fields a creator can change on an experience. */
export const CREATIVE_FIELDS = new Set([
  'headline',
  'subline',
  'heroAssetId',
  'narrative',
  'sectionOrder',
  'hiddenSections',
  'musicLink',
  'ctas',
  'statementIds',
])

/**
 * Applies the creative fields in `changes` to a new copy and reports every
 * other key as rejected. Hectares, verification status or any impact figure
 * can never be written; callers may surface `rejected` (tests assert it).
 *
 * @param {Record<string, unknown>} creative
 * @param {Record<string, unknown>} changes
 * @returns {{ creative: Record<string, unknown>, rejected: string[] }}
 */
export function applyCreativeEdit(creative, changes) {
  const entries = Object.entries(changes)
  const accepted = Object.fromEntries(entries.filter(([key]) => CREATIVE_FIELDS.has(key)))
  const rejected = entries.filter(([key]) => !CREATIVE_FIELDS.has(key)).map(([key]) => key)
  return { creative: { ...creative, ...accepted }, rejected }
}

// A number followed by a unit that states conservation impact. Dates,
// times and prices do not match; "7pm" and "12 October" pass.
const FIGURE_PATTERN =
  /\d[\d,]*(?:\.\d+)?\s*(?:%|percent\b|ha\b|hectares?\b|acres?\b|trees?\b|seedlings?\b|patrols?\b|tonnes?\b|tons?\b|t\s?co2e?\b|kg\s?co2e?\b)/gi

/**
 * Impact figures typed into creative copy. Verified numbers must come from
 * the ForestOS layer, so any match blocks publishing until removed.
 *
 * @param {string} text
 * @returns {string[]}
 */
export function findFigureClaims(text) {
  return (text ?? '').match(FIGURE_PATTERN)?.map((match) => match.trim()) ?? []
}

/** @param {string} value */
export function isSafeHttpUrl(value) {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * @param {string[]} order
 * @param {string} key
 * @param {-1 | 1} delta
 */
export function moveSection(order, key, delta) {
  const from = order.indexOf(key)
  const to = from + delta
  if (from < 0 || to < 0 || to >= order.length) return order
  const next = [...order]
  next.splice(from, 1)
  next.splice(to, 0, key)
  return next
}

/**
 * Hides or shows a creative section. Verified sections always show: a
 * creator can move them, not remove them.
 *
 * @param {string[]} hidden
 * @param {string} key
 * @param {{ sections: Array<{ key: string, layer: string }> }} template
 */
export function toggleSection(hidden, key, template) {
  const section = template.sections.find((entry) => entry.key === key)
  if (!section || section.layer === 'verified') return hidden
  return hidden.includes(key) ? hidden.filter((entry) => entry !== key) : [...hidden, key]
}

/**
 * What stands between an experience and publishing, as named checks.
 *
 * @param {{ creative: { headline: string, heroAssetId: string, subline: string, narrative: string, ctas: Array<{ label: string, href: string }>, musicLink: string | null } }} experience
 * @param {{ sections: Array<{ key: string }> }} template
 */
export function publishReadiness({ creative }, template) {
  const figures = findFigureClaims(`${creative.headline} ${creative.subline} ${creative.narrative}`)
  const links = [...creative.ctas.map((cta) => cta.href), ...(creative.musicLink ? [creative.musicLink] : [])]
  const checks = [
    { id: 'headline', label: 'Headline written', ok: creative.headline.trim().length > 0, detail: 'Every experience opens on a headline.' },
    { id: 'hero', label: 'Hero image chosen', ok: Boolean(creative.heroAssetId), detail: 'Pick one from your assets or ForestOS imagery.' },
    {
      id: 'cta',
      label: 'At least one call to action',
      ok: creative.ctas.some((cta) => cta.label.trim() && cta.href.trim()),
      detail: 'Give scanners somewhere to go next: music, socials or the community.',
    },
    {
      id: 'links',
      label: 'Links are safe web addresses',
      ok: links.every(isSafeHttpUrl),
      detail: 'Links must start with https:// or http://.',
    },
    {
      id: 'figures',
      label: 'No impact figures in your own words',
      ok: figures.length === 0,
      detail: figures.length ? `Remove ${figures.join(', ')}. Verified numbers appear from ForestOS records automatically.` : 'Verified numbers appear from ForestOS records automatically.',
    },
    { id: 'template', label: 'Template connected', ok: template.sections.length > 0, detail: 'The template decides where verified data sits.' },
  ]
  return { ready: checks.every((check) => check.ok), checks }
}

/**
 * Where a code lands. In the demo every template is an existing consumer
 * route; the campaign code rides along so scans can be attributed, and a
 * pack code also carries its batch so the scan opens that batch's record.
 *
 * @param {{ route: string }} template
 * @param {{ shortCode: string }} experience
 * @param {string} [batchId]
 */
export function destinationPath(template, experience, batchId) {
  const base = `${template.route}?c=${encodeURIComponent(experience.shortCode)}`
  return batchId ? `${base}&batch=${encodeURIComponent(batchId)}` : base
}

/**
 * The state of one per-batch pack code. Verification comes first: a code on
 * a batch that is not verified is blocked, even when everything else is
 * ready, so no pack ever opens an unverified story.
 *
 * @param {{ status: 'packed' | 'scheduled' }} code
 * @param {{ experienceStatus: string, batchVerified: boolean }} context
 * @returns {'live' | 'proof' | 'scheduled' | 'blocked'}
 */
export function packCodeState(code, { experienceStatus, batchVerified }) {
  if (!batchVerified) return 'blocked'
  if (experienceStatus !== 'published') return 'proof'
  if (code.status !== 'packed') return 'scheduled'
  return 'live'
}

const LINK_KINDS = ['spotify', 'social', 'community', 'website']

/**
 * One experience's totals: scans, estimated visitors, how many reached the
 * conservation story, and link taps by kind.
 *
 * @param {Array<{ experienceId: string, date: string, scans: number, uniqueDevices: number }>} records
 * @param {Record<string, { reachedStoryRate: number, links: Record<string, number> }>} engagement
 * @param {string} experienceId
 */
export function experienceStats(records, engagement, experienceId) {
  const own = records.filter((record) => record.experienceId === experienceId)
  const scans = own.reduce((sum, record) => sum + record.scans, 0)
  const visitors = own.reduce((sum, record) => sum + record.uniqueDevices, 0)
  const profile = engagement[experienceId]
  const clicks = Object.fromEntries(LINK_KINDS.map((kind) => [kind, Math.round(scans * (profile?.links[kind] ?? 0))]))
  const scanned = own.filter((record) => record.scans > 0).map((record) => record.date)
  return {
    scans,
    visitors,
    reachedStory: Math.round(scans * (profile?.reachedStoryRate ?? 0)),
    clicks,
    ctaClicks: Object.values(clicks).reduce((sum, value) => sum + value, 0),
    lastScan: scanned.length ? scanned.reduce((latest, date) => (date > latest ? date : latest)) : null,
  }
}
