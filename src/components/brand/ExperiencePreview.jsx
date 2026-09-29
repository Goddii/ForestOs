import { Link2, Lock, Music, ShieldCheck, Users } from 'lucide-react'
import BrandMark from './BrandMark'

/**
 * What the brand layer contributes to the consumer page, in a phone frame,
 * redrawn live from the studio form. It is a preview of the brand's fields
 * and the verified block they sit on, not the consumer page itself: the live
 * page is the ForestOS batch record, which the portal publishes and never
 * restyles. Brand fields use the brand's colours; the verified block always
 * renders in ForestOS's own styling, because the brand cannot change it.
 *
 * @param {{
 *   customisation: import('../../data/brand/experiences').ExperienceCustomisation,
 *   kit: import('../../data/brand/accounts').BrandKit,
 *   heroAsset: { src: string, alt: string, width: number, height: number } | null,
 *   lot: { code: string, block: string, landscape: string, verificationStatus: string, harvestMonth: string } | null,
 *   metrics: Array<{ id: string, wording: string }>,
 * }} props
 */
export default function ExperiencePreview({ customisation, kit, heroAsset, lot, metrics }) {
  const { colours } = customisation
  const markKit = { ...kit, primary: colours.primary, accent: colours.accent }
  return (
    <div className="mx-auto w-full max-w-[20rem] rounded-[2.4rem] border-[10px] border-forest-950 bg-forest-950 shadow-[0_30px_60px_-24px_rgba(8,20,14,0.45)]">
      <div className="h-[36rem] overflow-y-auto overscroll-contain rounded-[1.75rem] bg-white">
        {/* Brand layer */}
        <div className="flex items-center gap-2.5 px-4 py-3" style={{ backgroundColor: colours.primary, color: kit.ink }}>
          {customisation.showLogo && <BrandMark kit={markKit} size={28} />}
          <span className="text-[11px] font-bold tracking-label-wide">{kit.wordmark}</span>
        </div>
        {heroAsset ? (
          <picture>
            <source srcSet={`${heroAsset.src}.webp`} type="image/webp" />
            <img src={`${heroAsset.src}.jpg`} alt={heroAsset.alt} className="aspect-[4/3] w-full object-cover" />
          </picture>
        ) : (
          <div className="aspect-[4/3] w-full bg-canvas" />
        )}
        <div className="px-4 pb-4 pt-4">
          <p className="text-xl font-semibold leading-tight tracking-tight text-ink">{customisation.title || 'Campaign title'}</p>
          <p className={`mt-2 text-[13px] leading-relaxed ${customisation.story ? 'text-ink-muted' : 'italic text-ink-faint'}`}>
            {customisation.story || 'Your story appears here.'}
          </p>
        </div>

        {/* Verified layer: ForestOS styling, locked */}
        <div className="mx-3 rounded-xl border border-forest-accent/25 bg-forest-accent-soft/50 p-3.5">
          <p className="flex items-center justify-between text-label font-semibold uppercase tracking-label text-forest-accent-dark">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
              Verified by ForestOS
            </span>
            <Lock className="h-3 w-3" strokeWidth={2.25} aria-label="Locked: the brand cannot edit this block" />
          </p>
          {lot ? (
            <p className="mt-2 text-[12px] leading-snug text-ink">
              Lot #{lot.code}, {lot.block}, {lot.landscape}. {lot.harvestMonth} harvest. {lot.verificationStatus === 'Verified' ? 'Deforestation-free, verified.' : 'Verification pending.'}
            </p>
          ) : (
            <p className="mt-2 text-[12px] text-ink-faint">No lot connected.</p>
          )}
          {metrics.length > 0 && (
            <ul className="mt-2 space-y-1.5 border-t border-forest-accent/15 pt-2">
              {metrics.map((metric) => (
                <li key={metric.id} className="text-[12px] leading-snug text-ink-muted">
                  {metric.wording}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Brand layer: actions */}
        <div className="space-y-2 px-4 py-4">
          <span
            className="block rounded-full px-4 py-2.5 text-center text-[13px] font-semibold"
            style={{ backgroundColor: colours.accent, color: colours.primary }}
          >
            {customisation.cta.label || 'Call to action'}
          </span>
          <div className="flex flex-wrap justify-center gap-3 pt-1 text-[11px] text-ink-muted">
            {customisation.socialLinks.map((link, index) => (
              <span key={`${link.network}-${index}`} className="inline-flex items-center gap-1">
                <Link2 className="h-3 w-3" aria-hidden="true" />
                {link.network}
              </span>
            ))}
            {customisation.musicLink && (
              <span className="inline-flex items-center gap-1">
                <Music className="h-3 w-3" aria-hidden="true" />
                Listen
              </span>
            )}
            {customisation.communityLink && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" aria-hidden="true" />
                Join the community
              </span>
            )}
          </div>
        </div>
        <p className="px-4 pb-5 text-center text-[10px] text-ink-faint">Powered by ForestOS</p>
      </div>
    </div>
  )
}
