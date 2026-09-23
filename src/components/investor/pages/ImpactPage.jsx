import { useState } from 'react'
import SectionHeading from '../SectionHeading'
import ImpactMetricCard from '../ImpactMetricCard'
import PerformanceChart from '../PerformanceChart'
import AdditionalityPanel from '../AdditionalityPanel'
import { getImpactMetricsByPillar, CONSERVATION_PERFORMANCE } from '../../../data/investor'

const TABS = [
  { key: 'environmental', label: 'Environment' },
  { key: 'social', label: 'Community' },
  { key: 'economic', label: 'Economic' },
  { key: 'governance', label: 'Governance' },
]

/**
 * Impact explorer (build brief §24). Four pillars, never collapsed into one
 * score — each metric keeps its own current/baseline/target/trend/evidence.
 */
export default function ImpactPage() {
  const [activeTab, setActiveTab] = useState('environmental')
  const metrics = getImpactMetricsByPillar(activeTab)

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <section>
        <SectionHeading
          eyebrow="Conservation performance"
          title="Change over time"
          description="Neutral indicators, not scientific findings — each chart names its own methodology rather than implying a calculated percentage change."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CONSERVATION_PERFORMANCE.map((chart) => (
            <PerformanceChart key={chart.id} {...chart} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Impact explorer" title="Environment, community, economic, governance" />
        <div
          role="tablist"
          aria-label="Impact pillar"
          className="flex gap-1 rounded-xl border border-line bg-card p-1 shadow-card sm:inline-flex"
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer rounded-lg px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                activeTab === tab.key
                  ? 'bg-forest-accent font-semibold text-white shadow-sm'
                  : 'font-medium text-ink-faint hover:bg-canvas-sunk hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <ImpactMetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Additionality" title="What changes because of this capital?" />
        <AdditionalityPanel />
      </section>
    </div>
  )
}
