import { describe, expect, test } from 'vitest'
import { findBatchRecord } from '../../lib/batchChain'
import { COMMITMENTS } from '../offtaker/commitments'
import { buildOfftakerWorkspace } from '../offtaker/workspace'
import { BRAND_ORGANISATIONS } from '../funder/organisations'
import { SOURCING } from './sourcing'
import { BRAND_EXPERIENCES } from './experiences'
import { buildBrandWorkspace } from './workspace'

describe('shared records stay consistent with the Offtaker Portal', () => {
  test('every lot a brand packs from is on its packer’s own commitments', () => {
    const packerLots = new Set(COMMITMENTS.filter((c) => c.offtakerOrgId === 'org-offtaker-rvt').flatMap((c) => c.batchTraceIds))
    for (const record of SOURCING) expect(packerLots.has(record.batchTraceId)).toBe(true)
  })

  test('no lot is allocated beyond the made tea it holds', () => {
    const used = {}
    for (const record of SOURCING) used[record.batchTraceId] = (used[record.batchTraceId] ?? 0) + record.allocatedKg
    for (const [traceId, kg] of Object.entries(used)) expect(kg).toBeLessThanOrEqual(findBatchRecord(traceId).batch.madeTeaKg)
  })

  test('the packer still sees the brand lots as its own allocated batches', () => {
    const packer = buildOfftakerWorkspace('rift-valley-tea')
    const allocated = new Set(packer.allocated.map((batch) => batch.traceId))
    for (const record of SOURCING.filter((r) => r.status === 'packed')) expect(allocated.has(record.batchTraceId)).toBe(true)
  })
})

describe('buildBrandWorkspace', () => {
  test('builds a workspace for every brand and nothing else', () => {
    for (const org of BRAND_ORGANISATIONS) expect(buildBrandWorkspace(org.slug)).not.toBeNull()
    expect(buildBrandWorkspace('rift-valley-tea')).toBeNull()
    expect(buildBrandWorkspace('nope')).toBeNull()
  })

  test('a brand never receives another brand’s records', () => {
    const ws = buildBrandWorkspace('kilele-coffee-house')
    for (const list of [ws.products, ws.campaigns, ws.experiences, ws.content, ws.uploads]) {
      expect(list.every((item) => item.brandOrgId === 'org-brand-kilele')).toBe(true)
    }
    expect(ws.scanDays.every((day) => day.experienceId.startsWith('exp-kil'))).toBe(true)
  })

  test('falls back to the default role for an unknown one', () => {
    expect(buildBrandWorkspace('kilele-coffee-house', 'owner').role).toBe('brand_lead')
    expect(buildBrandWorkspace('kilele-coffee-house', 'agency').permissions.publishExperiences).toBe(false)
  })

  test('Kilele’s Mau tea is backed by verified Kiptunga work; Halden’s Mount Kenya tea is not', () => {
    const kilele = buildBrandWorkspace('kilele-coffee-house')
    const mau = kilele.products.find((p) => p.id === 'prd-kil-mau-black')
    expect(mau.evidence.metrics.map((m) => m.id)).toContain('ind-seedlings')
    const halden = buildBrandWorkspace('halden-grand')
    const afternoon = halden.products.find((p) => p.id === 'prd-hg-afternoon')
    expect(afternoon.evidence.metrics).toEqual([])
    expect(afternoon.claims.find((c) => c.id === 'clm-hg-02').assessment.status).toBe('not_supported')
    expect(afternoon.claims.find((c) => c.id === 'clm-hg-01').assessment.status).toBe('approved')
  })

  test('published experiences only show approved statements', () => {
    for (const org of BRAND_ORGANISATIONS) {
      const ws = buildBrandWorkspace(org.slug)
      for (const experience of ws.experiences.filter((e) => e.status === 'published')) {
        expect(experience.readiness.canPublish).toBe(true)
      }
    }
  })

  test('session drafts appear across the workspace without touching the seed data', () => {
    const before = BRAND_EXPERIENCES.find((e) => e.id === 'exp-kil-chai').status
    const ws = buildBrandWorkspace('kilele-coffee-house', undefined, {
      products: [{ id: 'prd-new-1', brandOrgId: 'org-brand-kilele', name: 'Test', status: 'draft', launchDate: null }],
      sourcing: [{ id: 'src-new-1', productId: 'prd-new-1', batchTraceId: 'TL-2026-00611', allocatedKg: 100, status: 'scheduled', date: '2026-10-06' }],
      experienceEdits: { 'exp-kil-chai': { status: 'published', publishedAt: '2026-09-24' } },
    })
    expect(ws.products.find((p) => p.id === 'prd-new-1').lots[0].traceId).toBe('TL-2026-00611')
    expect(ws.experiences.find((e) => e.id === 'exp-kil-chai').status).toBe('published')
    expect(BRAND_EXPERIENCES.find((e) => e.id === 'exp-kil-chai').status).toBe(before)
  })

  test('design requests are scoped to the brand and include the session’s new requests', () => {
    const request = { id: 'dr-new-1', brandOrgId: 'org-brand-kilele', productIds: ['prd-kil-chai'], status: 'received', submittedAt: '2026-09-24' }
    const kilele = buildBrandWorkspace('kilele-coffee-house', undefined, { designRequests: [request] })
    expect(kilele.designRequests.map((r) => r.id)).toEqual(['dr-new-1'])
    expect(kilele.designRequests[0].products.map((p) => p.name)).toEqual(['House Chai'])
    const maraCrest = buildBrandWorkspace('mara-crest-hotels', undefined, { designRequests: [request] })
    expect(maraCrest.designRequests.every((r) => r.brandOrgId === 'org-brand-maracrest')).toBe(true)
    expect(maraCrest.designRequests.length).toBeGreaterThan(0)
  })

  test('remaining volume on a lot accounts for every brand’s allocations', () => {
    const ws = buildBrandWorkspace('mara-crest-hotels')
    const lot = ws.availableLots.find((l) => l.traceId === 'TL-2026-00482')
    expect(lot.remainingKg).toBe(1840 - 420 - 380)
  })
})
