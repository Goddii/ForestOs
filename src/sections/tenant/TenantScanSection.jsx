import { useEffect, useState } from 'react'
import { useBatch } from '../../lib/batchContext'
import { useTenant } from '../../lib/tenantContext'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const CORNERS = [
  { top: 0, left: 0, side: 'tl' },
  { top: 0, right: 0, side: 'tr' },
  { bottom: 0, left: 0, side: 'bl' },
  { bottom: 0, right: 0, side: 'br' },
]

const CORNER_BORDER = {
  tl: { borderTop: '2px solid var(--color-amber-400)', borderLeft: '2px solid var(--color-amber-400)' },
  tr: { borderTop: '2px solid var(--color-amber-400)', borderRight: '2px solid var(--color-amber-400)' },
  bl: { borderBottom: '2px solid var(--color-amber-400)', borderLeft: '2px solid var(--color-amber-400)' },
  br: { borderBottom: '2px solid var(--color-amber-400)', borderRight: '2px solid var(--color-amber-400)' },
}

/**
 * "Scan" — a one-to-one port of the client-approved Figma Make design's
 * `ScanStage` (viewfinder brackets → batch id → block name → confirmed
 * stamp, on the same 400/1600/2200ms phase timing). `BATCH.product`,
 * `BATCH.block` and `BATCH.id` are the real scanned batch; `BATCH.scanTime`
 * is the visitor's actual local time, not a fabricated field.
 */
export default function TenantScanSection({ visible }) {
  const batch = useBatch()
  const tenant = useTenant()
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState(reduced ? 3 : 0)
  const [scanTime] = useState(() => new Date())
  const tenantShortName = tenant.slug.charAt(0).toUpperCase() + tenant.slug.slice(1)

  useEffect(() => {
    if (!visible || reduced) return undefined
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 1600)
    const t3 = setTimeout(() => setPhase(3), 2200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [visible, reduced])

  const scanTimeLabel = scanTime.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <section id="scan" className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-forest-950">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--color-forest-600) 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-forest-600) 10%, transparent) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative flex min-h-svh flex-col items-center justify-center px-8 md:pl-8">
        <div className={`mb-16 text-center transition-all duration-500 ${visible ? 'animate-reveal-fade' : 'opacity-0'}`}>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">
            {tenantShortName} · {batch.product}
          </span>
        </div>

        <div className="relative h-56 w-56 md:h-72 md:w-72">
          {phase >= 3 && !reduced && (
            <>
              <div
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: 'color-mix(in srgb, var(--color-amber-400) 30%, transparent)', animation: 'pulse-ring 1.8s ease-out infinite' }}
              />
              <div
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: 'color-mix(in srgb, var(--color-amber-400) 15%, transparent)', animation: 'pulse-ring 1.8s ease-out 0.6s infinite' }}
              />
            </>
          )}

          {phase >= 1 &&
            CORNERS.map((c) => (
              <div
                key={c.side}
                className="absolute h-8 w-8"
                style={{
                  top: c.top ?? 'auto',
                  bottom: c.bottom ?? 'auto',
                  left: c.left ?? 'auto',
                  right: c.right ?? 'auto',
                  animation: reduced ? 'none' : 'bracket-in 0.45s cubic-bezier(0.16,1,0.3,1) both',
                  ...CORNER_BORDER[c.side],
                }}
              />
            ))}

          {phase === 1 && !reduced && (
            <div
              className="absolute left-0 right-0 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--color-amber-400), transparent)',
                animation: 'scan-line 1s ease-in-out forwards',
              }}
            />
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {phase >= 1 && (
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage-500">Batch</span>
            )}
            {phase >= 1 && <span className="font-mono text-3xl font-medium text-bone">#{batch.id}</span>}
            {phase >= 2 && (
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-400">
                {batch.block.name}
              </span>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          {phase >= 3 ? (
            <div
              className="flex flex-col items-center gap-2"
              style={{ animation: reduced ? 'none' : 'confirmed-stamp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}
            >
              <div
                className="flex items-center gap-3 border px-6 py-2"
                style={{ borderColor: 'var(--color-amber-400)', background: 'color-mix(in srgb, var(--color-amber-400) 8%, transparent)' }}
              >
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
                  <path
                    d="M1 4L4.5 7.5L11 1"
                    stroke="var(--color-amber-400)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={reduced ? undefined : { strokeDasharray: 20, strokeDashoffset: 0, animation: 'check-draw 0.4s 0.1s ease both' }}
                  />
                </svg>
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-400">
                  Scan Confirmed
                </span>
              </div>
              <span className="font-mono text-[9px] tracking-[0.15em] text-sage-500">{scanTimeLabel}</span>
            </div>
          ) : (
            <div className="h-16" />
          )}
        </div>

        {phase >= 3 && (
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-sage-500">Continue</span>
            <div className="h-8 w-px" style={{ background: 'linear-gradient(to bottom, var(--color-forest-600), transparent)' }} />
          </div>
        )}
      </div>
    </section>
  )
}
