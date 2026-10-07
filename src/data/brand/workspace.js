// Builds one brand's workspace: everything the Brand Portal renders, scoped
// to that brand and its viewer's role. No new source of truth: lots are the
// canonical batch chain (lib/batchChain.js), conservation is the programme's
// own activity records (data/funder/activities.js), and the verdict on every
// claim and impact statement is computed here from those records
// (lib/brand/claims.js). Brand records only add what the brand owns: its
// products, campaigns, content, experience presentation and team.
//
// `drafts` carries what a brand creates during a demo session (new products,
// campaigns, experience edits). There is no backend; BrandView holds them in
// state and this builder merges them in, so every page sees them at once.

import { BATCH_CHAIN, findBatchRecord } from '../../lib/batchChain'
import { getOrganisation, getOrganisationBySlug } from '../funder/organisations'
import { ACTIVITY_RECORDS } from '../funder/activities'
import { AS_OF, OUTPUT_INDICATORS } from '../funder/programme'
import { centreForBatch } from '../supply/collectionCentres'
import { COMMITMENTS } from '../offtaker/commitments'
import { assessClaim, buildEvidenceBase, summariseAssessments } from '../../lib/brand/claims'
import { claimsRepeatedIn, publishReadiness } from '../../lib/brand/publish'
import { sumScans } from '../../lib/brand/analytics'
import { brandAccountForOrg } from './accounts'
import { BRAND_DATA_POLICY, BRAND_ROLE_CONFIG } from './roles'
import { BRAND_PRODUCTS } from './products'
import { SOURCING } from './sourcing'
import { BRAND_CAMPAIGNS } from './campaigns'
import { BRAND_EXPERIENCES, DESIGN_REQUESTS, EXPERIENCE_TEMPLATES, PLACEHOLDER_BATCH_ID } from './experiences'
import { BRAND_CLAIMS } from './claims'
import { BRAND_CONTENT } from './content'
import { BRAND_UPLOADS, FORESTOS_PHOTOS, getForestosPhoto } from './assets'
import { ENGAGEMENT_PROFILES, EXPERIENCE_STAGES, SCAN_DAYS } from './scans'

const EMPTY_DRAFTS = { products: [], sourcing: [], campaigns: [], experiences: [], experienceEdits: {}, invites: [], designRequests: [] }

const indicatorLabel = (id) => OUTPUT_INDICATORS.find((indicator) => indicator.id === id)?.label ?? id
const evidenceDeps = { centreForBatch, indicatorLabel }
const byDateDesc = (a, b) => b.date.localeCompare(a.date)

/** Lots the brand's packer holds on an open or delivered commitment: the only lots a brand can pack from. */
function packerLots(packerOrgId) {
  const traceIds = new Set(
    COMMITMENTS.filter((commitment) => commitment.offtakerOrgId === packerOrgId && commitment.status !== 'cancelled').flatMap(
      (commitment) => commitment.batchTraceIds,
    ),
  )
  return BATCH_CHAIN.filter((record) => traceIds.has(record.traceId))
}

/** Every brand's allocations, so remaining volume on a shared lot is honest across brands. */
function allocatedByLot(sourcing) {
  return sourcing.reduce((acc, record) => ({ ...acc, [record.batchTraceId]: (acc[record.batchTraceId] ?? 0) + record.allocatedKg }), {})
}

function lotSummary(record) {
  return {
    traceId: record.traceId,
    code: record.id,
    record,
    centre: centreForBatch(record),
    block: record.block.name,
    landscape: record.land.name,
    region: record.land.region,
    grade: record.batch.grade,
    madeTeaKg: record.batch.madeTeaKg,
    harvestMonth: record.harvest.month,
    factory: record.processing.facility,
    verificationStatus: record.verification.status,
    isPublic: Boolean(record.brand),
  }
}

function assessedClaimsFor(claims, base) {
  return claims.map((claim) => ({ ...claim, assessment: assessClaim(claim.asserts, base) }))
}

function buildProduct(product, context) {
  const { sourcing, campaigns, experiences, claims } = context
  const allocations = sourcing
    .filter((record) => record.productId === product.id)
    .map((record) => ({ ...record, lot: lotSummary(findBatchRecord(record.batchTraceId)) }))
  const lots = [...new Map(allocations.map((allocation) => [allocation.lot.traceId, allocation.lot])).values()]
  const evidence = buildEvidenceBase(
    lots.map((lot) => lot.record),
    ACTIVITY_RECORDS,
    evidenceDeps,
  )
  return {
    ...product,
    allocations,
    lots,
    evidence,
    claims: assessedClaimsFor(claims.filter((claim) => claim.productId === product.id), evidence),
    campaignIds: campaigns.filter((campaign) => campaign.productIds.includes(product.id)).map((campaign) => campaign.id),
    experienceId: experiences.find((experience) => experience.productId === product.id)?.id ?? null,
  }
}

