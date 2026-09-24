import { describe, expect, test } from 'vitest'
import { getAttentionItems } from './attention'
import { buildWorkspace } from '../../data/funder/workspace'

const KINDS = ['overdue', 'correction', 'risk']

describe('getAttentionItems', () => {
  const items = getAttentionItems(buildWorkspace('funder-a'))

  test('tags every item with a known kind and a short summary', () => {
    expect(items.length).toBeGreaterThan(0)
    for (const item of items) {
      expect(KINDS).toContain(item.kind)
      expect(item.summary).toBeTruthy()
      expect(item.to).toBe('/funder/funder-a/issues')
    }
  })

  test('lists overdue checks first, then corrections, then risks', () => {
    const order = items.map((item) => KINDS.indexOf(item.kind))
    expect(order).toEqual(order.toSorted((a, b) => a - b))
  })
})
