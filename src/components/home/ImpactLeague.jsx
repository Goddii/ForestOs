import { useState } from 'react'
import { ChevronDown, TrendingUp } from 'lucide-react'
import { STANDINGS, STANDINGS_TREES_MAX } from '../../lib/brands'
import VerificationBadge from '../ui/VerificationBadge'

/**
 * The competitive read — every sponsoring brand ranked by the conservation it
 * has funded. Each row flies the belt globe to that brand's block, so the table
 * doubles as a map index. Deliberately restrained: mono figures, one bar, the
 * leader carried by a faint amber wash rather than a badge.
 *
 * A row can also expand a real, sourced record of the block behind the
 * ranking — the same verified-record treatment the batch page uses, not a
 * fabricated rating.
 *
 * @param {(blockId: string) => void} onExplore
 */
export default function ImpactLeague({ onExplore }) {
  const [openBrandId, setOpenBrandId] = useState(null)

  return (
    <div>
      <h3 className="font-display text-2xl leading-tight text-bone sm:text-3xl">
        The Conservation Impact League
      </h3>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500">
        {STANDINGS.length} brands · ranked by trees funded
      </p>

      <ul className="mt-6 divide-y divide-bone/10 border-y border-bone/10">
        {STANDINGS.map((entry) => {
          const isLeader = entry.rank === 1
          const isOpen = openBrandId === entry.brandId
          const fill = Math.round((entry.treesFunded / STANDINGS_TREES_MAX) * 100)
          return (
            <li key={entry.brandId}>
              <div className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => onExplore?.(entry.blockId)}
                  aria-label={`Fly the belt map to ${entry.sector}, sponsored by ${entry.name} — rank ${entry.rank}, ${entry.treesFunded.toLocaleString()} trees funded`}
                  className={
                    'flex w-full flex-col px-3 py-4 text-left transition-colors duration-200 ' +
                    (isLeader ? 'bg-amber-400/[0.06] hover:bg-amber-400/[0.1]' : 'hover:bg-forest-950/50')
                  }
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={
                        'tnum font-mono text-sm ' + (isLeader ? 'text-amber-400' : 'text-sage-500')
                      }
                    >
                      {String(entry.rank).padStart(2, '0')}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={
                          'block font-display text-lg leading-tight ' +
                          (isLeader ? 'text-bone' : 'text-bone-300')
                        }
                      >
                        {entry.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
                        {entry.sector}
                      </span>
                    </span>

                    <span className="shrink-0 text-right">
                      <span className="tnum block font-mono text-sm text-bone">
                        {entry.treesFunded.toLocaleString()}
                        <span className="ml-1 text-sage-500">trees</span>
                      </span>
                      {entry.trendHa > 0 && (
                        <span className="mt-0.5 flex items-center justify-end gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-sage-500">
                          <TrendingUp className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
                          +{entry.trendHa} ha this quarter
                        </span>
                      )}
                    </span>
                  </div>

                  <span className="mt-3 block h-1 w-full overflow-hidden rounded-full bg-bone/15">
                    <span
                      className={
                        'block h-full rounded-full ' + (isLeader ? 'bg-amber-400' : 'bg-sage-500')
                      }
                      style={{ width: `${fill}%` }}
                    />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOpenBrandId(isOpen ? null : entry.brandId)}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? 'Hide' : 'View'} the verified record behind ${entry.name}'s ranking`}
                  className="flex shrink-0 items-center gap-1.5 self-stretch px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500 transition-colors duration-200 hover:text-bone"
                >
                  <span className="hidden sm:inline">Verify</span>
                  <ChevronDown
                    className={'h-3.5 w-3.5 transition-transform duration-200 ' + (isOpen ? 'rotate-180' : '')}
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {isOpen && (
                <div className="px-3 pb-4">
                  <VerificationBadge
                    title="Sector record behind this ranking"
                    body={`${entry.shortName} is under a tea-farm buffer covenant across ${entry.counties} counties, verified plot by plot as brands report against it.`}
                    fields={[
                      { label: 'Block', value: entry.shortName },
                      { label: 'Hectares', value: `${entry.hectares.toLocaleString()} ha` },
                      { label: 'Centres', value: String(entry.centres) },
                    ]}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