function buildExperience(experience, context) {
  const { productsById, days, claimsByProduct } = context
  const product = productsById.get(experience.productId) ?? null
  const lotRecord = experience.batchTraceId ? findBatchRecord(experience.batchTraceId) : null
  const scans = sumScans(days.filter((day) => day.experienceId === experience.id))
  const approvedMetrics = product?.evidence.metrics ?? []
  const readiness = publishReadiness(experience, {
    products: [...productsById.values()],
    lotStatus: (traceId) => findBatchRecord(traceId)?.verification.status ?? null,
    approvedMetricIds: new Set(approvedMetrics.map((metric) => metric.id)),
    claimsInStory: claimsRepeatedIn(experience.customisation.story, claimsByProduct.get(experience.productId) ?? []).map(
      (claim) => claim.assessment,
    ),
  })
  return {
    ...experience,
    template: EXPERIENCE_TEMPLATES.find((template) => template.id === experience.templateId),
    product,
    lot: lotRecord ? lotSummary(lotRecord) : null,
    heroAsset: getForestosPhoto(experience.customisation.heroAssetId),
    approvedMetrics,
    scans,
    readiness,
    livePath: experience.shortCode === 'kil-mau' ? '/java' : `/batch/${PLACEHOLDER_BATCH_ID}?exp=${experience.shortCode}`,
  }
}

function buildActivity({ products, experiences, campaigns, claims, lots }) {
  const events = [
    ...experiences.filter((e) => e.publishedAt).map((e) => ({ id: `ev-pub-${e.id}`, date: e.publishedAt, kind: 'published', text: `“${e.customisation.title}” QR experience published`, to: `experiences/${e.id}` })),
    ...products.filter((p) => p.launchDate).map((p) => ({ id: `ev-launch-${p.id}`, date: p.launchDate, kind: 'launched', text: `${p.name} went on sale`, to: `products/${p.id}` })),
    ...products.flatMap((p) =>
      p.allocations.filter((a) => a.status === 'packed').map((a) => ({ id: `ev-pack-${a.id}`, date: a.date, kind: 'packed', text: `${a.allocatedKg.toLocaleString('en-US')} kg of lot #${a.lot.code} packed for ${p.name}`, to: 'sources' })),
    ),
    ...lots.filter((lot) => lot.verificationStatus === 'Verified').map((lot) => ({ id: `ev-ver-${lot.traceId}`, date: lot.record.verification.timestamp.slice(0, 10), kind: 'verified', text: `Lot #${lot.code} verified deforestation-free (${lot.block})`, to: 'sources' })),
    ...claims.map((claim) => ({ id: `ev-clm-${claim.id}`, date: claim.submittedAt, kind: `claim_${claim.assessment.status}`, text: `Claim reviewed: “${claim.statement}”`, to: 'content' })),
    ...campaigns.filter((c) => c.status !== 'draft' && c.period.start <= AS_OF).map((c) => ({ id: `ev-cmp-${c.id}`, date: c.period.start, kind: 'campaign', text: `${c.name} campaign started`, to: 'campaigns' })),
  ]
  return events.filter((event) => event.date <= AS_OF).sort(byDateDesc)
}

