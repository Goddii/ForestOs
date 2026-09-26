// DEMO DATA — see src/lib/contracts/offtaker.js (`ComplianceDocument`).
//
// The document library the Offtaker Portal reads. Programme-, zone- and
// factory-level documents are authored below; every batch gets its four
// batch documents derived from its own record so none can drift from the
// chain. Issuers are the shared organisation registry
// (data/funder/organisations.js) — placeholder names for every certification
// body, laboratory and regulator until NTZDC confirms who really issues what.
// No document here is a real certificate. Downloads are placeholders.
import { BATCH_CHAIN } from '../../lib/batchChain'
import { reviewed, submitted, underReview, verifiedBy } from './events'

const ALL_ROLES = ['procurement', 'quality', 'compliance', 'sustainability', 'admin']

export const DOCUMENT_KIND_LABELS = {
  certificate: 'Certificate',
  batch_document: 'Batch document',
  quality_report: 'Quality report',
  traceability_report: 'Traceability report',
  verification_record: 'Verification record',
}

const addDays = (iso, days) => {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

// Each decision is preceded by its own review step, as the shared state
// machine requires (lib/programme/verificationState.js).
const independent = (at) => [
  underReview(at, 'Verification partner', 'org-verifier'),
  verifiedBy(at, 'Verification partner', 'org-verifier', 'independent', 'third_party'),
]
const issuerCheck = (at) => [
  underReview(at, 'Certification desk', 'org-certifier'),
  verifiedBy(at, 'Certification desk', 'org-certifier', 'independent', 'third_party'),
]
const internalCheck = (at, role, method) => [underReview(at, role), verifiedBy(at, role, 'org-ntzdc', 'internal_separate', method)]

/** @type {import('../../lib/contracts/offtaker').ComplianceDocument[]} */
const PROGRAMME_DOCUMENTS = [
  {
    id: 'DOC-0101',
    kind: 'verification_record',
    title: 'Deforestation-free evidence package, South West Mau (Q3 2026)',
    issuerOrgId: 'org-ntzdc',
    issuedDate: '2026-09-05',
    expiryDate: null,
    scope: 'zone',
    scopeRef: 'South West Mau',
    evidenceIds: ['ev-001', 'ev-009'],
    audience: ['compliance', 'sustainability', 'admin', 'procurement'],
    requiredForBuyers: true,
    withdrawnReason: null,
    verification: [submitted('2026-09-05', 'Zone GIS officer'), ...independent('2026-09-15')],
  },
  {
    id: 'DOC-0102',
    kind: 'verification_record',
    title: 'Deforestation-free evidence package, Mount Kenya East (Q3 2026)',
    issuerOrgId: 'org-ntzdc',
    issuedDate: '2026-09-19',
    expiryDate: null,
    scope: 'zone',
    scopeRef: 'Mount Kenya East',
    evidenceIds: [],
    audience: ['compliance', 'sustainability', 'admin', 'procurement'],
    requiredForBuyers: true,
    withdrawnReason: null,
    verification: [submitted('2026-09-19', 'Zone GIS officer'), underReview('2026-09-22', 'Verification partner', 'org-verifier')],
  },
  {
    id: 'DOC-0103',
    kind: 'certificate',
    title: 'Food safety management certificate, Kiptunga Tea Factory',
    issuerOrgId: 'org-certifier',
    issuedDate: '2025-11-03',
    expiryDate: '2026-11-02',
    scope: 'factory',
    scopeRef: 'Kiptunga Tea Factory',
    evidenceIds: [],
    audience: ['quality', 'compliance', 'procurement', 'admin'],
    requiredForBuyers: true,
    withdrawnReason: null,
    verification: [submitted('2025-11-03', 'Factory manager'), ...issuerCheck('2025-11-10')],
  },
  {
    id: 'DOC-0104',
    kind: 'certificate',
    title: 'Food safety management certificate, Nessuit Tea Factory',
    issuerOrgId: 'org-certifier',
    issuedDate: '2026-02-10',
    expiryDate: '2027-02-09',
    scope: 'factory',
    scopeRef: 'Nessuit Tea Factory',
    evidenceIds: [],
    audience: ['quality', 'compliance', 'procurement', 'admin'],
    requiredForBuyers: true,
    withdrawnReason: null,
    verification: [submitted('2026-02-10', 'Factory manager'), ...issuerCheck('2026-02-16')],
  },
  {
    id: 'DOC-0105',
    kind: 'certificate',
    title: 'Food safety management certificate, Mariashoni Tea Factory',
    issuerOrgId: 'org-certifier',
    issuedDate: '2025-09-01',
    expiryDate: '2026-08-31',
    scope: 'factory',
    scopeRef: 'Mariashoni Tea Factory',
    evidenceIds: [],
    audience: ['quality', 'compliance', 'procurement', 'admin'],
    requiredForBuyers: true,
    withdrawnReason: null,
    verification: [submitted('2025-09-01', 'Factory manager'), ...issuerCheck('2025-09-08')],
  },
  {
    id: 'DOC-0106',
    kind: 'certificate',
    title: 'Food safety management certificate, Kangaita Tea Factory',
    issuerOrgId: 'org-certifier',
    issuedDate: '2026-03-18',
    expiryDate: '2027-03-17',
    scope: 'factory',
    scopeRef: 'Kangaita Tea Factory',
    evidenceIds: [],
    audience: ['quality', 'compliance', 'procurement', 'admin'],
    requiredForBuyers: true,
    withdrawnReason: null,
    verification: [submitted('2026-03-18', 'Factory manager'), ...issuerCheck('2026-03-24')],
  },
  {
    id: 'DOC-0107',
    kind: 'certificate',
    title: 'Tea manufacturing licence, Kiptunga Tea Factory',
    issuerOrgId: 'org-regulator',
    issuedDate: '2026-01-01',
    expiryDate: '2026-12-31',
    scope: 'factory',
    scopeRef: 'Kiptunga Tea Factory',
    evidenceIds: [],
    audience: ['compliance', 'procurement', 'admin'],
    requiredForBuyers: true,
    withdrawnReason: null,
    verification: [submitted('2026-01-02', 'Factory manager'), ...internalCheck('2026-01-06', 'Compliance officer', 'desk')],
  },
  {
    id: 'DOC-0108',
    kind: 'certificate',
    title: 'Tea manufacturing licence, Kangaita Tea Factory',
    issuerOrgId: 'org-regulator',
    issuedDate: '2026-01-01',
    expiryDate: '2026-12-31',
    scope: 'factory',
    scopeRef: 'Kangaita Tea Factory',
    evidenceIds: [],
    audience: ['compliance', 'procurement', 'admin'],
    requiredForBuyers: true,
    withdrawnReason: null,
    verification: [submitted('2026-01-02', 'Factory manager'), ...internalCheck('2026-01-06', 'Compliance officer', 'desk')],
  },
  {
    id: 'DOC-0109',
    kind: 'verification_record',
    title: 'Independent verification statement, buffer programme H1 2026',
    issuerOrgId: 'org-verifier',
    issuedDate: '2026-07-28',
    expiryDate: null,
    scope: 'programme',
    scopeRef: 'Nyayo Tea Zone buffer programme, South West Mau',
    evidenceIds: ['ev-009'],
    audience: ALL_ROLES,
    requiredForBuyers: false,
    withdrawnReason: null,
    verification: [submitted('2026-07-20', 'Programme M&E lead'), ...independent('2026-07-28')],
  },
  {
    id: 'DOC-0110',
    kind: 'verification_record',
    title: 'Satellite canopy check, Kiptunga block (Q3 2026)',
    issuerOrgId: 'org-forestos',
    issuedDate: '2026-08-22',
    expiryDate: null,
    scope: 'zone',
    scopeRef: 'South West Mau',
    evidenceIds: ['ev-001'],
    audience: ALL_ROLES,
    requiredForBuyers: false,
    withdrawnReason: null,
    verification: [submitted('2026-08-16', 'Remote sensing analyst', 'org-forestos'), ...internalCheck('2026-08-22', 'Zone M&E officer', 'remote_sensing')],
  },
  {
    // Kept in the library, marked withdrawn, rather than deleted: a buyer
    // that downloaded it needs to know it no longer stands.
    id: 'DOC-00645-QR-v1',
    kind: 'quality_report',
    title: 'Quality report TL-2026-00645, first issue',
    issuerOrgId: 'org-ntzdc',
    issuedDate: '2026-09-19',
    expiryDate: null,
    scope: 'batch',
    scopeRef: 'TL-2026-00645',
    evidenceIds: [],
    audience: ['procurement', 'quality', 'admin'],
    requiredForBuyers: false,
    withdrawnReason: 'Superseded after a moisture re-test on 2026-09-20; see the current quality report',
    verification: [submitted('2026-09-19', 'Factory quality controller')],
  },
]

/** The four documents every batch carries, derived from its own record. */
function batchDocuments(record) {
  const seq = record.traceId.slice(8)
  const sealed = record.batch.sealedAt
  const eudrVerified = record.verification.status === 'Verified'
  const satelliteDate = record.verification.satellite.date
  return [
    {
      id: `DOC-${seq}-DR`,
      kind: 'batch_document',
      title: `Batch dispatch record ${record.traceId}`,
      issuerOrgId: 'org-ntzdc',
      issuedDate: sealed,
      expiryDate: null,
      scope: 'batch',
      scopeRef: record.traceId,
      evidenceIds: [],
      audience: ['procurement', 'quality', 'compliance', 'admin'],
      requiredForBuyers: true,
      withdrawnReason: null,
      verification: reviewed(sealed, sealed, addDays(sealed, 1), { role: 'Factory manager', submitterRole: 'Factory dispatch clerk' }),
    },
    {
      id: `DOC-${seq}-QR`,
      kind: 'quality_report',
      title: `Quality report ${record.traceId}`,
      issuerOrgId: 'org-ntzdc',
      issuedDate: sealed,
      expiryDate: null,
      scope: 'batch',
      scopeRef: record.traceId,
      evidenceIds: [],
      audience: ['procurement', 'quality', 'admin'],
      requiredForBuyers: true,
      withdrawnReason: null,
      verification:
        record.traceId === 'TL-2026-00630'
          ? [submitted(sealed, 'Factory quality controller')]
          : reviewed(sealed, addDays(sealed, 1), addDays(sealed, 2), { role: 'Zone quality officer', submitterRole: 'Factory quality controller' }),
    },
    {
      id: `DOC-${seq}-TR`,
      kind: 'traceability_report',
      title: `Traceability report ${record.traceId}`,
      issuerOrgId: 'org-forestos',
      issuedDate: sealed,
      expiryDate: null,
      scope: 'batch',
      scopeRef: record.traceId,
      evidenceIds: [],
      audience: ALL_ROLES,
      requiredForBuyers: false,
      withdrawnReason: null,
      verification: eudrVerified
        ? [submitted(sealed, 'Traceability service', 'org-forestos'), ...internalCheck(addDays(sealed, 3), 'Zone M&E officer', 'desk')]
        : [submitted(sealed, 'Traceability service', 'org-forestos'), underReview(addDays(sealed, 1), 'Zone M&E officer')],
    },
    {
      id: `DOC-${seq}-EU`,
      kind: 'verification_record',
      title: `Plot geolocation and deforestation-free check ${record.traceId}`,
      issuerOrgId: 'org-ntzdc',
      issuedDate: eudrVerified ? satelliteDate : record.verification.field.date,
      expiryDate: null,
      scope: 'batch',
      scopeRef: record.traceId,
      evidenceIds: record.block.id === 'KPT' ? ['ev-001'] : [],
      audience: ['compliance', 'admin'],
      requiredForBuyers: true,
      withdrawnReason: null,
      verification: eudrVerified
        ? [submitted(record.verification.field.date, 'NTZDC field officer'), ...internalCheck(satelliteDate, 'Zone GIS officer', 'remote_sensing')]
        : [submitted(record.verification.field.date, 'NTZDC field officer'), underReview(addDays(record.verification.field.date, 1), 'Zone GIS officer')],
    },
  ]
}

/** @type {import('../../lib/contracts/offtaker').ComplianceDocument[]} */
export const DOCUMENTS = [
  ...PROGRAMME_DOCUMENTS,
  ...BATCH_CHAIN.filter((record) => record.traceId).flatMap(batchDocuments),
]

export function getDocument(id) {
  return DOCUMENTS.find((document) => document.id === id) ?? null
}
