import { useBatch } from '../../lib/batchContext'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { regionOnly } from '../../lib/batchDisplay'

const SEAL_RADIUS = 45
const SEAL_CIRCUMFERENCE = +(2 * Math.PI * SEAL_RADIUS).toFixed(2)

/** The animated verification seal — a stroke-drawn ring plus checkmark, with
 * the batch's own block/region carried in the circular text, exactly as the
 * approved Figma design specifies (`FORESTOS VERIFIED · BATCH #... · ...`). */
function VerificationSeal({ batch, reduced }) {
  return (
    <svg width="240" height="240" viewBox="0 0 120 120" className="md:h-72 md:w-72">
      <circle
        cx="60"
        cy="60"
        r={SEAL_RADIUS}
        fill="none"
        stroke="var(--color-amber-400)"
        strokeWidth="1"
        strokeDasharray={SEAL_CIRCUMFERENCE}
        style={
          reduced
            ? { transform: 'rotate(-90deg)', transformOrigin: 'center' }
            : {
                animation: 'seal-ring 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
              }
        }
      />
      <circle cx="60" cy="60" r="38" fill="none" stroke="color-mix(in srgb, var(--color-amber-400) 20%, transparent)" strokeWidth="0.5" />
      <defs>
        <path id="verify-ring-text" d="M 60,60 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
      </defs>
      <text fontSize="4.8" fill="color-mix(in srgb, var(--color-amber-400) 70%, transparent)" fontFamily="var(--font-mono)" letterSpacing="2.8">
        <textPath href="#verify-ring-text">
          FORESTOS VERIFIED · BATCH #{batch.id} · {batch.block.name.toUpperCase()} · {regionOnly(batch).toUpperCase()} ·
        </textPath>
      </text>
      <g style={reduced ? undefined : { animation: 'reveal-fade 0.4s 1.2s ease both', opacity: 0 }}>
        <circle cx="60" cy="60" r="16" fill="color-mix(in srgb, var(--color-amber-400) 8%, transparent)" stroke="color-mix(in srgb, var(--color-amber-400) 20%, transparent)" strokeWidth="0.5" />
        <path
          d="M 53 60 L 58 65 L 68 55"
          stroke="var(--color-amber-400)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={reduced ? undefined : { strokeDasharray: 24, animation: 'check-draw 0.5s 1.4s ease both' }}
        />
      </g>
    </svg>
  )
}

/**
 * "Verify" — a one-to-one port of the approved Figma design's `VerifyStage`:
 * eyebrow row, seal, a bare (uncarded) 6-field stat grid, then a static
 * closing line. No headline or body copy — the seal's own arc text and the
 * stat grid carry the "prove this is real" message, exactly as designed.
 *
 * `Field Check` and `Satellite Confirm` are real, distinct dates
 * (`verification.field.date` / `verification.satellite.date`, added to
 * `toLegacyBatch` for this) rather than one timestamp shown twice.
 */
export default function TenantVerifyMoment({ visible }) {
  const batch = useBatch()
  const reduced = usePrefersReducedMotion()
  const v = batch.verification

  const stats = [
    ['Block', batch.block.name],
    ['Region', `${regionOnly(batch)}, Kenya`],
    ['Area Protected', `${batch.hectaresPreserved} ha`],
    ['Field Check', v.field.date],
    ['Satellite Confirm', v.satellite.date],
    ['Patrols This Month', String(batch.block.patrolsThisMonth)],
  ]

  return (
    <section
      id="verify"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-forest-950 px-8 py-24 md:pl-8"
    >
      <div className={`flex flex-col items-center gap-12 ${visible ? '' : 'opacity-0'}`}>
        <div className={`flex items-center gap-4 ${visible ? 'animate-reveal-up' : ''}`}>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">02</span>
          <div className="h-px w-8 bg-forest-700" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">Verify</span>
        </div>

        {visible && (
          <div className="animate-seal">
            <VerificationSeal batch={batch} reduced={reduced} />
          </div>
        )}

        {visible && (
          <div className="animate-reveal-up delay-800 grid grid-cols-2 gap-x-12 gap-y-5">
            {stats.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-sage-500">{label}</span>
                <span className="font-mono text-xs text-bone">{value}</span>
              </div>
            ))}
          </div>
        )}

        {visible && (
          <p className="animate-reveal-fade delay-1000 font-mono text-[10px] uppercase tracking-[0.15em] text-sage-500">
            Verified by ForestOS · Independent audit chain
          </p>
        )}
      </div>
    </section>
  )
}
