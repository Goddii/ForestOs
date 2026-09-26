// ── ForestOS — programme, funding and verification contracts ────────────────
// The hand-off shapes for the funder-agnostic model described in
// docs/FORESTOS_PROGRAMME_ARCHITECTURE_AUDIT.md §7. Frontend only: the funder
// workspace renders from seeded demo data in `src/data/funder/` that follows
// these shapes exactly, so a backend can replace the seed with API responses
// at the data barrel without any component changing.
//
// Conventions: ids use the prefixes below (the batch/claim prefixes stay in
// `./ids.js`); dates are ISO 8601 (`YYYY-MM-DD`); money is integer Kenya
// shillings (KES); shares are decimal fractions.

export const PROGRAMME_ID_PREFIX = {
  organisation: 'ORG',
  programme: 'PRG',
  agreement: 'AGR',
  tranche: 'TRN',
  segment: 'SEG',
  activity: 'ACT',
  observation: 'OBS',
  report: 'RPT',
}

/** @typedef {'implementer'|'funder'|'offtaker'|'government'|'technology'|'verifier'} OrganisationType */
export const ORGANISATION_TYPES = ['implementer', 'funder', 'offtaker', 'government', 'technology', 'verifier']

/**
 * How the money is given — drives the workspace's language, never its structure.
 * @typedef {'grant'|'csr'|'investment'|'in_kind'} FundingType
 */
export const FUNDING_TYPES = ['grant', 'csr', 'investment', 'in_kind']

/**
 * Every figure the workspace renders declares what kind of number it is.
 * @typedef {'target'|'reported'|'verified'|'estimated'|'baseline'|'evaluated'|'context'} ValueType
 */
export const VALUE_TYPES = ['target', 'reported', 'verified', 'estimated', 'baseline', 'evaluated', 'context']

/**
 * One state machine for anything that can be claimed (lib/programme/verificationState.js).
 * @typedef {'draft'|'submitted'|'under_review'|'verified'|'rejected'|'correction_required'} VerificationState
 */
export const VERIFICATION_STATES = ['draft', 'submitted', 'under_review', 'verified', 'rejected', 'correction_required']

/**
 * How independent the verifier is from whoever did the work.
 * @typedef {'self'|'internal_separate'|'independent'|'external_audit'} Independence
 */
export const INDEPENDENCE_LEVELS = ['self', 'internal_separate', 'independent', 'external_audit']

/** @typedef {'desk'|'field'|'remote_sensing'|'third_party'} VerificationMethod */

/** @typedef {'ntzdc_buffer'|'community_land'|'gazetted_forest'} Tenure */
export const TENURES = ['ntzdc_buffer', 'community_land', 'gazetted_forest']

/** @typedef {'output'|'outcome'|'impact'} ResultLevel */

/**
 * @typedef {Object} Organisation
 * @property {string} id              ORG-…
 * @property {string} slug            URL key for the funder workspace
 * @property {string} name
 * @property {OrganisationType} type
 * @property {boolean} isPlaceholder  true while the real organisation's details are unconfirmed
 */

/**
 * @typedef {Object} Programme
 * @property {string} id
 * @property {string} implementerOrgId
 * @property {string} name
 * @property {string} status
 * @property {string} startDate
 * @property {string} endDate
 * @property {string} goal
 * @property {'KES'} currency
 */

/**
 * @typedef {Object} ProgrammeComponent
 * @property {string} id
 * @property {string} code            e.g. "B.1"
 * @property {string} title
 */

/**
 * @typedef {Object} Indicator
 * @property {string} id
 * @property {string} componentId
 * @property {ResultLevel} level
 * @property {string} label
 * @property {string} unit
 * @property {?number} target
 * @property {string} targetDate
 * @property {string} method
 * @property {string[]} meansOfVerification
 * @property {string[]} disaggregations
 */

