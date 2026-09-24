import { describe, expect, test } from 'vitest'
import { projectActivity } from './disclosure'

const POLICY = { id: 'dp', householdFloor: 10, geoPrecision: 'segment', visible: [], withheld: [] }

const ACTIVITY = {
  id: 'act-1',
  recordedBy: 'SUP-KIP-02',
  beneficiaries: { households: 42, womenHeaded: 17 },
  verification: [
    { state: 'submitted', at: '2026-09-01', byRole: 'Field supervisor', byOrgId: 'org-ntzdc', independence: 'self', note: 'Filed by J. Chirchir' },
  ],
}

describe('projectActivity', () => {
  test('strips the internal recorder id', () => {
    expect(projectActivity(ACTIVITY, POLICY)).not.toHaveProperty('recordedBy')
  })

  test('keeps household counts at or above the floor', () => {
    expect(projectActivity(ACTIVITY, POLICY).beneficiaries).toEqual({ households: 42, womenHeaded: 17, suppressed: false })
  })

  test('suppresses household counts below the floor', () => {
    const small = { ...ACTIVITY, beneficiaries: { households: 4, womenHeaded: 2 } }
    expect(projectActivity(small, POLICY).beneficiaries).toEqual({ households: null, womenHeaded: null, suppressed: true })
  })

  test('drops free-text verification notes, which can carry names', () => {
    expect(projectActivity(ACTIVITY, POLICY).verification[0]).not.toHaveProperty('note')
  })

  test('does not mutate the source record', () => {
    projectActivity(ACTIVITY, POLICY)
    expect(ACTIVITY.recordedBy).toBe('SUP-KIP-02')
  })
})
