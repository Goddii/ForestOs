import { describe, expect, test } from 'vitest'
import { EXPIRY_NOTICE_DAYS, daysBetween, documentStatus, isOutstanding } from './documentStatus'

const verified = [
  { state: 'submitted', at: '2026-01-01', byRole: 'Clerk', byOrgId: 'org-ntzdc', independence: 'self' },
  { state: 'verified', at: '2026-01-02', byRole: 'Officer', byOrgId: 'org-ntzdc', independence: 'internal_separate' },
]
const doc = (overrides) => ({ withdrawnReason: null, expiryDate: null, requiredForBuyers: true, verification: verified, ...overrides })
const AS_OF = '2026-09-24'

describe('documentStatus', () => {
  test('valid when verified with no expiry', () => {
    expect(documentStatus(doc({}), AS_OF)).toBe('valid')
  })
  test('expired the day after its expiry date', () => {
    expect(documentStatus(doc({ expiryDate: '2026-09-23' }), AS_OF)).toBe('expired')
    expect(documentStatus(doc({ expiryDate: '2026-09-24' }), AS_OF)).toBe('expiring')
  })
  test('expiring inside the notice window, valid beyond it', () => {
    const edge = new Date(Date.parse(`${AS_OF}T00:00:00Z`) + EXPIRY_NOTICE_DAYS * 86_400_000).toISOString().slice(0, 10)
    expect(documentStatus(doc({ expiryDate: edge }), AS_OF)).toBe('expiring')
    expect(documentStatus(doc({ expiryDate: '2027-06-01' }), AS_OF)).toBe('valid')
  })
  test('unverified documents are pending whatever their dates', () => {
    expect(documentStatus(doc({ verification: verified.slice(0, 1), expiryDate: '2020-01-01' }), AS_OF)).toBe('pending')
  })
  test('withdrawn beats every other status', () => {
    expect(documentStatus(doc({ withdrawnReason: 'Superseded' }), AS_OF)).toBe('withdrawn')
  })
})

describe('isOutstanding', () => {
  test('only required documents that are not usable', () => {
    expect(isOutstanding(doc({ expiryDate: '2026-01-01' }), AS_OF)).toBe(true)
    expect(isOutstanding(doc({ expiryDate: '2026-01-01', requiredForBuyers: false }), AS_OF)).toBe(false)
    expect(isOutstanding(doc({ expiryDate: '2026-10-01' }), AS_OF)).toBe(false)
  })
})

test('daysBetween counts whole days', () => {
  expect(daysBetween('2026-09-24', '2026-11-02')).toBe(39)
})
