import { BadgeCheck, Music2 } from 'lucide-react'
import { getHeroAsset } from '../../data/creator/assets'

const COMMUNITY_KINDS = new Set(['community', 'social'])

/**
 * A live mobile preview of an experience as configured: the creator's
 * sections in their chosen order, with the verified ForestOS layer rendered
 * from the record in the places the template fixes. This is a working
 * miniature of the page, not a screenshot; the full consumer experience
 * opens from "Preview experience".
 *
 * Community sections carry community and social links; call-to-action
 * sections carry the rest, falling back to every link when a template has
 * only one of the two.
 *
 * @param {{
 *   creative: import('../../data/creator/campaigns').CreativeContent,
 *   template: import('../../data/creator/templates').ExperienceTemplate,
 *   verified: typeof import('../../data/creator/verifiedStory').VERIFIED_STORY,
 *   statements: typeof import('../../data/creator/verifiedStory').APPROVED_STATEMENTS,
 *   product: string,
 * }} props
 */
export default function PhonePreview({ creative, template, verified, statements, product }) {
  const hero = getHeroAsset(creative.heroAssetId)
  const quoted = statements.filter((statement) => creative.statementIds.includes(statement.id))
  const labelFor = (key) => template.sections.find((section) => section.key === key)?.label ?? key
  const visible = creative.sectionOrder.filter((key) => !creative.hiddenSections.includes(key))
  const splitLinks = visible.includes('community') && visible.includes('cta')
  const communityLinks = splitLinks ? creative.ctas.filter((cta) => COMMUNITY_KINDS.has(cta.kind)) : creative.ctas
  const actionLinks = splitLinks ? creative.ctas.filter((cta) => !COMMUNITY_KINDS.has(cta.kind)) : creative.ctas

  const renderers = {
    hook: () => (
      <div className="relative">
        {hero && <img src={hero.src} alt={hero.alt} className="aspect-[4/5] w-full object-cover" />}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950 via-forest-950/80 to-transparent px-4 pb-4 pt-16">
          <p className="font-display text-[26px] leading-[1.05] text-bone">{creative.headline || 'Your headline'}</p>
          {creative.subline && <p className="mt-2 text-[12px] leading-snug text-bone-300">{creative.subline}</p>}
        </div>
      </div>
    ),
    music: () =>
      creative.musicLink ? (
        <div className="mx-4 flex items-center gap-3 rounded-xl bg-bone/[0.06] p-3">
          <Music2 className="h-5 w-5 text-spotify-green" aria-hidden="true" />
          <p className="text-[12px] text-bone">Listen while you read</p>
        </div>
      ) : null,
    tea: () => (
      <div className="px-4">
        <p className="text-[11px] text-sage-300">The tea</p>
        <p className="text-[13px] text-bone">{product}</p>
      </div>
    ),
    story: () => (creative.narrative ? <p className="px-4 text-[12px] leading-relaxed text-bone-300">{creative.narrative}</p> : null),
    origin: () => (
      <div className="mx-4 rounded-xl border border-sage-500/30 p-3">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-sage-200">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> {verified.isVerified ? verified.verification.standard : 'Verification in progress'}
        </p>
        <dl className="mt-2 grid grid-cols-2 gap-2">
          {verified.landscape.slice(0, 2).map((fact) => (
            <div key={fact.id}>
              <dt className="text-[10px] text-sage-300">{fact.label}</dt>
              <dd className="text-[12px] text-bone">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    ),
    impact: () => (
      <div className="mx-4 space-y-2">
        <dl className="grid grid-cols-2 gap-2">
          {verified.activity.slice(0, 2).map((fact) => (
            <div key={fact.id} className="flex flex-col-reverse rounded-lg bg-bone/[0.06] p-2.5">
              <dt className="text-[10px] leading-tight text-sage-300">{fact.label}</dt>
              <dd className="text-[16px] font-semibold tabular-nums text-bone">{fact.value}</dd>
            </div>
          ))}
        </dl>
        {quoted.map((statement) => (
          <p key={statement.id} className="text-[11px] leading-snug text-sage-200">
            {statement.text}
          </p>
        ))}
      </div>
    ),
    community: () => (communityLinks.length ? <LinkButtons ctas={communityLinks} /> : null),
    cta: () => (actionLinks.length ? <LinkButtons ctas={actionLinks} /> : null),
  }

  return (
    <div className="portal-serif mx-auto w-[18rem] rounded-[2.4rem] border-[6px] border-slate-deep bg-slate-deep shadow-[0_24px_60px_-24px_rgba(8,20,14,0.55)]">
      <div
        className="h-[34rem] overflow-y-auto rounded-[1.9rem] bg-forest-950 pb-6"
        role="region"
        aria-label={`Mobile preview of ${creative.headline || 'this experience'}`}
        tabIndex={0}
      >
        <div className="space-y-5">
          {visible.map((key) => {
            const content = renderers[key]?.()
            return content ? (
              <section key={key} aria-label={labelFor(key)}>
                {content}
              </section>
            ) : null
          })}
          <p className="px-4 text-[10px] text-sage-500">Verified by ForestOS, batch {verified.batchId}</p>
        </div>
      </div>
    </div>
  )
}

function LinkButtons({ ctas }) {
  return (
    <div className="space-y-2 px-4">
      {ctas.map((cta) => (
        <span key={cta.id} className="block rounded-full bg-bone px-4 py-2 text-center text-[12px] font-semibold text-forest-950">
          {cta.label || 'Untitled link'}
        </span>
      ))}
    </div>
  )
}
