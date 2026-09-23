import SectionHeading from '../SectionHeading'
import RiskRegister from '../RiskRegister'

/**
 * Risk & Controls (build brief §16) — the full register, grouped by
 * category, never reduced to a single score.
 */
export default function RisksPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <SectionHeading
        eyebrow="Risk & controls"
        title="Risk register"
        description="Environmental, social, operational, financial and data risk, each with its own owner, mitigation and last review — not a single aggregate score."
      />
      <RiskRegister />
    </div>
  )
}
