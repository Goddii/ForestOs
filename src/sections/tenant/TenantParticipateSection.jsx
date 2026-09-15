import { useState } from 'react'
import { useBatch } from '../../lib/batchContext'

/**
 * "Participate" — a one-to-one port of the approved Figma design's
 * `ParticipateStage`: a single centered claim card and button, not the
 * richer brand-lockup / campaign-milestone content this section carried
 * before. `batch.protectedPerCup` ("10 m²" for this batch) happens to match
 * the design's literal "10" exactly, so the claim figure is real, not
 * hardcoded.
 */
export default function TenantParticipateSection({ visible }) {
  const batch = useBatch()
  const [claimed, setClaimed] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)
  const [claimSize, claimUnit] = batch.protectedPerCup.split(' ')

  return (
    <section id="participate" className="relative flex min-h-svh items-center justify-center bg-forest-900 px-8 py-24 text-center md:px-0">
      {visible && (
        <div className="animate-reveal-up w-full max-w-md px-8 md:px-0">
          <div className="mb-12 flex items-center justify-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">05</span>
            <div className="h-px w-8 bg-forest-700" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">Participate</span>
          </div>

          {!claimed ? (
            <>
              <h2 className="animate-reveal-up delay-200 mb-6 font-display text-4xl font-light leading-tight text-bone md:text-5xl">
                Your scan
                <br />
                <em className="italic text-amber-400">matters</em>
              </h2>

              <p className="animate-reveal-up delay-300 mx-auto mb-10 max-w-[34ch] text-sm leading-relaxed text-sage-300">
                Every verified Majani purchase signals demand that keeps {batch.block.name} under active
                protection. Claim your {batch.protectedPerCup}, your name logged against this batch.
              </p>

              <div className="animate-reveal-up delay-400 mb-8 border border-forest-700 bg-forest-850 p-6 text-left">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-sage-500">Your claim</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-sage-500">
                    Batch #{batch.id}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-light text-bone">{claimSize}</span>
                  <span className="font-mono text-sm text-sage-300">
                    {claimUnit} of {batch.block.name}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setClaimed(true)}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                className="animate-reveal-up delay-500 w-full py-4 font-mono text-sm uppercase tracking-[0.2em] text-bone transition-colors"
                style={{ background: btnHovered ? 'color-mix(in srgb, var(--color-forest-600) 130%, white)' : 'var(--color-forest-600)' }}
              >
                Claim Your Metre
              </button>
            </>
          ) : (
            <div style={{ animation: 'confirmed-stamp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full border border-forest-600 bg-forest-600/10">
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none" aria-hidden="true">
                  <path
                    d="M2 12L11 21L30 2"
                    stroke="var(--color-forest-600)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ strokeDasharray: 50, animation: 'check-draw 0.5s ease both' }}
                  />
                </svg>
              </div>
              <h3 className="mb-3 font-display text-3xl font-light text-bone">Claimed.</h3>
              <p className="font-mono text-xs tracking-[0.15em] text-sage-300">
                {claimSize} {claimUnit} · {batch.block.name} · Batch #{batch.id}
              </p>
              <p className="mt-6 text-sm text-sage-500">Your conservation act has been logged.</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
