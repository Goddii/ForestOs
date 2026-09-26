// The five export-ready report views, each derived from the buyer's scoped
// workspace — so an export can never contain more than the viewer's role
// may see on screen. Pure: returns rows + a PDF layout; the page triggers
// the download.
import { STAGE_STATUS_LABELS } from './journey'
import { DOCUMENT_STATUS_LABELS } from './documentStatus'
import { STATE_LABELS, currentState } from '../programme/verificationState'

const kg = (value) => `${value.toLocaleString('en-US')} kg`

/** @param {import('../../data/offtaker/workspace').OfftakerWorkspace} ws */
function sourcing(ws) {
  const columns = [
    { key: 'traceId', label: 'Trace id' },
    { key: 'access', label: 'Status' },
    { key: 'centre', label: 'Collection centre' },
    { key: 'zone', label: 'Zone' },
    { key: 'grade', label: 'Grade' },
    { key: 'madeTeaKg', label: 'Made tea (kg)' },
    { key: 'sealedAt', label: 'Sealed' },
    { key: 'commitment', label: 'Commitment' },
    ...(ws.permissions.commercialTerms ? [{ key: 'price', label: 'Price (KES/kg)' }] : []),
  ]
  const rows = ws.batches.map((batch) => ({
    traceId: batch.traceId,
    access: batch.access === 'allocated' ? 'Allocated to you' : 'Available',
    centre: batch.centre?.name ?? '',
    zone: batch.zone,
    grade: batch.grade,
    madeTeaKg: batch.madeTeaKg,
    sealedAt: batch.sealedAt,
    commitment: batch.commitment?.id ?? '',
    price: batch.commitment?.priceKesPerKg ?? '',
  }))
  const forecastLines = ws.centres
    .filter((centre) => centre.forecast.length)
    .map((centre) => `${centre.name} (${centre.zone}): ${centre.forecast.map((f) => `${f.period} ~${kg(f.expectedKg)}`).join(', ')}`)
  return {
    columns,
    rows,
    sections: [
      {
        heading: 'Position',
        lines: [
          `Available to buy: ${kg(ws.totals.availableKg)} across ${ws.totals.availableLots} lots`,
          `Open commitments: ${kg(ws.totals.committedOpenKg)} (${ws.totals.openCommitments})`,
          `Delivered to date: ${kg(ws.totals.deliveredKg)}`,
        ],
      },
      { heading: 'Batches', lines: rows.map((row) => `${row.traceId}  ${row.access}  ${row.centre}  ${row.grade}  ${kg(row.madeTeaKg)}  sealed ${row.sealedAt}`) },
      { heading: 'Expected production (estimates, not commitments)', lines: forecastLines },
    ],
  }
}

function traceability(ws) {
  const stageKeys = ['source', 'centre', 'delivery', 'processing', 'batch', 'buyer']
  const columns = [{ key: 'traceId', label: 'Trace id' }, ...stageKeys.map((key) => ({ key, label: key })), { key: 'fullyTraced', label: 'Fully traced' }]
  const rows = ws.batches.map((batch) => ({
    traceId: batch.traceId,
    ...Object.fromEntries(batch.journey.stages.map((stage) => [stage.key, STAGE_STATUS_LABELS[stage.status]])),
    fullyTraced: batch.journey.fullyTraced ? 'Yes' : 'No',
  }))
  return {
    columns,
    rows,
    sections: [
      { heading: 'Coverage', lines: [`${ws.totals.traceability.pct}% of visible volume fully traced (${kg(ws.totals.traceability.tracedKg)} of ${kg(ws.totals.traceability.visibleKg)})`] },
      ...ws.batches.map((batch) => ({
        heading: `${batch.traceId} (${batch.grade}, ${kg(batch.madeTeaKg)})`,
        lines: batch.journey.stages.map(
          (stage) =>
            `${stage.label}: ${STAGE_STATUS_LABELS[stage.status]}  ${stage.title}${stage.attestation ? `  - ${stage.attestation.role}, ${stage.attestation.at}` : ''}`,
        ),
      })),
    ],
  }
}

