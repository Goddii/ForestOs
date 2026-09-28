import { describe, expect, it } from 'vitest'
import {
  applyCreativeEdit,
  destinationPath,
  experienceStats,
  findFigureClaims,
  isSafeHttpUrl,
  moveSection,
  packCodeState,
  publishReadiness,
  toggleSection,
} from './experience'

const template = {
  id: 'tpl-x',
  route: '/majani/nyashinski',
  sections: [
    { key: 'hook', label: 'Hook', layer: 'creative' },
    { key: 'origin', label: 'Origin', layer: 'verified' },
    { key: 'community', label: 'Community', layer: 'creative' },
  ],
}

const creative = {
  headline: 'Good music grows better forests.',
  subline: '',
  heroAssetId: 'cr-portrait',
  narrative: 'Scan, listen, then see where your tea grew.',
  sectionOrder: ['hook', 'origin', 'community'],
  hiddenSections: [],
  musicLink: null,
  ctas: [{ id: 'cta-1', label: 'Listen', href: 'https://open.spotify.com/artist/x', kind: 'spotify' }],
  statementIds: [],
}

describe('applyCreativeEdit', () => {
  it('applies creative fields and returns a new object', () => {
    const { creative: next, rejected } = applyCreativeEdit(creative, { headline: 'New headline' })
    expect(next.headline).toBe('New headline')
    expect(creative.headline).toBe('Good music grows better forests.')
    expect(rejected).toEqual([])
  })

  it('rejects verified fields such as hectares and verification status', () => {
    const { creative: next, rejected } = applyCreativeEdit(creative, { hectares: 99, verificationStatus: 'Verified', headline: 'Ok' })
    expect(rejected).toEqual(['hectares', 'verificationStatus'])
    expect(next).not.toHaveProperty('hectares')
    expect(next.headline).toBe('Ok')
  })
})

describe('findFigureClaims', () => {
  it('finds impact figures typed into creative copy', () => {
    expect(findFigureClaims('We planted 5,000 trees and saved 12 ha of forest')).toEqual(['5,000 trees', '12 ha'])
  })

  it('ignores numbers that are not impact figures', () => {
    expect(findFigureClaims('Tour starts 12 October, doors at 7pm')).toEqual([])
  })

  it('finds percentages and hectares written out', () => {
    expect(findFigureClaims('Canopy up 40% across 3.2 hectares')).toEqual(['40%', '3.2 hectares'])
  })
})

describe('isSafeHttpUrl', () => {
  it('accepts https and http links', () => {
    expect(isSafeHttpUrl('https://open.spotify.com/artist/x')).toBe(true)
    expect(isSafeHttpUrl('http://example.com')).toBe(true)
  })

  it('rejects scripts, relative paths and garbage', () => {
    expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false)
    expect(isSafeHttpUrl('/relative')).toBe(false)
    expect(isSafeHttpUrl('not a url')).toBe(false)
    expect(isSafeHttpUrl('')).toBe(false)
  })
})

describe('moveSection', () => {
  it('moves a section up without mutating the order', () => {
    const order = ['hook', 'origin', 'community']
    expect(moveSection(order, 'community', -1)).toEqual(['hook', 'community', 'origin'])
    expect(order).toEqual(['hook', 'origin', 'community'])
  })

  it('leaves the order alone at the edges', () => {
    expect(moveSection(['a', 'b'], 'a', -1)).toEqual(['a', 'b'])
    expect(moveSection(['a', 'b'], 'b', 1)).toEqual(['a', 'b'])
  })
})

describe('toggleSection', () => {
  it('hides and shows creative sections', () => {
    expect(toggleSection([], 'community', template)).toEqual(['community'])
    expect(toggleSection(['community'], 'community', template)).toEqual([])
  })

  it('never hides a verified section', () => {
    expect(toggleSection([], 'origin', template)).toEqual([])
  })
})

describe('publishReadiness', () => {
  it('is ready with a headline, hero, a safe CTA and no typed figures', () => {
    const result = publishReadiness({ creative }, template)
    expect(result.ready).toBe(true)
  })

  it('blocks publishing when creative copy states its own impact figures', () => {
    const result = publishReadiness({ creative: { ...creative, narrative: 'We restored 20 hectares.' } }, template)
    expect(result.ready).toBe(false)
    expect(result.checks.find((check) => check.id === 'figures').ok).toBe(false)
  })

  it('blocks publishing with no CTA or an unsafe link', () => {
    expect(publishReadiness({ creative: { ...creative, ctas: [] } }, template).ready).toBe(false)
    const unsafe = { ...creative, ctas: [{ id: 'c', label: 'Go', href: 'javascript:alert(1)', kind: 'website' }] }
    expect(publishReadiness({ creative: unsafe }, template).ready).toBe(false)
  })

  it('blocks publishing with no headline', () => {
    expect(publishReadiness({ creative: { ...creative, headline: '  ' } }, template).ready).toBe(false)
  })
})

describe('destinationPath', () => {
  it('points the code at the template route with the campaign code', () => {
    expect(destinationPath(template, { shortCode: 'guardian' })).toBe('/majani/nyashinski?c=guardian')
  })

  it('carries the batch on a pack code so each scan opens that batch', () => {
    expect(destinationPath(template, { shortCode: 'anthem' }, '921')).toBe('/majani/nyashinski?c=anthem&batch=921')
  })
})

describe('packCodeState', () => {
  const code = { status: 'packed' }

  it('is live only when the batch is verified, the packs exist and the experience is published', () => {
    expect(packCodeState(code, { experienceStatus: 'published', batchVerified: true })).toBe('live')
  })

  it('is blocked while the batch is not verified, whatever else is true', () => {
    expect(packCodeState(code, { experienceStatus: 'published', batchVerified: false })).toBe('blocked')
    expect(packCodeState({ status: 'scheduled' }, { experienceStatus: 'draft', batchVerified: false })).toBe('blocked')
  })

  it('is a proof while the experience is not published', () => {
    expect(packCodeState(code, { experienceStatus: 'preview', batchVerified: true })).toBe('proof')
  })

  it('is scheduled when the batch is verified but not packed yet', () => {
    expect(packCodeState({ status: 'scheduled' }, { experienceStatus: 'published', batchVerified: true })).toBe('scheduled')
  })
})

describe('experienceStats', () => {
  const records = [
    { experienceId: 'e1', date: '2026-09-01', scans: 100, uniqueDevices: 80 },
    { experienceId: 'e1', date: '2026-09-02', scans: 0, uniqueDevices: 0 },
    { experienceId: 'e2', date: '2026-09-03', scans: 50, uniqueDevices: 40 },
  ]
  const engagement = { e1: { reachedStoryRate: 0.5, links: { spotify: 0.2, social: 0.1, community: 0, website: 0 } } }

  it('totals scans, visitors, story reach and link taps for one experience', () => {
    expect(experienceStats(records, engagement, 'e1')).toEqual({
      scans: 100,
      visitors: 80,
      reachedStory: 50,
      clicks: { spotify: 20, social: 10, community: 0, website: 0 },
      ctaClicks: 30,
      lastScan: '2026-09-01',
    })
  })

  it('returns zeros and no last scan for an unpublished experience', () => {
    expect(experienceStats(records, engagement, 'e9')).toEqual({
      scans: 0,
      visitors: 0,
      reachedStory: 0,
      clicks: { spotify: 0, social: 0, community: 0, website: 0 },
      ctaClicks: 0,
      lastScan: null,
    })
  })
})
