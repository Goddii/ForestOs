import { describe, expect, it } from 'vitest'
import { buildCreatorWorkspace } from './workspace'

describe('buildCreatorWorkspace', () => {
  it('returns null for an unknown creator', () => {
    expect(buildCreatorWorkspace('nobody')).toBeNull()
  })

  it('leads with the two strongest campaigns, live and published', () => {
    const workspace = buildCreatorWorkspace('nyashinski')
    expect(workspace.campaigns.slice(0, 2).map((entry) => entry.title)).toEqual(['The Living Anthem', 'The Sound of the Shield'])
    workspace.campaigns.slice(0, 2).forEach((campaign) => {
      expect(campaign.status).toBe('live')
      campaign.experiences.forEach((experience) => {
        expect(experience.status).toBe('published')
        expect(experience.stats.scans).toBeGreaterThan(0)
      })
    })
  })

  it('keeps the Nyashinski × Nyayo Tea Zone campaign in preview, unpublished and unscanned', () => {
    const workspace = buildCreatorWorkspace('nyashinski')
    const campaign = workspace.campaigns.find((entry) => entry.title === 'Nyashinski × Nyayo Tea Zone')
    expect(campaign.status).toBe('preview')
    expect(campaign.launchedAt).toBeNull()
    campaign.experiences.forEach((experience) => {
      expect(experience.status).toBe('preview')
      expect(experience.publishedAt).toBeNull()
      expect(experience.stats.scans).toBe(0)
    })
    expect(campaign.experiences.find((entry) => entry.id === 'exp-guardian').template.route).toBe('/majani/nyashinski')
  })

  it('gives every campaign its packaged tea products with pack types', () => {
    const { campaigns } = buildCreatorWorkspace('nyashinski')
    campaigns.forEach((campaign) => {
      expect(campaign.products.length).toBeGreaterThan(0)
      campaign.products.forEach((product) => expect(product.packs.length).toBeGreaterThan(0))
    })
  })

  it('issues one QR code per batch per product, pointing at that batch', () => {
    const { packCodes } = buildCreatorWorkspace('nyashinski')
    const keys = packCodes.map((code) => `${code.productId}:${code.batchId}`)
    expect(new Set(keys).size).toBe(keys.length)
    packCodes.forEach((code) => expect(code.destination).toContain(`batch=${code.batchId}`))
  })

  it('never makes a code live on a batch that is not verified', () => {
    const { packCodes } = buildCreatorWorkspace('nyashinski')
    const pending = packCodes.filter((code) => !code.batch.isVerified)
    expect(pending.length).toBeGreaterThan(0)
    pending.forEach((code) => {
      expect(code.state).toBe('blocked')
      expect(code.stats.scans).toBe(0)
    })
  })

  it('counts scans only on live codes, and experience totals equal the sum of their codes', () => {
    const { packCodes, experiences } = buildCreatorWorkspace('nyashinski')
    packCodes.filter((code) => code.state !== 'live').forEach((code) => expect(code.stats.scans).toBe(0))
    experiences.forEach((experience) => {
      const sum = packCodes.filter((code) => code.experienceId === experience.id).reduce((acc, code) => acc + code.stats.scans, 0)
      expect(experience.stats.scans).toBe(sum)
    })
  })

  it('tells each batch its own verified story', () => {
    const { verifiedByBatch } = buildCreatorWorkspace('nyashinski')
    expect(verifiedByBatch['921'].landscape.find((fact) => fact.id === 'block').value).toBe('Mariashoni Block')
    expect(verifiedByBatch['630'].isVerified).toBe(false)
  })

  it('offers only batches no buyer, brand or creator has taken', () => {
    const { availableBatches } = buildCreatorWorkspace('nyashinski')
    const ids = availableBatches.map((batch) => batch.batchId)
    expect(ids).toContain('624')
    expect(ids).not.toContain('611') // committed to a buyer in the Offtaker Portal
    expect(ids).not.toContain('637') // reserved by a buyer
    expect(ids).not.toContain('630') // already booked for the Anthem tin
    expect(ids).not.toContain('921')
    expect(ids).not.toContain('733') // already a named tenant product
    expect(ids).not.toContain('618') // already a named product
  })

  it('shows a flagged delivery as not bookable, with the reason', () => {
    const { availableBatches } = buildCreatorWorkspace('nyashinski')
    const flagged = availableBatches.find((batch) => batch.batchId === '645')
    expect(flagged.deliveryFlagged).toBe(true)
  })

  it('turns a session booking into a scheduled code on that batch and removes it from the available list', () => {
    const bookings = [{ id: 'bk-1', productId: 'prd-shield-taichi', batchId: '624', packs: 4000, date: '2026-10-20' }]
    const workspace = buildCreatorWorkspace('nyashinski', { experienceEdits: {}, published: {}, bookings })
    const code = workspace.packCodes.find((entry) => entry.batchId === '624')
    expect(code.productId).toBe('prd-shield-taichi')
    expect(code.state).toBe('scheduled')
    expect(workspace.availableBatches.map((batch) => batch.batchId)).not.toContain('624')
  })

  it('keeps design requests from the session alongside the seeded ones', () => {
    const request = { id: 'dr-new-1', kind: 'packaging', campaignId: 'cmp-shield', brief: 'A tour-only foil pouch.', features: [], references: '', launchBy: '2026-11-30', status: 'received' }
    const workspace = buildCreatorWorkspace('nyashinski', { experienceEdits: {}, published: {}, designRequests: [request] })
    expect(workspace.designRequests.map((entry) => entry.id)).toContain('dr-new-1')
    expect(workspace.designRequests.length).toBeGreaterThan(1)
  })

  it('offers all six templates, each opening an existing route', () => {
    const { templates } = buildCreatorWorkspace('nyashinski')
    expect(templates).toHaveLength(6)
    templates.forEach((template) => expect(template.route).toMatch(/^\//))
  })

  it('applies session edits to the creative layer only', () => {
    const drafts = { experienceEdits: { 'exp-anthem': { headline: 'Edited', hectares: 500 } }, published: {} }
    const workspace = buildCreatorWorkspace('nyashinski', drafts)
    const anthem = workspace.experiences.find((entry) => entry.id === 'exp-anthem')
    expect(anthem.creative.headline).toBe('Edited')
    expect(anthem.creative).not.toHaveProperty('hectares')
  })

  it('marks an experience published from the session with the as-of date', () => {
    const workspace = buildCreatorWorkspace('nyashinski', { experienceEdits: {}, published: { 'exp-passport': true } })
    const passport = workspace.experiences.find((entry) => entry.id === 'exp-passport')
    expect(passport.status).toBe('published')
    expect(passport.publishedAt).toBe(workspace.asOf)
  })

  it('adds experiences started from a template in the session as drafts on their campaign', () => {
    const created = [{ id: 'exp-new-1', campaignId: 'cmp-guardian', templateId: 'tpl-landscape', name: 'New', status: 'draft', shortCode: 'new-1', publishedAt: null, creative: { headline: '', subline: '', heroAssetId: 'fos-mau', narrative: '', sectionOrder: ['hook'], hiddenSections: [], musicLink: null, ctas: [], statementIds: [] } }]
    const workspace = buildCreatorWorkspace('nyashinski', { experienceEdits: {}, published: {}, created })
    const campaign = workspace.campaigns.find((entry) => entry.id === 'cmp-guardian')
    expect(campaign.experiences.map((entry) => entry.id)).toContain('exp-new-1')
    expect(workspace.experiences.find((entry) => entry.id === 'exp-new-1').template.name).toBe('Landscape Story')
  })

  it('never lets a verified figure be marked verified when its method is pending', () => {
    const { verified } = buildCreatorWorkspace('nyashinski')
    const hectares = verified.pending.find((fact) => fact.id === 'hectares')
    expect(hectares.status).toBe('method_pending')
  })

  it('totals only published experiences into the headline numbers', () => {
    const { totals, experiences } = buildCreatorWorkspace('nyashinski')
    const sum = experiences.reduce((acc, entry) => acc + entry.stats.scans, 0)
    expect(totals.scans).toBe(sum)
    expect(totals.published).toBe(experiences.filter((entry) => entry.status === 'published').length)
  })
})
