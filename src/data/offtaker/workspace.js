// Builds one buyer's workspace: everything the Offtaker Portal renders,
// scoped to that organisation and projected through the viewer's role.
// Nothing here is a new source of truth — batches are the canonical chain
// (lib/batchChain.js), conservation is the programme's own records
// (data/funder/*, data/investor/evidence.js), and the supply records are
// keyed to both. Data a buyer or role may not see is removed here, before
// any component receives it. A backend replaces the imports; the output
// shape stays.
import { BATCH_CHAIN, PUBLIC_CLAIM_BASIS } from '../../lib/batchChain'
import { BRANDS } from '../../lib/brands'
import { getOrganisation, getOrganisationBySlug } from '../funder/organisations'
import { ACTIVITY_RECORDS } from '../funder/activities'
import { getInterventionType } from '../funder/interventionTypes'
import { BUFFER_SEGMENTS } from '../funder/geography'
import { AS_OF, PROGRAMME } from '../funder/programme'
import { getEvidenceById, LANDSCAPE_LAYERS } from '../investor'
import { projectActivity } from '../../lib/programme/disclosure'
import { currentState, latestDecision } from '../../lib/programme/verificationState'
import { COLLECTION_CENTRES, centreForBatch } from '../supply/collectionCentres'
import { CENTRE_INTAKE_HISTORY, intakeForBatch } from '../supply/intake'
import { deliveryForBatch } from '../supply/deliveries'
import { qualityForBatch } from '../supply/quality'
import { SUPPLY_FORECASTS } from '../supply/forecast'
import { DOCUMENTS } from '../supply/documents'
import { batchAccess } from '../../lib/offtaker/access'
import { buildJourney } from '../../lib/offtaker/journey'
import { documentStatus, isOutstanding } from '../../lib/offtaker/documentStatus'
import { accountForOrg } from './accounts'
import { COMMITMENTS, OPEN_COMMITMENT_STATUSES } from './commitments'
import { OFFTAKER_DISCLOSURE_POLICY, OFFTAKER_ROLE_CONFIG } from './roles'

/**
 * Programme work a buyer can connect to the tea: planting and protecting the
 * buffer. Farmer onboarding and livelihood support are programme records a
 * buyer has no need to see.
 */
const BUYER_RELEVANT_INTERVENTIONS = new Set([
  'it-tea-infill',
  'it-fuelwood',
  'it-indigenous',
  'it-patrol',
  'it-audit',
  'it-disturbance',
  'it-boundary',
])

const orgName = (id) => getOrganisation(id)?.name ?? id

const isRelevantVerified = (activity) =>
  BUYER_RELEVANT_INTERVENTIONS.has(activity.interventionTypeId) && currentState(activity.verification) === 'verified'

/** Buffer segments with at least one verified planting or protection record — the same for every buyer. */
const VERIFIED_SEGMENT_IDS = new Set(ACTIVITY_RECORDS.filter(isRelevantVerified).map((activity) => activity.segmentId))

/** Batch-level claims whose allocation method is still pending (lib/batchChain.js). */
const METHOD_PENDING_CLAIMS = [
  { key: 'hectaresPreserved', statement: 'Hectares of forest preserved per batch' },
  { key: 'protectedPerCup', statement: 'Forest area protected per cup' },
  { key: 'premiumKesPerKg', statement: 'Conservation premium paid per kg' },
]

function projectCommitment(commitment, permissions) {
  if (permissions.commercialTerms) return commitment
  return { ...commitment, priceKesPerKg: null }
}

function projectQuality(assessment, permissions) {
  if (!assessment) return null
  if (permissions.qualityMetrics) return assessment
  return { ...assessment, metrics: null }
}

function buildBatch(record, context) {
  const { orgId, commitments, permissions, documentsById } = context
  const access = batchAccess(record, orgId, commitments)
  const commitment = commitments.find(
    (entry) => entry.offtakerOrgId === orgId && entry.batchTraceIds.includes(record.traceId),
  )
  const centre = centreForBatch(record)
  const intake = intakeForBatch(record.traceId)
  const delivery = deliveryForBatch(record.traceId)
  const journey = buildJourney(record, {
    intake,
    delivery,
    dispatchDocument: documentsById.get(`DOC-${record.traceId.slice(8)}-DR`),
    commitment: commitment ?? null,
    centre,
    preciseGeolocation: permissions.plotGeolocation,
    householdFloor: OFFTAKER_DISCLOSURE_POLICY.householdFloor,
    getOrgName: orgName,
  })
  return {
    traceId: record.traceId,
    code: record.id,
    access,
    record,
    centre,
    zone: centre?.zone ?? record.land.region,
    grade: record.batch.grade,
    madeTeaKg: record.batch.madeTeaKg,
    sealedAt: record.batch.sealedAt,
    eudrStatus: record.verification.status,
    intake,
    delivery,
    quality: projectQuality(qualityForBatch(record.traceId), permissions),
    commitment: commitment ? projectCommitment(commitment, permissions) : null,
    journey,
  }
}

