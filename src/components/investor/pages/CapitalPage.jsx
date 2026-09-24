import SectionHeading from '../SectionHeading'
import CapitalFlow from '../CapitalFlow'
import CapitalTimeline from '../CapitalTimeline'
import UseOfFundsBars from '../UseOfFundsBars'
import SustainabilityPathway from '../SustainabilityPathway'
import ContentCard from '../ui/ContentCard'
import CapitalOutcomes from '../CapitalOutcomes'
import ExpenditureList from '../ExpenditureList'
import { INVESTOR_PROJECT, EXPENDITURES, CAPITAL_POSITION } from '../../../data/investor'
import { formatCurrencyShort } from '../../../lib/investor/format'

const LEDGER_NEWEST_FIRST = EXPENDITURES.toSorted((a, b) => b.date.localeCompare(a.date))

/**
 * Capital page (build brief §23): the full accountability chain, the
 * deployment timeline, use of funds, and the long-term sustainability
 * pathway — how capital is expected to stop being a recurring subsidy.
 */
export default function CapitalPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-14">
      <section>
        <SectionHeading
          eyebrow="Accountability"
          title="Capital accountability chain"
          description="Committed capital narrows at each stage to the portion actually deployed, and further to the portion with verified evidence behind it."
        />
        <CapitalFlow />
      </section>

      <section>
        <SectionHeading
          eyebrow="Capital → outcomes"
          title="What your capital has produced"
          description="Gross programme outcomes, this fund's attributed share, and deployed capital per unit — each with its evidence."
        />
        <ContentCard>
          <CapitalOutcomes />
        </ContentCard>
      </section>

      <section>
        <SectionHeading
          eyebrow="Expenditure ledger"
          title="Every payment, the activity it funded, and its evidence"
          description={`${EXPENDITURES.length} payments totalling ${formatCurrencyShort(CAPITAL_POSITION.deployed, CAPITAL_POSITION.currency)} deployed, of which ${formatCurrencyShort(CAPITAL_POSITION.verified, CAPITAL_POSITION.currency)} is verified.`}
        />
        <ContentCard className="p-5">
          <ExpenditureList rows={LEDGER_NEWEST_FIRST} showCategory />
        </ContentCard>
      </section>

      <section>
        <SectionHeading eyebrow="Timeline" title="Deployment timeline" />
        <CapitalTimeline />
      </section>

      <section>
        <SectionHeading
          eyebrow="Use of funds"
          title="Budget, deployment and remaining balance by category"
        />
        <ContentCard>
          <UseOfFundsBars />
        </ContentCard>
      </section>

      <section>
        <SectionHeading
          eyebrow="Long-term model"
          title="How this stops being a subsidy"
          description={INVESTOR_PROJECT.sustainabilityModel}
        />
        <SustainabilityPathway />
      </section>
    </div>
  )
}
