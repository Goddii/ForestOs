// Assembles one creator's workspace from the demo records: campaigns with
// their experiences, each joined to its template and scan totals, plus the
// verified story and asset library. Session edits (there is no backend) are
// applied through lib/creator/experience.js, so they can only ever touch the
// creative layer.

import { AS_OF } from '../funder/programme'
import { applyCreativeEdit, destinationPath, experienceStats, packCodeState } from '../../lib/creator/experience'
import { getCreatorBySlug } from './creators'
import { CREATOR_CAMPAIGNS, CREATOR_EXPERIENCES } from './campaigns'
import { CREATOR_TEMPLATES, getTemplate } from './templates'
import { CREATOR_ENGAGEMENT, CREATOR_SCAN_DAYS } from './scans'
import { WITHHELD_FROM_CREATORS, verifiedStoryFor } from './verifiedStory'
import { CREATOR_PRODUCTS, PACK_CODES } from './products'
import { FREE_LOTS } from './batches'
import { CREATOR_DESIGN_REQUESTS } from './designRequests'
import { CREATOR_UPLOADS, FORESTOS_IMAGERY, VERIFICATION_MARK } from './assets'

/**
 * @typedef {{
 *   experienceEdits: Record<string, object>,
 *   published: Record<string, boolean>,
 *   created?: import('./campaigns').CreatorExperience[],
 *   bookings?: Array<{ id: string, productId: string, batchId: string, packs: number, date: string }>,
 *   designRequests?: import('./designRequests').CreatorDesignRequest[],
 * }} CreatorDrafts
 */

export const EMPTY_CREATOR_DRAFTS = { experienceEdits: {}, published: {}, created: [], bookings: [], designRequests: [] }

function withSession(experience, drafts) {
  const edits = drafts.experienceEdits[experience.id]
  const creative = edits ? applyCreativeEdit(experience.creative, edits).creative : experience.creative
  const publishedNow = drafts.published[experience.id] && experience.status !== 'published'
  return {
    ...experience,
    creative,
    status: publishedNow ? 'published' : experience.status,
    publishedAt: publishedNow ? AS_OF : experience.publishedAt,
  }
}

/**
 * @param {string} slug
 * @param {CreatorDrafts} [drafts]
 */
export function buildCreatorWorkspace(slug, drafts = EMPTY_CREATOR_DRAFTS) {
  const creator = getCreatorBySlug(slug)
  if (!creator) return null

  const ownCampaigns = CREATOR_CAMPAIGNS.filter((campaign) => campaign.creatorId === creator.id)
  const campaignIds = new Set(ownCampaigns.map((campaign) => campaign.id))
  const experiences = [...CREATOR_EXPERIENCES, ...(drafts.created ?? [])].filter((experience) => campaignIds.has(experience.campaignId)).map((experience) => {
    const current = withSession(experience, drafts)
    return {
      ...current,
      template: getTemplate(current.templateId),
      campaign: ownCampaigns.find((campaign) => campaign.id === current.campaignId),
      stats: experienceStats(CREATOR_SCAN_DAYS, CREATOR_ENGAGEMENT, current.id),
    }
  })

  const products = CREATOR_PRODUCTS.filter((product) => campaignIds.has(product.campaignId))
  // A booking made in the session is a scheduled code on that batch.
  const allCodes = [...PACK_CODES, ...(drafts.bookings ?? []).map((booking) => ({ ...booking, status: 'scheduled' }))].filter((code) =>
    products.some((product) => product.id === code.productId),
  )
  const batchIds = [...new Set(allCodes.map((code) => code.batchId))]
  const verifiedByBatch = Object.fromEntries(batchIds.map((batchId) => [batchId, verifiedStoryFor(batchId)]))

  const packCodes = allCodes.filter((code) => products.some((product) => product.id === code.productId)).map((code) => {
    const product = products.find((entry) => entry.id === code.productId)
    const experience = experiences.find((entry) => entry.id === product.experienceId)
    const batch = verifiedByBatch[code.batchId]
    const state = packCodeState(code, { experienceStatus: experience.status, batchVerified: batch.isVerified })
    const own = state === 'live' ? CREATOR_SCAN_DAYS.filter((record) => record.codeId === code.id) : []
    const scanned = own.filter((record) => record.scans > 0).map((record) => record.date)
    return {
      ...code,
      product,
      experienceId: experience.id,
      experience,
      batch,
      state,
      destination: destinationPath(experience.template, experience, code.batchId),
      stats: {
        scans: own.reduce((sum, record) => sum + record.scans, 0),
        visitors: own.reduce((sum, record) => sum + record.uniqueDevices, 0),
        lastScan: scanned.length ? scanned.reduce((latest, date) => (date > latest ? date : latest)) : null,
      },
    }
  })

  const bookedKgByBatch = packCodes.reduce(
    (acc, code) => ({ ...acc, [code.batchId]: (acc[code.batchId] ?? 0) + code.packs * code.product.packKg }),
    {},
  )
  // Seeded codes belong to every creator's catalogue, so a batch booked by
  // anyone is never offered again; this creator's session bookings add to it.
  const takenBatchIds = new Set([...PACK_CODES.map((code) => code.batchId), ...batchIds])
  const availableBatches = FREE_LOTS.filter((lot) => !takenBatchIds.has(lot.batchId)).map((lot) => ({
    ...verifiedStoryFor(lot.batchId),
    deliveryFlagged: lot.deliveryFlagged,
    bookedKg: bookedKgByBatch[lot.batchId] ?? 0,
  }))

  const campaigns = ownCampaigns.map((campaign) => {
    const own = experiences.filter((experience) => experience.campaignId === campaign.id)
    const campaignProducts = products
      .filter((product) => product.campaignId === campaign.id)
      .map((product) => ({ ...product, codes: packCodes.filter((code) => code.productId === product.id) }))
    return { ...campaign, experiences: own, products: campaignProducts, scans: own.reduce((sum, experience) => sum + experience.stats.scans, 0) }
  })

  const totals = experiences.reduce(
    (acc, { stats, status }) => ({
      scans: acc.scans + stats.scans,
      visitors: acc.visitors + stats.visitors,
      reachedStory: acc.reachedStory + stats.reachedStory,
      ctaClicks: acc.ctaClicks + stats.ctaClicks,
      spotify: acc.spotify + stats.clicks.spotify,
      social: acc.social + stats.clicks.social,
      community: acc.community + stats.clicks.community,
      website: acc.website + stats.clicks.website,
      published: acc.published + (status === 'published' ? 1 : 0),
    }),
    { scans: 0, visitors: 0, reachedStory: 0, ctaClicks: 0, spotify: 0, social: 0, community: 0, website: 0, published: 0 },
  )

  return {
    creator,
    basePath: `/creator/${creator.slug}`,
    asOf: AS_OF,
    templates: CREATOR_TEMPLATES,
    campaigns,
    experiences,
    totals,
    scanDays: CREATOR_SCAN_DAYS,
    products,
    packCodes,
    verifiedByBatch,
    availableBatches,
    designRequests: [...CREATOR_DESIGN_REQUESTS, ...(drafts.designRequests ?? [])],
    // The collaboration batch's story is the default wherever one story is shown.
    verified: verifiedByBatch['921'] ?? Object.values(verifiedByBatch)[0],
    statements: (verifiedByBatch['921'] ?? Object.values(verifiedByBatch)[0]).statements,
    withheld: WITHHELD_FROM_CREATORS,
    assets: { uploads: CREATOR_UPLOADS, forestos: FORESTOS_IMAGERY, mark: VERIFICATION_MARK },
  }
}
