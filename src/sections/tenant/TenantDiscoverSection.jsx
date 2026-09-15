import { useBatch } from '../../lib/batchContext'
import { regionOnly } from '../../lib/batchDisplay'

/**
 * "Discover" — a one-to-one port of the approved Figma design's
 * `DiscoverStage`: a full-bleed forest photo (left) gradient-blending into a
 * text column (right), a 3-stat trio, and a field-credit line. The design's
 * "Species" stat has no real equivalent on this batch's data model, so it's
 * mapped to `block.seedlingsPlanted` (a real field) instead — same slot,
 * same rhythm, honest value. `field.by` / a placeholder name stand in for
 * the design's own named field-officer credit, matching what was approved.
 */
export default function TenantDiscoverSection({ visible }) {
  const batch = useBatch()
  const { block } = batch
  const v = batch.verification

  const stats = [
    { value: batch.hectaresPreserved, unit: 'ha', label: 'Protected' },
    { value: block.seedlingsPlanted.toLocaleString(), unit: '', label: 'Seedlings Planted' },
    { value: block.patrolsThisMonth, unit: '', label: 'Patrols This Month' },
  ]

  return (
    <section id="discover" className="relative flex min-h-svh bg-forest-900">
      <div className="flex min-h-svh w-full flex-col md:flex-row">
        <div className="relative h-64 w-full overflow-hidden bg-forest-850 md:h-auto md:w-1/2">
          <picture>
            <source srcSet="/media/forests/mt-kenya.webp" type="image/webp" />
            <img
              src="/media/forests/mt-kenya.jpg"
              alt="Misty montane forest canopy, Mount Kenya"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: 0.75 }}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 50%, var(--color-forest-900))' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--color-forest-900) 0%, transparent 40%)' }} />

          {visible && (
            <div className="animate-reveal-up delay-400 absolute bottom-8 left-8">
              <span className="font-display text-5xl font-light italic text-amber-400">
                {batch.hectaresPreserved}
              </span>
              <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.25em] text-sage-300">
                hectares
              </span>
            </div>
          )}
        </div>

        <div className="flex w-full flex-col justify-center px-8 py-16 md:w-1/2 md:px-16 md:py-24">
          {visible && (
            <div className="flex flex-col gap-8">
              <span className="animate-reveal-up font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">
                03 — Discover
              </span>

              <div className="animate-reveal-up delay-200">
                <h2 className="font-display text-4xl font-light leading-tight text-bone md:text-5xl">
                  {block.name}
                </h2>
                <p className="mt-2 font-mono text-xs tracking-[0.15em] text-sage-300">
                  {regionOnly(batch)} · Kenya
                </p>
              </div>

              <p className="animate-reveal-up delay-400 max-w-[38ch] text-base leading-relaxed text-sage-200">
                A pocket of indigenous montane forest inside Kenya&rsquo;s largest remaining highland
                ecosystem. Preserved through active stewardship, satellite-monitored, field-verified, and
                traceable to every product that carries its mark.
              </p>

              <div className="animate-reveal-up delay-500 grid grid-cols-3 gap-6">
                {stats.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-light text-bone">{item.value}</span>
                      {item.unit && <span className="font-mono text-xs text-sage-300">{item.unit}</span>}
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-sage-500">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="animate-reveal-up delay-600 flex items-center gap-4 border-t border-forest-700 pt-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-forest-700 bg-forest-800">
                  <span className="font-mono text-xs text-forest-600">JK</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-bone">Joseph Kibet</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-sage-500">
                    Field Officer · Verified {v.field.date}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
