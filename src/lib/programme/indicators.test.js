import { describe, expect, test } from 'vitest'
import { progressPct, summarizeIndicator } from './indicators'

const ev = (state, independence = 'internal_separate') => ({
  state,
  at: '2026-09-01',
  byRole: 'M&E officer',
  byOrgId: 'org-ntzdc',
  independence,
})
const SUBMITTED = ev('submitted', 'self')
const REVIEW = ev('under_review')

const activity = (id, allocationId, value, states) => ({
  id,
  allocationId,
  outputs: [{ indicatorId: 'ind-seedlings', value }],
  verification: states,
})

const INDICATOR = { id: 'ind-seedlings', target: 1000, unit: 'seedlings' }

const ACTIVITIES = [
  activity('a1', 'alloc-a', 300, [SUBMITTED, REVIEW, ev('verified')]),
  activity('a2', 'alloc-b', 200, [SUBMITTED, REVIEW, ev('verified')]),
  activity('a3', 'alloc-a', 150, [SUBMITTED, REVIEW]),
  activity('a4', 'alloc-a', 999, [SUBMITTED, REVIEW, ev('rejected')]),
  activity('a5', 'alloc-a', 50, []),
]

describe('summarizeIndicator', () => {
  test('counts only verified activities as verified', () => {
    const summary = summarizeIndicator(INDICATOR, ACTIVITIES, new Set(['alloc-a']))
    expect(summary.verified).toBe(500)
  })

  test('reported excludes drafts and rejected claims but includes pending ones', () => {
    const summary = summarizeIndicator(INDICATOR, ACTIVITIES, new Set(['alloc-a']))
    expect(summary.reported).toBe(650)
  })

  test('attributes directly through the funder’s allocations, never pro-rata', () => {
    const summary = summarizeIndicator(INDICATOR, ACTIVITIES, new Set(['alloc-a']))
    expect(summary.fundedVerified).toBe(300)
    expect(summary.fundedReported).toBe(450)
  })

  test('lists contributing activities with their state, rejected ones included for transparency', () => {
    const summary = summarizeIndicator(INDICATOR, ACTIVITIES, new Set(['alloc-a']))
    expect(summary.activities.map((row) => [row.activity.id, row.state])).toEqual([
      ['a1', 'verified'],
      ['a2', 'verified'],
      ['a3', 'under_review'],
      ['a4', 'rejected'],
    ])
  })
})

describe('progressPct', () => {
  test('is null without a target and capped at 100', () => {
    expect(progressPct(10, null)).toBeNull()
    expect(progressPct(150, 100)).toBe(100)
    expect(progressPct(25, 100)).toBe(25)
  })
})
