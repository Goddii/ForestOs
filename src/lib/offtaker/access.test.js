import { describe, expect, test } from 'vitest'
import { batchAccess, formatCoords, formatCount } from './access'

const commitments = [
  { offtakerOrgId: 'org-a', batchTraceIds: ['TL-1'], status: 'confirmed' },
  { offtakerOrgId: 'org-b', batchTraceIds: ['TL-2'], status: 'reserved' },
  { offtakerOrgId: 'org-a', batchTraceIds: ['TL-4'], status: 'cancelled' },
]

describe('batchAccess', () => {
  test('a batch on the buyer’s own commitment is allocated', () => {
    expect(batchAccess({ traceId: 'TL-1', brand: null, channel: 'direct_sold' }, 'org-a', commitments)).toBe('allocated')
  })
  test('a batch reserved by another buyer is hidden', () => {
    expect(batchAccess({ traceId: 'TL-2', brand: null, channel: 'direct_sold' }, 'org-a', commitments)).toBe('hidden')
  })
  test('an unsold lot on nobody’s commitment is available', () => {
    expect(batchAccess({ traceId: 'TL-3', brand: null, channel: 'direct_sold' }, 'org-a', commitments)).toBe('available')
  })
  test('a branded batch with no commitment for this buyer is someone else’s', () => {
    expect(batchAccess({ traceId: 'TL-3', brand: 'Other Co', channel: 'branded' }, 'org-a', commitments)).toBe('hidden')
  })
  test('a cancelled commitment releases the lot', () => {
    expect(batchAccess({ traceId: 'TL-4', brand: null, channel: 'direct_sold' }, 'org-b', commitments)).toBe('available')
  })
  test('auction volume and records without a trace id are never shown', () => {
    expect(batchAccess({ traceId: null, brand: null, channel: 'auction' }, 'org-a', commitments)).toBe('hidden')
  })
})

describe('formatCount', () => {
  test('suppresses counts below the floor', () => {
    expect(formatCount(7, 10)).toBe('fewer than 10')
    expect(formatCount(10, 10)).toBe('10')
    expect(formatCount(1240, 10)).toBe('1,240')
  })
})

describe('formatCoords', () => {
  test('rounds to ~1 km unless the role has plot geolocation', () => {
    expect(formatCoords(-0.4153, 35.6181, false)).toBe('0.42° S, 35.62° E')
    expect(formatCoords(-0.4153, 35.6181, true)).toBe('0.415° S, 35.618° E')
    expect(formatCoords(1.042, 35.402, true)).toBe('1.042° N, 35.402° E')
  })
})
