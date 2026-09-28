import { Link } from 'react-router-dom'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { useCreator, useCreatorPath } from '../CreatorContext'
import { Figure, LockedTag, SectionTitle, StatusBadge, formatDate } from '../ui'
import ActionButton from '../../investor/ui/ActionButton'

/** Dated things that happened, newest first, derived from the records. */
function recentActivity(campaigns, experiences) {
  const events = [
    ...campaigns.filter((campaign) => campaign.launchedAt).map((campaign) => ({ date: campaign.launchedAt, text: `${campaign.title} went live` })),
    ...experiences.filter((experience) => experience.publishedAt).map((experience) => ({ date: experience.publishedAt, text: `Published “${experience.name}”` })),
    ...experiences.filter((experience) => experience.stats.lastScan).map((experience) => ({ date: experience.stats.lastScan, text: `Latest scan on “${experience.name}”` })),
  ]
  return events.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
}

const NOT_LIVE_NOTE = { preview: 'in preview, not published', in_review: 'with ForestOS for review', draft: 'still a draft' }

/** One live campaign shown in full: large image, title, product and actions. */
function FeaturedCampaign({ campaign, flip, headingLevel: Heading }) {
  const path = useCreatorPath()
  const experience = campaign.experiences[0]
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end">
      <img
        src={campaign.image.src}
        alt={campaign.image.alt}
        className={`aspect-[16/9] w-full rounded-2xl bg-forest-950 object-cover ${flip ? 'lg:order-2' : ''}`}
      />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={campaign.status} />
          <span className="text-compact text-ink-faint">{campaign.subtitle}</span>
        </div>
        <Heading className="mt-4 font-display text-5xl leading-[1] text-ink text-balance sm:text-6xl">{campaign.title}</Heading>
        <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
          {experience?.creative.subline || campaign.programme}
        </p>
        <p className="mt-2 text-compact text-ink-faint">
          {campaign.products.map((product) => product.name).join(', ')}, {campaign.scans.toLocaleString('en-GB')} pack scans
        </p>
        {experience && (
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={experience.template.route}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-forest-accent px-5 py-2.5 text-compact font-semibold text-white transition-colors hover:bg-forest-accent-dark"
            >
              Preview experience <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <ActionButton to={path(`studio/${experience.id}`)} variant="ghost">
              Open in Studio
            </ActionButton>
          </div>
        )}
      </div>
    </section>
  )
}

export default function HomePage() {
  const { creator, campaigns, experiences, totals, verified } = useCreator()
  const path = useCreatorPath()
  const live = campaigns.filter((campaign) => campaign.status === 'live')
  const featured = live.length ? live : campaigns.slice(0, 1)
  const needsYou = experiences.filter((experience) => experience.status !== 'published')

  return (
    <div className="space-y-16">
      <p className="text-[15px] text-ink-muted">
        Welcome back, {creator.name}. Your live campaigns are carrying the {verified.landscape[0].value} to your community.
      </p>
      {featured.map((campaign, index) => (
        <FeaturedCampaign key={campaign.id} campaign={campaign} flip={index % 2 === 1} headingLevel={index === 0 ? 'h1' : 'h2'} />
      ))}

      <section aria-labelledby="home-pulse" className="border-y border-line py-8">
        <h2 id="home-pulse" className="sr-only">
          Campaign pulse
        </h2>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <Figure value={totals.scans} label="QR scans" />
          <Figure value={totals.visitors} label="Visitors" note="Estimate, no cookies" />
          <Figure value={totals.reachedStory} label="Reached the conservation story" />
          <Figure value={totals.ctaClicks} label="Link taps" />
        </div>
        <Link to={path('analytics')} className="mt-6 inline-flex items-center gap-1 text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
          See analytics <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      <section aria-labelledby="home-experiences">
        <SectionTitle>
          <span id="home-experiences">Your experiences</span>
        </SectionTitle>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {experiences.map((experience) => (
            <li key={experience.id}>
              <Link to={path(`studio/${experience.id}`)} className="group block">
                <div className="overflow-hidden rounded-xl bg-canvas">
                  <img
                    src={experience.template.coverSrc}
                    alt={experience.template.coverAlt}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-ink">{experience.name}</p>
                  <StatusBadge status={experience.status} />
                </div>
                <p className="text-compact text-ink-faint">
                  {experience.template.name}
                  {experience.stats.scans > 0 && `, ${experience.stats.scans.toLocaleString('en-GB')} scans`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="home-impact">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <SectionTitle>
              <span id="home-impact">Verified impact behind your campaign</span>
            </SectionTitle>
            <LockedTag />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6">
            {verified.activity.map((fact) => (
              <div key={fact.id} className="flex flex-col-reverse">
                <dt className="mt-1 text-compact text-ink-muted">{fact.label}</dt>
                <dd className="text-2xl font-semibold tabular-nums text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <Link to={path('story')} className="mt-6 inline-flex items-center gap-1 text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
            Read the conservation story <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        <section aria-labelledby="home-activity">
          <SectionTitle>
            <span id="home-activity">Recent activity</span>
          </SectionTitle>
          {needsYou.length > 0 && (
            <ul className="mt-6 space-y-2">
              {needsYou.map((experience) => (
                <li key={experience.id} className="flex items-center justify-between gap-3 rounded-xl bg-warning-soft px-4 py-3">
                  <p className="text-compact text-ink">
                    “{experience.name}” is {NOT_LIVE_NOTE[experience.status] ?? 'not published'}
                  </p>
                  <Link to={path(`studio/${experience.id}`)} className="shrink-0 text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
                    Open
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <ol className="mt-4 divide-y divide-line">
            {recentActivity(campaigns, experiences).map((event) => (
              <li key={`${event.date}-${event.text}`} className="flex items-baseline justify-between gap-4 py-3">
                <p className="text-compact text-ink">{event.text}</p>
                <time dateTime={event.date} className="shrink-0 text-xs tabular-nums text-ink-faint">
                  {formatDate(event.date)}
                </time>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
