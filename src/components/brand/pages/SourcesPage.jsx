import { ExternalLink, Satellite, ShieldCheck, UserCheck } from 'lucide-react'
import { formatCoords, formatCount } from '../../../lib/offtaker/access'
import { formatKg } from '../../../lib/offtaker/format'
import { getForestosPhoto } from '../../../data/brand/assets'
import { useBrand } from '../BrandWorkspaceContext'
import PageHeader from '../../offtaker/PageHeader'
import DataTable from '../../offtaker/DataTable'
import EmptyState from '../../investor/EmptyState'
import { LotVerificationBadge, SourceTag } from '../StatusBadges'

/** Brands see farmer and plucker counts at or above this floor only (same floor as buyers). */
const COUNT_FLOOR = 10

const LANDSCAPE_PHOTO = { 'Mau Forest Complex': 'fos-mau', 'Mount Kenya Forest': 'fos-mt-kenya' }

function Facts({ rows }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 text-compact sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-ink-faint">{label}</dt>
          <dd className="mt-0.5 text-ink [overflow-wrap:anywhere]">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function LotCard({ lot }) {
  const { record } = lot
  const photo = getForestosPhoto(LANDSCAPE_PHOTO[lot.landscape])
  const { field, satellite } = record.verification
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-card shadow-card">
      <div className="grid lg:grid-cols-[22rem_minmax(0,1fr)]">
        {photo && (
          <picture className="block">
            <source srcSet={`${photo.src}.webp`} type="image/webp" />
            <img src={`${photo.src}.jpg`} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" className="aspect-[16/9] h-full w-full object-cover lg:aspect-auto" />
          </picture>
        )}
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink">
                Lot #{lot.code}, {lot.block}
              </h2>
              <p className="mt-0.5 font-mono text-xs text-ink-faint">{lot.traceId}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SourceTag kind="forestos" />
              <LotVerificationBadge status={lot.verificationStatus} />
            </div>
          </div>
          <div className="mt-5">
            <Facts
              rows={[
                ['Landscape', `${lot.landscape}, ${lot.region}`],
                ['Plot', `${record.plot.id}, ${record.plot.areaHa} ha near ${formatCoords(record.plot.lat, record.plot.lon, false)}`],
                ['Harvest', `${record.harvest.window}, ${formatKg(record.harvest.greenLeafKg)} green leaf`],
                ['Growers', `${formatCount(record.plot.farmers, COUNT_FLOOR)} farmers, ${formatCount(record.harvest.pluckers, COUNT_FLOOR)} pluckers`],
                ['Processing', `${record.processing.facility}, ${record.processing.method}`],
                ['Lot', `${formatKg(lot.madeTeaKg)} made tea, grade ${lot.grade}, sealed ${record.batch.sealedAt}`],
              ]}
            />
          </div>
          <ul className="mt-5 grid gap-2 border-t border-line pt-4 text-compact sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-accent" aria-hidden="true" />
              <span>
                Field check: {field.status.toLowerCase()} {field.date !== '—' && `on ${field.date}`} by {field.by}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Satellite className="mt-0.5 h-4 w-4 shrink-0 text-forest-accent" aria-hidden="true" />
              <span>
                Satellite check: {satellite.status.toLowerCase()} {satellite.date !== '—' && `on ${satellite.date}`}, {satellite.source} against the {satellite.baseline} baseline
              </span>
            </li>
          </ul>
          {lot.isPublic && (
            <a
              href={`/batch/${lot.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-compact font-semibold text-forest-accent hover:text-forest-accent-dark"
            >
              Open the public batch record <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-line bg-canvas/60 px-6 py-4">
        <p className="mb-2 text-xs font-semibold text-ink-muted">Your allocation from this lot</p>
        <DataTable
          minWidth="30rem"
          caption={`Products packed from lot ${lot.code}`}
          rowKey={(row) => row.id}
          rows={lot.allocations}
          columns={[
            { key: 'product', header: 'Product', cell: (row) => row.productName },
            { key: 'kg', header: 'Reserved', align: 'right', cell: (row) => formatKg(row.allocatedKg) },
            { key: 'status', header: 'Status', cell: (row) => (row.status === 'packed' ? `Packed ${row.date}` : `Scheduled ${row.date}`) },
          ]}
        />
      </div>
    </article>
  )
}

export default function SourcesPage() {
  const ws = useBrand()
  const verified = ws.lots.filter((lot) => lot.verificationStatus === 'Verified').length
  return (
    <div>
      <PageHeader
        title="Tea sources"
        description={`The lots your products are packed from. ${ws.packer.name} holds each lot and packs your share; the origin, harvest, processing and verification records below come from NTZDC and ForestOS and cannot be edited.`}
        meta={
          ws.lots.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-compact text-ink-muted">
              <ShieldCheck className="h-4 w-4 text-forest-accent" aria-hidden="true" />
              {verified} of {ws.lots.length} lots verified deforestation-free
            </span>
          )
        }
      />
      {ws.lots.length === 0 ? (
        <EmptyState message="No lots connected yet. Connect a lot when you create or edit a product." />
      ) : (
        <div className="space-y-8">
          {ws.lots.map((lot) => (
            <LotCard key={lot.traceId} lot={lot} />
          ))}
        </div>
      )}
    </div>
  )
}
