import { describe, expect, test } from 'vitest'
import { getEvidenceChain } from './evidenceChain'

const record = (type) => ({ id: type, type })

describe('getEvidenceChain', () => {
  test('marks only the evidence types actually linked as present', () => {
    const chain = getEvidenceChain([record('gis'), record('field_audit')])
    const present = chain.filter((item) => item.present).map((item) => item.key)
    expect(present).toEqual(['gis', 'field_audit'])
  })

  test('never claims a photo that does not exist', () => {
    const chain = getEvidenceChain([record('satellite')])
    expect(chain.find((item) => item.key === 'photo')?.present).toBe(false)
  })

  test('shows extra evidence types only when present', () => {
    const withReview = getEvidenceChain([record('verification_document')])
    expect(withReview.some((item) => item.key === 'independent_review' && item.present)).toBe(true)
    const without = getEvidenceChain([])
    expect(without.some((item) => item.key === 'independent_review')).toBe(false)
  })

  test('counts duplicates of one type', () => {
    const chain = getEvidenceChain([record('photo'), record('photo')])
    expect(chain.find((item) => item.key === 'photo')?.count).toBe(2)
  })
})
