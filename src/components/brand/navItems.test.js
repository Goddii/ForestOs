import { expect, test } from 'vitest'
import { NAV_ITEMS, sectionFor } from './navItems'

test('the portal has the twelve sections of the brief, each once', () => {
  expect(NAV_ITEMS).toHaveLength(12)
  expect(new Set(NAV_ITEMS.map((item) => item.sub)).size).toBe(12)
})

test('sectionFor resolves nested paths to their section', () => {
  expect(sectionFor('/brand/kilele', '/brand/kilele').label).toBe('Brand overview')
  expect(sectionFor('/brand/kilele/experiences/exp-kil-mau', '/brand/kilele').label).toBe('QR experiences')
  expect(sectionFor('/brand/kilele/products/new', '/brand/kilele').label).toBe('Products')
  expect(sectionFor('/brand/kilele/nope', '/brand/kilele')).toBeNull()
})
