import { useState } from 'react'
import { ArrowRight, Check, Copy, Paperclip, Pencil, ShieldCheck } from 'lucide-react'
import { assessClaim } from '../../../lib/brand/claims'
import { BRAND_DATA_POLICY } from '../../../data/brand/roles'
import { CONTENT_STATUS_LABELS, CONTENT_TYPE_LABELS } from '../../../data/brand/content'
import { getInterventionType } from '../../../data/funder/interventionTypes'
import { useBrand } from '../BrandWorkspaceContext'
import { useEvidenceDrawer } from '../../investor/EvidenceDrawerContext'
import PageHeader from '../../offtaker/PageHeader'
import SectionHeading from '../../investor/SectionHeading'
import DataTable from '../../offtaker/DataTable'
import Badge from '../../investor/ui/Badge'
import ActionButton from '../../investor/ui/ActionButton'
import Field, { inputClass } from '../Field'
import { ClaimVerdictBadge } from '../StatusBadges'

const VERDICT_RANK = { not_supported: 0, reword: 1, in_review: 2, approved: 3 }

const CLAIM_KINDS = [
  { key: 'landscape_support', label: 'It supports conservation or the landscape' },
  { key: 'origin', label: 'Where the tea comes from' },
  { key: 'intervention', label: 'A specific kind of conservation work' },
  { key: 'metric', label: 'A figure, such as trees planted' },
  { key: 'per_unit', label: 'Something per pack or per cup' },
  { key: 'carbon', label: 'Carbon or climate neutrality' },
]

const CHECKABLE_WORK = ['it-indigenous', 'it-tea-infill', 'it-fuelwood', 'it-patrol', 'it-audit']
const CHECKABLE_FIGURES = [
  ['ind-seedlings', 'Indigenous seedlings planted'],
  ['ind-tea-ha', 'Hectares of tea buffer infilled'],
  ['ind-fuelwood-ha', 'Hectares of fuelwood established'],
  ['ind-patrols', 'Buffer patrols'],
  ['ind-plots-audited', 'Plots audited'],
]

function EvidenceChips({ ids }) {
  const { openEvidence } = useEvidenceDrawer()
  if (ids.length === 0) return null
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => openEvidence(id)}
          className="inline-flex items-center gap-1 rounded-full border border-line bg-card px-2.5 py-0.5 text-compact font-medium text-forest-accent hover:border-forest-accent/40 hover:bg-forest-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
        >
          <Paperclip className="h-3 w-3" aria-hidden="true" />
          {id}
        </button>
      ))}
    </div>
  )
}

function CopyWording({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button type="button" onClick={copy} className="inline-flex shrink-0 items-center gap-1 text-compact font-semibold text-forest-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy wording'}
    </button>
  )
}

/** The brand's words on the left, ForestOS's verdict on the right. */
function ClaimRow({ statement, productName, assessment }) {
  return (
    <li className="grid overflow-hidden rounded-2xl border border-line bg-card shadow-card md:grid-cols-2">
      <div className="p-5">
        <p className="flex items-center gap-1.5 text-compact font-semibold text-ink-muted">
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> {productName ? `Brand says, ${productName}` : 'Brand says'}
        </p>
        <p className="mt-2 text-base leading-snug text-ink">“{statement}”</p>
      </div>
      <div className="border-t border-line bg-canvas/70 p-5 md:border-l md:border-t-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-compact font-semibold text-forest-accent-dark">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> ForestOS verified data
          </p>
          <ClaimVerdictBadge status={assessment.status} />
        </div>
        <p className="mt-2 text-compact leading-relaxed text-ink-muted">{assessment.reason}</p>
        {assessment.approvedWording && (
          <div className="mt-3 rounded-lg border border-forest-accent/20 bg-card p-3">
            <p className="text-compact text-ink-faint">{assessment.status === 'approved' ? 'Recommended wording' : 'What you can say instead'}</p>
            <p className="mt-1 text-compact text-ink">{assessment.approvedWording}</p>
            <div className="mt-2">
              <CopyWording text={assessment.approvedWording} />
            </div>
          </div>
        )}
        <EvidenceChips ids={assessment.evidenceIds} />
      </div>
    </li>
  )
}

