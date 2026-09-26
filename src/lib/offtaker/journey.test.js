import { describe, expect, test } from 'vitest'
import { findBatchRecord } from '../batchChain'
import { buildJourney } from './journey'

const verified = [
  { state: 'submitted', at: '2026-09-01', byRole: 'Clerk', byOrgId: 'org-ntzdc', independence: 'self' },
  { state: 'verified', at: '2026-09-02', byRole: 'Zone quality officer', byOrgId: 'org-ntzdc', independence: 'internal_separate' },
]
const base = {
  intake: { receivedKg: 100, acceptedKg: 90, rejectedKg: 10, verification: verified },
  delivery: { dayLots: 7, ticketsTotalKg: 90, weighedKg: 90, varianceKg: 0, varianceStatus: 'within_tolerance', signOffId: 'SGN-X', verification: verified },
  dispatchDocument: { verification: verified },
  commitment: null,
  centre: { name: 'Kiptunga' },
  preciseGeolocation: false,
  householdFloor: 10,
  getOrgName: () => 'NTZDC',
}

describe('buildJourney', () => {
  const record = findBatchRecord('TL-2026-00482')

  test('six stages in journey order', () => {
    const journey = buildJourney(record, base)
    expect(journey.stages.map((stage) => stage.key)).toEqual(['source', 'centre', 'delivery', 'processing', 'batch', 'buyer'])
  })

  test('fully traced when source to batch are verified; an unsold lot’s buyer stage is open', () => {
    const journey = buildJourney(record, base)
    expect(journey.fullyTraced).toBe(true)
    expect(journey.stages.at(-1).status).toBe('open')
  })

  test('a flagged delivery variance breaks full traceability and is listed as an exception', () => {
    const journey = buildJourney(record, { ...base, delivery: { ...base.delivery, varianceStatus: 'flagged' } })
    expect(journey.fullyTraced).toBe(false)
    expect(journey.exceptions).toEqual(['delivery'])
  })

  test('a missing intake record is not recorded, never assumed verified', () => {
    const journey = buildJourney(record, { ...base, intake: null })
    expect(journey.stages[1].status).toBe('not_recorded')
    expect(journey.fullyTraced).toBe(false)
  })

  test('a pending satellite check leaves the source stage pending', () => {
    const journey = buildJourney(findBatchRecord('TL-2026-00630'), base)
    expect(journey.stages[0].status).toBe('pending')
    expect(journey.stages[4].status).toBe('pending')
  })

  test('plot location precision follows the role', () => {
    const coarse = buildJourney(record, base).stages[0].rows.find((row) => row.k === 'Plot location').v
    const precise = buildJourney(record, { ...base, preciseGeolocation: true }).stages[0].rows.find((row) => row.k === 'Plot location').v
    expect(coarse).toBe('0.41° S, 35.62° E')
    expect(precise).toBe('0.415° S, 35.618° E')
  })

  test('a delivered commitment verifies the buyer stage', () => {
    const journey = buildJourney(record, { ...base, commitment: { id: 'CMT-1', reference: 'PO-1', status: 'delivered' } })
    expect(journey.stages.at(-1).status).toBe('verified')
  })
})
