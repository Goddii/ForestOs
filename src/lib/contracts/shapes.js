// ── Forest Line — frontend ↔ backend data contracts ─────────────────────────
// The shapes the UI screens expect, so the frontend (mock) and backend (real
// API) can be built in parallel and swapped without surprises. These match the
// team's "Forest Line — frontend data contracts" doc; where the UI needs a field
// the doc does not carry, it is marked PROPOSED and listed for the stakeholder
// meeting rather than silently invented.
//
// Conventions: ids use the prefixes in `./ids.js`; timestamps are ISO 8601
// (UTC); rates that are shares (rejection rate, training coverage) are decimal
// fractions, not percentages. Redaction happens at the API boundary — the buyer
// and consumer payloads simply omit `farmerId` / `reportedBy` server-side.

/**
 * @typedef {'tree_planting'|'buffer_maintenance'|'erosion_control'|'invasive_removal'|'fire_report'} ClaimType
 * @typedef {'reported'|'field_verified'|'evidence_attached'|'satellite_checked'|'verified'|'rejected'} ClaimStage
 * @typedef {'pest'|'disease'|'poor_growth'|'drought'|'flooding'|'weeds'|'erosion'|'fire'|'other'} ProblemType
 * @typedef {'low'|'medium'|'high'} Severity
 * @typedef {'received'|'officer_notified'|'field_verification'|'intervention'|'outcome_recorded'} ProblemStatus
 * @typedef {'direct_sold'|'branded'|'auction'} Channel
 * @typedef {'verified'|'pending'|'flagged'} ConservationStatus
 * @typedef {'active'|'pending_renewal'|'expired'} PassportStatus
 */

export const CLAIM_TYPES = ['tree_planting', 'buffer_maintenance', 'erosion_control', 'invasive_removal', 'fire_report']
export const CLAIM_STAGES = ['reported', 'field_verified', 'evidence_attached', 'satellite_checked', 'verified', 'rejected']
export const PROBLEM_TYPES = ['pest', 'disease', 'poor_growth', 'drought', 'flooding', 'weeds', 'erosion', 'fire', 'other']
export const SEVERITIES = ['low', 'medium', 'high']
export const PROBLEM_STATUSES = ['received', 'officer_notified', 'field_verification', 'intervention', 'outcome_recorded']
export const CHANNELS = ['direct_sold', 'branded', 'auction']

/**
 * Verification claim — Verification Queue.
 * @typedef {Object} VerificationClaim
 * @property {string}   claimId       VER-0142
 * @property {ClaimType} type
 * @property {string}   plotId        NTZ-A-014
 * @property {string}   blockId       KIP
 * @property {string}   reportedBy    RVT-0887  — internal only, never in buyer/consumer payloads
 * @property {string}   reportedAt    ISO 8601
 * @property {ClaimStage} stage
 * @property {?string}  officerNote
 * @property {?string}  photoUrl
 * @property {?{lat:number,lng:number}} gpsCoords
 * @property {?number}  ndviDelta     same source as Satellite Recovery
 * @property {?string}  verifiedAt    ISO 8601, null until verified
 * @property {?string}  reportedWork  PROPOSED — the submission's quantity/description text
 * @property {?string}  assignedOfficer PROPOSED — the field officer's name/handle
 * @property {?number}  ndviBaseline  PROPOSED — needed to draw the baseline→current bars
 * @property {?number}  ndviCurrent   PROPOSED
 * @property {?number}  photoCount    PROPOSED — the UI shows an evidence tile per photo
 */

/**
 * Problem report — Problem Reports.
 * @typedef {Object} ProblemReport
 * @property {string} reportId          PR-0231
 * @property {string} farmerId          RVT-0912  — internal only
 * @property {string} centre            Tinet
 * @property {ProblemType} problemType
 * @property {Severity} severity
 * @property {ProblemStatus} status
 * @property {?string} assignedOfficer  Node A
 * @property {string} reportedAt        ISO 8601
 * @property {?string} outcome
 * @property {?boolean} overdue         PROPOSED — past the response window and not yet closed
 */

/**
 * Zone comparison row — NTZDC Management → Zone Comparison.
 * @typedef {Object} ZoneComparisonRow
 * @property {string} zoneId                 SW-MAU
 * @property {string} zoneName               South West Mau
 * @property {number} baseRateKes
 * @property {number} qualityPremiumKes
 * @property {number} conservationPremiumKes
 * @property {number} totalPayoutKes
 * @property {number} rejectionRate          decimal fraction (0.042)
 * @property {number} trainingCoverage       decimal fraction (0.95)
 */

/**
 * Conservation passport — Buyer / Brand View → Conservation Passport.
 * @typedef {Object} ConservationPassport
 * @property {string}   passportId               CP-2026-0007
 * @property {string}   brand
 * @property {string[]} bufferZones              PROPOSED plural — a buyer sources from several
 * @property {number}   volumeSourcedKg
 * @property {string}   conservationActivity     free-text summary
 * @property {number}   farmersRepresented       count only — never names or ids
 * @property {number}   bufferHectaresAttributed
 * @property {string[]} verificationRecords      ["EUDR-C-118", "NDVI-2026Q3"]
 * @property {PassportStatus} status
 */