function centreSummaries(batches, verifiedSegmentIds) {
  return COLLECTION_CENTRES.map((centre) => {
    const available = batches.filter((batch) => batch.access === 'available' && batch.centre?.id === centre.id)
    const yours = batches.filter((batch) => batch.access === 'allocated' && batch.centre?.id === centre.id)
    const history = CENTRE_INTAKE_HISTORY.filter((row) => row.centreId === centre.id)
    const latest = history.at(-1) ?? null
    return {
      ...centre,
      availableKg: available.reduce((sum, batch) => sum + batch.madeTeaKg, 0),
      availableLots: available.length,
      yourKg: yours.reduce((sum, batch) => sum + batch.madeTeaKg, 0),
      forecast: SUPPLY_FORECASTS.filter((forecast) => forecast.centreId === centre.id),
      history,
      latestAcceptancePct: latest ? Math.round((latest.acceptedKg / latest.receivedKg) * 1000) / 10 : null,
      latestFineLeafPct: latest?.fineLeafPct ?? null,
      conservationLinked: centre.segmentIds.some((id) => verifiedSegmentIds.has(id)),
    }
  })
}

/** Verified-vs-claimed ledger for the "Verified origin & impact" view. */
function buildClaims({ allocated, activities, brand }) {
  const claims = []
  const sourced = allocated.filter((batch) => batch.journey.stages[0].status === 'verified')
  if (allocated.length > 0) {
    const zones = [...new Set(allocated.map((batch) => batch.zone))]
    claims.push({
      id: 'claim-origin',
      statement: `Grown in the Nyayo Tea Zone buffer belt (${zones.join(', ')})`,
      basis: sourced.length === allocated.length ? 'verified' : 'reported',
      source: `${sourced.length} of ${allocated.length} of your batches have a verified plot origin (field check and satellite check against the 2020 baseline)`,
      evidenceIds: [],
    })
  }
  for (const activity of activities) {
    const state = currentState(activity.verification)
    if (state === 'rejected') continue
    const decision = latestDecision(activity.verification)
    claims.push({
      id: `claim-${activity.id}`,
      statement: activity.summary,
      basis: state === 'verified' ? 'verified' : 'reported',
      source:
        state === 'verified'
          ? `Verified ${decision.at} by ${decision.byRole} (${orgName(decision.byOrgId)})`
          : 'Recorded by NTZDC, verification not complete',
      evidenceIds: activity.evidenceIds,
    })
  }
  for (const { key, statement } of METHOD_PENDING_CLAIMS) {
    const basis = PUBLIC_CLAIM_BASIS[key]
    claims.push({ id: `claim-${key}`, statement, basis: 'method_pending', source: basis.method, evidenceIds: [] })
  }
  if (brand?.treesFunded) {
    claims.push({
      id: 'claim-brand-trees',
      statement: `${brand.treesFunded.toLocaleString('en-US')} trees funded by ${brand.name}`,
      basis: 'unsupported',
      source: 'Public standings figure on the ForestOS home page, with no evidence record linked',
      evidenceIds: [],
    })
  }
  return claims
}

function buildConservation({ allocated, available, brand }) {
  const sourceCentres = [...new Map(allocated.filter((b) => b.centre).map((b) => [b.centre.id, b.centre])).values()]
  const linkedSegmentIds = new Set(sourceCentres.flatMap((centre) => centre.segmentIds))
  const linkedFeatureIds = new Set(sourceCentres.flatMap((centre) => centre.landscapeFeatureIds))

  const activities = ACTIVITY_RECORDS.filter(
    (activity) => BUYER_RELEVANT_INTERVENTIONS.has(activity.interventionTypeId) && linkedSegmentIds.has(activity.segmentId),
  )
    .map((activity) => projectActivity(activity, OFFTAKER_DISCLOSURE_POLICY))
    .map((activity) => {
      const copy = { ...activity, intervention: getInterventionType(activity.interventionTypeId)?.label ?? '' }
      delete copy.beneficiaries
      delete copy.allocationId
      return copy
    })

  const verifiedActivities = activities.filter((activity) => currentState(activity.verification) === 'verified')
  const verifiedSegmentIds = new Set(verifiedActivities.map((activity) => activity.segmentId))
  const zones = LANDSCAPE_LAYERS.filter((feature) => linkedFeatureIds.has(feature.id))
  const evidenceIds = [
    ...new Set([...verifiedActivities.flatMap((activity) => activity.evidenceIds), ...zones.map((zone) => zone.evidenceId).filter(Boolean)]),
  ]

  const connectedCentreIds = new Set(
    sourceCentres.filter((centre) => centre.segmentIds.some((id) => verifiedSegmentIds.has(id))).map((centre) => centre.id),
  )
  const allocatedKg = allocated.reduce((sum, batch) => sum + batch.madeTeaKg, 0)
  const connectedKg = allocated
    .filter((batch) => connectedCentreIds.has(batch.centre?.id))
    .reduce((sum, batch) => sum + batch.madeTeaKg, 0)

  return {
    programme: PROGRAMME,
    sourceCentres,
    segments: BUFFER_SEGMENTS.filter((segment) => linkedSegmentIds.has(segment.id)),
    zones,
    activities,
    verifiedActivities,
    rejectedCount: activities.filter((activity) => currentState(activity.verification) === 'rejected').length,
    evidence: evidenceIds.map(getEvidenceById).filter(Boolean),
    connection: { connectedKg, allocatedKg, connectedCentreIds: [...connectedCentreIds] },
    // Available lots from centres already connected to verified work — the
    // procurement hook for a buyer with no connected supply yet.
    connectedAvailable: available.filter((batch) => batch.centre?.segmentIds.some((id) => VERIFIED_SEGMENT_IDS.has(id))),
    claims: buildClaims({ allocated, activities, brand }),
  }
}

