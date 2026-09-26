import { AlertTriangle, Download, Lock, ShieldCheck } from 'lucide-react'
import { VERIFICATION_MARK } from '../../../data/brand/assets'
import { useBrand } from '../BrandWorkspaceContext'
import PageHeader from '../../offtaker/PageHeader'
import SectionHeading from '../../investor/SectionHeading'
import DataTable from '../../offtaker/DataTable'
import ActionButton from '../../investor/ui/ActionButton'
import { downloadQrSvg } from '../QrCode'
import { ExperienceStatusBadge, SourceTag } from '../StatusBadges'

function PhotoCard({ photo }) {
  return (
    <li className="flex flex-col">
      <picture>
        <source srcSet={`${photo.src}.webp`} type="image/webp" />
        <img src={`${photo.src}.jpg`} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" className="aspect-[3/2] w-full rounded-xl object-cover" />
      </picture>
      <p className="mt-2 text-compact font-semibold text-ink">{photo.caption}</p>
      <p className="text-xs text-ink-muted">{photo.landscape}</p>
      <p className="mt-1 text-xs text-ink-faint">
        {photo.credit ? (
          <>
            {photo.credit.author}, {photo.credit.license}.{' '}
            <a href={photo.credit.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-forest-accent">
              Source
            </a>
          </>
        ) : (
          photo.licenceNote
        )}
      </p>
      {photo.showsPeople && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-warning">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Shows people: needs a consented field photo before marketing use
        </p>
      )}
      <a href={`${photo.src}.jpg`} download className="mt-2 inline-flex items-center gap-1 self-start text-xs font-semibold text-forest-accent hover:underline">
        <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download
      </a>
    </li>
  )
}

export default function AssetsPage() {
  const ws = useBrand()
  const memberName = (id) => ws.team.find((member) => member.id === id)?.name ?? 'Unknown'
  return (
    <div className="space-y-14">
      <PageHeader title="Assets" description="Photography and marks ForestOS supplies for use beside verified records, the QR code files for your experiences, and your team’s own files." />

      <section aria-label="ForestOS photography">
        <SectionHeading title="ForestOS photography" description="Illustrative landscape and field photography, not photos of your lots. Each image keeps its author and licence." />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 xl:grid-cols-4">
          {ws.photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </ul>
      </section>

      <section aria-label="Verification mark" className="grid gap-6 rounded-2xl border border-line bg-card p-6 shadow-card md:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="grid place-items-center rounded-xl bg-canvas p-8">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-forest-accent bg-card px-4 py-2 text-sm font-bold text-forest-accent-dark">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
            {VERIFICATION_MARK.name}
          </span>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-ink">Verification mark</h2>
            <SourceTag kind="forestos" />
          </div>
          <ul className="mt-3 space-y-2 text-compact text-ink">
            {VERIFICATION_MARK.rules.map((rule) => (
              <li key={rule} className="flex gap-2">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="QR code files">
        <SectionHeading title="QR code files" description="One print-ready SVG per experience. Each opens the experience from the moment it is published." />
        <DataTable
          caption="QR code files"
          rowKey={(row) => row.id}
          rows={ws.experiences}
          minWidth="36rem"
          columns={[
            { key: 'title', header: 'Experience', cell: (row) => <span className="font-semibold text-ink">{row.customisation.title}</span> },
            { key: 'product', header: 'Printed on', cell: (row) => row.product?.name ?? 'No product' },
            { key: 'status', header: 'Status', cell: (row) => <ExperienceStatusBadge status={row.status} /> },
            {
              key: 'download',
              header: 'File',
              cell: (row) => (
                <ActionButton onClick={() => downloadQrSvg(`${window.location.origin}${row.livePath}`, `${row.shortCode}-qr.svg`)} icon={Download} iconPosition="left">
                  SVG
                </ActionButton>
              ),
            },
          ]}
        />
      </section>

      <section aria-label="Your files">
        <SectionHeading title="Your files" description="Logos, pack artwork and campaign material uploaded by your team. Uploading is not available in this demo." />
        <DataTable
          caption="Files uploaded by your team"
          rowKey={(row) => row.id}
          rows={ws.uploads}
          empty="No files uploaded yet."
          columns={[
            { key: 'name', header: 'File', cell: (row) => <span className="font-semibold text-ink">{row.name}</span> },
            { key: 'usage', header: 'Used for', cell: (row) => row.usage },
            { key: 'type', header: 'Type', cell: (row) => <span className="font-mono text-xs">{row.type}</span> },
            { key: 'size', header: 'Size', align: 'right', cell: (row) => (row.sizeKb >= 1000 ? `${(row.sizeKb / 1000).toFixed(1)} MB` : `${row.sizeKb} KB`) },
            { key: 'by', header: 'Uploaded by', cell: (row) => memberName(row.uploadedBy) },
            { key: 'at', header: 'Date', cell: (row) => <span className="font-mono text-xs">{row.uploadedAt}</span> },
          ]}
        />
      </section>
    </div>
  )
}
