import { Link } from 'react-router-dom'
import { ExternalLink, QrCode } from 'lucide-react'
import { useCreator, useCreatorPath } from '../CreatorContext'
import { CodeStateBadge, PageHeader, StatusBadge, formatDate } from '../ui'
import { PACK_TYPE_LABELS } from '../../../data/creator/products'
import { EXPERIENCE_STATUS_LABELS } from '../../../data/creator/campaigns'

/**
 * Every campaign as a large editorial card: image, status, its QR
 * experiences, scans, the connected product and the conservation programme
 * it tells. Live campaigns are shown in full; campaigns kept in preview or
 * still in progress sit below in a smaller row.
 */
export default function CampaignsPage() {
  const { campaigns } = useCreator()
  const live = campaigns.filter((campaign) => campaign.status === 'live')
  const rest = campaigns.filter((campaign) => campaign.status !== 'live')

  return (
    <div className="space-y-16">
      <PageHeader title="Campaigns" lede="Each campaign is a cultural moment with verified conservation underneath. Open one in the Studio to shape its QR experience." />
      {live.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} wide />
      ))}
      {rest.length > 0 && (
        <section aria-labelledby="campaigns-preview" className="border-t border-line pt-10">
          <h2 id="campaigns-preview" className="font-display text-3xl text-ink">
            In preview
          </h2>
          <p className="mt-2 max-w-[60ch] text-compact text-ink-muted">Built and viewable, not published. Their codes do not count scans until you publish.</p>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {rest.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function CampaignCard({ campaign, wide = false }) {
  const path = useCreatorPath()
  const primary = campaign.experiences[0]
  return (
    <article className={wide ? 'grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center' : ''}>
      <img
        src={campaign.image.src}
        alt={campaign.image.alt}
        loading={wide ? 'eager' : 'lazy'}
        className={`w-full rounded-2xl object-cover ${wide ? 'aspect-[16/9]' : 'aspect-[3/2]'}`}
      />
      <div className={wide ? '' : 'mt-5'}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={campaign.status} />
          <span className="text-compact text-ink-faint">{campaign.subtitle}</span>
        </div>
        <h2 className={`mt-3 font-display leading-[1.05] text-ink text-balance ${wide ? 'text-4xl sm:text-5xl' : 'text-3xl'}`}>{campaign.title}</h2>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-compact">
          <div>
            <dt className="text-ink-faint">Packaged tea</dt>
            <dd className="mt-0.5 text-ink">{campaign.products.map((product) => product.name).join(', ')}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Conservation programme</dt>
            <dd className="mt-0.5 text-ink">{campaign.programme}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">QR scans</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums text-ink">{campaign.scans.toLocaleString('en-GB')}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Live since</dt>
            <dd className="mt-0.5 text-ink">{formatDate(campaign.launchedAt)}</dd>
          </div>
        </dl>

        <ul className="mt-5 grid gap-3" aria-label="Packs and batch codes">
          {campaign.products.map((product) => (
            <li key={product.id} className="rounded-xl bg-canvas px-4 py-3">
              <p className="text-compact font-semibold text-ink">{product.name}</p>
              <p className="text-xs text-ink-muted">{product.packs.map((pack) => `${PACK_TYPE_LABELS[pack.type]} ${pack.size}`).join(', ')}</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                {product.codes.map((code) => (
                  <li key={code.id} className="flex items-center gap-1.5 text-xs text-ink">
                    Batch #{code.batchId} <CodeStateBadge state={code.state} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <ul className="mt-5 divide-y divide-line border-y border-line">
          {campaign.experiences.map((experience) => (
            <li key={experience.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-compact font-semibold text-ink">
                  <QrCode className="h-4 w-4 text-ink-faint" aria-hidden="true" />
                  {experience.name}
                </p>
                <p className="text-xs text-ink-faint">
                  {experience.template.name}, {EXPERIENCE_STATUS_LABELS[experience.status].toLowerCase()}
                </p>
              </div>
              <Link to={path(`studio/${experience.id}`)} className="text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
                Edit in Studio
              </Link>
            </li>
          ))}
        </ul>

        {primary && (
          <a
            href={primary.template.route}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-compact font-semibold text-ink transition-colors hover:border-forest-accent/40 hover:bg-forest-accent-soft"
          >
            Preview experience <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  )
}
