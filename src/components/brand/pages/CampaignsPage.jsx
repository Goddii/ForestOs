import { Link } from 'react-router-dom'
import { ArrowRight, Plus } from 'lucide-react'
import { CAMPAIGN_STATUS_LABELS } from '../../../data/brand/campaigns'
import { sumScans } from '../../../lib/brand/analytics'
import { useBrand, useBrandPath } from '../BrandWorkspaceContext'
import PageHeader from '../../offtaker/PageHeader'
import ActionButton from '../../investor/ui/ActionButton'
import EmptyState from '../../investor/EmptyState'
import { CampaignStatusBadge, CampaignThemeTag, ExperienceStatusBadge } from '../StatusBadges'

const STATUS_ORDER = ['live', 'scheduled', 'draft', 'ended']

/** Scans of the campaign's experience that fall inside the campaign's own dates. */
function campaignScans(campaign, days, asOf) {
  if (!campaign.experienceId) return null
  const end = campaign.period.end && campaign.period.end < asOf ? campaign.period.end : asOf
  return sumScans(days.filter((day) => day.experienceId === campaign.experienceId && day.date >= campaign.period.start && day.date <= end))
}

function CampaignCard({ campaign }) {
  const ws = useBrand()
  const path = useBrandPath()
  const experience = ws.experiences.find((entry) => entry.id === campaign.experienceId) ?? null
  const products = ws.products.filter((product) => campaign.productIds.includes(product.id))
  const scans = campaignScans(campaign, ws.scanDays, ws.asOf)
  return (
    <article className="grid gap-5 rounded-2xl border border-line bg-card p-6 shadow-card lg:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <CampaignThemeTag theme={campaign.theme} />
          <CampaignStatusBadge status={campaign.status} />
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{campaign.name}</h3>
        <p className="mt-0.5 font-mono text-compact text-ink-faint">
          {campaign.period.start}
          {campaign.period.end ? ` to ${campaign.period.end}` : ', open-ended'}
        </p>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-ink">{campaign.objective}</p>
        <dl className="mt-4 grid gap-3 text-compact sm:grid-cols-2">
          <div>
            <dt className="text-compact text-ink-faint">Products</dt>
            <dd className="mt-0.5 flex flex-wrap gap-x-3">
              {products.map((product) => (
                <Link key={product.id} to={path(`products/${product.id}`)} className="text-ink underline decoration-line-strong underline-offset-2 hover:text-forest-accent">
                  {product.name}
                </Link>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-compact text-ink-faint">Channels</dt>
            <dd className="mt-0.5 text-ink">{campaign.channels.join(', ')}</dd>
          </div>
        </dl>
      </div>
      <div className="flex flex-col justify-between gap-4 rounded-xl bg-canvas p-4">
        {experience ? (
          <div>
            <p className="text-compact text-ink-faint">QR experience</p>
            <Link to={path(`experiences/${experience.id}`)} className="mt-0.5 block font-semibold text-ink hover:text-forest-accent">
              {experience.customisation.title}
            </Link>
            <ExperienceStatusBadge status={experience.status} className="mt-2" />
          </div>
        ) : (
          <p className="text-compact text-ink-muted">No QR experience connected.</p>
        )}
        {scans && scans.scans > 0 ? (
          <div>
            <p className="text-3xl font-bold leading-none tracking-tight tabular-nums text-ink">{scans.scans.toLocaleString('en-US')}</p>
            <p className="mt-1 text-compact text-ink-muted">scans during the campaign</p>
            <Link
              to={`${path('analytics')}?exp=${campaign.experienceId}`}
              className="mt-2 inline-flex items-center gap-1 text-compact font-semibold text-forest-accent hover:text-forest-accent-dark"
            >
              Performance <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <p className="text-compact text-ink-faint">No scans yet.</p>
        )}
      </div>
    </article>
  )
}

export default function CampaignsPage() {
  const ws = useBrand()
  const path = useBrandPath()
  const groups = STATUS_ORDER.map((status) => ({ status, campaigns: ws.campaigns.filter((campaign) => campaign.status === status) })).filter(
    (group) => group.campaigns.length > 0,
  )
  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Campaigns group products and a QR experience around a theme: conservation, landscape, community, cultural identity, artists or climate action."
        actions={
          ws.permissions.manageCampaigns && (
            <ActionButton to={path('campaigns/new')} variant="primary" icon={Plus} iconPosition="left">
              New campaign
            </ActionButton>
          )
        }
      />
      {groups.length === 0 ? (
        <EmptyState message="No campaigns yet. Start one around a product and its QR experience." />
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.status} aria-label={`${CAMPAIGN_STATUS_LABELS[group.status]} campaigns`}>
              <h2 className="mb-4 text-lg font-semibold text-ink">
                {CAMPAIGN_STATUS_LABELS[group.status]} <span className="font-normal text-ink-faint">{group.campaigns.length}</span>
              </h2>
              <div className="space-y-4">
                {group.campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
