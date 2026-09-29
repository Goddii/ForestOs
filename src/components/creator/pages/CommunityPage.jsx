import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import Badge from '../../investor/ui/Badge'
import { useCreator, useCreatorPath } from '../CreatorContext'
import { PageHeader, SectionTitle } from '../ui'

const KIND_LABELS = { spotify: 'Spotify', social: 'Social', community: 'Community', website: 'Website' }

/**
 * Where a scan leads next. The creator's own channels, and the links each
 * campaign's experiences carry, with how often each kind is tapped.
 * Placeholder links are labelled as demo links rather than passed off as
 * the creator's real accounts.
 */
export default function CommunityPage() {
  const { creator, campaigns, totals } = useCreator()
  const path = useCreatorPath()

  return (
    <div className="space-y-16">
      <PageHeader title="Community" lede="Turn a scan into a listener, a follower, a guest at the next planting day. These are the links your experiences can send people to." />

      <section aria-labelledby="community-channels">
        <SectionTitle>
          <span id="community-channels">Your channels</span>
        </SectionTitle>
        <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
          {creator.links.map((link) => (
            <li key={link.kind} className="flex items-center justify-between gap-3 border-b border-line py-4">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{link.label}</p>
                <p className="truncate font-mono text-compact text-ink-faint">{link.href}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {link.isDemo && <Badge tone="neutral">Demo link</Badge>}
                <a href={link.href} target="_blank" rel="noreferrer" aria-label={`Open ${link.label}`} className="text-ink-muted hover:text-forest-accent">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="community-campaigns">
        <SectionTitle>
          <span id="community-campaigns">Links in each campaign</span>
        </SectionTitle>
        <p className="mt-2 text-compact text-ink-muted">
          Across all experiences: {totals.spotify.toLocaleString('en-GB')} Spotify taps, {totals.social.toLocaleString('en-GB')} social taps and {totals.community.toLocaleString('en-GB')} community sign-up taps.
        </p>
        <div className="mt-8 grid gap-12">
          {campaigns.map((campaign) => (
            <div key={campaign.id}>
              <h3 className="font-display text-2xl text-ink">{campaign.title}</h3>
              {campaign.experiences.every((experience) => experience.creative.ctas.length === 0) ? (
                <p className="mt-3 text-compact text-ink-muted">No links yet. Add them in the Studio.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {campaign.experiences.flatMap((experience) =>
                    experience.creative.ctas.map((cta) => (
                      <li key={`${experience.id}-${cta.id}`} className="grid gap-2 py-3 text-compact sm:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)] sm:items-center">
                        <span className="font-semibold text-ink">{cta.label || 'Untitled link'}</span>
                        <span className="text-ink-muted">{KIND_LABELS[cta.kind]}</span>
                        <span className="flex items-center justify-between gap-3">
                          <span className="truncate text-ink-faint">{experience.name}</span>
                          <Link to={path(`studio/${experience.id}`)} className="shrink-0 font-semibold text-forest-accent hover:text-forest-accent-dark">
                            Edit
                          </Link>
                        </span>
                      </li>
                    )),
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
