import { describe, expect, test } from 'vitest'
import { daysBetween, nextTranche } from './overviewBand'

const TRANCHES = [
  { id: 't1', milestone: 'Signed', plannedDate: '2026-03-15', plannedKes: 9_000_000, receivedKes: 9_000_000 },
  { id: 't2', milestone: 'First 30 ha verified', plannedDate: '2026-09-30', plannedKes: 5_400_000, receivedKes: null },
  { id: 't3', milestone: 'Survival report', plannedDate: '2027-04-30', plannedKes: 3_600_000, receivedKes: null },
]

describe('daysBetween', () => {
  test('counts whole calendar days from one ISO date to another', () => {
    expect(daysBetween('2026-09-24', '2026-09-30')).toBe(6)
    expect(daysBetween('2026-09-30', '2026-09-24')).toBe(-6)
  })
})

describe('nextTranche', () => {
  test('returns the first tranche not yet received, with its position and days until due', () => {
    expect(nextTranche(TRANCHES, '2026-09-24')).toEqual({
      tranche: TRANCHES[1],
      number: 2,
      count: 3,
      daysUntil: 6,
    })
  })

  test('reports a negative day count when the planned date has passed', () => {
    expect(nextTranche(TRANCHES, '2026-10-02').daysUntil).toBe(-2)
  })

  test('returns null when every tranche has been received', () => {
    const received = TRANCHES.map((tranche) => ({ ...tranche, receivedKes: tranche.plannedKes }))
    expect(nextTranche(received, '2026-09-24')).toBeNull()
  })
})
