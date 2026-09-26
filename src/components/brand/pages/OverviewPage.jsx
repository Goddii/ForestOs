import { Link } from 'react-router-dom'
import { ArrowRight, Ban, CalendarClock, CheckCircle2, Megaphone, Package, PenLine, QrCode, Radio, ShieldCheck, Sprout, UserPlus } from 'lucide-react'
import { BRAND_SEGMENT_LABELS } from '../../../data/brand/accounts'
import { periodChange, rangeFrom } from '../../../lib/brand/analytics'
import { formatKg } from '../../../lib/offtaker/format'
import { useBrand, useBrandPath } from '../BrandWorkspaceContext'
import BrandMark from '../BrandMark'
import PackRender from '../PackRender'
import { ExperienceStatusBadge, ProductStatusBadge } from '../StatusBadges'
import SectionHeading from '../../investor/SectionHeading'

const DAYS_30 = 30

const ACTIVITY_ICONS = {
  published: Radio,
  launched: Package,
  packed: Sprout,
  verified: ShieldCheck,
  campaign: Megaphone,
  claim_approved: CheckCircle2,
  claim_reword: PenLine,
  claim_in_review: CalendarClock,
  claim_not_supported: Ban,
}

/** What needs someone's attention, each item pointing at the page where it is dealt with. */
function attentionItems(ws) {
  const items = []
  const claimsToFix = ws.claimSummary.reword + ws.claimSummary.not_supported
  if (claimsToFix > 0) {
    items.push({ key: 'claims', icon: PenLine, text: `${claimsToFix} claim${claimsToFix === 1 ? '' : 's'} need approved wording or cannot be made yet`, to: 'content' })
  }
  for (const experience of ws.experiences.filter((e) => e.status === 'draft')) {
    const open = experience.readiness.checks.filter((check) => !check.ok).length
    items.push({
      key: experience.id,
      icon: QrCode,
      text: open === 0 ? `“${experience.customisation.title}” is ready to publish` : `“${experience.customisation.title}” has ${open} check${open === 1 ? '' : 's'} left before it can publish`,
      to: `experiences/${experience.id}`,
    })
  }
  for (const campaign of ws.campaigns.filter((c) => c.status === 'scheduled')) {
    items.push({ key: campaign.id, icon: CalendarClock, text: `${campaign.name} starts ${campaign.period.start}`, to: 'campaigns' })
  }
  for (const lot of ws.lots.flatMap((l) => l.allocations).filter((a) => a.status === 'scheduled')) {
    items.push({ key: lot.id, icon: Sprout, text: `${formatKg(lot.allocatedKg)} for ${lot.productName} is scheduled to pack on ${lot.date}`, to: 'sources' })
  }
  const invited = ws.team.filter((member) => member.status === 'invited').length
  if (invited > 0) items.push({ key: 'invites', icon: UserPlus, text: `${invited} team invitation${invited === 1 ? '' : 's'} not accepted yet`, to: 'team' })
  return items
}

function Figure({ label, value, detail, to }) {
  return (
    <Link to={to} className="group block bg-card px-5 py-5 transition-colors duration-150 hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/50">
      <p className="text-compact text-ink-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold leading-none tracking-tight text-ink">{value}</p>
      <p className="mt-2 text-xs leading-snug text-ink-faint">{detail}</p>
    </Link>
  )
}

