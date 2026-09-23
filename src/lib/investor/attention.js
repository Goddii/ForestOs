import { RISK_REGISTER, EVIDENCE_RECORDS } from '../../data/investor'

/**
 * "Requires attention" (design-review brief §12) is deliberately derived
 * from the same risk register and evidence records the rest of the console
 * already shows — not a second, parallel dataset invented for this one
 * section. That keeps every item traceable back to a real record instead of
 * being a fabricated activity feed.
 *
 * @returns {Array<{ id: string, label: string, detail: string, to: string }>}
 */
export function getAttentionItems() {
  const openRisks = RISK_REGISTER.filter((risk) => risk.status === 'open')
  const gapCount = EVIDENCE_RECORDS.filter(
    (record) => record.status === 'pending_verification' || record.status === 'incomplete',
  ).length

  const items = openRisks.slice(0, 3).map((risk) => ({
    id: risk.id,
    label: risk.description,
    detail: `${risk.severity.toUpperCase()} · ${risk.owner}`,
    to: '/investor/risks',
  }))

  if (gapCount > 0) {
    items.push({
      id: 'evidence-gap',
      label: `${gapCount} evidence record${gapCount === 1 ? '' : 's'} pending or incomplete verification`,
      detail: 'Evidence centre',
      to: '/investor/evidence',
    })
  }

  return items
}
