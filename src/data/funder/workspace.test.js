import { describe, expect, test } from 'vitest'
import { buildWorkspace } from './workspace'
import { FUNDING_AGREEMENTS } from './agreements'
import { ACTIVITY_RECORDS } from './activities'
import { SURVIVAL_OBSERVATIONS } from './observations'
import { EXPENDITURES } from '../investor/expenditures'
import { EVIDENCE_RECORDS } from '../investor/evidence'
import { validateHistory } from '../../lib/programme/verificationState'

const ALLOCATION_IDS = new Set(FUNDING_AGREEMENTS.flatMap((agreement) => agreement.allocations.map((a) => a.id)))
const EVIDENCE_IDS = new Set(EVIDENCE_RECORDS.map((record) => record.id))
const ACTIVITY_IDS = new Set(ACTIVITY_RECORDS.map((activity) => activity.id))

describe('seed integrity', () => {
  test('every ledger row belongs to a funding-agreement allocation', () => {
    expect(EXPENDITURES.filter((row) => !ALLOCATION_IDS.has(row.categoryId))).toEqual([])
  })

  test('every activity belongs to an allocation and cites existing evidence', () => {
    for (const activity of ACTIVITY_RECORDS) {
      expect(ALLOCATION_IDS.has(activity.allocationId), activity.id).toBe(true)
      for (const id of activity.evidenceIds) expect(EVIDENCE_IDS.has(id), `${activity.id} → ${id}`).toBe(true)
    }
  })

  test('ledger rows and survival checks point at real activities', () => {
    for (const row of EXPENDITURES) {
      for (const id of row.activityIds) expect(ACTIVITY_IDS.has(id), `${row.id} → ${id}`).toBe(true)
    }
    for (const check of SURVIVAL_OBSERVATIONS) expect(ACTIVITY_IDS.has(check.activityId), check.id).toBe(true)
  })

  test('every verification history obeys the state machine', () => {
    for (const activity of ACTIVITY_RECORDS) {
      expect(validateHistory(activity.verification), activity.id).toEqual({ valid: true, errors: [] })
    }
  })
})

describe('buildWorkspace', () => {
  test('returns null for unknown slugs and for organisations that are not funders', () => {
    expect(buildWorkspace('nobody')).toBeNull()
    expect(buildWorkspace('ntzdc')).toBeNull()
  })

  test('two funders partition the programme ledger with no overlap', () => {
    const a = buildWorkspace('funder-a').capital.expenditures.map((row) => row.id)
    const b = buildWorkspace('funder-b').capital.expenditures.map((row) => row.id)
    expect(a.filter((id) => b.includes(id))).toEqual([])
    expect(a.length + b.length).toBe(EXPENDITURES.length)
  })

  test('Funder A never spends more than it has received', () => {
    const { position } = buildWorkspace('funder-a').capital
    expect(position).toMatchObject({ committed: 18_000_000, received: 9_000_000, deployed: 8_800_000, verified: 6_120_000 })
    expect(position.deployed).toBeLessThanOrEqual(position.received)
  })

  test('Funder B keeps the original console’s ledger totals', () => {
    expect(buildWorkspace('funder-b').capital.position).toMatchObject({
      committed: 50_000_000,
      received: 40_000_000,
      deployed: 31_400_000,
      verified: 29_800_000,
    })
  })

  test('a funder sees no staff ids or reviewer notes', () => {
    for (const activity of buildWorkspace('funder-a').activities) {
      expect(activity).not.toHaveProperty('recordedBy')
      for (const event of activity.verification) expect(event).not.toHaveProperty('note')
    }
  })

  test('small household groups are suppressed', () => {
    const blockC = buildWorkspace('funder-a').activities.find((activity) => activity.id === 'act-a-06')
    expect(blockC.beneficiaries).toEqual({ households: null, womenHeaded: null, suppressed: true })
  })

  test('tea infill counts only verified work as verified, and only this funder’s as funded', () => {
    const tea = (slug) => buildWorkspace(slug).progress.find((row) => row.indicator.id === 'ind-tea-ha')
    expect(tea('funder-a')).toMatchObject({ verified: 14.5, reported: 23.5, fundedVerified: 14.5 })
    expect(tea('funder-b').fundedVerified).toBe(0)
  })

  test('survival outcomes come from counts, and missing checks stay missing', () => {
    const outcome = (id) => buildWorkspace('funder-a').outcomes.find((row) => row.indicator.id === id)
    expect(outcome('out-tree-survival-3m').funded).toBe(86)
    expect(outcome('out-tea-establishment-3m').funded).toBe(91)
    expect(outcome('out-tree-survival-12m').programme).toBeNull()
  })

  test('language follows the funding type, structure does not', () => {
    const a = buildWorkspace('funder-a')
    const b = buildWorkspace('funder-b')
    expect(a.terms.showsAttribution).toBe(false)
    expect(b.terms.showsAttribution).toBe(true)
    expect(Object.keys(a).sort()).toEqual(Object.keys(b).sort())
  })

  test('reports are scoped to the funder’s agreement', () => {
    expect(buildWorkspace('funder-a').reports.every((report) => report.agreementIds.includes('agr-funder-a'))).toBe(true)
  })
})
