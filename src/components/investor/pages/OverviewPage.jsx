import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import SectionHeading from '../SectionHeading'
import OverviewHero from '../OverviewHero'
import FundedOutputs from '../FundedOutputs'
import { useWorkspace, useWorkspacePath } from '../FunderWorkspaceContext'
import LandscapeSummary from '../LandscapeSummary'
import MapLoadingFallback from '../MapLoadingFallback'
import ContentCard from '../ui/ContentCard'
import ActionButton from '../ui/ActionButton'
import { getRecentActivity } from '../../../data/investor'

const LandscapeMap = lazy(() => import('../LandscapeMap'))

/**
 * The overview (design-review brief §1/§5/§29) — the executive read, in the
 * product's own flow: an opening band with the funder's capital, next
 * tranche and what needs attention, then what that capital has produced
 * (with evidence), the landscape it sits in, and what's happening now.
 * Every section here has its single home on this page; detail that has a home elsewhere (use of funds → Capital, reports →
 * Reports, per-pillar metrics → Impact) is linked, not repeated.
 */
export default function OverviewPage() {
  const workspace = useWorkspace()
  const path = useWorkspacePath()
  const recentActivity = getRecentActivity(workspace)

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <OverviewHero />

      <section>
        <SectionHeading
          title={workspace.terms.producedTitle}
          description="Outputs from the activities your payments paid for, counted only once verified. Open any figure for the activities and evidence behind it."
          action={
            <ActionButton to={path('progress')} variant="text">
              Full progress
            </ActionButton>
          }
        />
        <ContentCard>
          <FundedOutputs />
        </ContentCard>
      </section>

      <section>
        <SectionHeading
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

      <section>
        <SectionHeading title="What is happening now" />
        <ContentCard>
          <ul className="divide-y divide-line">
            {recentActivity.map((item) => (
              <li key={item.id}>
                <Link to={item.to} className="group flex items-center gap-4 px-5 py-4 transition-colors duration-200 ease-in-out hover:bg-canvas-sunk">
                  <p className="w-20 shrink-0 font-mono text-label uppercase tracking-label text-ink-faint">
                    {item.when}
                  </p>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-label uppercase tracking-label text-forest-accent">
                      {item.category}
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink">{item.headline}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{item.detail}</p>
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

    </div>
  )
}
