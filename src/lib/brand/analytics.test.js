import { describe, expect, test } from 'vitest'
import { dailyTotals, geographyRows, linkRows, mergedGeographyRows, periodChange, rangeFrom, stageFunnel, sumScans, weightedRates } from './analytics'

const day = (experienceId, date, scans, uniqueDevices = scans) => ({ experienceId, date, scans, uniqueDevices })
const days = [day('a', '2026-09-01', 10, 8), day('b', '2026-09-01', 5, 5), day('a', '2026-09-03', 20, 15)]

describe('dailyTotals', () => {
  test('sums experiences per day and fills missing days with zero', () => {
    expect(dailyTotals(days, '2026-09-01', '2026-09-03')).toEqual([
      { date: '2026-09-01', scans: 15, uniqueDevices: 13 },
      { date: '2026-09-02', scans: 0, uniqueDevices: 0 },
      { date: '2026-09-03', scans: 20, uniqueDevices: 15 },
    ])
  })
})

test('sumScans totals scans and devices', () => {
  expect(sumScans(days)).toEqual({ scans: 35, uniqueDevices: 28 })
})

test('rangeFrom counts back inclusively from the end date', () => {
  expect(rangeFrom('2026-09-24', 7)).toBe('2026-09-18')
})

describe('periodChange', () => {
  test('compares with the same-length period immediately before', () => {
    expect(periodChange(days, '2026-09-03', '2026-09-03')).toEqual({ current: 20, previous: 0, pct: null })
    expect(periodChange(days, '2026-09-02', '2026-09-03')).toEqual({ current: 20, previous: 15, pct: 33 })
  })
})

describe('stageFunnel', () => {
  const stages = [
    { key: 's', label: 'Scanned' },
    { key: 'o', label: 'Origin' },
    { key: 'p', label: 'Proof' },
  ]
  test('applies stage rates, reports step conversion and marks the biggest drop', () => {
    const funnel = stageFunnel(1000, [1, 0.8, 0.4], stages)
    expect(funnel.rows.map((row) => row.count)).toEqual([1000, 800, 400])
    expect(funnel.rows.map((row) => row.fromPrevious)).toEqual([null, 80, 50])
    expect(funnel.biggestDropKey).toBe('p')
  })
  test('an empty funnel has no biggest drop', () => {
    expect(stageFunnel(0, [1, 0.8, 0.4], stages).biggestDropKey).toBeNull()
  })
})

describe('geographyRows', () => {
  const geography = [
    ['Nairobi', 'county', 0.9],
    ['Mombasa', 'county', 0.08],
    ['Uganda', 'country', 0.015],
    ['Japan', 'country', 0.005],
  ]
  test('folds any place under the privacy floor into Other locations, listed last', () => {
    const rows = geographyRows(500, geography, 10)
    expect(rows.map((row) => row.label)).toEqual(['Nairobi', 'Mombasa', 'Other locations'])
    expect(rows.at(-1)).toMatchObject({ count: 11, places: 2, isOther: true })
  })
  test('never shows a single suppressed place under its own name', () => {
    const rows = geographyRows(100, [['Nairobi', 'county', 0.95], ['Japan', 'country', 0.05]], 10)
    expect(rows.map((row) => row.label)).toEqual(['Nairobi', 'Other locations'])
  })
})

describe('combining experiences', () => {
  test('weightedRates weights each experience’s stage rates by its scans', () => {
    expect(weightedRates([{ scans: 300, rates: [1, 0.5] }, { scans: 100, rates: [1, 0.9] }])).toEqual([1, 0.6])
    expect(weightedRates([])).toEqual([])
  })

  test('mergedGeographyRows merges places before applying the floor', () => {
    const parts = [
      { totalScans: 100, geography: [['Nairobi', 'county', 0.94], ['Japan', 'country', 0.06]] },
      { totalScans: 100, geography: [['Nairobi', 'county', 0.95], ['Japan', 'country', 0.05]] },
    ]
    // Japan has 6 + 5 = 11 across both, so it clears a floor of 10 only once merged.
    expect(mergedGeographyRows(parts, 10).map((row) => [row.label, row.count])).toEqual([
      ['Nairobi', 189],
      ['Japan', 11],
    ])
  })
})

describe('linkRows', () => {
  test('lists only links the experience actually has', () => {
    const customisation = { cta: { label: 'Book', href: 'https://x' }, socialLinks: [], musicLink: null, communityLink: 'https://c' }
    const rows = linkRows(1000, { cta: 0.2, social: 0.05, music: 0.1, community: 0.02 }, customisation)
    expect(rows.map((row) => row.key)).toEqual(['cta', 'community'])
    expect(rows[0]).toMatchObject({ label: 'Book', taps: 200, ratePct: 20 })
  })
})
