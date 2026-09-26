import { describe, expect, test } from 'vitest'
import { claimsRepeatedIn, publishReadiness } from './publish'

test('claimsRepeatedIn finds claims a story repeats, ignoring case and the full stop', () => {
  const claims = [{ statement: 'Every tin plants a tree.' }, { statement: 'Grown on the edge of the Mau.' }]
  expect(claimsRepeatedIn('New in store. every tin plants a tree! Come by.', claims)).toEqual([claims[0]])
  expect(claimsRepeatedIn('', claims)).toEqual([])
})

const ready = {
  productId: 'prd-1',
  batchTraceId: 'TL-1',
  customisation: {
    title: 'Mau Mornings',
    story: 'A story.',
    metricIds: ['ind-seedlings'],
    cta: { label: 'Visit', href: 'https://example.com' },
  },
}
const context = {
  products: [{ id: 'prd-1' }],
  lotStatus: () => 'Verified',
  approvedMetricIds: new Set(['ind-seedlings']),
  claimsInStory: [],
}

const failing = (result) => result.checks.filter((check) => !check.ok).map((check) => check.key)

describe('publishReadiness', () => {
  test('a complete experience on a verified lot can be published', () => {
    const result = publishReadiness(ready, context)
    expect(result.canPublish).toBe(true)
    expect(failing(result)).toEqual([])
  })

  test('needs a product and a lot', () => {
    expect(failing(publishReadiness({ ...ready, productId: null, batchTraceId: null }, context))).toEqual(['product', 'batch'])
  })

  test('the connected lot must be verified', () => {
    const result = publishReadiness(ready, { ...context, lotStatus: () => 'Pending' })
    expect(result.canPublish).toBe(false)
    expect(failing(result)).toEqual(['batch'])
  })

  test('every impact statement shown must still be approved for this product', () => {
    const result = publishReadiness(ready, { ...context, approvedMetricIds: new Set() })
    expect(failing(result)).toEqual(['metrics'])
  })

  test('a story that repeats an unapproved claim blocks publishing', () => {
    const result = publishReadiness(ready, { ...context, claimsInStory: [{ status: 'not_supported' }] })
    expect(failing(result)).toEqual(['claims'])
  })

  test('every optional link must be a web address, so no javascript: or data: URL can be published', () => {
    const risky = { ...ready, customisation: { ...ready.customisation, musicLink: 'javascript:alert(1)', socialLinks: [{ network: 'X', href: 'https://x.test' }] } }
    expect(failing(publishReadiness(risky, context))).toEqual(['links'])
  })

  test('title, story and a working call to action are required', () => {
    const blank = { ...ready, customisation: { ...ready.customisation, title: ' ', story: '', cta: { label: 'Go', href: '' } } }
    expect(failing(publishReadiness(blank, context))).toEqual(['title', 'story', 'cta'])
  })
})
