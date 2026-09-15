import { useBatch } from '../../lib/batchContext'
import { useTenant } from '../../lib/tenantContext'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/** The tier badge — an arced-text seal naming the passport's current tier
 * and the batch that earned it, matching the seal motif `TenantVerifyMoment`
 * uses for the verification ring. */
function TierBadge({ tierLabel, batchId, tenantShortName, reduced }) {
  return (
    <svg width="200" height="200" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-amber-400)" strokeWidth="0.8" strokeDasharray="4 3" />
      <circle cx="50" cy="50" r="40" fill="color-mix(in srgb, var(--color-amber-400) 6%, transparent)" stroke="color-mix(in srgb, var(--color-amber-400) 25%, transparent)" strokeWidth="0.5" />
      <defs>
        <path id="earn-top-arc" d="M 50,50 m -33,0 a 33,33 0 0,1 66,0" />
        <path id="earn-bot-arc" d="M 50,50 m -33,0 a 33,33 0 0,0 66,0" />
      </defs>
      <text fontSize="5.5" fill="var(--color-amber-400)" fontFamily="var(--font-mono)" letterSpacing="4">
        <textPath href="#earn-top-arc" startOffset="8%">{tierLabel.toUpperCase()}</textPath>
      </text>
      <text fontSize="4.5" fill="color-mix(in srgb, var(--color-amber-400) 60%, transparent)" fontFamily="var(--font-mono)" letterSpacing="2.5">
        <textPath href="#earn-bot-arc" startOffset="10%">
          BATCH #{batchId} · {tenantShortName.toUpperCase()}
        </textPath>
      </text>
      {/* The CSS `animation` shorthand's `transform` fully replaces (not
          composes with) an SVG `transform` attribute on the same element, so
          the translate that centers this glyph lives on a static outer `g`
          and the animated scale/rotate lives on an unpositioned inner one. */}
      <g transform="translate(50,50)">
        <g style={reduced ? undefined : { animation: 'confirmed-stamp 0.55s cubic-bezier(0.16,1,0.3,1) both' }}>
          <path d="M0-14 L8 2 H4 L10 14 H-10 L-4 2 H-8 Z" fill="none" stroke="var(--color-amber-400)" strokeWidth="1.2" strokeLinejoin="round" />
          <rect x="-2" y="14" width="4" height="4" fill="color-mix(in srgb, var(--color-amber-400) 40%, transparent)" />
        </g>
      </g>
    </svg>
  )
}

/** The ladder this passport climbs — only `tiers[activeIndex]` is real
 * state (`tenant.collection.tierLabel`); the rest render as upcoming. */
function TierLadder({ tiers, activeIndex }) {
  return (
    <div className="flex items-center gap-3">
      {tiers.map((tier, i) => (
        <div key={tier} className="flex items-center gap-3">
          {i > 0 && <div className="h-px w-6 bg-forest-700" />}
          <div className="flex flex-col items-center gap-1">
            <div
              className="grid h-6 w-6 place-items-center rounded-full border"
              style={{
                borderColor: i === activeIndex ? 'var(--color-amber-400)' : 'var(--color-forest-700)',
                background: i === activeIndex ? 'color-mix(in srgb, var(--color-amber-400) 10%, transparent)' : 'transparent',
              }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: i === activeIndex ? 'var(--color-amber-400)' : 'var(--color-forest-700)' }}
              />
            </div>
            <span
              className="font-mono text-[8px] uppercase tracking-[0.15em]"
              style={{ color: i === activeIndex ? 'var(--color-amber-400)' : 'var(--color-sage-500)' }}
            >
              {tier}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * "Earn" — a one-to-one port of the approved Figma design's `EarnStage`:
 * header row, badge, a static "Forest {tier}" headline and "Level 01 ·
 * First Scan" subline (as designed, not the tenant-voiced copy this stage
 * used before), body, tier ladder. The full stamp-grid recap lives on
 * `TenantBelongSection`, matching the design's own per-stage split.
 */
export default function TenantEarnSection({ visible }) {
  const batch = useBatch()
  const tenant = useTenant()
  const reduced = usePrefersReducedMotion()
  const { collection } = tenant
  const activeTierIndex = Math.max(collection.tiers.indexOf(collection.tierLabel), 0)
  const tenantShortName = tenant.slug.charAt(0).toUpperCase() + tenant.slug.slice(1)

  return (
    <section id="earn" className="relative flex min-h-svh items-center justify-center bg-forest-950 px-8 py-24 md:px-0">
      {visible && (
        <div className="flex flex-col items-center gap-10">
          <div className="animate-reveal-up flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">06</span>
            <div className="h-px w-8 bg-forest-700" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">Earn</span>
          </div>

          <div className="animate-stamp-fill delay-300">
            <TierBadge
              tierLabel={collection.tierLabel}
              batchId={batch.id}
              tenantShortName={tenantShortName}
              reduced={reduced}
            />
          </div>

          <div className="animate-reveal-up delay-600 max-w-[36ch] text-center">
            <h2 className="mb-3 font-display text-3xl font-light text-bone md:text-4xl">
              Forest {collection.tierLabel}
            </h2>
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400">
              Level 01 · First Scan
            </p>
            <p className="text-sm leading-relaxed text-sage-300">
              You have logged your first conservation act against a verified batch. This stamp is yours.
              Scan again to advance, {collection.totalStamps} scans reaches the next tier.
            </p>
          </div>

          <div className="animate-reveal-up delay-700">
            <TierLadder tiers={collection.tiers} activeIndex={activeTierIndex} />
          </div>
        </div>
      )}
    </section>
  )
}
