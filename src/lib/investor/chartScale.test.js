import { describe, expect, test } from 'vitest'
import { chartDomainMax, niceCeiling, shareOf, trancheSegments } from './chartScale'

describe('niceCeiling', () => {
  test('rounds up to the next 1, 2, 2.5 or 5 step of the magnitude', () => {
    expect(niceCeiling(8_420)).toBe(10_000)
    expect(niceCeiling(1_842)).toBe(2_000)
    expect(niceCeiling(2_100)).toBe(2_500)
    expect(niceCeiling(42)).toBe(50)
  })

  test('returns 1 for zero or negative input so the scale never divides by zero', () => {
    expect(niceCeiling(0)).toBe(1)
    expect(niceCeiling(-5)).toBe(1)
  })
})

describe('chartDomainMax', () => {
  test('uses a declared fixed scale, such as a 0–100 index', () => {
    expect(chartDomainMax([58, 63, 67], 100)).toBe(100)
  })

  test('falls back to a nice ceiling above the largest value', () => {
    expect(chartDomainMax([6_180, 7_460, 8_420])).toBe(10_000)
  })

  test('never lets a value sit above a declared scale', () => {
    expect(chartDomainMax([40, 120], 100)).toBe(200)
  })
})

describe('shareOf', () => {
  test('returns the fraction of the total, clamped to 0–1', () => {
    expect(shareOf(9_000_000, 18_000_000)).toBe(0.5)
    expect(shareOf(20, 10)).toBe(1)
    expect(shareOf(5, 0)).toBe(0)
  })
})

describe('trancheSegments', () => {
  test('lays planned tranches end to end as fractions of the commitment', () => {
    const tranches = [
      { id: 'a', plannedKes: 9 },
      { id: 'b', plannedKes: 5.4 },
      { id: 'c', plannedKes: 3.6 },
    ]
    const segments = trancheSegments(tranches, 18)
    expect(segments.map((segment) => segment.id)).toEqual(['a', 'b', 'c'])
    expect(segments[1].left).toBeCloseTo(0.5)
    expect(segments[1].width).toBeCloseTo(0.3)
    expect(segments[2].left).toBeCloseTo(0.8)
  })
})
