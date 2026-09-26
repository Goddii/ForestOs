// ── ForestOS — offtaker (tea buyer) contracts ───────────────────────────────
// The hand-off shapes the Offtaker Portal (`/offtaker/:orgSlug/*`) reads. The
// portal owns no facts of its own: batches come from the canonical chain
// (`lib/batchChain.js`), organisations from the shared registry
// (`data/funder/organisations.js`), conservation from the programme records
// (`data/funder/*`, `data/investor/evidence.js`). The shapes below cover only
// the supply-side records the buyer needs that nothing else carried yet —
// collection-centre intake, delivery reconciliation, quality assessments,
// documents, production forecasts and buyer commitments — each keyed to ids
// that already exist (batch `traceId`, organisation `id`, evidence `id`).
//
// Conventions follow `./programme.js`: ISO dates, integer KES, decimal shares.
// Redaction happens at the workspace boundary (`data/offtaker/workspace.js`):
// farmer identities never leave it, whatever the buyer's role.

export const OFFTAKER_ID_PREFIX = {
  centre: 'CC', // collection centre              — CC-KPT
  intake: 'INT', // green-leaf intake for a batch  — INT-2026-00482
  delivery: 'DLV', // centre → factory reconciliation — DLV-2026-00482
  quality: 'QA', // quality assessment             — QA-2026-00482
  document: 'DOC', // compliance / batch document  — DOC-0107
  forecast: 'FC', // expected production           — FC-KPT-2026-10
  commitment: 'CMT', // buyer order / commitment     — CMT-2026-0012
}

/**
 * Who the buying organisation is. Drives language and defaults, never access.
 * @typedef {'brand_packer'|'exporter'|'processor'} BuyerType
 */
export const BUYER_TYPES = ['brand_packer', 'exporter', 'processor']

/**
 * The viewer's job inside the buying organisation. Access follows the role
 * (`data/offtaker/roles.js`), so two people at one buyer can see different
 * documents and different geolocation precision.
 * @typedef {'procurement'|'quality'|'compliance'|'sustainability'|'admin'} OfftakerRole
 */
export const OFFTAKER_ROLES = ['procurement', 'quality', 'compliance', 'sustainability', 'admin']

/**
 * @typedef {Object} CollectionCentre
 * @property {string} id              CC-KPT
 * @property {string} name            Kiptunga
 * @property {string} blockId         → batchChain record `block.id`
 * @property {string} beltBlockId     → platformData BELT_BLOCKS id (mau, aberdares…)
 * @property {string} zone            human-readable source zone
 * @property {string} factory         the NTZDC factory the centre delivers to
 * @property {number} lat
 * @property {number} lon
 * @property {string[]} segmentIds    buffer segments the centre's catchment overlaps (data/funder/geography.js)
 * @property {string[]} landscapeFeatureIds conservation zones in data/investor/landscape.js
 */

/**
 * @typedef {'coarse_leaf'|'wet_leaf'|'foreign_matter'|'damaged_leaf'|'late_delivery'} RejectionReason
 */
export const REJECTION_REASONS = ['coarse_leaf', 'wet_leaf', 'foreign_matter', 'damaged_leaf', 'late_delivery']

/**
 * Green leaf received at the collection centre for one batch.
 * @typedef {Object} IntakeRecord
 * @property {string} id
 * @property {string} batchTraceId
 * @property {string} centreId
 * @property {number} receivedKg
 * @property {number} acceptedKg
 * @property {number} rejectedKg
 * @property {Array<{ reason: RejectionReason, kg: number }>} rejections
 * @property {import('./programme').VerificationEvent[]} verification
 */