export default function OverviewPage() {
  const ws = useBrand()
  const path = useBrandPath()
  const from = rangeFrom(ws.asOf, DAYS_30)
  const change = periodChange(ws.scanDays, from, ws.asOf)
  const attention = attentionItems(ws)
  const approvedClaims = ws.claimSummary.approved
  const experiencesById = new Map(ws.experiences.map((experience) => [experience.id, experience]))

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-center">
        <BrandMark kit={ws.kit} size={64} />
        <div className="min-w-0">
          <h1 className="font-display text-5xl leading-[1.05] text-ink sm:text-6xl">{ws.org.name}</h1>
          <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-ink-muted">
            {BRAND_SEGMENT_LABELS[ws.account.segment]}: {ws.account.footprint}. Tea packed for you by {ws.packer.name} from verified Nyayo
            Tea Zone lots. You shape the product and the story; ForestOS supplies the origin and conservation record underneath it.
          </p>
        </div>
      </div>

      <section aria-labelledby="figures-heading">
        <h2 id="figures-heading" className="sr-only">
          Your brand at a glance
        </h2>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-card sm:grid-cols-2 xl:grid-cols-6">
          <Figure label="Products on sale" value={ws.totals.productsOnSale} detail={`${ws.products.length} in the range, including drafts`} to={path('products')} />
          <Figure label="Live campaigns" value={ws.totals.liveCampaigns} detail={`${ws.campaigns.length} campaigns in total`} to={path('campaigns')} />
          <Figure label="Connected tea lots" value={ws.totals.connectedLots} detail={`${formatKg(ws.totals.packedKg)} packed so far`} to={path('sources')} />
          <Figure
            label="QR scans, last 30 days"
            value={change.current.toLocaleString('en-US')}
            detail={change.pct === null ? `${ws.totals.publishedExperiences} published experience${ws.totals.publishedExperiences === 1 ? '' : 's'}` : `${change.pct >= 0 ? '+' : ''}${change.pct}% on the 30 days before`}
            to={path('analytics')}
          />
          <Figure
            label="Verified conservation"
            value={ws.evidence.verified.length}
            detail={ws.evidence.verified.length > 0 ? `records behind ${ws.evidence.metrics.length} impact statements you can use` : 'no verified work linked to your lots yet'}
            to={path('impact')}
          />
          <Figure label="Claims approved" value={`${approvedClaims} of ${ws.claims.length}`} detail="statements checked against the records" to={path('content')} />
        </div>
      </section>

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-12">
          {attention.length > 0 && (
            <section aria-label="Needs your attention">
              <SectionHeading title="Needs your attention" />
              <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card shadow-card">
                {attention.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.key}>
                      <Link to={path(item.to)} className="group flex items-center gap-3 px-5 py-3.5 text-compact text-ink transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/50">
                        <Icon className="h-4 w-4 shrink-0 text-ink-faint" strokeWidth={2} aria-hidden="true" />
                        <span className="min-w-0 flex-1">{item.text}</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          <section aria-label="Your products">
            <SectionHeading
              title="Your products"
              description="Each product, the lot it is packed from and the QR experience printed on it."
              action={
                <Link to={path('products')} className="text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
                  All products
                </Link>
              }
            />
            <ul className="grid gap-3 md:grid-cols-2">
              {ws.products.map((product) => {
                const experience = experiencesById.get(product.experienceId)
                return (
                  <li key={product.id}>
                    <Link
                      to={path(`products/${product.id}`)}
                      className="flex gap-4 rounded-2xl border border-line bg-card p-3 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-forest-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                    >
                      <PackRender product={product} kit={ws.kit} className="w-20 shrink-0" />
                      <div className="min-w-0 flex-1 py-1">
                        <p className="truncate font-semibold text-ink">{product.name}</p>
                        <p className="mt-0.5 truncate text-xs text-ink-muted">
                          {product.lots.length > 0 ? `Lot ${product.lots.map((lot) => `#${lot.code}`).join(', ')}, ${product.lots[0].block}` : 'No lot connected'}
                        </p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                          <ProductStatusBadge status={product.status} />
                          {experience && <ExperienceStatusBadge status={experience.status} />}
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-label="Conservation impact you can talk about">
            <SectionHeading
              title="Conservation impact you can talk about"
              action={
                <Link to={path('impact')} className="text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
                  All impact statements
                </Link>
              }
            />
            {ws.evidence.metrics.length > 0 ? (
              <ul className="grid gap-3 md:grid-cols-2">
                {ws.evidence.metrics.slice(0, 4).map((metric) => (
                  <li key={metric.id} className="flex gap-3 rounded-2xl border border-forest-accent/20 bg-forest-accent-soft/40 p-4 text-compact leading-relaxed text-ink">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-accent" strokeWidth={2.25} aria-hidden="true" />
                    {metric.wording}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-line-strong px-5 py-4 text-compact text-ink-muted">
                None of your lots’ collection centres is linked to verified conservation work yet, so there is no impact statement to use. Your
                verified origin can still be shown on every pack.
              </p>
            )}
          </section>
        </div>

        <section aria-labelledby="activity-heading" className="xl:border-l xl:border-line xl:pl-10">
          <h2 id="activity-heading" className="text-2xl font-bold tracking-tight text-ink">
            Recent activity
          </h2>
          <ol className="mt-5 space-y-4">
            {ws.activity.slice(0, 9).map((event) => {
              const Icon = ACTIVITY_ICONS[event.kind] ?? CheckCircle2
              return (
                <li key={event.id} className="flex gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-canvas text-ink-muted">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <Link to={path(event.to)} className="text-compact leading-snug text-ink hover:text-forest-accent">
                      {event.text}
                    </Link>
                    <p className="mt-0.5 font-mono text-label text-ink-faint">{event.date}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </div>
  )
}
