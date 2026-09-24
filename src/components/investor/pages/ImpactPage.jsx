import { useState } from 'react'
import SectionHeading from '../SectionHeading'
import ImpactMetricCard from '../ImpactMetricCard'
import PerformanceChart from '../PerformanceChart'
import AdditionalityPanel from '../AdditionalityPanel'
import OutcomesPanel from '../OutcomesPanel'
import { getImpactMetricsByPillar, CONSERVATION_PERFORMANCE } from '../../../data/investor'
import { PROGRAMME } from '../../../data/funder/programme'

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
    <div className="mx-auto max-w-6xl space-y-12">
      <section>
        <SectionHeading
          title="What has changed, and how we know"
          description="Outcomes measured on the ground, such as whether planted seedlings survived. Planting is an output; survival is the outcome. A figure appears only once a count or audit has been done."
        />
        <OutcomesPanel />
      </section>

      <section>
        <SectionHeading
          title="Change over time"
          description="Programme-wide indicators. Years before funding began are baseline, not programme results, and landscape trends are context that the programme does not claim to have caused."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {CONSERVATION_PERFORMANCE.map((chart) => (
            <PerformanceChart key={chart.id} {...chart} baselineBefore={PROGRAMME.startDate.slice(0, 4)} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Environment, community, economic, governance" />
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
              className={`cursor-pointer rounded-lg px-4 py-2 font-mono text-label uppercase tracking-label transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
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
        <SectionHeading title="What changes because of this capital?" />
        <AdditionalityPanel />
      </section>
    </div>
  )
}
