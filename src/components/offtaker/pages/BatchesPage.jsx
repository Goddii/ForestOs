import Badge from '../../investor/ui/Badge'
import { formatKg } from '../../../lib/offtaker/format'
import { useOfftaker } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import BatchTable from '../BatchTable'

export default function BatchesPage() {
  const ws = useOfftaker()
  return (
    <div>
      <PageHeader
        title="Batches"
        description="Every batch allocated to you and every lot on offer. Open a batch for its full journey, quality record and documents."
        meta={
          <>
            <Badge tone="live">{ws.allocated.length} yours</Badge>
            <Badge tone="neutral">{ws.available.length} available</Badge>
            <Badge tone="neutral">{formatKg(ws.totals.traceability.visibleKg)}</Badge>
          </>
        }
      />
      <BatchTable
        batches={ws.batches}
        extraColumns={[
          {
            key: 'commitment',
            header: 'Commitment',
            cell: (batch) =>
              batch.commitment ? (
                <span className="font-mono text-label text-ink-muted">{batch.commitment.id}</span>
              ) : (
                <span className="text-xs text-ink-faint">None</span>
              ),
          },
        ]}
      />
    </div>
  )
}
