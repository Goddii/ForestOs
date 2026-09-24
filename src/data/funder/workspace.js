// Builds one funder's workspace: everything the funder console renders,
// scoped to that funder's agreement and projected through its disclosure
// policy. Every figure is derived from the shared programme records
// (activities, ledger, observations) — funders are filters over one set of
// facts, never separate datasets (audit §9). A backend replaces the seed
// imports below with API responses; this function's output shape stays.
import { EXPENDITURES } from '../investor/expenditures'
import { FUNDING_AGREEMENTS, IN_KIND_CONTRIBUTIONS, agreementsForOrg } from './agreements'
import { ACTIVITY_RECORDS } from './activities'
import { SURVIVAL_OBSERVATIONS } from './observations'
import { REPORT_INSTANCES } from './reports'
import { getPolicy } from './policies'
import { getInterventionType } from './interventionTypes'
import { getOrganisation, getOrganisationBySlug } from './organisations'
import { AS_OF, OUTCOME_INDICATORS, OUTPUT_INDICATORS, PROGRAMME } from './programme'
import {
  agreementDeploymentTrend,
  agreementExpenditures,
  agreementUseOfFunds,
  buildCapitalPosition,
  trancheTotals,
} from '../../lib/programme/funding'
import { summarizeIndicator } from '../../lib/programme/indicators'
import { projectActivity } from '../../lib/programme/disclosure'
import { observationStatus, survivalRate } from '../../lib/programme/survival'

/** How money is given drives the language, never the structure (audit §9 rule 4). */
const TERMS = {
  csr: {
    money: 'contribution',
    yours: 'your contribution',
    positionTitle: 'Contribution position',
    producedTitle: 'What your contribution has funded',
    storyAudience: 'sustainability reports and public updates',
    showsAttribution: false,
  },
  grant: {
    money: 'grant',
    yours: 'your grant',
    positionTitle: 'Grant position',
    producedTitle: 'What your grant has funded',
    storyAudience: 'grant reports and public updates',
    showsAttribution: false,
  },
  investment: {
    money: 'capital',
    yours: 'this fund',
    positionTitle: 'Capital position',
    producedTitle: 'What your capital has funded',
    storyAudience: 'LP letters and public updates',
    showsAttribution: true,
  },
}

export const FUNDING_TYPE_LABELS = {
  csr: 'CSR contribution',
  grant: 'Grant',
  investment: 'Investment',
  in_kind: 'In kind',
}

const ACTIVITY_BY_ID = new Map(ACTIVITY_RECORDS.map((activity) => [activity.id, activity]))

/** Survival checks with their status, intervention category and whether this funder paid for the planting. */
function survivalChecks(allocationIds) {
  return SURVIVAL_OBSERVATIONS.map((observation) => {
    const activity = ACTIVITY_BY_ID.get(observation.activityId)
    return {
      ...observation,
      status: observationStatus(observation, AS_OF),
      category: activity ? getInterventionType(activity.interventionTypeId)?.category ?? null : null,
      activitySummary: activity?.summary ?? '',
      isFunded: Boolean(activity && allocationIds.has(activity.allocationId)),
    }
  })
}

function outcomeValues(checks) {
  return OUTCOME_INDICATORS.map((indicator) => {
    if (indicator.source.kind === 'fixed') {
      return {
        indicator,
        programme: indicator.source.value,
        funded: null,
        pending: 0,
        asOf: indicator.source.asOf,
        evidenceId: indicator.source.evidenceId,
      }
    }
    const { category, monthsAfter } = indicator.source
    const relevant = checks.filter((check) => check.category === category && check.monthsAfter === monthsAfter)
    return {
      indicator,
      programme: survivalRate(relevant)?.pct ?? null,
      funded: survivalRate(relevant.filter((check) => check.isFunded))?.pct ?? null,
      pending: relevant.filter((check) => check.status !== 'observed').length,
      asOf: AS_OF,
      evidenceId: relevant.find((check) => check.evidenceId)?.evidenceId ?? null,
    }
  })
}

/** Every programme funder, for whole-programme context and the optional pro-rata view. */
function programmeFunding(agreement) {
  const sources = [
    ...FUNDING_AGREEMENTS.map((entry) => ({
      label: getOrganisation(entry.funderOrgId)?.name ?? entry.funderOrgId,
      type: FUNDING_TYPE_LABELS[entry.type],
      amount: entry.amountKes,
      isInvestor: entry.id === agreement.id,
    })),
    ...IN_KIND_CONTRIBUTIONS.map((entry) => ({ label: entry.label, type: entry.type, amount: entry.amountKes, isInvestor: false })),
  ]
  return { sources, attributionMethod: 'Pro-rata by committed amount across all programme funders' }
}

function composeWorkspace(org, agreement) {
  const policy = getPolicy(agreement.disclosurePolicyId)
  const allocationIds = new Set(agreement.allocations.map((allocation) => allocation.id))
  const activities = ACTIVITY_RECORDS.map((activity) => projectActivity(activity, policy))
  const checks = survivalChecks(allocationIds)

  return {
    org,
    agreement,
    policy,
    programme: PROGRAMME,
    asOf: AS_OF,
    basePath: `/funder/${org.slug}`,
    terms: TERMS[agreement.type] ?? TERMS.grant,
    allocationIds,
    capital: {
      position: buildCapitalPosition(agreement, EXPENDITURES),
      useOfFunds: agreementUseOfFunds(agreement, EXPENDITURES),
      expenditures: agreementExpenditures(agreement, EXPENDITURES),
      trend: agreementDeploymentTrend(agreement, EXPENDITURES),
      tranches: agreement.tranches,
      trancheTotals: trancheTotals(agreement.tranches),
    },
    programmeFunding: programmeFunding(agreement),
    activities,
    fundedActivities: activities.filter((activity) => allocationIds.has(activity.allocationId)),
    progress: OUTPUT_INDICATORS.map((indicator) => summarizeIndicator(indicator, activities, allocationIds)),
    survivalChecks: checks,
    outcomes: outcomeValues(checks),
    reports: REPORT_INSTANCES.filter((report) => report.agreementIds.includes(agreement.id)),
  }
}

/**
 * @param {string} slug - the funder organisation's slug (URL key)
 * @returns {null | ReturnType<typeof composeWorkspace>} null for an unknown slug or a non-funder
 */
export function buildWorkspace(slug) {
  const org = getOrganisationBySlug(slug)
  if (!org || org.type !== 'funder') return null
  const [agreement] = agreementsForOrg(org.id)
  if (!agreement) return null
  return composeWorkspace(org, agreement)
}

/** @typedef {NonNullable<ReturnType<typeof buildWorkspace>>} FunderWorkspace */
