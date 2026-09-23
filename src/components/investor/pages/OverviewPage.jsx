import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import SectionHeading from '../SectionHeading'
import OverviewHero from '../OverviewHero'
import MetricCard from '../MetricCard'
import LandscapeSummary from '../LandscapeSummary'
import UseOfFundsBars from '../UseOfFundsBars'
import ReportCard from '../ReportCard'
import MapLoadingFallback from '../MapLoadingFallback'
import ContentCard from '../ui/ContentCard'
import ActionButton from '../ui/ActionButton'
import { CORE_OUTCOMES, REPORTS, RECENT_ACTIVITY } from '../../../data/investor'
import { getAttentionItems } from '../../../lib/investor/attention'

const LandscapeMap = lazy(() => import('../LandscapeMap'))

/**
 * The overview (design-review brief §1/§5/§29) — structured to read as the
 * product's own flow, CAPITAL → LANDSCAPE → ACTIVITY → EVIDENCE → OUTCOME →
 * REPORTING, rather than as a stack of interchangeable dashboard cards: a
 * composed project+capital hero that bridges straight into the landscape,
 * the map paired with its summary, what's happening now, what needs
 * attention, the outcome panel, use of funds, then reporting status.
 */
export default function OverviewPage() {
  const attentionItems = getAttentionItems()
  const latestReports = REPORTS.slice(0, 2)

  return (
    <div className="mx-auto max-w-6xl space-y-16">
      <OverviewHero />

      <section>
        <SectionHeading
          eyebrow="Landscape intelligence"
          title="The landscape"
          description="Boundaries, conservation zones and field evidence — click a conservation zone for its detail."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
          <Suspense fallback={<MapLoadingFallback className="h-[28rem]" />}>
            <LandscapeMap className="h-[28rem]" />
          </Suspense>
          <ContentCard className="p-5">
            <LandscapeSummary />
          </ContentCard>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <SectionHeading eyebrow="Field intelligence" title="What is happening now" />
          <ContentCard>
            <ul className="divide-y divide-line">
              {RECENT_ACTIVITY.map((item) => (
                <li key={item.id}>
                  <Link to={item.to} className="group flex items-center gap-4 px-5 py-4 transition-colors duration-200 ease-in-out hover:bg-canvas-sunk">
                    <p className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
                      {item.when}
                    </p>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-forest-accent">
                        {item.category}
                      </p>
                      <p className="mt-1 text-[14px] font-medium text-ink">{item.headline}</p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-ink-muted">{item.detail}</p>
                    </div>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-ink-faint opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </ContentCard>
        </section>

        <section>
          <SectionHeading
            eyebrow="Requires attention"
            title="Attention"
            action={
              <ActionButton to="/investor/risks" variant="text">
                Full register
              </ActionButton>
            }
          />
          {attentionItems.length > 0 ? (
            <ContentCard>
              <ul className="divide-y divide-line">
                {attentionItems.map((item) => (
                  <li key={item.id}>
                    <Link to={item.to} className="group flex items-center gap-4 px-5 py-4 transition-colors duration-200 ease-in-out hover:bg-canvas-sunk">
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-medium text-ink">{item.label}</p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                          {item.detail}
                        </p>
                      </div>
                      <ChevronRight
                        className="h-4 w-4 shrink-0 text-ink-faint opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </ContentCard>
          ) : (
            <ContentCard className="p-6">
              <p className="text-[13px] text-ink-muted">Nothing currently requires attention.</p>
            </ContentCard>
          )}
        </section>
      </div>

      <section>
        <SectionHeading
          eyebrow="Outcomes"
          title="What conservation outcomes are being produced"
          description="Every figure below is drillable — click a number to see the evidence behind it."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_OUTCOMES.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Use of funds" title="Where the capital is going" />
        <ContentCard className="p-2">
          <UseOfFundsBars />
        </ContentCard>
      </section>

      <section>
        <SectionHeading
          eyebrow="Reporting"
          title="Reporting status"
          action={
            <ActionButton to="/investor/reports" variant="text">
              Reporting centre
            </ActionButton>
          }
        />
        <ContentCard>
          <ul className="divide-y divide-line">
            {latestReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </ul>
        </ContentCard>
      </section>
    </div>
  )
}