function composeWorkspace(org, account, role) {
  const roleConfig = OFFTAKER_ROLE_CONFIG[role]
  const permissions = roleConfig.permissions
  const documentsById = new Map(DOCUMENTS.map((document) => [document.id, document]))
  const ownCommitments = COMMITMENTS.filter((commitment) => commitment.offtakerOrgId === org.id)

  const batches = BATCH_CHAIN.filter((record) => batchAccess(record, org.id, COMMITMENTS) !== 'hidden')
    .map((record) => buildBatch(record, { orgId: org.id, commitments: COMMITMENTS, permissions, documentsById }))
    .sort((a, b) => b.sealedAt.localeCompare(a.sealedAt))
  const allocated = batches.filter((batch) => batch.access === 'allocated')
  const available = batches.filter((batch) => batch.access === 'available')
  const visibleTraceIds = new Set(batches.map((batch) => batch.traceId))
  const visibleFactories = new Set(batches.map((batch) => batch.record.processing.facility))
  const visibleZones = new Set(batches.map((batch) => batch.zone))

  // Documents about this buyer's supply: programme-wide, zones and factories
  // it sources from, and batches it can see. Then the role filter.
  const relevant = DOCUMENTS.filter((document) => {
    if (document.scope === 'batch') return visibleTraceIds.has(document.scopeRef)
    if (document.scope === 'factory') return visibleFactories.has(document.scopeRef)
    if (document.scope === 'zone') return visibleZones.has(document.scopeRef)
    return true
  }).map((document) => ({
    ...document,
    status: documentStatus(document, AS_OF),
    outstanding: isOutstanding(document, AS_OF),
    issuer: orgName(document.issuerOrgId),
  }))
  const documents = relevant.filter((document) => document.audience.includes(role))

  const brand = Object.values(BRANDS).find((entry) => entry.name === org.name) ?? null
  const conservation = buildConservation({ allocated, available, brand })

  const tracedKg = batches.filter((batch) => batch.journey.fullyTraced).reduce((sum, batch) => sum + batch.madeTeaKg, 0)
  const visibleKg = batches.reduce((sum, batch) => sum + batch.madeTeaKg, 0)
  const openCommitments = ownCommitments.filter((commitment) => OPEN_COMMITMENT_STATUSES.has(commitment.status))

  return {
    org,
    account,
    role,
    roleConfig,
    permissions,
    policy: OFFTAKER_DISCLOSURE_POLICY,
    asOf: AS_OF,
    basePath: `/offtaker/${org.slug}`,
    batches,
    allocated,
    available,
    commitments: ownCommitments.map((commitment) => projectCommitment(commitment, permissions)),
    centres: centreSummaries(batches, VERIFIED_SEGMENT_IDS),
    documents,
    withheldDocumentCount: relevant.length - documents.length,
    conservation,
    totals: {
      availableKg: available.reduce((sum, batch) => sum + batch.madeTeaKg, 0),
      availableLots: available.length,
      committedOpenKg: openCommitments.reduce((sum, commitment) => sum + commitment.volumeKg, 0),
      openCommitments: openCommitments.length,
      deliveredKg: ownCommitments
        .flatMap((commitment) => commitment.schedule)
        .filter((entry) => entry.status === 'delivered')
        .reduce((sum, entry) => sum + entry.volumeKg, 0),
      traceability: { tracedKg, visibleKg, pct: visibleKg ? Math.round((tracedKg / visibleKg) * 100) : 0 },
      outstandingDocuments: documents.filter((document) => document.outstanding).length,
      documentStatusCounts: documents.reduce((counts, document) => {
        counts[document.status] = (counts[document.status] ?? 0) + 1
        return counts
      }, {}),
    },
  }
}

/**
 * @param {string} slug organisation slug (URL key)
 * @param {string} [role] viewer role; the account's default when missing or unknown
 * @returns {null | ReturnType<typeof composeWorkspace>} null for an unknown slug or a non-offtaker
 */
export function buildOfftakerWorkspace(slug, role) {
  const org = getOrganisationBySlug(slug)
  if (!org || org.type !== 'offtaker') return null
  const account = accountForOrg(org.id)
  if (!account) return null
  const viewerRole = OFFTAKER_ROLE_CONFIG[role] ? role : account.defaultRole
  return composeWorkspace(org, account, viewerRole)
}

/** @typedef {NonNullable<ReturnType<typeof buildOfftakerWorkspace>>} OfftakerWorkspace */
