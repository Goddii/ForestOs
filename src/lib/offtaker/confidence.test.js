import { expect, test } from 'vitest'
import { buildOfftakerWorkspace } from '../../data/offtaker/workspace'
import { sourcingConfidence } from './confidence'

test('four checks, in a fixed order', () => {
  const checks = sourcingConfidence(buildOfftakerWorkspace('rift-valley-tea'))
  expect(checks.map((check) => check.key)).toEqual(['traceability', 'quality', 'compliance', 'origin'])
})

test('a flagged delivery on a visible lot flags traceability and names it', () => {
  const [traceability] = sourcingConfidence(buildOfftakerWorkspace('rift-valley-tea'))
  expect(traceability.status).toBe('flagged')
  expect(traceability.detail).toContain('TL-2026-00645')
})

test('a buyer with no connected supply is pending on origin, not verified', () => {
  const origin = sourcingConfidence(buildOfftakerWorkspace('highland-leaf')).find((check) => check.key === 'origin')
  expect(origin.status).toBe('pending')
})

test('an expired required certificate flags compliance for roles that can see it', () => {
  const compliance = sourcingConfidence(buildOfftakerWorkspace('rift-valley-tea', 'compliance')).find((check) => check.key === 'compliance')
  expect(compliance.status).toBe('flagged')
  expect(compliance.detail).toContain('Mariashoni')
})
