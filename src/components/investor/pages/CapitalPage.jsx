import { useState } from 'react'
import SectionHeading from '../SectionHeading'
import CapitalFlow from '../CapitalFlow'
import CapitalTimeline from '../CapitalTimeline'
import UseOfFundsBars from '../UseOfFundsBars'
import SustainabilityPathway from '../SustainabilityPathway'
import ExpenditureLedger from '../ExpenditureLedger'
import ContentCard from '../ui/ContentCard'
import Badge from '../ui/Badge'
import { INVESTOR_PROJECT } from '../../../data/investor'
import { FUNDING_TYPE_LABELS } from '../../../data/funder/workspace'
import { ALL_PAYMENTS, LEDGER_ID } from '../../../lib/investor/capitalLedger'
import { formatCurrencyShort, formatMillions } from '../../../lib/investor/format'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { useWorkspace } from '../FunderWorkspaceContext'

function AgreementSummary({ agreement, org }) {
  return (
    <ContentCard className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-ink">{agreement.label}</p>
          <p className="mt-0.5 text-compact text-ink-muted">
            {org.name} · {FUNDING_TYPE_LABELS[agreement.type]} · signed {agreement.signedDate}
          </p>
        </div>
        <p className="font-sans text-2xl font-bold tabular-nums text-ink">{formatCurrencyShort(agreement.amountKes)}</p>
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-[12rem_1fr]">
        <dt className="font-mono text-label font-semibold uppercase tracking-label text-ink-faint">Period</dt>
        <dd className="text-compact text-ink-muted">
          {agreement.period.start} to {agreement.period.end}
        </dd>
        <dt className="font-mono text-label font-semibold uppercase tracking-label text-ink-faint">Terms</dt>
        <dd>
          <ul className="list-disc space-y-1 pl-4 text-compact text-ink-muted">
            {agreement.restrictions.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </dd>
      </dl>
      {agreement.isIllustrative && (
        <Badge tone="warning" className="mt-5">
          Illustrative terms, to be replaced by the signed agreement
        </Badge>
      )}
    </ContentCard>
  )
}

/**
 * Capital page (build brief §23) — the home of everything capital: the
 * accountability chain, use of funds, the one expenditure ledger both of
 * them point into, the deployment timeline and the long-term sustainability
 * pathway. The chain and the categories never list payments themselves;
 * they set the ledger's filter and scroll to it, so no payment is shown
 * twice. "What your capital has produced" lives on the Overview.
 */
export default function CapitalPage() {
  const [ledgerFilter, setLedgerFilter] = useState(ALL_PAYMENTS)
  const reduced = usePrefersReducedMotion()
  const { agreement, org, capital, terms } = useWorkspace()
  const { position } = capital

  const showPayments = (filter) => {
    setLedgerFilter(filter)
    document.getElementById(LEDGER_ID)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <section>
        <SectionHeading title="What was agreed" />
        <AgreementSummary agreement={agreement} org={org} />
      </section>

      <section>
        <SectionHeading
          title={`Where ${terms.yours} is`}
          description="Every bar is measured against the full commitment: what has arrived (outlined sections are tranches still to come), what has been assigned to work, what has been spent, and what was spent on work that has since been verified. Work can be assigned against the whole commitment, so it can run ahead of the money received."
        />
        <CapitalFlow onShowPayments={showPayments} />
      </section>

      <section>
        <SectionHeading
          title="What each category paid for, produced and contributes to"
        />
        <ContentCard className="overflow-hidden">
          <UseOfFundsBars onShowPayments={showPayments} />
        </ContentCard>
      </section>

      <section>
        <SectionHeading
          title="Every payment, the activity it funded, and its evidence"
          description={`${capital.expenditures.length} payments totalling ${formatMillions(position.deployed, position.currency)}, of which ${formatMillions(position.verified, position.currency)} paid for work that has been verified.`}
        />
        <ContentCard className="overflow-hidden">
          <ExpenditureLedger filter={ledgerFilter} onFilterChange={setLedgerFilter} />
        </ContentCard>
      </section>

      <section>
        <SectionHeading title="When the money arrives" />
        <CapitalTimeline />
      </section>

      {terms.showsAttribution && (
        <section>
          <SectionHeading
            title="How this stops being a subsidy"
            description={INVESTOR_PROJECT.sustainabilityModel}
          />
          <SustainabilityPathway />
        </section>
      )}
    </div>
  )
}
