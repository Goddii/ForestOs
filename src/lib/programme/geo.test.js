import { describe, expect, test } from 'vitest'
import { bufferAreaHa, polylineLengthKm } from './geo'

describe('polylineLengthKm', () => {
  test('measures along the line, point to point', () => {
    // 0.01° of longitude at the equator ≈ 1.112 km
    expect(polylineLengthKm([[0, 35.0], [0, 35.01], [0, 35.02]])).toBeCloseTo(2.224, 2)
  })

  test('is zero for fewer than two points', () => {
    expect(polylineLengthKm([[0, 35]])).toBe(0)
  })
})

describe('bufferAreaHa', () => {
  test('is length × width — 1 km of a 100 m belt is 10 ha', () => {
    expect(bufferAreaHa(1, 100)).toBe(10)
  })
})
