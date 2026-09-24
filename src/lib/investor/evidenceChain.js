// "How do we know?" — computed from the evidence records actually linked to
// a claim, never inferred from its confidence label (audit §5.3 / gap #10).
// A claim with no photo on file shows the photo slot unticked, whatever its
// status says.

/** Evidence record type → the chain item it satisfies. */
const TYPE_TO_KEY = {
  gis: 'gis',
  satellite: 'satellite',
  field_audit: 'field_audit',
  gps: 'gps',
  conservation_activity: 'field_log',
  photo: 'photo',
  farmer_record: 'farmer_record',
  payment_record: 'payment',
  verification_document: 'independent_review',
}

const LABELS = {
  gis: 'GIS boundary',
  satellite: 'Satellite observation',
  field_audit: 'Field verification',
  gps: 'GPS capture',
  field_log: 'Field activity log',
  photo: 'Photo evidence',
  farmer_record: 'Farmer record',
  payment: 'Payment record',
  independent_review: 'Independent review',
}

// Always shown (ticked or not) so a missing core type is visible; the rest
// appear only when a record of that type is actually linked.
const CORE = ['gis', 'satellite', 'field_audit', 'photo']
const ORDER = ['gis', 'satellite', 'field_audit', 'gps', 'field_log', 'photo', 'farmer_record', 'payment', 'independent_review']

/**
 * @param {Array<Pick<import('../../data/investor/types').EvidenceRecord, 'type'>>} records
 * @returns {Array<{ key: string, label: string, present: boolean, count: number }>}
 */
export function getEvidenceChain(records) {
  const counts = new Map()
  for (const record of records) {
    const key = TYPE_TO_KEY[record.type]
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return ORDER.filter((key) => CORE.includes(key) || counts.has(key)).map((key) => ({
    key,
    label: LABELS[key],
    present: counts.has(key),
    count: counts.get(key) ?? 0,
  }))
}
