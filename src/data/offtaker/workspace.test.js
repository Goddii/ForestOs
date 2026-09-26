import { describe, expect, test } from 'vitest'
import { buildOfftakerWorkspace } from './workspace'
import { COMMITMENTS } from './commitments'
import { BATCH_CHAIN, findBatchRecord } from '../../lib/batchChain'
import { resolveBatch } from '../../lib/mock'
import { getOrganisation } from '../funder/organisations'
import { EVIDENCE_RECORDS } from '../investor/evidence'
import { DOCUMENTS } from '../supply/documents'
import { INTAKE_RECORDS } from '../supply/intake'
import { DELIVERY_RECONCILIATIONS } from '../supply/deliveries'
import { QUALITY_ASSESSMENTS, QUALITY_METRICS } from '../supply/quality'
import { COLLECTION_CENTRES, centreForBatch } from '../supply/collectionCentres'
import { BUFFER_SEGMENTS } from '../funder/geography'
import { validateHistory } from '../../lib/programme/verificationState'
import { REPORT_DEFINITIONS, buildReport } from '../../lib/offtaker/reports'

const TRACE_IDS = new Set(BATCH_CHAIN.map((record) => record.traceId).filter(Boolean))
const EVIDENCE_IDS = new Set(EVIDENCE_RECORDS.map((record) => record.id))
const SEGMENT_IDS = new Set(BUFFER_SEGMENTS.map((segment) => segment.id))

describe('supply seed integrity', () => {
  test('every supply record points at a real batch and carries a legal verification history', () => {
    for (const entry of [...INTAKE_RECORDS, ...DELIVERY_RECONCILIATIONS, ...QUALITY_ASSESSMENTS]) {
      expect(TRACE_IDS.has(entry.batchTraceId), entry.id).toBe(true)
      expect(validateHistory(entry.verification).errors, entry.id).toEqual([])
    }
  })

  test('intake accepted + rejected always equals received', () => {
    for (const intake of INTAKE_RECORDS) expect(intake.acceptedKg + intake.rejectedKg).toBe(intake.receivedKg)
  })

  test('every sold or offered batch has a collection centre, intake, delivery and quality record', () => {
    for (const record of BATCH_CHAIN.filter((entry) => entry.traceId)) {
      expect(centreForBatch(record), record.traceId).not.toBeNull()
      expect(INTAKE_RECORDS.some((intake) => intake.batchTraceId === record.traceId), record.traceId).toBe(true)
      expect(DELIVERY_RECONCILIATIONS.some((d) => d.batchTraceId === record.traceId), record.traceId).toBe(true)
      expect(QUALITY_ASSESSMENTS.some((q) => q.batchTraceId === record.traceId), record.traceId).toBe(true)
    }
  })

  test('documents cite real issuers and evidence, with legal histories', () => {
    for (const document of DOCUMENTS) {
      expect(getOrganisation(document.issuerOrgId), document.id).not.toBeNull()
      for (const id of document.evidenceIds) expect(EVIDENCE_IDS.has(id), `${document.id} → ${id}`).toBe(true)
      expect(validateHistory(document.verification).errors, document.id).toEqual([])
    }
  })

  test('centres link only to real buffer segments', () => {
    for (const centre of COLLECTION_CENTRES) for (const id of centre.segmentIds) expect(SEGMENT_IDS.has(id)).toBe(true)
  })

  test('commitments reference real batches, and no batch is committed twice', () => {
    const seen = new Set()
    for (const commitment of COMMITMENTS) {
      for (const id of commitment.batchTraceIds) {
        expect(TRACE_IDS.has(id), id).toBe(true)
        expect(seen.has(id), `${id} committed twice`).toBe(false)
        seen.add(id)
      }
    }
  })

  test('an unsold lot’s own record never reaches the public QR page', () => {
    // Unknown ids fall back to the reference batch on the public page; the
    // lot's plot, volume and verification must not leak through it.
    expect(findBatchRecord('611')).not.toBeNull()
    const publicView = resolveBatch('611')
    expect(publicView.verification.plotId).not.toBe('MAU-KPT-0611')
    expect(publicView.verification.reference).not.toBe(findBatchRecord('611').verification.reference)
  })
})

