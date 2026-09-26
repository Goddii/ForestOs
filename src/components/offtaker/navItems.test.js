import { expect, test } from 'vitest'
import { NAV_ITEMS, sectionFor } from './navItems'

test('the portal has the thirteen sections of the brief, each once', () => {
  expect(NAV_ITEMS).toHaveLength(13)
  expect(new Set(NAV_ITEMS.map((item) => item.sub)).size).toBe(13)
})

test('sectionFor resolves nested paths to their section', () => {
  expect(sectionFor('/offtaker/rvt', '/offtaker/rvt').label).toBe('Overview')
  expect(sectionFor('/offtaker/rvt/batches/TL-2026-00482', '/offtaker/rvt').label).toBe('Batches')
  expect(sectionFor('/offtaker/rvt/nope', '/offtaker/rvt')).toBeNull()
})
