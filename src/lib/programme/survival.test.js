import { describe, expect, test } from 'vitest'
import { observationStatus, survivalRate } from './survival'

const TODAY = '2026-09-24'

const obs = (id, dueDate, observed) => ({
  id,
  activityId: `act-${id}`,
  kind: 'survival',
  monthsAfter: 3,
  dueDate,
  observedDate: observed ? '2026-07-20' : null,
  planted: observed ? observed.planted : null,
  surviving: observed ? observed.surviving : null,
})

describe('observationStatus', () => {
  test('is observed once counted, whatever the date', () => {
    expect(observationStatus(obs('a', '2026-07-15', { planted: 100, surviving: 90 }), TODAY)).toBe('observed')
  })

  test('is overdue when the due date has passed without a count', () => {
    expect(observationStatus(obs('b', '2026-09-01', null), TODAY)).toBe('overdue')
  })

  test('is scheduled when still in the future', () => {
    expect(observationStatus(obs('c', '2026-11-30', null), TODAY)).toBe('scheduled')
  })
})

describe('survivalRate', () => {
  test('pools counts rather than averaging percentages', () => {
    const rows = [
      obs('a', '2026-07-15', { planted: 1000, surviving: 900 }),
      obs('b', '2026-07-15', { planted: 100, surviving: 50 }),
    ]
    expect(survivalRate(rows)).toEqual({ planted: 1100, surviving: 950, pct: 86 })
  })

  test('ignores checks that have not happened and returns null when none have', () => {
    expect(survivalRate([obs('c', '2026-11-30', null)])).toBeNull()
  })
})