describe('buildOfftakerWorkspace', () => {
  test('unknown or non-offtaker organisations get no workspace', () => {
    expect(buildOfftakerWorkspace('nobody')).toBeNull()
    expect(buildOfftakerWorkspace('funder-a')).toBeNull()
  })

  test('falls back to the account’s default role', () => {
    expect(buildOfftakerWorkspace('rift-valley-tea').role).toBe('procurement')
    expect(buildOfftakerWorkspace('highland-leaf', 'not-a-role').role).toBe('compliance')
  })

  test('a buyer never sees another buyer’s batches', () => {
    const rvt = buildOfftakerWorkspace('rift-valley-tea')
    const hlc = buildOfftakerWorkspace('highland-leaf')
    const rvtIds = new Set(rvt.batches.map((batch) => batch.traceId))
    const hlcIds = new Set(hlc.batches.map((batch) => batch.traceId))
    expect(rvtIds.has('TL-2026-00637')).toBe(false) // reserved by Highland Leaf
    expect(hlcIds.has('TL-2026-00611')).toBe(false) // committed to Rift Valley
    expect(rvtIds.has('TL-2026-00521')).toBe(false) // another brand's batch
    for (const batch of hlc.allocated) expect(rvtIds.has(batch.traceId)).toBe(false)
  })

  test('documents follow batch visibility and the viewer’s role', () => {
    const ws = buildOfftakerWorkspace('rift-valley-tea', 'quality')
    const visible = new Set(ws.batches.map((batch) => batch.traceId))
    for (const document of ws.documents) {
      expect(document.audience).toContain('quality')
      if (document.scope === 'batch') expect(visible.has(document.scopeRef)).toBe(true)
    }
    expect(ws.withheldDocumentCount).toBeGreaterThan(0)
  })

  test('prices are stripped for roles without commercial terms', () => {
    expect(buildOfftakerWorkspace('rift-valley-tea', 'procurement').commitments[0].priceKesPerKg).not.toBeNull()
    for (const commitment of buildOfftakerWorkspace('rift-valley-tea', 'quality').commitments) {
      expect(commitment.priceKesPerKg).toBeNull()
    }
  })

  test('quality measurements are stripped for roles without quality access', () => {
    const ws = buildOfftakerWorkspace('rift-valley-tea', 'sustainability')
    for (const batch of ws.batches) expect(batch.quality.metrics).toBeNull()
  })

  test('no farmer or staff identifiers reach the workspace', () => {
    for (const role of ['procurement', 'quality', 'compliance', 'sustainability', 'admin']) {
      const json = JSON.stringify(buildOfftakerWorkspace('rift-valley-tea', role))
      expect(json).not.toMatch(/RVT-\d{4}/) // farmer / worker ids
      expect(json).not.toMatch(/"recordedBy"|"farmerId"|"workerId"/)
      expect(json).not.toMatch(/SUP-[A-Z]{3}-\d/) // supervisor ids
    }
  })

  test('conservation only counts verified work in segments linked to the buyer’s source centres', () => {
    const rvt = buildOfftakerWorkspace('rift-valley-tea')
    const linked = new Set(rvt.conservation.sourceCentres.flatMap((centre) => centre.segmentIds))
    for (const activity of rvt.conservation.activities) expect(linked.has(activity.segmentId)).toBe(true)
    expect(rvt.conservation.connection.connectedKg).toBeLessThanOrEqual(rvt.conservation.connection.allocatedKg)

    const hlc = buildOfftakerWorkspace('highland-leaf')
    expect(hlc.conservation.connection.connectedKg).toBe(0)
    expect(hlc.conservation.claims.filter((claim) => claim.basis === 'verified' && claim.id !== 'claim-origin')).toEqual([])
  })

  test('exports never carry more than the role sees', () => {
    const ws = buildOfftakerWorkspace('rift-valley-tea', 'quality')
    for (const { id } of REPORT_DEFINITIONS) {
      const report = buildReport(id, ws, QUALITY_METRICS)
      expect(report.columns.some((column) => column.key === 'price')).toBe(false)
    }
    const sustainability = buildReport('quality', buildOfftakerWorkspace('rift-valley-tea', 'sustainability'), QUALITY_METRICS)
    expect(sustainability.columns.some((column) => column.key === 'fine_leaf')).toBe(false)
  })
})
