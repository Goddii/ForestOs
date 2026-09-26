import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterBar from '../investor/FilterBar'
import DataTable from './DataTable'
import { AccessBadge, StageStatusBadge } from './StatusBadges'
import { JourneyStrip } from './TraceJourney'
import { useOfftakerPath } from './OfftakerWorkspaceContext'

const uniqueOptions = (values) => [...new Set(values)].sort().map((value) => ({ value, label: value }))

/**
 * Filterable batch register. Filters sit in one row above the table; the
 * trace column shows the six-stage strip so a broken chain is visible
 * without opening the batch.
 *
 * @param {{ batches: any[], showAccessFilter?: boolean, extraColumns?: any[] }} props
 */
export default function BatchTable({ batches, showAccessFilter = true, extraColumns = [] }) {
  const navigate = useNavigate()
  const path = useOfftakerPath()
  const [search, setSearch] = useState('')
  const [zone, setZone] = useState('')
  const [grade, setGrade] = useState('')
  const [access, setAccess] = useState('')
  const [trace, setTrace] = useState('')

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return batches.filter((batch) => {
      const traceState = batch.journey.fullyTraced ? 'traced' : batch.journey.exceptions.length ? 'exception' : 'incomplete'
      return (
        (!zone || batch.zone === zone) &&
        (!grade || batch.grade === grade) &&
        (!access || batch.access === access) &&
        (!trace || traceState === trace) &&
        (!q || `${batch.traceId} ${batch.code} ${batch.centre?.name ?? ''} ${batch.record.processing.facility}`.toLowerCase().includes(q))
      )
    })
  }, [batches, search, zone, grade, access, trace])

  return (
    <div className="space-y-3">
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search trace id, centre or factory…"
        filters={[
          { key: 'zone', label: 'All zones', value: zone, options: uniqueOptions(batches.map((b) => b.zone)), onChange: setZone },
          { key: 'grade', label: 'All grades', value: grade, options: uniqueOptions(batches.map((b) => b.grade)), onChange: setGrade },
          ...(showAccessFilter
            ? [
                {
                  key: 'access',
                  label: 'Yours and available',
                  value: access,
                  options: [
                    { value: 'allocated', label: 'Yours' },
                    { value: 'available', label: 'Available' },
                  ],
                  onChange: setAccess,
                },
              ]
            : []),
          {
            key: 'trace',
            label: 'Any traceability',
            value: trace,
            options: [
              { value: 'traced', label: 'Fully traced' },
              { value: 'incomplete', label: 'Verification pending' },
              { value: 'exception', label: 'Has an exception' },
            ],
            onChange: setTrace,
          },
        ]}
      />
      <p className="font-mono text-label text-ink-faint" aria-live="polite">
        {rows.length} of {batches.length} batches · {rows.reduce((sum, b) => sum + b.madeTeaKg, 0).toLocaleString('en-US')} kg
      </p>
      <DataTable
        caption="Batches"
        rows={rows}
        rowKey={(batch) => batch.traceId}
        onRowClick={(batch) => navigate(path(`batches/${batch.traceId}`))}
        minWidth="60rem"
        columns={[
          {
            key: 'id',
            header: 'Batch',
            cell: (batch) => (
              <>
                <p className="font-mono font-semibold text-ink">{batch.traceId}</p>
                <p className="mt-0.5 text-xs text-ink-faint">Factory lot {batch.record.processing.lotId}</p>
              </>
            ),
          },
          { key: 'access', header: 'Status', cell: (batch) => <AccessBadge access={batch.access} /> },
          {
            key: 'source',
            header: 'Source',
            cell: (batch) => (
              <>
                <p className="text-ink">{batch.centre?.name}</p>
                <p className="text-xs text-ink-faint">{batch.zone}</p>
              </>
            ),
          },
          { key: 'grade', header: 'Grade', cell: (batch) => <span className="font-semibold text-ink">{batch.grade}</span> },
          { key: 'kg', header: 'Made tea (kg)', align: 'right', cell: (batch) => <span className="font-semibold text-ink">{batch.madeTeaKg.toLocaleString('en-US')}</span> },
          { key: 'sealed', header: 'Sealed', cell: (batch) => <span className="font-mono text-label tabular-nums text-ink-muted">{batch.sealedAt}</span> },
          ...extraColumns,
          {
            key: 'trace',
            header: 'Journey',
            cell: (batch) => (
              <div className="flex flex-col gap-1.5">
                <JourneyStrip journey={batch.journey} />
                {batch.journey.exceptions.length > 0 && <StageStatusBadge status="flagged" className="self-start" />}
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
