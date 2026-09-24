import { cumulativeByQuarter, summarizeCategories, sumAmounts } from '../investor/capitalLedger'

/**
 * Funding roll-ups for one agreement. Every figure is derived from the
 * agreement's tranches and allocations plus its own rows in the programme
 * expenditure ledger, so no headline can drift from its breakdown — the
 * same principle the investor ledger already followed, now scoped per funder.
 */

/** @typedef {import('../contracts/programme').FundingAgreement} FundingAgreement */
/** @typedef {import('../../data/investor/types').Expenditure} Expenditure */

/**
 * @param {import('../contracts/programme').Tranche[]} tranches
 * @returns {{ planned: number, received: number, outstanding: number }}
 */
export function trancheTotals(tranches) {
  const planned = tranches.reduce((total, tranche) => total + tranche.plannedKes, 0)
  const received = tranches.reduce((total, tranche) => total + (tranche.receivedKes ?? 0), 0)
  return { planned, received, outstanding: planned - received }
}

/**
 * @param {FundingAgreement} agreement
 * @param {Expenditure[]} expenditures - the whole programme ledger
 * @returns {Expenditure[]}
 */
export function agreementExpenditures(agreement, expenditures) {
  const ids = new Set(agreement.allocations.map((allocation) => allocation.id))
  return expenditures.filter((row) => ids.has(row.categoryId))
}

/**
 * @param {FundingAgreement} agreement
 * @param {Expenditure[]} expenditures
 */
export function buildCapitalPosition(agreement, expenditures) {
  const rows = agreementExpenditures(agreement, expenditures)
  return {
    committed: agreement.amountKes,
    received: trancheTotals(agreement.tranches).received,
    allocated: agreement.allocations.reduce((total, allocation) => total + allocation.allocatedKes, 0),
    deployed: sumAmounts(rows),
    verified: sumAmounts(rows.filter((row) => row.status === 'verified')),
    currency: 'KSh',
  }
}

/**
 * The agreement's allocations in the `CapitalAllocation` shape the existing
 * use-of-funds components render.
 *
 * @param {FundingAgreement} agreement
 * @param {Expenditure[]} expenditures
 */
export function agreementUseOfFunds(agreement, expenditures) {
  const categories = agreement.allocations.map((allocation) => ({
    id: allocation.id,
    category: allocation.label,
    componentId: allocation.componentId,
    budget: allocation.budgetKes,
    allocated: allocation.allocatedKes,
    percentage: Math.round((allocation.budgetKes / agreement.amountKes) * 100),
    outputs: allocation.outputs,
    outcomeIds: allocation.outcomeIds,
  }))
  return summarizeCategories(categories, agreementExpenditures(agreement, expenditures))
}

/**
 * @param {FundingAgreement} agreement
 * @param {Expenditure[]} expenditures
 */
export function agreementDeploymentTrend(agreement, expenditures) {
  return cumulativeByQuarter(agreementExpenditures(agreement, expenditures))
}
