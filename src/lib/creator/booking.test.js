import { describe, expect, it } from 'vitest'
import { bookingCheck } from './booking'

const batch = { madeTeaKg: 1480, isVerified: true, deliveryFlagged: false }

describe('bookingCheck', () => {
  it('accepts a booking that fits in the batch', () => {
    expect(bookingCheck({ batch, bookedKg: 0, packs: 5000, packKg: 0.1 })).toEqual({ ok: true, reason: null, kg: 500 })
  })

  it('refuses more packs than the tea left in the batch', () => {
    const result = bookingCheck({ batch, bookedKg: 1200, packs: 5000, packKg: 0.1 })
    expect(result.ok).toBe(false)
    expect(result.reason).toMatch(/280 kg/)
  })

  it('refuses a batch whose delivery reconciliation is flagged', () => {
    const result = bookingCheck({ batch: { ...batch, deliveryFlagged: true }, bookedKg: 0, packs: 100, packKg: 0.1 })
    expect(result.ok).toBe(false)
    expect(result.reason).toMatch(/delivery/i)
  })

  it('refuses a zero or fractional pack count', () => {
    expect(bookingCheck({ batch, bookedKg: 0, packs: 0, packKg: 0.1 }).ok).toBe(false)
    expect(bookingCheck({ batch, bookedKg: 0, packs: 12.5, packKg: 0.1 }).ok).toBe(false)
  })

  it('allows booking an unverified batch, since its code stays blocked until verified', () => {
    expect(bookingCheck({ batch: { ...batch, isVerified: false }, bookedKg: 0, packs: 100, packKg: 0.1 }).ok).toBe(true)
  })
})
