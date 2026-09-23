// Maps a ConfidenceStatus to the evidence types that typically back a claim
// at that confidence level, for the EvidenceChain component ("How do we
// know?"). This is a reasonable demo default, not a per-record ledger —
// a real integration would read the actual evidence types linked to a
// specific record instead of inferring from its confidence status alone.
const CHAINS = {
  verified: ['gis', 'field_audit', 'farmer_record'],
  field_verified: ['gis', 'field_audit', 'gps', 'photo'],
  satellite_verified: ['satellite', 'gis', 'field_audit'],
  pending_verification: ['satellite', 'field_audit'],
  incomplete: [],
}

const LABELS = {
  gis: 'GIS boundary',
  satellite: 'Satellite observation',
  field_audit: 'Field verification',
  gps: 'GPS activity',
  photo: 'Photo evidence',
  farmer_record: 'Farmer record',
}

// The full checklist order every chain draws from, so items always appear
// in the same sequence regardless of which are present for a given status.
const ORDER = ['gis', 'satellite', 'field_audit', 'gps', 'photo', 'farmer_record']

/**
 * @param {import('../../data/investor/types').ConfidenceStatus} status
 * @returns {Array<{ key: string, label: string, present: boolean }>}
 */
export function getEvidenceChain(status) {
  const present = new Set(CHAINS[status] ?? [])
  return ORDER.filter((key) => key !== 'farmer_record' || present.has(key)).map((key) => ({
    key,
    label: LABELS[key],
    present: present.has(key),
  }))
}
