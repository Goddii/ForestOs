import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBatch } from '../../lib/batchContext'
import { useTenant } from '../../lib/tenantContext'

/**
 * "Proof" — a one-to-one port of the approved Figma design's `ProofStage`.
 * `Block` and `Batch` are real; `GIS Boundary` ("Confirmed") and `Audit
 * Chain` ("4 of 4 checks") are static labels in the design itself, not
 * per-batch data — same in this port as in the source.
 */
export default function TenantProofSection({ visible }) {
  const batch = useBatch()
  const tenant = useTenant()
  const [hovered, setHovered] = useState(false)
  const tenantShortName = tenant.slug.charAt(0).toUpperCase() + tenant.slug.slice(1)

  const fields = [
    ['Block', batch.block.name],
    ['Batch', `#${batch.id}`],
    ['GIS Boundary', 'Confirmed'],
    ['Audit Chain', '4 of 4 checks'],
  ]

  return (
    <section id="proof" className="relative flex min-h-svh items-center justify-center bg-forest-950 px-8 py-24 md:px-0">
      {visible && (
        <div className="animate-reveal-up w-full max-w-lg px-8 md:px-0">
          <div className="mb-12 flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">04</span>
            <div className="h-px w-8 bg-forest-700" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">The Source Record</span>
          </div>

          <div className="animate-reveal-up delay-200 border border-forest-700 bg-forest-850 p-8">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-forest-600" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">ForestOS</span>
            </div>

            <h3 className="mb-3 font-display text-2xl font-light text-bone">
              Every number here traces back to one record.
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-sage-300">
              The GIS boundary, satellite imagery, verification chain, and field officer log for Batch #
              {batch.id} live in ForestOS&rsquo;s public record. Open to anyone. Unchanged by any tenant.
            </p>

            <div className="mb-8 grid grid-cols-2 gap-4 border border-forest-700 bg-forest-950 p-4">
              {fields.map(([k, val]) => (
                <div key={k}>
                  <span className="mb-1 block font-mono text-[8px] uppercase tracking-[0.2em] text-sage-500">
                    {k}
                  </span>
                  <span className="font-mono text-xs text-sage-200">{val}</span>
                </div>
              ))}
            </div>

            <Link
              to={`/batch/${batch.id}`}
              className="flex w-full items-center justify-between px-5 py-3 transition-colors"
              style={{
                borderColor: 'var(--color-forest-600)',
                borderWidth: '1px',
                borderStyle: 'solid',
                background: hovered ? 'color-mix(in srgb, var(--color-forest-600) 12%, transparent)' : 'transparent',
                color: 'var(--color-forest-600)',
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <span className="font-mono text-xs uppercase tracking-[0.15em]">View Full Record</span>
              <span className="font-mono text-sm" style={{ transform: hovered ? 'translateX(4px)' : 'none', transition: 'transform 0.2s' }}>
                →
              </span>
            </Link>
          </div>

          <p className="mt-6 text-center font-mono text-[9px] tracking-[0.15em] text-sage-500">
            This link leaves the {tenantShortName} experience and opens ForestOS directly.
          </p>
        </div>
      )}
    </section>
  )
}
