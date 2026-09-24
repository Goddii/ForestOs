import { useMemo, useState } from 'react'
import SectionHeading from '../SectionHeading'
import FilterBar from '../FilterBar'
import EvidenceTable from '../EvidenceTable'
import { EVIDENCE_RECORDS } from '../../../data/investor'

const TYPE_OPTIONS = [
  { value: 'satellite', label: 'Satellite' },
  { value: 'gis', label: 'GIS' },
  { value: 'field_audit', label: 'Field audit' },
  { value: 'gps', label: 'GPS' },
  { value: 'photo', label: 'Photo' },
  { value: 'farmer_record', label: 'Farmer record' },
  { value: 'conservation_activity', label: 'Conservation activity' },
  { value: 'payment_record', label: 'Payment record' },
  { value: 'verification_document', label: 'Verification document' },
]
const STATUS_OPTIONS = [
  { value: 'verified', label: 'Verified' },
  { value: 'field_verified', label: 'Field verified' },
  { value: 'satellite_verified', label: 'Satellite verified' },
  { value: 'pending_verification', label: 'Pending verification' },
  { value: 'incomplete', label: 'Incomplete' },
]

/**
 * The Evidence Centre (build brief §15) — a searchable repository, not a
 * long unfiltered list. Search covers location, date, activity and
 * responsible team in one box rather than seven separate dropdowns, which
 * would be excessive for the current record count; type and verification
 * status get dedicated filters since those are the two dimensions an
 * investor is most likely to narrow by first.
 */
export default function EvidencePage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')

  const programmeOptions = useMemo(() => {
    const programmes = [...new Set(EVIDENCE_RECORDS.map((r) => r.programme))]
    return programmes.map((p) => ({ value: p, label: p }))
  }, [])
  const [programme, setProgramme] = useState('')

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return EVIDENCE_RECORDS.filter((record) => {
      if (type && record.type !== type) return false
      if (status && record.status !== status) return false
      if (programme && record.programme !== programme) return false
      if (!query) return true
      const haystack = `${record.title} ${record.location} ${record.relatedActivity} ${record.responsibleTeam} ${record.date}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [search, type, status, programme])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeading
        title="Every conservation claim, traced to its record"
        description="Satellite, GIS, field audit, GPS, photo, farmer record, conservation activity, payment and verification-document evidence — filter, search, and open any record for its full trail."
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search location, activity, team, date…"
        filters={[
          { key: 'type', label: 'Type', value: type, options: TYPE_OPTIONS, onChange: setType },
          { key: 'status', label: 'Status', value: status, options: STATUS_OPTIONS, onChange: setStatus },
          {
            key: 'programme',
            label: 'Programme',
            value: programme,
            options: programmeOptions,
            onChange: setProgramme,
          },
        ]}
      />
      <EvidenceTable records={filtered} />
    </div>
  )
}