/**
 * Batch record — shared across internal Batch Lookup, Buyer Portal and the
 * public QR site. One shape, three redaction levels (the payload for buyer /
 * consumer omits `farmerId`).
 * @typedef {Object} BatchRecord
 * @property {string} batchId              TL-2026-00482
 * @property {string} originZone           Nyayo Tea Zone / South West Mau
 * @property {string} blockId              NTZ-A-014
 * @property {string} collectionCentre     Kiptunga
 * @property {string} harvestDate          ISO date
 * @property {number} quantityKg
 * @property {Channel} channel             buyer / consumer never see 'auction'
 * @property {ConservationStatus} conservationStatus
 * @property {('field'|'satellite')[]} verificationMethod
 * @property {?string} farmerId            internal-only — omit from buyer and consumer payloads
 */

/**
 * Visitor passport — PROPOSED. The record a tenant-owned consumer experience
 * (`/passport/:tenantSlug/:batchId`, `TenantEarnSection`) needs once a real
 * backend exists to make "every scan progressively builds something around
 * this person" actually durable, instead of the visual-only, derived-from-
 * the-batch-id preview it renders today. Shared across channels by design —
 * the web frontend, the companion mobile app, and USSD flows should all read
 * and write the same passport rather than each keeping their own notion of a
 * visitor's collection/status.
 * @typedef {Object} VisitorPassport
 * @property {string} passportId          PSP-2026-00931 — see `ID_PREFIX`; add a `passport` entry there once this is real
 * @property {string} tenantSlug          majani — → `src/lib/tenants.js` TENANTS
 * @property {Stamp[]} stamps
 * @property {string} tier                matches the owning tenant's `collection.tierLabel`
 * @property {?string} ownerContact       PROPOSED — phone number or other identifier once a real identity exists (no accounts today; USSD in particular will need one)
 */

/**
 * @typedef {Object} Stamp
 * @property {string} batchId             the scanned batch that earned this stamp
 * @property {string} tenantSlug
 * @property {string} earnedAt            ISO 8601
 * @property {?{lat:number,lng:number}} geo   PROPOSED — only if the scan flow captures location
 */

// ── Forest Line field-capture records ───────────────────────────────────────
// The sibling repo `Forest-Line-App` (branch `presentation-v2`) is the field
// capture layer: the USSD/worker and supervisor edge where records are actually
// created. Its `designs/docs/04-data-contract.md` maps every one of its screens
// onto the shapes above, and proposes six records that do not exist here yet.
//
// They are declared here because they are the gap between what ForestOS
// *displays* and what it can *prove*. Today `dashboardData.js` carries
// `FAIR_PAY` as premium-per-kg aggregates and `forestLine.js` records
// `pluckers: 1240` against a harvest as a bare integer — an auditor asking
// "show me the 1,240 payments" has nothing to look at. These six are what turn
// those assertions into evidence.
//
// The governing rule from that repo, which this file adopts:
//
//   Every number shown to an outsider must decompose into records that each
//   carry an identity, a location, a time, and an independent corroboration.
//
// Redaction is unchanged: buyer and consumer payloads omit `workerId` /
// `farmerId` / `recordedBy` at the API boundary. Aggregate contribution counts
// go out; people's names never do.

/**
 * @typedef {'plucking'|'pruning'|'weeding'|'fertilizer'|'planting'|'nursery'} WorkTask
 * @typedef {'kg'|'seedlings'|'hours'} WorkUnit
 * @typedef {'recorded'|'approved'|'paid'|'disputed'} TicketStatus
 * @typedef {'within_tolerance'|'flagged'} VarianceStatus
 * @typedef {'6m'|'12m'|'24m'} SurvivalInterval
 */

export const WORK_TASKS = ['plucking', 'pruning', 'weeding', 'fertilizer', 'planting', 'nursery']
export const WORK_UNITS = ['kg', 'seedlings', 'hours']
export const TICKET_STATUSES = ['recorded', 'approved', 'paid', 'disputed']
export const SURVIVAL_INTERVALS = ['6m', '12m', '24m']

/**
 * The atom of the whole system — one person's output on one plot on one day,
 * witnessed at a supervised weigh-in. Everything downstream decomposes to this.
 * @typedef {Object} WorkTicket
 * @property {string} ticketId      WT-2026-004182
 * @property {string} workerId      RVT-0887 — internal only, never in buyer/consumer payloads
 * @property {string} plotId        KIP-09
 * @property {string} blockId       KIP
 * @property {string} zoneId        SW-MAU
 * @property {WorkTask} task
 * @property {number} quantity
 * @property {WorkUnit} unit
 * @property {number} rateKes
 * @property {string} recordedAt    ISO 8601
 * @property {string} recordedBy    SUP-KIP-02 — the supervisor who witnessed it; internal only
 * @property {string} dayLotId      LOT-KIP-20260916
 * @property {TicketStatus} status
 * @property {'supervisor_device'|'ussd'} capture
 * @property {?{lat:number,lng:number}} gps
 */

