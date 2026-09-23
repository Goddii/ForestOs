import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '../SectionHeading'
import MapLoadingFallback from '../MapLoadingFallback'
import ImpactFlowDiagram from '../ImpactFlowDiagram'
import ContentCard from '../ui/ContentCard'
import StatCard from '../ui/StatCard'
import ActionButton from '../ui/ActionButton'
import {
  INVESTOR_PROJECT,
  CAPITAL_POSITION,
  CORE_OUTCOMES,
  RISK_REGISTER,
  REPORTS,
} from '../../../data/investor'
import { formatCurrencyShort } from '../../../lib/investor/format'

const LandscapeMap = lazy(() => import('../LandscapeMap'))

function SummaryCard({ to, eyebrow, value, detail }) {
  return (
    <Link
      to={to}
      className="group block cursor-pointer rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-[0_1px_2px_rgba(20,32,25,0.05),0_16px_32px_-14px_rgba(20,32,25,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{eyebrow}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-ink">{value}</p>
      <p className="mt-1 text-[12px] text-ink-muted">{detail}</p>
      <p className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-forest-accent opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
        View
        <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
      </p>
    </Link>
  )
}

/**
 * Investor project profile (design-review brief §17): a header, an
 * at-a-glance stat row, why the landscape matters, the landscape itself,
 * the conservation model, then compact summary links into capital,
 * evidence, risks and reporting — visually rich and concise, not a wall of
 * Q&A text.
 */
export default function ProjectPage() {
  const evidenceMetric = CORE_OUTCOMES.find((m) => m.id === 'evidence-coverage')
  const openRiskCount = RISK_REGISTER.filter((r) => r.status === 'open').length
  const highRiskCount = RISK_REGISTER.filter((r) => r.status === 'open' && r.severity === 'high').length
  const readyReportCount = REPORTS.filter((r) => r.status === 'ready').length

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <SectionHeading
        eyebrow="Project profile"
        title={INVESTOR_PROJECT.name}
        description={`${INVESTOR_PROJECT.location} · ${INVESTOR_PROJECT.region} · ${INVESTOR_PROJECT.reportingPeriod}`}
      />

      <ContentCard as="section" className="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">
        <StatCard className="p-5 text-center sm:text-left" size="sm" label="Hectares monitored" value="12,840" />
        <StatCard className="p-5 text-center sm:text-left" size="sm" label="Participating farmers" value="1,842" />
        <StatCard className="p-5 text-center sm:text-left" size="sm" label="Hectares conservation" value="8,420" />
        <StatCard className="p-5 text-center sm:text-left" size="sm" label="Status" value="Active" />
      </ContentCard>

      <section>
        <SectionHeading eyebrow="Why this landscape matters" title="The buffer belt" />
        <p className="max-w-[68ch] text-[14px] leading-relaxed text-ink-muted">
          {INVESTOR_PROJECT.problem}
        </p>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-ink-muted">
          Implemented by {INVESTOR_PROJECT.implementer}. {INVESTOR_PROJECT.beneficiaries}
        </p>
        <ActionButton to="/investor/governance" variant="text" className="mt-2">
          Full governance structure
        </ActionButton>
      </section>

      <section>
        <SectionHeading eyebrow="Landscape" title="Where it is" />
        <Suspense fallback={<MapLoadingFallback className="h-[24rem]" />}>
          <LandscapeMap className="h-[24rem]" />
        </Suspense>
      </section>

      <section>
        <SectionHeading eyebrow="Conservation model" title="How capital becomes impact" />
        <ImpactFlowDiagram />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          to="/investor/capital"
          eyebrow="Capital"
          value={`${Math.round((CAPITAL_POSITION.deployed / CAPITAL_POSITION.committed) * 100)}%`}
          detail={`${formatCurrencyShort(CAPITAL_POSITION.deployed, CAPITAL_POSITION.currency)} deployed`}
        />
        <SummaryCard
          to="/investor/evidence"
          eyebrow="Evidence"
          value={`${evidenceMetric.value}%`}
          detail="records with supporting evidence"
        />
        <SummaryCard
          to="/investor/risks"
          eyebrow="Risks"
          value={openRiskCount}
          detail={`${highRiskCount} high severity, open`}
        />
        <SummaryCard
          to="/investor/reports"
          eyebrow="Reporting"
          value={readyReportCount}
          detail="reports ready this period"
        />
      </section>
    </div>
  )
}