function composeWorkspace(org, account, role, drafts) {
  const roleConfig = BRAND_ROLE_CONFIG[role]
  const own = (record) => record.brandOrgId === org.id
  const allSourcing = [...SOURCING, ...drafts.sourcing]
  const rawProducts = [...BRAND_PRODUCTS, ...drafts.products].filter(own)
  const productIds = new Set(rawProducts.map((product) => product.id))
  const ownSourcing = allSourcing.filter((record) => productIds.has(record.productId))
  const campaigns = [...BRAND_CAMPAIGNS, ...drafts.campaigns].filter(own)
  const rawExperiences = [...BRAND_EXPERIENCES, ...drafts.experiences]
    .filter(own)
    .map((experience) => ({ ...experience, ...(drafts.experienceEdits[experience.id] ?? {}) }))
  const claims = BRAND_CLAIMS.filter(own)

  const products = rawProducts.map((product) => buildProduct(product, { sourcing: ownSourcing, campaigns, experiences: rawExperiences, claims }))
  const productsById = new Map(products.map((product) => [product.id, product]))
  const claimsByProduct = new Map(products.map((product) => [product.id, product.claims]))
  const experienceIds = new Set(rawExperiences.map((experience) => experience.id))
  const days = SCAN_DAYS.filter((day) => experienceIds.has(day.experienceId))
  const experiences = rawExperiences.map((experience) => buildExperience(experience, { productsById, days, claimsByProduct }))

  const lots = [...new Map(products.flatMap((product) => product.lots).map((lot) => [lot.traceId, lot])).values()].map((lot) => {
    const allocations = products.flatMap((product) =>
      product.allocations.filter((allocation) => allocation.batchTraceId === lot.traceId).map((allocation) => ({ ...allocation, productName: product.name, productId: product.id })),
    )
    return { ...lot, allocations, allocatedKg: allocations.reduce((sum, allocation) => sum + allocation.allocatedKg, 0) }
  })
  const evidence = buildEvidenceBase(lots.map((lot) => lot.record), ACTIVITY_RECORDS, evidenceDeps)
  const assessedClaims = products.flatMap((product) => product.claims.map((claim) => ({ ...claim, productName: product.name })))
  const claimsById = new Map(assessedClaims.map((claim) => [claim.id, claim]))
  const content = BRAND_CONTENT.filter(own).map((item) => ({ ...item, claims: item.claimIds.map((id) => claimsById.get(id)).filter(Boolean) }))

  const usedKg = allocatedByLot(allSourcing)
  const packer = getOrganisation(account.packerOrgId)
  const availableLots = packerLots(account.packerOrgId)
    .map(lotSummary)
    .map((lot) => ({ ...lot, remainingKg: lot.madeTeaKg - (usedKg[lot.traceId] ?? 0) }))
    .filter((lot) => lot.remainingKg > 0)

  const liveCampaigns = campaigns.filter((campaign) => campaign.status === 'live')
  const published = experiences.filter((experience) => experience.status === 'published')

  return {
    org,
    account,
    kit: account.kit,
    packer,
    role,
    roleConfig,
    permissions: roleConfig.permissions,
    asOf: AS_OF,
    basePath: `/brand/${org.slug}`,
    products,
    lots,
    availableLots,
    evidence,
    claims: assessedClaims,
    claimSummary: summariseAssessments(assessedClaims.map((claim) => claim.assessment)),
    content,
    campaigns,
    experiences,
    templates: EXPERIENCE_TEMPLATES,
    photos: FORESTOS_PHOTOS,
    uploads: BRAND_UPLOADS.filter(own),
    team: [...account.team, ...drafts.invites],
    designRequests: [...DESIGN_REQUESTS, ...drafts.designRequests]
      .filter(own)
      .map((request) => ({ ...request, products: products.filter((product) => request.productIds.includes(product.id)) }))
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    scanDays: days,
    engagement: Object.fromEntries(Object.entries(ENGAGEMENT_PROFILES).filter(([id]) => experienceIds.has(id))),
    stages: EXPERIENCE_STAGES,
    analyticsFloor: BRAND_DATA_POLICY.analyticsFloor,
    activity: buildActivity({ products, experiences, campaigns, claims: assessedClaims, lots }),
    totals: {
      productsOnSale: products.filter((product) => product.status === 'on_sale').length,
      liveCampaigns: liveCampaigns.length,
      connectedLots: lots.length,
      packedKg: ownSourcing.filter((record) => record.status === 'packed').reduce((sum, record) => sum + record.allocatedKg, 0),
      publishedExperiences: published.length,
      scans: sumScans(days),
    },
  }
}

/**
 * @param {string} slug         brand organisation slug (URL key)
 * @param {string} [role]       viewer role; the account's default when missing or unknown
 * @param {Partial<typeof EMPTY_DRAFTS>} [drafts]  records created during the session
 * @returns {null | ReturnType<typeof composeWorkspace>} null for an unknown slug or a non-brand organisation
 */
export function buildBrandWorkspace(slug, role, drafts = EMPTY_DRAFTS) {
  const org = getOrganisationBySlug(slug)
  if (!org || org.type !== 'brand') return null
  const account = brandAccountForOrg(org.id)
  if (!account) return null
  const viewerRole = BRAND_ROLE_CONFIG[role] ? role : account.defaultRole
  return composeWorkspace(org, account, viewerRole, { ...EMPTY_DRAFTS, ...drafts })
}

/** @typedef {NonNullable<ReturnType<typeof buildBrandWorkspace>>} BrandWorkspace */
