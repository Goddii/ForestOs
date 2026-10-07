import { Bell, CupSoda, Gift, Mountain } from 'lucide-react'
import { buildStampBoard } from '../../lib/game'
import { XP_AWARDS } from '../../data/game'
import { ConceptTag } from '../ui'

const GLYPHS = {
  signal: Bell,
  cup: CupSoda,
  mountain: Mountain,
}

/**
 * The stamp book (brief 5.6): one passport, several series. A series with no
 * brand behind it yet stays visibly empty — the book never invents a stamp.
 */
export default function StampBook({ stamps = [], className = '' }) {
  const board = buildStampBoard(stamps)

  return (
    <section className={className} aria-label="Stamp book">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">Stamp book</p>
        <ConceptTag>Series bonus +{XP_AWARDS.setComplete} XP</ConceptTag>
      </div>

      <ul className="mt-3 space-y-3">
        {board.map((series) => {
          const Glyph = GLYPHS[series.glyph] ?? Gift
          return (
            <li key={series.id} className="rounded-xl border border-bone/12 bg-forest-900/50 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-sans text-[13px] font-semibold text-bone">{series.label}</p>
                <span className="font-mono text-[10px] tabular-nums text-sage-500">
                  {series.filled}/{series.slots}
                </span>
              </div>
              <div className="mt-2 flex gap-2">
                {Array.from({ length: series.slots }).map((_, i) => {
                  const filled = i < series.filled
                  return (
                    <span
                      key={i}
                      className={
                        'grid h-9 flex-1 place-items-center rounded-lg border ' +
                        (filled
                          ? 'border-river-400/45 bg-river-400/12 text-river-400'
                          : 'border-dashed border-bone/20 text-bone-500/60')
                      }
                      aria-hidden="true"
                    >
                      {filled ? <Glyph className="h-4 w-4" strokeWidth={1.9} /> : <span className="text-[10px]">·</span>}
                    </span>
                  )
                })}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-bone-500">
                {series.complete
                  ? `Series complete — bonus +${series.bonusXp} XP.`
                  : series.brandId
                    ? `${series.slots - series.filled} more ${series.label} stamp${series.slots - series.filled === 1 ? '' : 's'} to complete the set.`
                    : 'No partner brand on this series yet.'}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
