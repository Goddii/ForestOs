import { describe, expect, test } from 'vitest'
import { paymentStatus } from './paymentStatus'
import { formatMillions } from './format'

describe('paymentStatus', () => {
  const row = (status, evidenceCount, activityIds = []) => ({
    status,
    evidenceIds: Array.from({ length: evidenceCount }, (_, i) => `ev-${i}`),
    activityIds,
  })
  const states = (map) => (id) => map[id]

  test('a verified payment is verified, whatever its activities say', () => {
    expect(paymentStatus(row('verified', 1, ['a']), states({ a: 'under_review' }))).toBe('verified')
  })

  test('an unverified payment takes the most urgent state of the activities it paid for', () => {
    const lookup = states({ a: 'under_review', b: 'correction_required' })
    expect(paymentStatus(row('pending_verification', 1, ['a']), lookup)).toBe('under_review')
    expect(paymentStatus(row('pending_verification', 1, ['a', 'b']), lookup)).toBe('correction_required')
    expect(paymentStatus(row('pending_verification', 1, ['r']), states({ r: 'rejected' }))).toBe('rejected')
  })

  test('an unverified payment with no evidence yet is awaiting evidence', () => {
    expect(paymentStatus(row('pending_verification', 0, ['a']), states({ a: 'submitted' }))).toBe('awaiting_evidence')
  })

  test('an unverified payment with evidence but no decision is awaiting verification', () => {
    expect(paymentStatus(row('pending_verification', 1, ['a']), states({ a: 'submitted' }))).toBe('awaiting_verification')
    expect(paymentStatus(row('pending_verification', 1), states({}))).toBe('awaiting_verification')
  })
})

describe('formatMillions', () => {
  test('shows millions to two decimals so ledger figures add up', () => {
    expect(formatMillions(3_550_000)).toBe('3.55M')
    expect(formatMillions(2_450_000)).toBe('2.45M')
    expect(formatMillions(980_000)).toBe('0.98M')
    expect(formatMillions(18_000_000)).toBe('18.00M')
  })

  test('prefixes the currency when given', () => {
    expect(formatMillions(1_100_000, 'KSh')).toBe('KSh 1.10M')
  })
})
