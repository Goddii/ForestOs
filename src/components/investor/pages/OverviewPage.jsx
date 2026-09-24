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
import { getAttentionItems } from '../../../lib/investor/attention'

const LandscapeMap = lazy(() => import('../LandscapeMap'))

/**
 * The overview (design-review brief §1/§5/§29) — the executive read, in the
 * product's own flow: the project and its capital, what that capital has
 * produced (with evidence), the landscape it sits in, what's happening now
 * and what needs attention. Every section here has its single home on this
 * page; detail that has a home elsewhere (use of funds → Capital, reports →
 * Reports, per-pillar metrics → Impact) is linked, not repeated.
 */
export default function OverviewPage() {
  const workspace = useWorkspace()
  const path = useWorkspacePath()
  const attentionItems = getAttentionItems(workspace)
  const recentActivity = getRecentActivity(workspace)

  return (
    <div className="mx-auto max-w-6xl space-y-16">
      <OverviewHero />

      <section>
        <SectionHeading
          eyebrow="Outputs"
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
              {recentActivity.map((item) => (
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
              <ActionButton to={path('issues')} variant="text">
                All issues
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

    </div>
  )
}
