import { describe, expect, test } from 'vitest'
import { desktopColumns, splitFundedOutputs } from './fundedOutputs'

const row = (id, fundedVerified, fundedReported) => ({ indicator: { id }, fundedVerified, fundedReported })

describe('splitFundedOutputs', () => {
  test('separates outputs with verified work from ones reported but not yet verified', () => {
    const progress = [row('tea', 14.5, 23.5), row('hives', 0, 45), row('seedlings', 6_400, 6_400), row('patrols', 0, 0)]
    const { verified, unverified } = splitFundedOutputs(progress)
    expect(verified.map((r) => r.indicator.id)).toEqual(['tea', 'seedlings'])
    expect(unverified.map((r) => r.indicator.id)).toEqual(['hives'])
  })

  test('adds the amount still awaiting verification to each row', () => {
    const { verified, unverified } = splitFundedOutputs([row('tea', 14.5, 23.5), row('hives', 0, 45)])
    expect(verified[0].pending).toBeCloseTo(9)
    expect(unverified[0].pending).toBe(45)
  })

  test('drops outputs this funder has not paid for at all', () => {
    expect(splitFundedOutputs([row('patrols', 0, 0)])).toEqual({ verified: [], unverified: [] })
  })
})

describe('desktopColumns', () => {
  test('fits up to five outputs in a single row', () => {
    expect([1, 2, 3, 4, 5].map(desktopColumns)).toEqual([1, 2, 3, 4, 5])
  })

  test('uses rows of three when that divides evenly, otherwise rows of four', () => {
    expect(desktopColumns(6)).toBe(3)
    expect(desktopColumns(9)).toBe(3)
    expect(desktopColumns(7)).toBe(4)
    expect(desktopColumns(8)).toBe(4)
  })
})
