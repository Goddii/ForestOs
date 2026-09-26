import { currentState, latestDecision } from '../programme/verificationState'
import { formatCoords, formatCount } from './access'

/**
 * The batch journey a buyer sees: Farmer / Source → Collection centre →
 * Delivery → Processing → Batch → Buyer, each stage with its own
 * verification status and who established it. Built from the canonical
 * batch record plus the supply records keyed to it; pure.
 *
 * Stage status:
 *  - `verified`      a reviewer other than the recorder confirmed it
 *  - `pending`       recorded, verification not complete
 *  - `flagged`       recorded with an exception the buyer should see
 *  - `not_recorded`  no record exists for this stage
 *  - `open`          the buyer stage of a lot nobody has bought yet
 */

export const STAGE_STATUS_LABELS = {
  verified: 'Verified',
  pending: 'Pending',
  flagged: 'Flagged',
  not_recorded: 'Not recorded',
  open: 'Open',
}

/** The stages that must all be verified for a batch to count as fully traced. */
export const TRACED_STAGE_KEYS = ['source', 'centre', 'delivery', 'processing', 'batch']

const kg = (value) => `${value.toLocaleString('en-US')} kg`

function fromHistory(history, getOrgName) {
  if (!history || history.length === 0) return { status: 'not_recorded', attestation: null }
  const state = currentState(history)
  const decision = latestDecision(history)
  return {
    status: state === 'verified' ? 'verified' : state === 'rejected' ? 'flagged' : 'pending',
    attestation: decision
      ? { role: decision.byRole, org: getOrgName(decision.byOrgId), independence: decision.independence, at: decision.at }
      : null,
  }
}

/**
 * @param {object} record                 canonical batch (lib/batchChain.js)
 * @param {object} context
 * @param {?object} context.intake        IntakeRecord
 * @param {?object} context.delivery      DeliveryReconciliation
 * @param {?object} context.dispatchDocument the batch dispatch record (processing attestation)
 * @param {?object} context.commitment    this buyer's commitment holding the batch, if any
 * @param {?object} context.centre        CollectionCentre
 * @param {boolean} context.preciseGeolocation
 * @param {number} context.householdFloor
 * @param {(orgId: string) => string} context.getOrgName
 */
