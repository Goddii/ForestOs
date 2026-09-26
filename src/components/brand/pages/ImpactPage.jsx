import { Ban, Clock, Paperclip, ShieldCheck } from 'lucide-react'
import { assessClaim } from '../../../lib/brand/claims'
import { useBrand } from '../BrandWorkspaceContext'
import { useEvidenceDrawer } from '../../investor/EvidenceDrawerContext'
import PageHeader from '../../offtaker/PageHeader'
import SectionHeading from '../../investor/SectionHeading'
import { SourceTag } from '../StatusBadges'

const formatValue = (value) => value.toLocaleString('en-US', { maximumFractionDigits: 1 })

/** Things no brand can say yet, and why. Fixed by the record, not by any one brand. */
const CANNOT_SAY = [
  {
    title: 'Impact per pack or per cup',
    reason: 'No allocation method ties hectares, trees or premium to an individual pack or cup yet. Talk about the landscape, not a unit.',
  },
  {
    title: 'Carbon neutrality or offsets',
    reason: 'ForestOS holds no carbon methodology, baseline or verifier for this tea.',
  },
  {
    title: 'That your brand did the work',
    reason: 'Planting, patrols and audits are NTZDC programme work, verified by NTZDC and independent reviewers. Say what happened where your tea grows.',
  },
]

function MetricCard({ metric, products }) {
  const { openEvidence } = useEvidenceDrawer()
  return (
    <li className="flex flex-col rounded-2xl border border-line bg-card p-6 shadow-card">
      <p className="text-4xl font-bold leading-none tracking-tight text-ink">{formatValue(metric.value)}</p>
      <p className="mt-2 text-compact font-semibold text-ink-muted">{metric.label}</p>
      <p className="mt-4 flex-1 border-t border-line pt-4 text-compact leading-relaxed text-ink">{metric.wording}</p>
      <p className="mt-3 text-xs text-ink-faint">Applies to {products.join(', ')}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {metric.evidenceIds.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => openEvidence(id)}
            className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-forest-accent hover:border-forest-accent/40 hover:bg-forest-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          >
            <Paperclip className="h-3 w-3" aria-hidden="true" />
            {id}
          </button>
        ))}
      </div>
    </li>
  )
}

export default function ImpactPage() {
  const ws = useBrand()
  const productsFor = (metricId) => ws.products.filter((product) => product.evidence.metrics.some((metric) => metric.id === metricId)).map((product) => product.name)
  const origins = ws.products
    .filter((product) => product.lots.length > 0)
    .map((product) => ({ product, assessment: assessClaim({ type: 'origin' }, product.evidence) }))
    .filter((entry) => entry.assessment.status === 'approved')

  return (
    <div className="space-y-14">
      <PageHeader
        title="Impact"
        description="The conservation and origin statements your brand may communicate, with the figure, the approved wording and the evidence behind each. Figures come from verified NTZDC records in the buffer beside your lots; you choose which to use."
        meta={<SourceTag kind="forestos" />}
      />

      <section aria-label="Statements you can use">
        <SectionHeading title="Statements you can use" />
        {ws.evidence.metrics.length === 0 ? (
          <p className="max-w-[65ch] rounded-2xl border border-dashed border-line-strong px-5 py-4 text-compact text-ink-muted">
            No verified conservation work is linked to your lots’ collection centres yet, so there is no impact figure to communicate. Your verified origin statements are
            below.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ws.evidence.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} products={productsFor(metric.id)} />
            ))}
          </ul>
        )}
      </section>

      {origins.length > 0 && (
        <section aria-label="Origin statements">
          <SectionHeading title="Origin statements" description="Every connected lot passed the field and satellite checks, so each product may say where it was grown." />
          <ul className="divide-y divide-line rounded-2xl border border-line bg-card shadow-card">
            {origins.map(({ product, assessment }) => (
              <li key={product.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="w-56 shrink-0 text-compact font-semibold text-ink">{product.name}</span>
                <span className="flex items-start gap-2 text-compact text-ink">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-accent" aria-hidden="true" />
                  {assessment.approvedWording}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-label="Still being verified">
          <SectionHeading title="Still being verified" />
          {ws.evidence.pendingMetrics.length === 0 ? (
            <p className="text-compact text-ink-muted">Nothing linked to your lots is waiting on verification.</p>
          ) : (
            <ul className="space-y-2">
              {ws.evidence.pendingMetrics.map((metric) => (
                <li key={metric.id} className="flex items-start gap-3 rounded-xl border border-line p-4 text-compact">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-ink">
                      {formatValue(metric.value)} {metric.label.toLowerCase()}
                    </span>
                    <span className="block text-ink-muted">Recorded, not verified yet. It becomes usable here once it is.</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section aria-label="What no brand can say yet">
          <SectionHeading title="What no brand can say yet" />
          <ul className="space-y-2">
            {CANNOT_SAY.map((item) => (
              <li key={item.title} className="flex items-start gap-3 rounded-xl border border-line p-4 text-compact">
                <Ban className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-ink">{item.title}</span>
                  <span className="block text-ink-muted">{item.reason}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
