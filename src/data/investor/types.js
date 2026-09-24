// Shared JSDoc typedefs for the ESG investor experience. No runtime code —
// this file exists so every data module and component can reference one
// contract, and so the shape is obvious to whoever wires a real API in later.
// Kept in plain JS (no `.ts`) to match the rest of the repo.

/**
 * @typedef {'verified' | 'field_verified' | 'satellite_verified' | 'pending_verification' | 'incomplete'} ConfidenceStatus
 * Why a record is considered verified, never a numeric "trust score".
 */

/**
 * @typedef {'low' | 'medium' | 'high'} RiskSeverity
 */

/**
 * @typedef {'environmental' | 'social' | 'operational' | 'financial' | 'data'} RiskCategory
 */

/**
 * @typedef {Object} InvestorProject
 * @property {string} name
 * @property {string} location
 * @property {string} region
 * @property {[number, number]} centroid - [lon, lat]
 * @property {'active' | 'onboarding' | 'closed'} status
 * @property {string} reportingPeriod
 * @property {string} problem
 * @property {string} implementer
 * @property {string} beneficiaries
 * @property {string} sustainabilityModel
 */

/**
 * @typedef {Object} CapitalPosition
 * @property {number} committed - KSh
 * @property {number} allocated - KSh
 * @property {number} deployed - KSh
 * @property {number} verified - KSh, deployed capital with verified evidence behind it
 * @property {string} currency
 */

/**
 * @typedef {Object} CapitalAllocation
 * @property {string} id
 * @property {string} category
 * @property {number} budget - KSh, planned share of the commitment
 * @property {number} allocated - KSh, formally assigned to work so far
 * @property {number} deployed - KSh, derived: sum of this category's expenditures
 * @property {number} verified - KSh, derived: sum of its verified expenditures
 * @property {number} pendingVerification - KSh, derived: deployed - verified
 * @property {number} remaining - KSh, derived: budget - deployed
 * @property {number} percentage - share of total budget, 0-100
 * @property {string[]} outputs - what the category's spend has produced
 * @property {string[]} outcomeIds - CORE_OUTCOMES ids it contributes to
 * @property {Expenditure[]} expenditures - derived: its ledger rows
 */

/**
 * One disbursement in the expenditure ledger — the proposed backend
 * contract. Deployed and verified capital are computed from these rows.
 *
 * @typedef {Object} Expenditure
 * @property {string} id
 * @property {string} date - ISO date, YYYY-MM-DD
 * @property {string} categoryId - funding-agreement allocation id (src/data/funder/agreements.js)
 * @property {string} description - the activity the money paid for
 * @property {number} amount - KSh
 * @property {'verified' | 'pending_verification'} status
 * @property {string[]} evidenceIds - EvidenceRecord ids for that activity
 * @property {string[]} activityIds - ActivityRecord ids it paid for (src/data/funder/activities.js)
 */

/**
 * Every funder of the programme, so impact can be reported gross (whole
 * programme) and attributed (this fund's share).
 *
 * @typedef {Object} ProgrammeFunding
 * @property {Array<{ label: string, type: string, amount: number, isInvestor: boolean }>} sources
 * @property {string} attributionMethod
 */

/**
 * @typedef {Object} CapitalTimelineStep
 * @property {string} period - e.g. "2026 Q1"
 * @property {string} label
 * @property {string} detail
 * @property {'complete' | 'active' | 'upcoming'} state
 */

/**
 * @typedef {Object} ConservationMetric
 * @property {string} id
 * @property {string} label
 * @property {number} value
 * @property {string} unit
 * @property {string} eyebrow - section label, e.g. "LANDSCAPE"
 * @property {ConfidenceStatus} confidence
 * @property {string} evidenceId - links into evidence.js
 */

/**
 * @typedef {Object} ImpactMetric
 * @property {string} id
 * @property {'environmental' | 'social' | 'economic' | 'governance'} pillar
 * @property {string} label
 * @property {number} current
 * @property {number} baseline
 * @property {number|null} target
 * @property {string} unit
 * @property {'up' | 'down' | 'flat'} trend
 * @property {string} evidenceSummary
 * @property {string} methodology
 * @property {ConfidenceStatus} confidence
 */

/**
 * @typedef {Object} EvidenceRecord
 * @property {string} id
 * @property {'satellite' | 'gis' | 'field_audit' | 'gps' | 'photo' | 'farmer_record' | 'conservation_activity' | 'payment_record' | 'verification_document'} type
 * @property {string} title
 * @property {string} location
 * @property {string} date
 * @property {ConfidenceStatus} status
 * @property {string} relatedMetric
 * @property {string} relatedActivity
 * @property {string} responsibleTeam
 * @property {string} programme
 * @property {Object} detail
 * @property {string} detail.observation
 * @property {string} detail.source
 * @property {number} detail.fieldVerificationCount
 * @property {string} detail.lastVerification
 * @property {string[]} detail.auditTrail
 */

