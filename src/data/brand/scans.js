// DEMO DATA — daily QR scan records for each published experience, from the
// day it was published to the demo's fixed "today" (AS_OF). Generated from a
// seeded pseudo-random walk so the series look organic but are identical on
// every load; a backend's scan log replaces this module and the aggregation
// in lib/brand/analytics.js stays as is.
//
// What is counted, and what is not: a scan is one page open from a printed
// code. Unique devices are estimated without cookies (a daily-rotating hash,
// never stored), so they are an estimate, labelled as one. Location is
// county or country only. No names, phone numbers or emails exist here.

import { AS_OF } from '../funder/programme'
import { BRAND_EXPERIENCES } from './experiences'

const DAY_MS = 86_400_000

/** Deterministic PRNG (mulberry32) so every load draws the same series. */
function seeded(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

const isoDay = (ms) => new Date(ms).toISOString().slice(0, 10)

/**
 * How each experience is scanned: typical daily volume, how it ramps after
 * launch, which days are busy (0 = Sunday), how far guests read, where scans
 * come from and which links they tap.
 */
const PROFILES = {
  'exp-kil-mau': {
    seed: 11,
    daily: 96,
    ramp: 0.12,
    busyDays: [1, 2, 3, 4, 5],
    stageRates: [1, 0.84, 0.61, 0.44, 0.19],
    geography: [
      ['Nairobi', 'county', 0.58],
      ['Mombasa', 'county', 0.21],
      ['Kiambu', 'county', 0.09],
      ['Nakuru', 'county', 0.05],
      ['Kisumu', 'county', 0.03],
      ['Kajiado', 'county', 0.018],
      ['Uasin Gishu', 'county', 0.012],
      ['United Kingdom', 'country', 0.006],
      ['Uganda', 'country', 0.004],
    ],
    links: { cta: 0.13, social: 0.05, music: 0, community: 0 },
  },
  'exp-mc-guest': {
    seed: 23,
    daily: 38,
    ramp: 0.08,
    busyDays: [0, 5, 6],
    stageRates: [1, 0.88, 0.69, 0.52, 0.27],
    geography: [
      ['Narok', 'county', 0.31],
      ['Nairobi', 'county', 0.19],
      ['Laikipia', 'county', 0.14],
      ['United Kingdom', 'country', 0.1],
      ['United States', 'country', 0.09],
      ['Germany', 'country', 0.07],
      ['Kilifi', 'county', 0.05],
      ['France', 'country', 0.03],
      ['Netherlands', 'country', 0.01],
      ['Japan', 'country', 0.01],
    ],
    links: { cta: 0.22, social: 0.04, music: 0, community: 0 },
  },
  'exp-hg-afternoon': {
    seed: 37,
    daily: 24,
    ramp: 0.1,
    busyDays: [0, 6],
    stageRates: [1, 0.9, 0.73, 0.58, 0.31],
    geography: [
      ['Nairobi', 'county', 0.46],
      ['United Kingdom', 'country', 0.14],
      ['United States', 'country', 0.12],
      ['United Arab Emirates', 'country', 0.08],
      ['China', 'country', 0.06],
      ['Germany', 'country', 0.05],
      ['South Africa', 'country', 0.04],
      ['India', 'country', 0.03],
      ['Kiambu', 'county', 0.02],
    ],
    links: { cta: 0.26, social: 0.06, music: 0, community: 0 },
  },
}

/**
 * One experience's daily scan records from its publish date to AS_OF, drawn
 * from its profile's seeded walk. Shared with the Creator Portal.
 *
 * @param {{ id: string, publishedAt: string }} experience
 * @param {{ seed: number, daily: number, ramp: number, busyDays: number[] }} profile
 */
export function dailySeries(experience, profile) {
  const random = seeded(profile.seed)
  const start = Date.parse(experience.publishedAt)
  const end = Date.parse(AS_OF)
  const days = []
  for (let ms = start, index = 0; ms <= end; ms += DAY_MS, index += 1) {
    const ramp = 1 - Math.exp(-profile.ramp * (index + 1))
    const busy = profile.busyDays.includes(new Date(ms).getUTCDay()) ? 1.18 : 0.78
    const noise = 0.82 + random() * 0.36
    const scans = Math.max(0, Math.round(profile.daily * ramp * busy * noise))
    const uniqueDevices = Math.round(scans * (0.8 + random() * 0.08))
    days.push({ experienceId: experience.id, date: isoDay(ms), scans, uniqueDevices })
  }
  return days
}

const PUBLISHED = BRAND_EXPERIENCES.filter((experience) => experience.status === 'published' && PROFILES[experience.id])

/** @type {Array<{ experienceId: string, date: string, scans: number, uniqueDevices: number }>} */
export const SCAN_DAYS = PUBLISHED.flatMap((experience) => dailySeries(experience, PROFILES[experience.id]))

/** Per-experience engagement shape; totals are applied in lib/brand/analytics.js. */
export const ENGAGEMENT_PROFILES = Object.fromEntries(
  Object.entries(PROFILES).map(([id, profile]) => [
    id,
    {
      // The last stage is derived from the link rates, so "tapped a link"
      // always agrees with the per-link taps.
      stageRates: [...profile.stageRates.slice(0, -1), Object.values(profile.links).reduce((sum, rate) => sum + rate, 0)],
      geography: profile.geography,
      links: profile.links,
    },
  ]),
)

/** The stages of the placeholder batch-record experience, in reading order. */
export const EXPERIENCE_STAGES = [
  { key: 'scanned', label: 'Scanned the code' },
  { key: 'origin', label: 'Saw where it grew' },
  { key: 'proof', label: 'Opened the verification' },
  { key: 'story', label: 'Reached the brand story' },
  { key: 'action', label: 'Tapped a link' },
]