function quality(ws, metrics) {
  const showMetrics = ws.permissions.qualityMetrics
  const columns = [
    { key: 'traceId', label: 'Trace id' },
    { key: 'grade', label: 'Grade' },
    { key: 'receivedKg', label: 'Green leaf received (kg)' },
    { key: 'acceptedKg', label: 'Accepted (kg)' },
    { key: 'rejectedKg', label: 'Rejected (kg)' },
    ...(showMetrics ? metrics.map((metric) => ({ key: metric.id, label: `${metric.label} (${metric.unit})` })) : []),
    { key: 'verification', label: 'Verification' },
  ]
  const rows = ws.batches.map((batch) => ({
    traceId: batch.traceId,
    grade: batch.grade,
    receivedKg: batch.intake?.receivedKg ?? '',
    acceptedKg: batch.intake?.acceptedKg ?? '',
    rejectedKg: batch.intake?.rejectedKg ?? '',
    ...(showMetrics && batch.quality?.metrics ? batch.quality.metrics : {}),
    verification: batch.quality ? STATE_LABELS[currentState(batch.quality.verification)] : 'Not recorded',
  }))
  return {
    columns,
    rows,
    sections: [
      {
        heading: 'Batches',
        lines: rows.map(
          (row) =>
            `${row.traceId}  ${row.grade}  accepted ${row.acceptedKg} / received ${row.receivedKg} kg${
              showMetrics ? `  ${metrics.map((metric) => `${metric.label} ${row[metric.id] ?? '-'}${metric.unit}`).join('  ')}` : ''
            }`,
        ),
      },
      { heading: 'Method', lines: ['ForestOS reports measured values only. Specification limits are set in your contract, not by ForestOS.'] },
    ],
  }
}

function compliance(ws) {
  const columns = [
    { key: 'id', label: 'Document' },
    { key: 'title', label: 'Title' },
    { key: 'issuer', label: 'Issuer' },
    { key: 'issuedDate', label: 'Issued' },
    { key: 'expiryDate', label: 'Expires' },
    { key: 'status', label: 'Status' },
    { key: 'verification', label: 'Verification' },
  ]
  const rows = ws.documents.map((document) => ({
    id: document.id,
    title: document.title,
    issuer: document.issuer,
    issuedDate: document.issuedDate,
    expiryDate: document.expiryDate ?? 'No expiry',
    status: DOCUMENT_STATUS_LABELS[document.status],
    verification: STATE_LABELS[currentState(document.verification)],
  }))
  return {
    columns,
    rows,
    sections: [
      { heading: 'Summary', lines: [`${rows.length} documents visible to the ${ws.roleConfig.label} role; ${ws.totals.outstandingDocuments} outstanding`] },
      { heading: 'Documents', lines: rows.map((row) => `${row.status.padEnd(20)} ${row.title} (${row.issuer}, issued ${row.issuedDate}, expires ${row.expiryDate})`) },
    ],
  }
}

const BASIS_LABELS = { verified: 'Verified', reported: 'Reported, not verified', method_pending: 'Method pending', unsupported: 'No evidence linked' }

function provenance(ws) {
  const columns = [
    { key: 'statement', label: 'Statement' },
    { key: 'basis', label: 'Basis' },
    { key: 'source', label: 'Source' },
    { key: 'evidence', label: 'Evidence records' },
  ]
  const rows = ws.conservation.claims.map((claim) => ({
    statement: claim.statement,
    basis: BASIS_LABELS[claim.basis],
    source: claim.source,
    evidence: claim.evidenceIds.join(' '),
  }))
  const { connectedKg, allocatedKg } = ws.conservation.connection
  return {
    columns,
    rows,
    sections: [
      {
        heading: 'Origin',
        lines: [
          `Programme: ${ws.conservation.programme.name}`,
          `${kg(connectedKg)} of ${kg(allocatedKg)} sourced from centres linked to verified conservation work`,
        ],
      },
      { heading: 'Claims and their basis', lines: rows.map((row) => `[${row.basis}] ${row.statement} - ${row.source}`) },
    ],
  }
}

export const REPORT_DEFINITIONS = [
  { id: 'sourcing', title: 'Sourcing report', description: 'Available and allocated batches, commitments and expected production.', build: sourcing },
  { id: 'traceability', title: 'Batch traceability report', description: 'Every visible batch’s six-stage journey with the verification status of each stage.', build: traceability },
  { id: 'quality', title: 'Quality report', description: 'Grade, intake acceptance and the quality measurements your role may see.', build: quality },
  { id: 'compliance', title: 'Compliance report', description: 'Documents visible to your role with status, issuer, dates and verification state.', build: compliance },
  { id: 'provenance', title: 'Conservation provenance report', description: 'What is verified about your tea’s origin and impact, and what is not.', build: provenance },
]

/**
 * @param {string} id
 * @param {import('../../data/offtaker/workspace').OfftakerWorkspace} ws
 * @param {Array<{ id: string, label: string, unit: string }>} metrics
 */
export function buildReport(id, ws, metrics) {
  const definition = REPORT_DEFINITIONS.find((entry) => entry.id === id)
  const body = definition.build(ws, metrics)
  return {
    ...body,
    title: definition.title,
    pdf: {
      title: `${definition.title} - ${ws.org.name}`,
      subtitle: `Prepared for the ${ws.roleConfig.label} role. Data as of ${ws.asOf}.`,
      sections: body.sections,
      footer: 'Illustrative demo data from the ForestOS prototype - not an official record or certificate.',
    },
  }
}