/**
 * The centre → factory reconciliation (the aggregate of `DayLot`s in
 * `./shapes.js`): weighed leaf against the sum of its tickets. The buyer sees
 * the totals and the variance status — never ticket, worker or supervisor ids.
 * @typedef {Object} DeliveryReconciliation
 * @property {string} id
 * @property {string} batchTraceId
 * @property {number} dayLots
 * @property {number} ticketsTotalKg
 * @property {number} weighedKg
 * @property {'within_tolerance'|'flagged'} varianceStatus
 * @property {string} dispatchedAt
 * @property {string} receivedAt
 * @property {?string} signOffId      SGN-… when a named zone manager attested the period
 * @property {import('./programme').VerificationEvent[]} verification
 */

/**
 * A metric the quality view can show. Configurable: which metrics appear, and
 * how each is measured, is data. ForestOS sets no pass/fail thresholds — a
 * buyer's specification belongs in its own contract.
 * @typedef {Object} QualityMetric
 * @property {string} id
 * @property {string} label
 * @property {string} unit
 * @property {'intake'|'factory'|'laboratory'} stage
 * @property {string} method
 * @property {?number} scaleMax       fixed scale top for charts (100 for a %), null otherwise
 */

/**
 * @typedef {Object} QualityAssessment
 * @property {string} id
 * @property {string} batchTraceId
 * @property {string} assessedAt
 * @property {string} byRole
 * @property {string} byOrgId
 * @property {Record<string, number>} metrics  keyed by QualityMetric id
 * @property {string} notes          descriptive tasting notes, never a grade claim
 * @property {?string} documentId    the quality report in the document library
 * @property {import('./programme').VerificationEvent[]} verification
 */

/**
 * @typedef {'certificate'|'batch_document'|'quality_report'|'traceability_report'|'verification_record'} DocumentKind
 * @typedef {'programme'|'zone'|'factory'|'batch'} DocumentScope
 */
export const DOCUMENT_KINDS = ['certificate', 'batch_document', 'quality_report', 'traceability_report', 'verification_record']

/**
 * @typedef {Object} ComplianceDocument
 * @property {string} id
 * @property {DocumentKind} kind
 * @property {string} title
 * @property {string} issuerOrgId
 * @property {string} issuedDate
 * @property {?string} expiryDate     null when the document does not expire
 * @property {DocumentScope} scope
 * @property {?string} scopeRef       batch traceId, centre id or factory name for the scope
 * @property {string[]} evidenceIds   → data/investor/evidence.js
 * @property {OfftakerRole[]} audience roles that may open it
 * @property {boolean} requiredForBuyers  counts toward "outstanding" when missing or lapsed
 * @property {?string} withdrawnReason
 * @property {import('./programme').VerificationEvent[]} verification
 */

/**
 * Expected made-tea production. Always an estimate (`valueType: 'estimated'`).
 * @typedef {Object} SupplyForecast
 * @property {string} id
 * @property {string} centreId
 * @property {string} period          YYYY-MM
 * @property {number} expectedKg
 * @property {number} lowKg
 * @property {number} highKg
 * @property {string} basis
 */

/**
 * @typedef {'requested'|'reserved'|'confirmed'|'in_transit'|'delivered'|'cancelled'} CommitmentStatus
 */
export const COMMITMENT_STATUSES = ['requested', 'reserved', 'confirmed', 'in_transit', 'delivered', 'cancelled']

/**
 * A buyer's order against NTZDC supply. Batches allocated to one buyer are
 * invisible to every other buyer.
 * @typedef {Object} Commitment
 * @property {string} id
 * @property {string} offtakerOrgId
 * @property {'contract'|'spot'} type
 * @property {string} reference       the buyer's own PO / contract reference
 * @property {{ start: string, end: string }} period
 * @property {number} volumeKg
 * @property {string[]} batchTraceIds
 * @property {CommitmentStatus} status
 * @property {?number} priceKesPerKg  commercial — shown only to roles with `commercialTerms`
 * @property {Array<{ date: string, volumeKg: number, batchTraceId: ?string, status: 'scheduled'|'dispatched'|'delivered' }>} schedule
 */

export {}