/**
 * @typedef {Object} RiskRecord
 * @property {string} id
 * @property {RiskCategory} category
 * @property {string} affectedArea
 * @property {string} [zoneId] - present when affectedArea maps to a mapped conservation zone; links into landscape.js
 * @property {string} description
 * @property {'open' | 'monitoring' | 'mitigated' | 'closed'} status
 * @property {RiskSeverity} severity
 * @property {string} owner
 * @property {string} mitigation
 * @property {string} lastReviewed
 * @property {string} relatedEvidenceId
 */

/**
 * @typedef {Object} GovernanceMember
 * @property {string} name
 * @property {string} role
 * @property {'implementing_organization' | 'conservation_manager' | 'field_team' | 'verification_partner' | 'technology_partner' | 'funder'} function
 * @property {string} responsibility
 */

/**
 * @typedef {Object} Report
 * @property {string} id
 * @property {string} title
 * @property {string} period
 * @property {string} coverage - human-readable date range, e.g. "01 Jul – 30 Sep 2026"
 * @property {string} generatedDate
 * @property {'ready' | 'in_review' | 'scheduled'} status
 * @property {string} dataCoverage
 * @property {number} evidenceCoveragePct
 * @property {string[]} dataSources
 */

/**
 * @typedef {Object} LandscapeObservation
 * @property {string} id
 * @property {'boundary' | 'conservation_area' | 'farm_area' | 'monitoring_zone' | 'field_activity' | 'verification_point'} layer
 * @property {'polygon' | 'point'} geometryType
 * @property {Array<[number, number]> | [number, number]} geometry - [lat, lon] pairs, or one pair for a point
 * @property {string} label
 * @property {ConfidenceStatus} [confidence]
 * @property {string} [evidenceId] - links into evidence.js
 * @property {ZoneDetail} [zone] - present on conservation_area polygons only
 */

/**
 * @typedef {Object} ZoneDetail
 * @property {number} areaHa
 * @property {string} status
 * @property {string} lastObservation
 * @property {number} fieldActivities
 * @property {number} verificationRecords
 */

/**
 * A photo in the field-media store. `src` has no extension — `.webp` and
 * `.jpg` both exist. `isIllustrative` marks stock imagery standing in for a
 * real programme capture; `showsPeople` marks images that need consented
 * replacements before public marketing use.
 *
 * @typedef {Object} MediaAsset
 * @property {string} id
 * @property {string} src
 * @property {number} width
 * @property {number} height
 * @property {string} alt
 * @property {string} caption
 * @property {boolean} isIllustrative
 * @property {boolean} [showsPeople]
 * @property {{ author: string, license: string, url: string }} credit
 */

/**
 * One seedling batch's diary, nursery to survival checks.
 *
 * @typedef {Object} SeedlingBatch
 * @property {string} id
 * @property {string} label
 * @property {string} zoneId - conservation-area feature id in landscape.js
 * @property {string[]} species
 * @property {number} quantity - seedlings in the batch
 * @property {string[]} expenditureIds - ledger rows that paid for it
 * @property {Array<{ stage: string, date: string, status: 'done' | 'in_review' | 'scheduled' | 'overdue', mediaId: string | null, note: string, evidenceId: string | null }>} stages
 */

/**
 * A share-ready programme story. The headline stat is resolved from the data
 * layer (`statSource`), never stored as text.
 *
 * @typedef {Object} ProgrammeStory
 * @property {string} id
 * @property {string} programme
 * @property {string} title
 * @property {string} summary
 * @property {string} mediaId
 * @property {{ posterMediaId: string, status: 'pending' | 'available', src?: string }} video
 * @property {{ kind: 'batches' } | { kind: 'outcome', outcomeId: string }} statSource
 * @property {string[]} evidenceIds
 */

/**
 * Before/after satellite imagery for one conservation zone, from Esri's World
 * Imagery Wayback archive (real, dated captures). Landscape context only —
 * the change shown is not attributed to the programme.
 *
 * @typedef {Object} CanopyComparison
 * @property {string} zoneId
 * @property {{ z: number, x: number, y: number }} tile - centre tile; a 3×3 block is shown
 * @property {{ releaseId: string, date: string }} baseline
 * @property {{ releaseId: string, date: string }} latest
 */

export {}
