// DEMO DATA — daily scans for each live pack code, drawn the same seeded way
// as the Brand Portal's (data/brand/scans.js), so the series look organic but
// are identical on every load. Codes are per batch, so scans are recorded per
// code and roll up to the experience it opens. A code only scans from the
// later of its packing date and its experience going live; codes that are
// not live (proofs, scheduled or blocked batches) have no scans at all.
// Unique visitors are a cookie-free estimate.
//
// Social reach is not collected: no social platform is connected, and the
// portal says so rather than showing an invented number.

import { dailySeries } from '../brand/scans'
import { CREATOR_EXPERIENCES } from './campaigns'
import { CREATOR_PRODUCTS, PACK_CODES } from './products'

/** Seeded scan profiles for the codes that are on shelves and live. */
const CODE_PROFILES = {
  'qr-anthem-921': { seed: 53, daily: 310, ramp: 0.16, busyDays: [5, 6, 0] },
  'qr-shield-921': { seed: 71, daily: 240, ramp: 0.14, busyDays: [5, 6] },
}

/** How far scanners read, and which links they tap, per experience. */
export const CREATOR_ENGAGEMENT = {
  'exp-anthem': { reachedStoryRate: 0.58, links: { spotify: 0.21, social: 0.07, community: 0.09, website: 0 } },
  'exp-shield': { reachedStoryRate: 0.62, links: { spotify: 0.16, social: 0.06, community: 0.05, website: 0.11 } },
}

function recordsFor(code) {
  const product = CREATOR_PRODUCTS.find((entry) => entry.id === code.productId)
  const experience = CREATOR_EXPERIENCES.find((entry) => entry.id === product?.experienceId)
  if (!experience?.publishedAt || code.status !== 'packed') return []
  const start = experience.publishedAt > code.date ? experience.publishedAt : code.date
  return dailySeries({ id: code.id, publishedAt: start }, CODE_PROFILES[code.id]).map(({ date, scans, uniqueDevices }) => ({
    codeId: code.id,
    experienceId: experience.id,
    date,
    scans,
    uniqueDevices,
  }))
}

/** @type {Array<{ codeId: string, experienceId: string, date: string, scans: number, uniqueDevices: number }>} */
export const CREATOR_SCAN_DAYS = PACK_CODES.filter((code) => CODE_PROFILES[code.id]).flatMap(recordsFor)
