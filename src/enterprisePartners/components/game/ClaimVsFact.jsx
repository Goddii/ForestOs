import { useCallback, useMemo, useState } from 'react'
import { Check, RotateCcw, Satellite, Stamp } from 'lucide-react'
import { CLAIM_PLOTS, XP_AWARDS } from '../../data/game'
import { ConceptTag, PartnerCta } from '../ui'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'

/**
 * Claim vs Fact — the signature mini-game (brief 5.3), about twenty seconds,
 * replayable on different plots.
 *
 * A field report is grey until it is placed on the satellite layer and the
 * ground and the satellite agree. A claim with no satellite confirmation
 * stays grey — the ghost-planting variant — because the game exists to teach
 * why verification matters.
 *
 * Operable three ways, with no timers anywhere: pointer drag, tap (select the
 * claim, then tap the layer) and keyboard (the same, with Enter/Space). The
 * reduced-motion variant swaps the sweep for a plain state change.
 */
export default function ClaimVsFact({ plotId, onComplete }) {
  const reduced = usePrefersReducedMotion()
  const plots = CLAIM_PLOTS
  const [plotIndex, setPlotIndex] = useState(() => {
    const found = plots.findIndex((p) => p.id === plotId)
    return found >= 0 ? found : 0
  })
  const plot = plots[plotIndex]

  const [placed, setPlaced] = useState({}) // claimId -> 'fact' | 'grey'
  const [selectedId, setSelectedId] = useState(null)
  const [dragId, setDragId] = useState(null)
  const [message, setMessage] = useState(null)

  const resolve = useCallback(
    (claim) => {
      if (!claim || placed[claim.id]) return
      const outcome = claim.satelliteConfirmed ? 'fact' : 'grey'
      const nextPlaced = { ...placed, [claim.id]: outcome }
      setPlaced(nextPlaced)
      setSelectedId(null)
      setDragId(null)
      setMessage(
        outcome === 'fact'
          ? { tone: 'fact', text: `Fact — ${claim.note}` }
          : { tone: 'grey', text: `Grey — ${claim.note}` },
      )
      if (Object.keys(nextPlaced).length === plot.claims.length) {
        const facts = Object.values(nextPlaced).filter((v) => v === 'fact').length
        onComplete?.({ plotId: plot.id, facts, total: plot.claims.length })
      }
    },
    [onComplete, placed, plot],
  )

  const replay = useCallback(() => {
    setPlaced({})
    setSelectedId(null)
    setDragId(null)
    setMessage(null)
    setPlotIndex((i) => (i + 1) % plots.length)
  }, [plots.length])

  const facts = useMemo(() => Object.values(placed).filter((v) => v === 'fact').length, [placed])
  const done = Object.keys(placed).length === plot.claims.length

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <Stamp className="h-4 w-4 text-amber-400" strokeWidth={1.9} aria-hidden="true" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
            Claim vs Fact
          </p>
        </div>
        <h2 className="mt-2 font-display text-3xl text-bone">Does the ground match the sky?</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-bone-300">
          Drag a field report onto the satellite layer — or tap the report, then tap the layer. A
          claim only becomes a Fact when the two agree.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-bone/12 bg-forest-900/45 px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-sage-500">Plot</p>
          <p className="font-mono text-[12px] text-bone">{plot.label}</p>
        </div>
        <p className="font-mono text-[11px] tabular-nums text-bone-300">
          {facts}/{plot.claims.length} facts
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Field reports — grey until verified. */}
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
            Field reports
          </p>
          <ul className="space-y-2">
            {plot.claims.map((claim) => {
              const outcome = placed[claim.id]
              const selected = selectedId === claim.id
              return (
                <li key={claim.id}>
                  <button
                    type="button"
                    draggable={!outcome}
                    onDragStart={() => setDragId(claim.id)}
                    onDragEnd={() => setDragId(null)}
                    onClick={() => !outcome && setSelectedId(selected ? null : claim.id)}
                    aria-pressed={selected}
                    disabled={Boolean(outcome)}
                    className={
                      'w-full rounded-xl border p-3 text-left text-[13px] leading-relaxed transition-colors ep-motion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400 disabled:cursor-default ' +
                      (outcome === 'fact'
                        ? 'border-river-400/45 bg-river-400/10 text-bone'
                        : outcome === 'grey'
                          ? 'border-bone/20 bg-bone/5 text-bone-500'
                          : selected
                            ? 'border-amber-400/50 bg-amber-400/10 text-bone'
                            : 'border-bone/15 bg-forest-800/70 text-bone-300 hover:border-bone/30')
                    }
                  >
                    <span className="flex items-start gap-2">
                      {outcome === 'fact' ? (
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-river-400" aria-hidden="true" />
                      ) : (
                        <span
                          className={
                            'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ' +
                            (outcome === 'grey' ? 'bg-bone-500' : 'bg-amber-400/70')
                          }
                          aria-hidden="true"
                        />
                      )}
                      <span>{claim.text}</span>
                    </span>
                    {outcome ? (
                      <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.14em]">
                        {outcome === 'fact' ? 'Fact · +XP' : 'Grey · no satellite confirmation'}
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Satellite layer — the drop target. */}
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
            Satellite layer
          </p>
          <button
            type="button"
            onClick={() => selectedId && resolve(plot.claims.find((c) => c.id === selectedId))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const id = dragId ?? e.dataTransfer?.getData('text/plain')
              resolve(plot.claims.find((c) => c.id === id))
            }}
            className={
              'relative grid min-h-[176px] w-full place-items-center overflow-hidden rounded-xl border-2 border-dashed p-4 text-center transition-colors ep-motion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ' +
              (selectedId
                ? 'border-amber-400/60 bg-amber-400/8'
                : 'border-bone/20 bg-forest-900/50')
            }
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent 0 15px, color-mix(in srgb, var(--color-river-400) 12%, transparent) 15px 16px), repeating-linear-gradient(90deg, transparent 0 15px, color-mix(in srgb, var(--color-river-400) 12%, transparent) 15px 16px)',
              }}
              aria-hidden="true"
            />
            <span className="relative">
              <Satellite className="mx-auto h-7 w-7 text-river-400" strokeWidth={1.6} aria-hidden="true" />
              <span className="mt-2 block text-[12px] leading-relaxed text-bone-500">
                {selectedId
                  ? 'Now tap here to place the report'
                  : done
                    ? 'All reports placed'
                    : 'Drop a field report here'}
              </span>
              {!reduced && message ? (
                <span className="absolute inset-x-0 -top-1 h-px bg-river-400/60 ep-verify-sweep" aria-hidden="true" />
              ) : null}
            </span>
          </button>
        </div>
      </div>

      <p
        className={
          'min-h-11 rounded-xl border px-4 py-3 text-[13px] leading-relaxed ' +
          (message?.tone === 'fact'
            ? 'border-river-400/45 bg-river-400/10 text-bone-300'
            : message?.tone === 'grey'
              ? 'border-bone/20 bg-bone/5 text-bone-400'
              : 'border-transparent text-transparent')
        }
        role="status"
      >
        {message?.text ?? '—'}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <PartnerCta variant="secondary" onClick={replay} className="!w-auto">
          <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Replay on another plot
        </PartnerCta>
        <ConceptTag variant="illustrative">Illustrative plots</ConceptTag>
        <ConceptTag>+{XP_AWARDS.miniGame} Canopy XP per plot</ConceptTag>
      </div>
    </div>
  )
}
