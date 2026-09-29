import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { PACK_TYPE_LABELS } from '../../../data/brand/products'
import { useBrand, useBrandPath } from '../BrandWorkspaceContext'
import PackRender from '../PackRender'
import ProvenanceChain from '../ProvenanceChain'
import SectionHeading from '../../investor/SectionHeading'
import { CampaignStatusBadge, ClaimVerdictBadge, ProductStatusBadge, SourceTag } from '../StatusBadges'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const ws = useBrand()
  const path = useBrandPath()
  const product = ws.products.find((entry) => entry.id === productId)
  if (!product) return <Navigate to={path('products')} replace />

  const experience = ws.experiences.find((entry) => entry.id === product.experienceId) ?? null
  const campaigns = ws.campaigns.filter((campaign) => product.campaignIds.includes(campaign.id))

  return (
    <div className="space-y-12">
      <nav aria-label="Breadcrumb">
        <Link to={path('products')} className="inline-flex items-center gap-1 text-compact text-ink-muted hover:text-forest-accent">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Products
        </Link>
      </nav>

      <div className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <PackRender product={product} kit={ws.kit} className="w-full max-w-[18rem]" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ProductStatusBadge status={product.status} />
            <SourceTag kind="brand" />
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-title">{product.name}</h1>
          <p className="mt-1 text-sm text-ink-muted">{product.line}</p>
          <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-ink">{product.description}</p>
          <dl className="mt-6 grid gap-4 text-compact sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Tea', product.teaType],
              ['Packaging', `${PACK_TYPE_LABELS[product.packaging.type]}, ${product.packaging.size}`],
              ['Sold or served', product.channel],
              ['On sale since', product.launchDate ?? 'Not launched'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-compact text-ink-faint">{label}</dt>
                <dd className="mt-0.5 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section aria-label="From product to forest">
        <SectionHeading
          title="From product to forest"
          description="What this product is, the lot it is packed from, where that lot grew, the conservation work verified there, and the experience a customer reaches by scanning the pack."
        />
        <div className="max-w-4xl">
          <ProvenanceChain product={product} experience={experience} packerName={ws.packer.name} path={path} />
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-label="Claims about this product">
          <SectionHeading
            title="Claims about this product"
            action={
              <Link to={path('content')} className="inline-flex items-center gap-1 text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
                Content & claims <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
          />
          {product.claims.length === 0 ? (
            <p className="text-compact text-ink-muted">No claims submitted for this product.</p>
          ) : (
            <ul className="divide-y divide-line rounded-2xl border border-line bg-card shadow-card">
              {product.claims.map((claim) => (
                <li key={claim.id} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-compact text-ink">“{claim.statement}”</span>
                  <ClaimVerdictBadge status={claim.assessment.status} className="shrink-0" />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section aria-label="Campaigns">
          <SectionHeading
            title="Campaigns"
            action={
              <Link to={path('campaigns')} className="inline-flex items-center gap-1 text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
                All campaigns <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
          />
          {campaigns.length === 0 ? (
            <p className="text-compact text-ink-muted">This product is not in a campaign yet.</p>
          ) : (
            <ul className="divide-y divide-line rounded-2xl border border-line bg-card shadow-card">
              {campaigns.map((campaign) => (
                <li key={campaign.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <span className="text-compact text-ink">
                    {campaign.name}
                    <span className="ml-2 text-compact text-ink-faint">
                      from {campaign.period.start}
                      {campaign.period.end ? ` to ${campaign.period.end}` : ''}
                    </span>
                  </span>
                  <CampaignStatusBadge status={campaign.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
