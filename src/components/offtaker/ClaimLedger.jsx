import { Paperclip } from 'lucide-react'
import { useEvidenceDrawer } from '../investor/EvidenceDrawerContext'
import { ClaimBasisBadge } from './StatusBadges'

const ORDER = ['verified', 'reported', 'method_pending', 'unsupported']
const GROUP_TITLES = {
  verified: 'Verified: safe to rely on',
  reported: 'Reported: recorded, not yet verified',
  method_pending: 'Method pending: no agreed way to calculate it yet',
  unsupported: 'No evidence linked: treat as a marketing statement',
}

/**
 * Every origin and impact statement a buyer might repeat, sorted by what it
 * rests on. The point of the page: a buyer can tell a verified fact from a
 * claim before it goes on a pack or into a sustainability report.
 *
 * @param {{ claims: Array<{ id: string, statement: string, basis: string, source: string, evidenceIds: string[] }> }} props
 */
export default function ClaimLedger({ claims }) {
  const { openEvidence } = useEvidenceDrawer()
  return (
    <div className="space-y-6">
      {ORDER.filter((basis) => claims.some((claim) => claim.basis === basis)).map((basis) => (
        <section key={basis} aria-labelledby={`claims-${basis}`}>
          <h3 id={`claims-${basis}`} className="text-sm font-bold text-ink">
            {GROUP_TITLES[basis]}
          </h3>
          <ul className="mt-2 divide-y divide-line rounded-2xl border border-line bg-card shadow-card">
            {claims
              .filter((claim) => claim.basis === basis)
              .map((claim) => (
                <li key={claim.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{claim.statement}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">{claim.source}</p>
                    {claim.evidenceIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {claim.evidenceIds.map((id) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => openEvidence(id)}
                            className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 font-mono text-label text-forest-accent hover:border-forest-accent/40 hover:bg-forest-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                          >
                            <Paperclip className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                            Evidence {id}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <ClaimBasisBadge basis={claim.basis} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
