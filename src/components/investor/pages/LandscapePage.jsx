import { lazy, Suspense } from 'react'
import SectionHeading from '../SectionHeading'
import MapLoadingFallback from '../MapLoadingFallback'
import EvidenceChain from '../EvidenceChain'
import { CORE_OUTCOMES, LANDSCAPE_SUMMARY } from '../../../data/investor'
import MetricCard from '../MetricCard'

const LandscapeMap = lazy(() => import('../LandscapeMap'))

/**
 * Landscape Intelligence (build brief §9) — the dedicated, full-size version
 * of the overview's map panel, paired with the landscape-relevant metrics
 * and their evidence chain (design-review brief §16).
 */
export default function LandscapePage() {
  const landscapeMetrics = CORE_OUTCOMES.filter((m) =>
    ['landscape', 'conservation', 'field-activity'].includes(m.id),
  )
  const conservationMetric = CORE_OUTCOMES.find((m) => m.id === 'conservation')

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <SectionHeading
        eyebrow="Landscape intelligence"
        title="Project boundary, conservation areas and field evidence"
        description="Boundaries, conservation blocks, farm/community areas, monitoring zones, field activity and verification points — toggle layers, switch to satellite, and click any point for its evidence record."
      />
      <Suspense fallback={<MapLoadingFallback className="h-[36rem]" />}>
        <LandscapeMap className="h-[36rem]" />
      </Suspense>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {landscapeMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {conservationMetric && (
        <div className="rounded-2xl border border-line bg-card p-6 shadow-card">
          <p className="text-[14px] font-semibold text-ink">
            {conservationMetric.value.toLocaleString('en-US')} ha under active conservation
          </p>
          <EvidenceChain
            status={conservationMetric.confidence}
            lastVerified={LANDSCAPE_SUMMARY.lastVerified}
            className="mt-3"
          />
        </div>
      )}
    </div>
  )
}
