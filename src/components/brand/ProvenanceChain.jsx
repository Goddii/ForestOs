import { Link } from 'react-router-dom'
import { ArrowRight, CircleDashed, Package, QrCode, ShieldCheck, Sprout, Trees } from 'lucide-react'
import { formatKg } from '../../lib/offtaker/format'
import { ExperienceStatusBadge, LotVerificationBadge, SourceTag } from './StatusBadges'

/**
 * Product → Tea source → Nyayo Tea Zone → Verified conservation → Consumer
 * experience: the one chain the brief asks a product page to show. Each
 * node says who owns it (brand content or ForestOS verified), and the spine
 * between two nodes is solid green only when the node above is backed by a
 * verified record, so a gap in the chain shows where it happens.
 *
 * @param {{ product: any, experience: any | null, packerName: string, path: (sub?: string) => string }} props
 */
export default function ProvenanceChain({ product, experience, packerName, path }) {
  const lots = product.lots
  const lotsVerified = lots.length > 0 && lots.every((lot) => lot.verificationStatus === 'Verified')
  const { evidence } = product
  const centres = evidence.centres

  const nodes = [
    {
      key: 'product',
      icon: Package,
      title: 'Product',
      owner: 'brand',
      solid: true,
      body: (
        <>
          <p className="text-base font-semibold text-ink">{product.name}</p>
          <p className="mt-1 text-compact text-ink-muted">
            {product.teaType}. {product.packaging.size}, {product.packaging.material.toLowerCase()}. QR: {product.packaging.qrPlacement.toLowerCase()}.
          </p>
        </>
      ),
    },
    {
      key: 'source',
      icon: Sprout,
      title: 'Tea source',
      owner: 'forestos',
      solid: lotsVerified,
      body:
        lots.length === 0 ? (
          <EmptyNode text="No lot connected yet. Connect the lot this product is packed from before printing a QR code." />
        ) : (
          <ul className="space-y-3">
            {product.allocations.map((allocation) => (
              <li key={allocation.id} className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">
                    Lot #{allocation.lot.code} <span className="font-mono text-xs font-normal text-ink-faint">{allocation.lot.traceId}</span>
                  </p>
                  <p className="mt-0.5 text-compact text-ink-muted">
                    {formatKg(allocation.allocatedKg)} of {formatKg(allocation.lot.madeTeaKg)} {allocation.status === 'packed' ? `packed ${allocation.date}` : `scheduled for ${allocation.date}`} by {packerName.replace(/\.$/, '')}. Grade {allocation.lot.grade}, {allocation.lot.harvestMonth} harvest, {allocation.lot.factory}.
                  </p>
                </div>
                <LotVerificationBadge status={allocation.lot.verificationStatus} />
              </li>
            ))}
          </ul>
        ),
    },
    {
      key: 'zone',
      icon: Trees,
      title: 'Nyayo Tea Zone',
      owner: 'forestos',
      solid: lotsVerified,
      body:
        lots.length === 0 ? (
          <EmptyNode text="Shown once a lot is connected." />
        ) : (
          <dl className="grid gap-x-6 gap-y-3 text-compact sm:grid-cols-2">
            {lots.map((lot) => (
              <div key={lot.traceId} className="sm:col-span-2">
                <dt className="text-xs text-ink-faint">{lot.block}</dt>
                <dd className="mt-0.5 text-ink">
                  {lot.landscape}, {lot.region}. Tea buffer at {lot.centre?.name ?? lot.record.plot.centre} collection centre, water towers {lot.record.land.waterTowers.join(', ')}. Plot canopy {lot.record.plot.canopyBaseline2020Pct}% in 2020, {lot.record.plot.canopyNowPct}% now.
                </dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-faint">Buffer segments linked</dt>
              <dd className="mt-0.5 text-ink">
                {evidence.segmentIds.length > 0 ? `${evidence.segmentIds.length} segment${evidence.segmentIds.length === 1 ? '' : 's'} of the forest buffer beside ${centres.map((c) => c.name).join(', ')}` : 'None linked to this collection centre yet'}
              </dd>
            </div>
          </dl>
        ),
    },
    {
      key: 'conservation',
      icon: ShieldCheck,
      title: 'Verified conservation',
      owner: 'forestos',
      solid: evidence.verified.length > 0,
      body:
        evidence.verified.length === 0 ? (
          <EmptyNode text="No verified conservation work is linked to this tea’s source yet. The product can show verified origin, but no conservation claim." />
        ) : (
          <>
            <ul className="space-y-1.5 text-compact text-ink">
              {evidence.metrics.slice(0, 3).map((metric) => (
                <li key={metric.id} className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-accent" strokeWidth={2.25} aria-hidden="true" />
                  <span>{metric.wording}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-muted">
              {evidence.verified.length} verified record{evidence.verified.length === 1 ? '' : 's'}
              {evidence.pending.length > 0 && `, ${evidence.pending.length} still in verification`}.{' '}
              <Link to={path('story')} className="font-semibold text-forest-accent underline-offset-2 hover:underline">
                Open the conservation story
              </Link>
            </p>
          </>
        ),
    },
    {
      key: 'experience',
      icon: QrCode,
      title: 'Consumer experience',
      owner: 'brand',
      solid: false,
      body: experience ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-ink">{experience.customisation.title}</p>
            <p className="mt-0.5 text-compact text-ink-muted">
              {experience.template.name} template.{' '}
              {experience.status === 'published' ? `${experience.scans.scans.toLocaleString('en-US')} scans since ${experience.publishedAt}.` : 'Not published yet.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ExperienceStatusBadge status={experience.status} />
            <Link to={path(`experiences/${experience.id}`)} className="inline-flex items-center gap-1 text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
              Open studio <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : (
        <EmptyNode text="No QR experience yet. Create one from QR experiences once the product has a lot." />
      ),
    },
  ]

  return (
    <ol className="relative">
      {nodes.map((node, index) => {
        const Icon = node.icon
        const last = index === nodes.length - 1
        return (
          <li key={node.key} className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-6 last:pb-0">
            {!last && (
              <span aria-hidden="true" className={`absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 ${node.solid ? 'bg-forest-accent' : 'bg-line-strong'}`} />
            )}
            <span
              className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 ${
                node.owner === 'forestos' && node.solid ? 'border-forest-accent bg-forest-accent text-white' : 'border-line-strong bg-card text-ink-muted'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            </span>
            <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-ink">{node.title}</h3>
                <SourceTag kind={node.owner} />
              </div>
              {node.body}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function EmptyNode({ text }) {
  return (
    <p className="flex items-start gap-2 text-compact text-ink-muted">
      <CircleDashed className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" strokeWidth={2} aria-hidden="true" />
      {text}
    </p>
  )
}