/**
 * Who turned up on a block and what they were assigned — the ghost-worker
 * baseline and the turnout signal.
 * @typedef {Object} MusterRecord
 * @property {string} musterId      MUS-KIP-20260916
 * @property {string} blockId
 * @property {string} date          ISO date
 * @property {string[]} workerIds   internal only
 * @property {number} expected
 * @property {number} presentCount
 * @property {string} calledBy      supervisor id
 */

/**
 * The reconciliation point, and the most important of the six: the join
 * between per-person work and the consignment ForestOS already tracks. The
 * physically weighed lot must equal the sum of its tickets within tolerance —
 * a gap is an alarm, not a rounding note. This is the seam where product
 * traceability either holds or fails, and the defence against buying leaf in
 * from outside the buffer to inherit its conservation story.
 * @typedef {Object} DayLot
 * @property {string} lotId            LOT-KIP-20260916
 * @property {string} blockId
 * @property {string} date             ISO date
 * @property {number} ticketCount
 * @property {number} ticketsTotalKg   Σ of the day's WorkTickets
 * @property {number} weighedKg        the physical lot weight
 * @property {number} varianceKg       weighedKg − ticketsTotalKg
 * @property {VarianceStatus} varianceStatus
 * @property {string} closedBy         supervisor id
 * @property {string} dispatchedTo     CC-KPT — collection centre
 * @property {string} harvestId        HRV-2026-0412 — links into the existing chain
 */

/**
 * One worker's settled pay for a period, broken into the three rates ForestOS
 * already separates. This is the row beneath `FAIR_PAY`: it makes the fair-pay
 * claim survive an auditor, and makes the documented west/east belt pay gap
 * measurable per block instead of per belt.
 * @typedef {Object} PaymentRecord
 * @property {string} paymentId              PAY-2026-019844
 * @property {string} workerId               internal only
 * @property {string} periodStart            ISO date
 * @property {string} periodEnd              ISO date
 * @property {string[]} ticketIds            the tickets this settles
 * @property {number} baseKes
 * @property {number} qualityPremiumKes
 * @property {number} conservationPremiumKes conditional — released against verified conservation
 * @property {number} totalKes
 * @property {'mpesa'} channel
 * @property {string} mpesaRef               Daraja transaction id, reconciled against the payroll line
 * @property {string} approvedBy             supervisor id
 * @property {string} signedOffBy            zone manager id
 * @property {string} settledAt              ISO 8601
 * @property {?string} workerNotifiedAt      ISO 8601 — the SMS receipt the worker can dispute from
 */

/**
 * A scheduled re-check of a planting claim's SAME polygon. This is what lets
 * ForestOS say "survival-adjusted" instead of "planted", and answers the
 * brief's sharpest question — proving a tree was planted AND survived.
 * The bonus follows survival rather than planting (proposed 40/40/20 across
 * planting, 12 months and 24 months), so the planter keeps a standing reason
 * to protect the tree.
 * @typedef {Object} SurvivalCheck
 * @property {string} checkId          SVC-2026-00731
 * @property {string} claimId          VER-0142 — the planting claim it re-checks
 * @property {SurvivalInterval} interval
 * @property {string} dueAt            ISO date
 * @property {?string} checkedAt       ISO 8601, null until checked
 * @property {?string} checkedBy       supervisor id; internal only
 * @property {number} planted
 * @property {?number} aliveCount
 * @property {?number} survivalRate    decimal fraction
 * @property {string[]} photoUrls
 * @property {?{lat:number,lng:number}} gps
 * @property {?number} ndviAtCheck     Sentinel-2 at that polygon — independent corroboration
 * @property {?number} bonusReleasedKes
 */

/**
 * A named human attesting to a period's records before they leave the system.
 * Automated data plus a signature is auditable; automated data alone is what
 * carbon-credit projects were caught with.
 *
 * The boundary rule: nothing leaves ForestOS as a "verified" claim unless a
 * SignOff covers its period.
 * @typedef {Object} SignOff
 * @property {string} signOffId    SGN-SWMAU-2026-09
 * @property {'zone_period'|'block_period'} scope
 * @property {string} zoneId
 * @property {?string} blockId     set when scope is block_period
 * @property {string} periodStart  ISO date
 * @property {string} periodEnd    ISO date
 * @property {{workTickets:number,dayLots:number,claims:number,payments:number}} covers
 * @property {number} exceptionsOpen
 * @property {string} attestation  the words the signer is held to
 * @property {string} signedBy     ZM-SWMAU-01
 * @property {string} signedAt     ISO 8601
 * @property {string} hash         sha256:… over the covered record set
 */

export {}
