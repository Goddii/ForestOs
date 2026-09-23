import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { USE_OF_FUNDS, CAPITAL_POSITION, EVIDENCE_RECORDS } from '../../data/investor'
import { formatCurrencyShort } from '../../lib/investor/format'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import ActionButton from './ui/ActionButton'

// Which evidence programme(s) each budget category's funded activity shows
// up under — real evidence records, not fabricated per-category detail
// (design-review brief §15: click a category → see what it funded → where
// → the evidence). "Programme management" has no field-level evidence by
// nature (it funds coordination, not an activity on the ground).
const CATEGORY_PROGRAMMES = {
  'Conservation operations': ['Compliance & Verification'],
  'Farmer & community incentives': ['Farmer Participation'],
  Restoration: ['Restoration'],
  'Monitoring & verification': ['Landscape Intelligence', 'Compliance & Verification'],
  'Technology & data': ['Landscape Intelligence'],
  'Programme management': [],
}

/**
 * Investor-grade Use of Funds (build brief §13/§15). Each category is its
 * own single-hue progress bar (deployed fill vs. remaining track) —
 * deliberately not a stacked multi-color chart, so it never needs a
 * categorical palette the design system wasn't built for (see the audit
 * doc's dataviz note). Clicking a category expands to the real evidence
 * records tied to its programme(s). Meant to sit inside a `ContentCard`, so
 * it carries no outer border of its own.
 */
export default function UseOfFundsBars() {
  const [expanded, setExpanded] = useState(null)
  const { openEvidence } = useEvidenceDrawer()

  return (
    <ul className="divide-y divide-line">
      {USE_OF_FUNDS.map((category) => {
        const deployedPct = Math.round((category.deployed / category.budget) * 100)
        const isOpen = expanded === category.category
        const programmes = CATEGORY_PROGRAMMES[category.category] ?? []
        const activities = EVIDENCE_RECORDS.filter((record) => programmes.includes(record.programme))

        return (
          <li key={category.category}>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : category.category)}
              aria-expanded={isOpen}
              className="w-full px-5 py-4 text-left transition-colors duration-200 ease-in-out hover:bg-canvas-sunk"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                  {category.category}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-ink-faint transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                  />
                </span>
                <span className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-ink">
                  {formatCurrencyShort(category.budget, CAPITAL_POSITION.currency)}
                  <span className="ml-1 font-normal text-ink-faint">{category.percentage}%</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas-sunk">
                <div className="h-full rounded-full bg-forest-accent" style={{ width: `${deployedPct}%` }} />
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                {formatCurrencyShort(category.deployed, CAPITAL_POSITION.currency)} deployed ·{' '}
                {formatCurrencyShort(category.remaining, CAPITAL_POSITION.currency)} remaining
              </p>
            </button>

            {isOpen && (
              <div className="mx-5 mb-4 rounded-lg border border-line bg-canvas-sunk p-4">
                {activities.length > 0 ? (
                  <ul className="space-y-2.5">
                    {activities.map((record) => (
                      <li key={record.id} className="flex items-center justify-between gap-3 text-[12px]">
                        <span className="text-ink-muted">
                          {record.title}
                          <span className="ml-1.5 text-ink-faint">— {record.location}</span>
                        </span>
                        <ActionButton variant="text" onClick={() => openEvidence(record.id)}>
                          Evidence
                        </ActionButton>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[12px] text-ink-muted">
                    Funds coordination and administrative costs — not tied to a field-level activity.
                  </p>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