function ClaimChecker() {
  const ws = useBrand()
  const [statement, setStatement] = useState('')
  const [productId, setProductId] = useState(ws.products[0]?.id ?? '')
  const [kind, setKind] = useState('landscape_support')
  const [work, setWork] = useState(CHECKABLE_WORK[0])
  const [figure, setFigure] = useState(CHECKABLE_FIGURES[0][0])
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const product = ws.products.find((entry) => entry.id === productId)

  const check = (event) => {
    event.preventDefault()
    if (!product) return setError('Create a product first: a statement is checked against a product’s lots.')
    if (!statement.trim()) return setError('Write the statement you want to use.')
    if (kind === 'metric' && !(Number(value) > 0)) return setError('Enter the figure the statement uses.')
    setError('')
    const asserts = { type: kind, interventionTypeIds: [work], indicatorId: figure, value: Number(value) }
    return setResult({ statement: statement.trim(), productName: product?.name, assessment: assessClaim(asserts, product.evidence) })
  }

  return (
    <form onSubmit={check} noValidate className="rounded-2xl border border-line bg-card p-6 shadow-card">
      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Statement" error={error || null} className="lg:col-span-2">
          {(props) => <input {...props} className={inputClass} value={statement} onChange={(event) => setStatement(event.target.value)} placeholder="Our tea protects the Mau Forest." />}
        </Field>
        <Field label="Product it is about">
          {(props) => (
            <select {...props} className={inputClass} value={productId} onChange={(event) => setProductId(event.target.value)}>
              {ws.products.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="What it claims">
          {(props) => (
            <select {...props} className={inputClass} value={kind} onChange={(event) => setKind(event.target.value)}>
              {CLAIM_KINDS.map((entry) => (
                <option key={entry.key} value={entry.key}>
                  {entry.label}
                </option>
              ))}
            </select>
          )}
        </Field>
        {kind === 'intervention' && (
          <Field label="Which work">
            {(props) => (
              <select {...props} className={inputClass} value={work} onChange={(event) => setWork(event.target.value)}>
                {CHECKABLE_WORK.map((id) => (
                  <option key={id} value={id}>
                    {getInterventionType(id)?.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
        )}
        {kind === 'metric' && (
          <>
            <Field label="Which figure">
              {(props) => (
                <select {...props} className={inputClass} value={figure} onChange={(event) => setFigure(event.target.value)}>
                  {CHECKABLE_FIGURES.map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field label="The figure you state">
              {(props) => <input {...props} type="number" inputMode="decimal" min={0} className={inputClass} value={value} onChange={(event) => setValue(event.target.value)} />}
            </Field>
          </>
        )}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <ActionButton type="submit" variant="primary" icon={ArrowRight}>
          Check against the records
        </ActionButton>
        <p className="text-compact text-ink-faint">A check only; nothing is submitted or saved.</p>
      </div>
      {result && (
        <ul className="mt-6" aria-live="polite">
          <ClaimRow {...result} />
        </ul>
      )}
    </form>
  )
}

export default function ContentPage() {
  const ws = useBrand()
  const memberName = (id) => ws.team.find((member) => member.id === id)?.name ?? 'Unknown'
  const worstVerdict = (item) =>
    item.claims.length === 0 ? null : item.claims.map((claim) => claim.assessment.status).sort((a, b) => VERDICT_RANK[a] - VERDICT_RANK[b])[0]

  return (
    <div className="space-y-14">
      <PageHeader
        title="Content & claims"
        description="Your words are yours to write. What they claim about origin and conservation is checked against ForestOS’s records, and ForestOS decides which wording those records support."
      />

      <section aria-label="Who controls what" className="grid overflow-hidden rounded-2xl border border-line shadow-card md:grid-cols-2">
        <div className="bg-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
            <Pencil className="h-4 w-4 text-ink-muted" aria-hidden="true" /> Brand content
          </h2>
          <p className="mt-1 text-compact text-ink-muted">You write and change these.</p>
          <ul className="mt-4 space-y-2 text-compact text-ink">
            {BRAND_DATA_POLICY.brandControls.map((line) => (
              <li key={line} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-line bg-forest-accent-soft/50 p-6 md:border-l md:border-t-0">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
            <ShieldCheck className="h-4 w-4 text-forest-accent" aria-hidden="true" /> ForestOS verified data
          </h2>
          <p className="mt-1 text-compact text-ink-muted">Read-only for every brand role.</p>
          <ul className="mt-4 space-y-2 text-compact text-ink">
            {BRAND_DATA_POLICY.forestosControls.map((line) => (
              <li key={line} className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-accent" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Check a statement">
        <SectionHeading title="Check a statement" description="Before it goes on a pack, a card or a post: see whether the records behind the product support it." />
        <ClaimChecker />
      </section>

      <section aria-label="Your claims">
        <SectionHeading
          title="Your claims"
          description={`${ws.claimSummary.approved} approved, ${ws.claimSummary.reword} to reword, ${ws.claimSummary.in_review} pending verification, ${ws.claimSummary.not_supported} that cannot be made yet.`}
        />
        <ul className="space-y-3">
          {[...ws.claims]
            .sort((a, b) => VERDICT_RANK[a.assessment.status] - VERDICT_RANK[b.assessment.status])
            .map((claim) => (
              <ClaimRow key={claim.id} statement={claim.statement} productName={claim.productName} assessment={claim.assessment} />
            ))}
        </ul>
      </section>

      <section aria-label="Content library">
        <SectionHeading title="Content library" description="Stories, pack copy, posts and calls to action. The ForestOS column follows the claims each piece repeats." />
        <DataTable
          caption="Content library"
          rowKey={(row) => row.id}
          rows={ws.content}
          minWidth="56rem"
          columns={[
            {
              key: 'title',
              header: 'Content',
              cell: (row) => (
                <span>
                  <span className="block font-semibold text-ink">{row.title}</span>
                  <span className="line-clamp-2 max-w-[48ch] text-compact text-ink-muted">{row.body}</span>
                </span>
              ),
            },
            { key: 'type', header: 'Type', cell: (row) => CONTENT_TYPE_LABELS[row.type] },
            { key: 'brand', header: 'Brand sign-off', cell: (row) => <Badge tone="neutral">{CONTENT_STATUS_LABELS[row.status]}</Badge> },
            {
              key: 'forestos',
              header: 'ForestOS check',
              cell: (row) => {
                const verdict = worstVerdict(row)
                return verdict ? <ClaimVerdictBadge status={verdict} /> : <span className="text-compact text-ink-faint">No claims</span>
              },
            },
            { key: 'author', header: 'Author', cell: (row) => memberName(row.authorId) },
            { key: 'updated', header: 'Updated', cell: (row) => <span className="font-mono text-compact">{row.updatedAt}</span> },
          ]}
        />
      </section>
    </div>
  )
}
