import { CORE_OUTCOMES, LANDSCAPE_SUMMARY } from '../../data/investor'
import { useWorkspace } from './FunderWorkspaceContext'
import { attributedValue, costPerAttributedUnit, fundShare } from '../../lib/investor/attribution'
import { formatCurrencyShort, formatNumber } from '../../lib/investor/format'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import ConfidenceIndicator from './ConfidenceIndicator'
import ActionButton from './ui/ActionButton'

// Only countable outcomes can be attributed and costed per unit — a
// percentage (compliance rate, evidence coverage) has no meaningful
// "share" or "cost per", so those stay on their own metric cards.
const ATTRIBUTABLE = [
  { id: 'conservation', perUnit: 'ha conserved' },
  { id: 'landscape', perUnit: 'ha monitored' },
  { id: 'participation', perUnit: 'farmer' },
  { id: 'field-activity', perUnit: 'verified activity' },
]

const OUTCOMES_BY_ID = Object.fromEntries(CORE_OUTCOMES.map((outcome) => [outcome.id, outcome]))

/**
 * "What your capital has produced" — the fund manager's question answered in
 * one place: each outcome for the whole programme (gross), the share this
 * fund can claim (attributed, with the method stated), what this fund has
 * deployed per attributed unit, and the evidence behind it. Gross vs.
 * attributed follows GIIN IRIS+ LP-reporting practice; the cost figure is an
 * average across all deployed capital, never presented as a marginal cost.
 */
export default function CapitalOutcomes() {
  const { openEvidence } = useEvidenceDrawer()
  const { programmeFunding: PROGRAMME_FUNDING, capital } = useWorkspace()
  const CAPITAL_POSITION = capital.position
  const share = fundShare(PROGRAMME_FUNDING)
  const sharePct = Math.round(share * 1000) / 10
  const programmeTotal = PROGRAMME_FUNDING.sources.reduce((sum, source) => sum + source.amount, 0)
  const { committed, deployed, currency } = CAPITAL_POSITION
  const coFunders = PROGRAMME_FUNDING.sources.filter((source) => !source.isInvestor)

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-line px-5 py-4">
        <p className="text-[14px] text-ink">
          <span className="font-semibold tabular-nums">{formatCurrencyShort(committed, currency)}</span> of a{' '}
          {formatCurrencyShort(programmeTotal, currency)} programme ·{' '}
          <span className="font-semibold tabular-nums">{sharePct}%</span> attributed to this fund
        </p>
        {coFunders.length > 0 && (
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
            {coFunders
              .map((source) => `${source.label} — ${source.type}, ${formatCurrencyShort(source.amount, currency)}`)
              .join(' · ')}
          </p>
        )}
      </div>

      <ul className="divide-y divide-line">
        {ATTRIBUTABLE.map(({ id, perUnit }) => {
          const outcome = OUTCOMES_BY_ID[id]
          if (!outcome) return null
          const attributed = attributedValue(outcome.value, share)
          const cost = costPerAttributedUnit(deployed, attributed)
          return (
            <li key={id} className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-4 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center">
              <div className="col-span-2 sm:col-span-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">{outcome.label}</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-ink">
                  {formatNumber(outcome.value)}
                  {outcome.unit && <span className="ml-1 text-sm font-medium text-ink-muted">{outcome.unit}</span>}
                </p>
                <p className="text-[11px] text-ink-faint">Whole programme</p>
              </div>
              <div>
                <p className="text-lg font-semibold tabular-nums text-ink">
                  {formatNumber(Math.round(attributed))}
                  {outcome.unit && <span className="ml-1 text-sm font-medium text-ink-muted">{outcome.unit}</span>}
                </p>
                <p className="text-[11px] text-ink-faint">Attributed to this fund</p>
              </div>
              <div>
                <p className="text-lg font-semibold tabular-nums text-ink">
                  {cost === null ? '—' : `${currency} ${formatNumber(Math.round(cost))}`}
                </p>
                <p className="text-[11px] text-ink-faint">Deployed per {perUnit}</p>
              </div>
              <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1 sm:flex-col sm:items-end">
                <ConfidenceIndicator status={outcome.confidence} />
                <ActionButton variant="text" onClick={() => openEvidence(outcome.evidenceId)}>
                  How do we know?
                </ActionButton>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="border-t border-line px-5 py-3 text-[11px] leading-relaxed text-ink-faint">
        Attribution: {PROGRAMME_FUNDING.attributionMethod.toLowerCase()}. “Deployed per unit” divides this fund’s{' '}
        {formatCurrencyShort(deployed, currency)} deployed by its attributed outcome — an average across all spend, not a
        marginal cost. Sources: {LANDSCAPE_SUMMARY.sources.join(', ')} · last verified {LANDSCAPE_SUMMARY.lastVerified} ·
        demo data.
      </p>
    </div>
  )
}
