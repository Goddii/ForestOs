import { describe, expect, test } from 'vitest'
import { assessClaim, buildEvidenceBase, summariseAssessments } from './claims'

// Synthetic fixtures: two lots from one centre linked to two buffer segments.
const centre = { id: 'CC-A', name: 'Alpha', blockId: 'A', segmentIds: ['seg-1', 'seg-2'] }
const lot = (id, status = 'Verified') => ({
  id,
  traceId: `TL-${id}`,
  block: { id: 'A', name: 'Alpha Block' },
  land: { name: 'Test Forest', region: 'Test Region' },
  verification: { status },
})
const verified = [{ state: 'verified', at: '2026-08-01', byRole: 'M&E', byOrgId: 'org-ntzdc', independence: 'internal_separate' }]
const reviewing = [{ state: 'under_review', at: '2026-08-01', byRole: 'M&E', byOrgId: 'org-ntzdc', independence: 'internal_separate' }]
const activity = (id, interventionTypeId, segmentId, outputs, history = verified, evidenceIds = [`ev-${id}`]) => ({
  id,
  interventionTypeId,
  segmentId,
  outputs,
  verification: history,
  evidenceIds,
  summary: id,
  date: '2026-07-01',
})
const deps = {
  centreForBatch: (record) => (record.block.id === 'A' ? centre : null),
  indicatorLabel: (id) => id,
}

const activities = [
  activity('plant', 'it-indigenous', 'seg-1', [{ indicatorId: 'ind-seedlings', value: 4200 }]),
  activity('patrol', 'it-patrol', 'seg-2', [{ indicatorId: 'ind-patrols', value: 156 }]),
  activity('infill', 'it-tea-infill', 'seg-1', [{ indicatorId: 'ind-tea-ha', value: 9 }], reviewing),
  activity('elsewhere', 'it-fuelwood', 'seg-9', [{ indicatorId: 'ind-fuelwood-ha', value: 18 }]),
  activity('onboard', 'it-onboarding', 'seg-1', [{ indicatorId: 'ind-farmers-onboarded', value: 80 }]),
]

const base = buildEvidenceBase([lot('1'), lot('2')], activities, deps)
const emptyBase = buildEvidenceBase([{ ...lot('3'), block: { id: 'Z', name: 'Zeta Block' } }], activities, deps)

describe('buildEvidenceBase', () => {
  test('keeps only conservation activities in segments linked to the lots’ centres', () => {
    expect(base.verified.map((a) => a.id)).toEqual(['plant', 'patrol'])
    expect(base.pending.map((a) => a.id)).toEqual(['infill'])
  })

  test('sums verified outputs into approved metrics with their evidence', () => {
    const seedlings = base.metrics.find((metric) => metric.id === 'ind-seedlings')
    expect(seedlings.value).toBe(4200)
    expect(seedlings.evidenceIds).toEqual(['ev-plant'])
    expect(seedlings.wording).toMatch(/4,200/)
    expect(base.metrics.some((metric) => metric.id === 'ind-tea-ha')).toBe(false)
  })

  test('lists metrics still under review separately, never as approved', () => {
    expect(base.pendingMetrics.map((metric) => metric.id)).toEqual(['ind-tea-ha'])
  })

  test('a lot from a centre with no linked segments has no evidence', () => {
    expect(emptyBase.verified).toEqual([])
    expect(emptyBase.metrics).toEqual([])
  })
})

describe('assessClaim', () => {
  test('the brief’s example: a general landscape claim is supported by the verified work behind it', () => {
    const result = assessClaim({ type: 'landscape_support' }, base)
    expect(result.status).toBe('approved')
    expect(result.evidenceIds).toEqual(['ev-plant', 'ev-patrol'])
    expect(result.approvedWording).toMatch(/4,200/)
  })

  test('a landscape claim with no linked verified work cannot be made', () => {
    expect(assessClaim({ type: 'landscape_support' }, emptyBase).status).toBe('not_supported')
  })

  test('origin is approved only when every lot is verified', () => {
    expect(assessClaim({ type: 'origin' }, base).status).toBe('approved')
    const mixed = buildEvidenceBase([lot('1'), lot('4', 'Pending')], activities, deps)
    expect(assessClaim({ type: 'origin' }, mixed).status).toBe('in_review')
  })

  test('an intervention claim follows the state of that intervention’s records', () => {
    expect(assessClaim({ type: 'intervention', interventionTypeIds: ['it-patrol'] }, base).status).toBe('approved')
    expect(assessClaim({ type: 'intervention', interventionTypeIds: ['it-tea-infill'] }, base).status).toBe('in_review')
    expect(assessClaim({ type: 'intervention', interventionTypeIds: ['it-fuelwood'] }, base).status).toBe('not_supported')
  })

  test('a figure above the verified total needs rewording to the verified figure', () => {
    const result = assessClaim({ type: 'metric', indicatorId: 'ind-seedlings', value: 5000 }, base)
    expect(result.status).toBe('reword')
    expect(result.approvedWording).toMatch(/4,200/)
  })

  test('a figure at or below the verified total is approved', () => {
    expect(assessClaim({ type: 'metric', indicatorId: 'ind-seedlings', value: 4200 }, base).status).toBe('approved')
  })

  test('claiming the brand did the work needs rewording even when the figure is right', () => {
    const result = assessClaim({ type: 'metric', indicatorId: 'ind-seedlings', value: 4200, byBrand: true }, base)
    expect(result.status).toBe('reword')
    expect(result.reason).toMatch(/NTZDC/)
  })

  test('per-pack and carbon claims cannot be made yet', () => {
    expect(assessClaim({ type: 'per_unit' }, base).status).toBe('not_supported')
    expect(assessClaim({ type: 'carbon' }, base).status).toBe('not_supported')
  })

  test('a per-pack claim offers the landscape wording as the alternative when one exists', () => {
    expect(assessClaim({ type: 'per_unit' }, base).approvedWording).toMatch(/4,200/)
    expect(assessClaim({ type: 'per_unit' }, emptyBase).approvedWording).toBeNull()
  })
})

test('summariseAssessments counts each status', () => {
  const summary = summariseAssessments([{ status: 'approved' }, { status: 'approved' }, { status: 'reword' }])
  expect(summary).toEqual({ approved: 2, reword: 1, in_review: 0, not_supported: 0 })
})
