import { CalendarClock, CheckCircle2, Clock } from 'lucide-react'
import { SEEDLING_BATCHES, EXPENDITURES, LANDSCAPE_LAYERS, getMediaById } from '../../data/investor'
import { useWorkspace } from './FunderWorkspaceContext'
import { sumAmounts } from '../../lib/investor/capitalLedger'
import { formatCurrencyShort, formatNumber } from '../../lib/investor/format'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import MediaFigure from './MediaFigure'
import Badge from './ui/Badge'
import ActionButton from './ui/ActionButton'

const STAGE_STATUS = {
  done: { label: 'Done', tone: 'verified', icon: CheckCircle2 },
  in_review: { label: 'In review', tone: 'warning', icon: Clock },
  scheduled: { label: 'Scheduled', tone: 'neutral', icon: CalendarClock },
  overdue: { label: 'Overdue', tone: 'danger', icon: Clock },
}

const ZONE_LABELS = Object.fromEntries(LANDSCAPE_LAYERS.map((feature) => [feature.id, feature.label]))

/**
 * Seedling batch diaries — each batch's whole life on one timeline, the
 * Treedom / Greenstand / Ecosia pattern of periodic dated photos of the same
 * trees: nursery → land preparation → planting → survival checks. The
 * header ties the batch back to the payments that funded it; a stage that
 * hasn't happened shows an empty "scheduled" slot, never a projected result.
 */
export default function SeedlingBatchDiary() {
  const { openEvidence } = useEvidenceDrawer()
  const { allocationIds, terms } = useWorkspace()

  return (
    <div className="space-y-10">
      {SEEDLING_BATCHES.map((batch) => {
        const payments = EXPENDITURES.filter((row) => batch.expenditureIds.includes(row.id))
        const isYours = payments.some((row) => allocationIds.has(row.categoryId))
        return (
          <article key={batch.id}>
            <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
              <div>
                <h3 className="text-[16px] font-semibold text-ink">{batch.label}</h3>
                <p className="mt-0.5 text-[12px] text-ink-muted">
                  <span className="font-semibold tabular-nums text-ink">{formatNumber(batch.quantity)}</span> seedlings ·{' '}
                  <span className="italic">{batch.species.join(', ')}</span> · {ZONE_LABELS[batch.zoneId]}
                </p>
              </div>
              <p className="font-mono text-[11px] tabular-nums text-ink-muted">
                {isYours ? `Funded by ${terms.yours}` : 'Funded by another programme funder'} ·{' '}
                {payments.length} payment{payments.length === 1 ? '' : 's'} · {formatCurrencyShort(sumAmounts(payments))}
              </p>
            </header>

            <ol className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {batch.stages.map((stage) => {
                const status = STAGE_STATUS[stage.status]
                const asset = getMediaById(stage.mediaId)
                return (
                  <li key={stage.stage} className="flex flex-col">
                    {asset ? (
                      <MediaFigure asset={asset} />
                    ) : (
                      <div className="grid aspect-[3/2] place-items-center rounded-lg border border-dashed border-line bg-canvas-sunk px-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                        Photo set not yet captured
                      </div>
                    )}
                    <p className="mt-2 text-[13px] font-semibold text-ink">{stage.stage}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">{stage.date}</p>
                    <Badge tone={status.tone} icon={status.icon} className="mt-1.5 self-start">
                      {status.label}
                    </Badge>
                    <p className="mt-1.5 text-[12px] leading-snug text-ink-muted">{stage.note}</p>
                    {stage.evidenceId && (
                      <ActionButton variant="text" onClick={() => openEvidence(stage.evidenceId)} className="self-start">
                        Evidence
                      </ActionButton>
                    )}
                  </li>
                )
              })}
            </ol>
          </article>
        )
      })}
    </div>
  )
}
