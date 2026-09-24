import { RISK_REGISTER, RISK_CATEGORY_LABELS } from '../../data/investor'
import RiskCard from './RiskCard'
import EmptyState from './EmptyState'
import ContentCard from './ui/ContentCard'

/**
 * The risk register, grouped by category (build brief §16) — never
 * collapsed into one artificial risk score.
 */
export default function RiskRegister() {
  if (RISK_REGISTER.length === 0) {
    return <EmptyState message="No risks currently registered." />
  }

  const categories = Object.keys(RISK_CATEGORY_LABELS)

  return (
    <div className="space-y-10">
      {categories.map((category) => {
        const risks = RISK_REGISTER.filter((risk) => risk.category === category)
        if (risks.length === 0) return null
        return (
          <section key={category}>
            <h3 className="font-mono text-label font-semibold uppercase tracking-label-wide text-ink-faint">
              {RISK_CATEGORY_LABELS[category]}
              <span className="ml-2 text-ink-faint/60">{risks.length}</span>
            </h3>
            <ContentCard className="mt-3">
              <ul className="divide-y divide-line">
                {risks.map((risk) => (
                  <RiskCard key={risk.id} risk={risk} />
                ))}
              </ul>
            </ContentCard>
          </section>
        )
      })}
    </div>
  )
}