export function buildJourney(record, context) {
  const { intake, delivery, dispatchDocument, commitment, centre, preciseGeolocation, householdFloor, getOrgName } = context
  const field = record.verification.field
  const satellite = record.verification.satellite

  const sourceStatus =
    field.status === 'Verified' && satellite.status === 'Verified'
      ? 'verified'
      : field.status === 'Not tracked'
        ? 'not_recorded'
        : 'pending'

  const intakeState = fromHistory(intake?.verification, getOrgName)
  const deliveryState = fromHistory(delivery?.verification, getOrgName)
  const processingState = fromHistory(dispatchDocument?.verification, getOrgName)

  const stages = [
    {
      key: 'source',
      label: 'Farmer / Source',
      title: `${record.block.name}, ${record.land.region}`,
      rows: [
        { k: 'Plot', v: record.plot.id },
        { k: 'Plot location', v: formatCoords(record.plot.lat, record.plot.lon, preciseGeolocation) },
        { k: 'Farmers on plot', v: `${formatCount(record.plot.farmers, householdFloor)} (count only)` },
        { k: 'Canopy 2020 → now', v: `${record.plot.canopyBaseline2020Pct}% → ${record.plot.canopyNowPct}%` },
        { k: 'Satellite check', v: satellite.status === 'Verified' ? `${satellite.source}, ${satellite.date}` : 'Awaiting a clear satellite pass' },
      ],
      status: sourceStatus,
      attestation:
        field.status === 'Verified'
          ? { role: field.by, org: 'Nyayo Tea Zones Development Corporation', independence: 'internal_separate', at: field.date }
          : null,
      note:
        sourceStatus === 'pending'
          ? 'Field check complete; the satellite cross-check against the 2020 forest baseline is still outstanding.'
          : null,
    },
    {
      key: 'centre',
      label: 'Collection centre',
      title: centre ? `${centre.name} collection centre` : record.plot.centre,
      rows: intake
        ? [
            { k: 'Green leaf received', v: kg(intake.receivedKg) },
            { k: 'Accepted', v: kg(intake.acceptedKg) },
            { k: 'Rejected at weigh-in', v: kg(intake.rejectedKg) },
            { k: 'Pluckers', v: `${formatCount(record.harvest.pluckers, householdFloor)} (count only)` },
            { k: 'Harvest window', v: record.harvest.window },
          ]
        : [],
      ...intakeState,
      note: null,
    },
    {
      key: 'delivery',
      label: 'Delivery',
      title: centre ? `${centre.name} → ${record.processing.facility}` : `To ${record.processing.facility}`,
      rows: delivery
        ? [
            { k: 'Day lots', v: String(delivery.dayLots) },
            { k: 'Weigh-in tickets', v: kg(delivery.ticketsTotalKg) },
            { k: 'Weighed at factory', v: kg(delivery.weighedKg) },
            { k: 'Variance', v: `${delivery.varianceKg > 0 ? '+' : ''}${delivery.varianceKg} kg` },
            delivery.signOffId ? { k: 'Period sign-off', v: delivery.signOffId } : null,
          ].filter(Boolean)
        : [],
      ...deliveryState,
      status: delivery?.varianceStatus === 'flagged' ? 'flagged' : deliveryState.status,
      note:
        delivery?.varianceStatus === 'flagged'
          ? 'Weighed leaf differs from the weigh-in tickets by more than the reconciliation tolerance. The record stays flagged even after sign-off.'
          : null,
    },
    {
      key: 'processing',
      label: 'Processing',
      title: record.processing.facility,
      rows: [
        { k: 'Factory lot', v: record.processing.lotId },
        { k: 'Processed', v: record.processing.processedAt },
        { k: 'Method', v: record.processing.method },
      ],
      ...processingState,
      note: null,
    },
    {
      key: 'batch',
      label: 'Batch',
      title: record.traceId,
      rows: [
        { k: 'Sealed', v: record.batch.sealedAt },
        { k: 'Made tea', v: kg(record.batch.madeTeaKg) },
        { k: 'Grade', v: record.batch.grade },
        { k: 'Standard', v: record.verification.standard },
        { k: 'Reference', v: record.verification.reference },
      ],
      status: record.verification.status === 'Verified' ? 'verified' : record.verification.status === 'Not tracked' ? 'not_recorded' : 'pending',
      attestation:
        record.verification.status === 'Verified'
          ? { role: 'Zone GIS officer', org: 'Nyayo Tea Zones Development Corporation', independence: 'internal_separate', at: satellite.date }
          : null,
      note: null,
    },
    buyerStage(commitment),
  ]

  const traced = stages.filter((stage) => TRACED_STAGE_KEYS.includes(stage.key))
  return {
    stages,
    fullyTraced: traced.every((stage) => stage.status === 'verified'),
    verifiedCount: traced.filter((stage) => stage.status === 'verified').length,
    exceptions: stages.filter((stage) => stage.status === 'flagged').map((stage) => stage.key),
  }
}

function buyerStage(commitment) {
  if (!commitment) {
    return {
      key: 'buyer',
      label: 'Buyer',
      title: 'Not yet allocated',
      rows: [{ k: 'Availability', v: 'Offered to every buyer on the portal' }],
      status: 'open',
      attestation: null,
      note: null,
    }
  }
  const delivered = commitment.status === 'delivered'
  return {
    key: 'buyer',
    label: 'Buyer',
    title: 'Your organisation',
    rows: [
      { k: 'Commitment', v: commitment.id },
      { k: 'Your reference', v: commitment.reference },
      { k: 'Status', v: commitment.status.replace('_', ' ') },
    ],
    status: delivered ? 'verified' : 'pending',
    attestation: null,
    note: delivered ? null : 'Allocated to you; delivery not yet confirmed.',
  }
}
