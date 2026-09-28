import { Link } from 'react-router-dom'
import { useCreator, useCreatorPath } from '../CreatorContext'
import { SectionTitle, formatDate } from '../ui'

/**
 * The creator's identity as ForestOS shows it on their experiences: a large
 * portrait, the name set in the display face, and the partnership facts.
 * Read-only in the demo; editing arrives with sign-in.
 */
export default function ProfilePage() {
  const { creator, campaigns, totals } = useCreator()
  const path = useCreatorPath()
  const [year, month] = creator.partnerSince.split('-')
  const since = formatDate(`${year}-${month}-01`).split(' ').slice(1).join(' ')

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
      <figure>
        <img src={creator.portrait.src} alt={creator.portrait.alt} width={720} height={900} className="aspect-[4/5] w-full rounded-2xl bg-forest-950 object-cover" />
        <figcaption className="mt-2 text-xs text-ink-faint">{creator.portrait.credit}</figcaption>
      </figure>

      <div>
        <p className="text-compact text-ink-faint">{creator.discipline}</p>
        <h1 className="mt-1 font-display text-6xl leading-[0.95] text-ink sm:text-7xl">{creator.name}</h1>
        <p className="mt-6 max-w-[55ch] text-lg leading-relaxed text-ink-muted">{creator.bio}</p>

        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
          <div>
            <dt className="text-compact text-ink-faint">Partner since</dt>
            <dd className="mt-1 font-semibold text-ink">{since}</dd>
          </div>
          <div>
            <dt className="text-compact text-ink-faint">Programme</dt>
            <dd className="mt-1 font-semibold text-ink">{creator.programme}</dd>
          </div>
          <div>
            <dt className="text-compact text-ink-faint">Campaigns</dt>
            <dd className="mt-1 font-semibold tabular-nums text-ink">{campaigns.length}</dd>
          </div>
          <div>
            <dt className="text-compact text-ink-faint">Live experiences</dt>
            <dd className="mt-1 font-semibold tabular-nums text-ink">{totals.published}</dd>
          </div>
        </dl>

        <div className="mt-12">
          <SectionTitle>How your profile is used</SectionTitle>
          <p className="mt-3 max-w-[60ch] text-compact leading-relaxed text-ink-muted">
            Your name and portrait open the artist templates, next to the verified ForestOS record for the tea. Your channels and sign-up links are managed in{' '}
            <Link to={path('community')} className="font-semibold text-forest-accent hover:text-forest-accent-dark">
              Community
            </Link>
            . Editing your profile arrives with sign-in; this demo shows it as it is.
          </p>
        </div>
      </div>
    </div>
  )
}