/**
 * @typedef {Object} Tranche
 * @property {string} id
 * @property {string} milestone
 * @property {string} plannedDate
 * @property {number} plannedKes
 * @property {?string} receivedDate   null until the money has actually arrived
 * @property {?number} receivedKes
 */

/**
 * @typedef {Object} Allocation
 * @property {string} id              also the expenditure ledger's `categoryId`
 * @property {string} label
 * @property {string} componentId
 * @property {number} budgetKes
 * @property {number} allocatedKes    formally assigned to work so far
 * @property {string[]} outputs
 * @property {string[]} outcomeIds
 */

/**
 * @typedef {Object} FundingAgreement
 * @property {string} id
 * @property {string} funderOrgId
 * @property {string} programmeId
 * @property {FundingType} type
 * @property {number} amountKes
 * @property {string} signedDate
 * @property {{ start: string, end: string }} period
 * @property {string[]} restrictions  human-readable ring-fencing terms
 * @property {Tranche[]} tranches
 * @property {Allocation[]} allocations
 * @property {string} disclosurePolicyId
 */

/**
 * @typedef {Object} BufferSegment
 * @property {string} id
 * @property {string} label
 * @property {string} zone
 * @property {number} lengthKm
 * @property {number} widthM          nominal ~100 m buffer
 * @property {Tenure} tenure
 * @property {'tea'|'fuelwood'|'indigenous'|'gap'|'mixed'} landUse
 * @property {Array<[number, number]>} geometry  [lat, lon] centre line
 * @property {string} source          where the geometry came from
 * @property {number} accuracyM
 */

/**
 * @typedef {Object} VerificationEvent
 * @property {VerificationState} state
 * @property {string} at
 * @property {string} byRole          a role, never a person's name, in funder-facing data
 * @property {string} byOrgId
 * @property {Independence} independence
 * @property {VerificationMethod} [method]
 * @property {string} [note]
 */

/**
 * @typedef {Object} ActivityRecord
 * @property {string} id
 * @property {string} programmeId
 * @property {string} allocationId    → FundingAgreement.allocations — how activities attribute to a funder
 * @property {string} interventionTypeId
 * @property {string} segmentId
 * @property {?string} landscapeFeatureId  conservation zone in landscape.js, when inside one
 * @property {string} date
 * @property {string} summary
 * @property {Array<{ indicatorId: string, value: number }>} outputs
 * @property {?{ households: number, womenHeaded: number }} beneficiaries
 * @property {string} recordedBy      internal staff id — stripped by the disclosure projection
 * @property {string[]} evidenceIds
 * @property {VerificationEvent[]} verification  append-only history, oldest first
 */

/**
 * @typedef {Object} MonitoringObservation
 * @property {string} id
 * @property {string} activityId
 * @property {'survival'} kind
 * @property {number} monthsAfter
 * @property {string} dueDate
 * @property {?string} observedDate   null until done
 * @property {?number} value          survival % — null until observed
 * @property {string} method
 * @property {?string} evidenceId
 */

/**
 * @typedef {Object} ReportInstance
 * @property {string} id
 * @property {string} title
 * @property {string[]} agreementIds  which funders it was issued to
 * @property {string} period
 * @property {string} coverage
 * @property {'ready'|'in_review'|'scheduled'} status
 * @property {Array<{ step: string, at: ?string }>} approvals  PIU review → PTC approval → issued
 * @property {?Array<{ label: string, value: string }>} snapshot  figures frozen at issue — never recomputed live
 * @property {string} dataCoverage
 * @property {number} evidenceCoveragePct
 * @property {string[]} dataSources
 */

/**
 * @typedef {Object} DisclosurePolicy
 * @property {string} id
 * @property {string} audience
 * @property {number} householdFloor  counts below this render as "fewer than N"
 * @property {'site'|'segment'|'zone'} geoPrecision
 * @property {string[]} visible
 * @property {string[]} withheld
 */

export {}
