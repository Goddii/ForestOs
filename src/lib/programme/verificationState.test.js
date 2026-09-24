import { describe, expect, test } from 'vitest'
import {
  appendEvent,
  canTransition,
  currentState,
  latestDecision,
  validateHistory,
} from './verificationState'

const submitted = { state: 'submitted', at: '2026-09-01', byRole: 'Field supervisor', byOrgId: 'org-ntzdc', independence: 'self' }
const underReview = { state: 'under_review', at: '2026-09-02', byRole: 'M&E officer', byOrgId: 'org-ntzdc', independence: 'internal_separate' }
const verified = { state: 'verified', at: '2026-09-03', byRole: 'M&E officer', byOrgId: 'org-ntzdc', independence: 'internal_separate' }

describe('canTransition', () => {
  test('allows the forward path and the correction loop', () => {
    expect(canTransition('draft', 'submitted')).toBe(true)
    expect(canTransition('submitted', 'under_review')).toBe(true)
    expect(canTransition('under_review', 'correction_required')).toBe(true)
    expect(canTransition('correction_required', 'submitted')).toBe(true)
  })

  test('rejects skipping review and leaving a rejected record', () => {
    expect(canTransition('submitted', 'verified')).toBe(false)
    expect(canTransition('rejected', 'submitted')).toBe(false)
  })

  test('lets a verified record be reopened for review', () => {
    expect(canTransition('verified', 'under_review')).toBe(true)
  })
})

describe('currentState', () => {
  test('is draft for an empty history', () => {
    expect(currentState([])).toBe('draft')
  })

  test('is the last event state', () => {
    expect(currentState([submitted, underReview, verified])).toBe('verified')
  })
})

describe('appendEvent', () => {
  test('returns a new history and leaves the original untouched', () => {
    const history = [submitted]
    const next = appendEvent(history, underReview)
    expect(next).toHaveLength(2)
    expect(history).toHaveLength(1)
  })

  test('throws on an illegal transition', () => {
    expect(() => appendEvent([submitted], verified)).toThrow(/submitted → verified/)
  })

  test('blocks self-verification', () => {
    expect(() => appendEvent([submitted, underReview], { ...verified, independence: 'self' })).toThrow(/self/)
  })
})

describe('validateHistory', () => {
  test('accepts a well-formed history', () => {
    expect(validateHistory([submitted, underReview, verified])).toEqual({ valid: true, errors: [] })
  })

  test('reports every problem', () => {
    const result = validateHistory([submitted, { ...verified, independence: 'self' }])
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThanOrEqual(2)
  })
})

describe('latestDecision', () => {
  test('returns the most recent reviewer decision, not the submission', () => {
    expect(latestDecision([submitted, underReview, verified])).toBe(verified)
    expect(latestDecision([submitted])).toBeNull()
  })
})
