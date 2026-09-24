import { describe, expect, test } from 'vitest'
import { sectionFor } from './navItems'

describe('sectionFor', () => {
  const base = '/funder/funder-a'

  test('returns the nav item for the current page', () => {
    expect(sectionFor(`${base}/funding`, base).label).toBe('Funding')
    expect(sectionFor(`${base}/issues`, base).label).toBe('Issues & risks')
  })

  test('treats the workspace root as the overview', () => {
    expect(sectionFor(base, base).label).toBe('Overview')
    expect(sectionFor(`${base}/`, base).label).toBe('Overview')
  })

  test('marks pages that already render their own visible title', () => {
    expect(sectionFor(base, base).hasVisibleTitle).toBe(true)
    expect(sectionFor(`${base}/programme`, base).hasVisibleTitle).toBe(true)
    expect(sectionFor(`${base}/progress`, base).hasVisibleTitle).toBeFalsy()
  })

  test('returns null for an unknown sub-page', () => {
    expect(sectionFor(`${base}/nope`, base)).toBeNull()
  })
})
