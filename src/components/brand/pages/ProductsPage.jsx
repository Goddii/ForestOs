import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PRODUCT_STATUS_LABELS } from '../../../data/brand/products'
import { useBrand, useBrandPath } from '../BrandWorkspaceContext'
import PageHeader from '../../offtaker/PageHeader'
import ActionButton from '../../investor/ui/ActionButton'
import EmptyState from '../../investor/EmptyState'
import PackRender from '../PackRender'
import { ExperienceStatusBadge, LotVerificationBadge, ProductStatusBadge } from '../StatusBadges'

const FILTERS = [['all', 'All'], ...Object.entries(PRODUCT_STATUS_LABELS)]

export default function ProductsPage() {
  const ws = useBrand()
  const path = useBrandPath()
  const [filter, setFilter] = useState('all')
  const experiencesById = new Map(ws.experiences.map((experience) => [experience.id, experience]))
  const campaignsById = new Map(ws.campaigns.map((campaign) => [campaign.id, campaign]))
  const shown = ws.products.filter((product) => filter === 'all' || product.status === filter)

  return (
    <div>
      <PageHeader
        title="Products"
        description="Your tea range. Every product points at the lot it is packed from, the campaigns it belongs to and the QR experience printed on it."
        actions={
          ws.permissions.manageProducts && (
            <ActionButton to={path('products/new')} variant="primary" icon={Plus} iconPosition="left">
              New product
            </ActionButton>
          )
        }
      />

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {FILTERS.map(([key, label]) => {
          const count = key === 'all' ? ws.products.length : ws.products.filter((product) => product.status === key).length
          return (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={`rounded-full border px-3.5 py-1.5 text-compact transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                filter === key ? 'border-forest-accent bg-forest-accent-soft font-semibold text-forest-accent-dark' : 'border-line text-ink-muted hover:border-ink-faint'
              }`}
            >
              {label} <span className="tabular-nums text-ink-faint">{count}</span>
            </button>
          )
        })}
      </div>

      {shown.length === 0 ? (
        <EmptyState message="No products with this status." />
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((product) => {
            const experience = experiencesById.get(product.experienceId)
            const lot = product.lots[0]
            return (
              <li key={product.id}>
                <Link
                  to={path(`products/${product.id}`)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-forest-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                >
                  <PackRender product={product} kit={ws.kit} aspect="aspect-[16/10]" className="rounded-none" />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-lg font-semibold leading-snug text-ink">{product.name}</p>
                        <p className="text-compact text-ink-muted">{product.line}</p>
                      </div>
                      <ProductStatusBadge status={product.status} />
                    </div>
                    <dl className="mt-4 grid gap-2 border-t border-line pt-4 text-compact">
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-ink-faint">Tea source</dt>
                        <dd className="flex items-center gap-2 text-right text-ink">
                          {lot ? (
                            <>
                              Lot #{lot.code}, {lot.block}
                              <LotVerificationBadge status={lot.verificationStatus} />
                            </>
                          ) : (
                            <span className="text-ink-faint">Not connected</span>
                          )}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-faint">Campaigns</dt>
                        <dd className="text-right text-ink">{product.campaignIds.map((id) => campaignsById.get(id)?.name).join(', ') || 'None'}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-ink-faint">QR experience</dt>
                        <dd className="flex items-center gap-2 text-ink">
                          {experience ? (
                            <>
                              {experience.status === 'published' && <span className="tabular-nums text-ink-muted">{experience.scans.scans.toLocaleString('en-US')} scans</span>}
                              <ExperienceStatusBadge status={experience.status} />
                            </>
                          ) : (
                            <span className="text-ink-faint">None</span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
