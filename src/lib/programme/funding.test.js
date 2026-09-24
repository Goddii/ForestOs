import { describe, expect, test } from 'vitest'
import { agreementExpenditures, agreementUseOfFunds, buildCapitalPosition, trancheTotals } from './funding'

const AGREEMENT = {
  id: 'agr-a',
  amountKes: 1_000_000,
  tranches: [
    { id: 't1', plannedKes: 600_000, receivedKes: 600_000, receivedDate: '2026-03-01' },
    { id: 't2', plannedKes: 400_000, receivedKes: null, receivedDate: null },
  ],
  allocations: [
    { id: 'alloc-x', label: 'X', componentId: 'c1', budgetKes: 700_000, allocatedKes: 500_000, outputs: [], outcomeIds: [] },
    { id: 'alloc-y', label: 'Y', componentId: 'c2', budgetKes: 300_000, allocatedKes: 100_000, outputs: [], outcomeIds: [] },
  ],
}

const EXPENDITURES = [
  { id: 'e1', categoryId: 'alloc-x', amount: 200_000, status: 'verified', date: '2026-04-01', evidenceIds: [] },
  { id: 'e2', categoryId: 'alloc-y', amount: 50_000, status: 'pending_verification', date: '2026-05-01', evidenceIds: [] },
  { id: 'e3', categoryId: 'other-funder', amount: 999_999, status: 'verified', date: '2026-05-01', evidenceIds: [] },
]

describe('trancheTotals', () => {
  test('separates planned from actually received money', () => {
    expect(trancheTotals(AGREEMENT.tranches)).toEqual({ planned: 1_000_000, received: 600_000, outstanding: 400_000 })
  })
})

describe('agreementExpenditures', () => {
  test('keeps only this agreement’s ledger rows', () => {
    expect(agreementExpenditures(AGREEMENT, EXPENDITURES).map((row) => row.id)).toEqual(['e1', 'e2'])
  })
})

describe('buildCapitalPosition', () => {
  test('derives every figure from the agreement and its own ledger rows', () => {
    expect(buildCapitalPosition(AGREEMENT, EXPENDITURES)).toEqual({
      committed: 1_000_000,
      received: 600_000,
      allocated: 600_000,
      deployed: 250_000,
      verified: 200_000,
      currency: 'KSh',
    })
  })
})

describe('agreementUseOfFunds', () => {
  test('rolls ledger rows up per allocation with its share of the agreement', () => {
    const [x, y] = agreementUseOfFunds(AGREEMENT, EXPENDITURES)
    expect(x).toMatchObject({ id: 'alloc-x', category: 'X', budget: 700_000, deployed: 200_000, verified: 200_000, percentage: 70 })
    expect(y).toMatchObject({ id: 'alloc-y', deployed: 50_000, verified: 0, pendingVerification: 50_000, percentage: 30 })
  })
})
