// DEMO DATA — illustrative only. Barrel export for the investor data layer;
// nothing here is real ForestOS production data (see build brief §4 / §32).
// This flag drives the persistent "DEMO ENVIRONMENT" indicator in
// InvestorShell — flip it only once a real API backs every module below.
export const IS_DEMO_ENVIRONMENT = true

export { INVESTOR_PROJECT } from './project'
export {
  CAPITAL_POSITION,
  USE_OF_FUNDS,
  CAPITAL_TIMELINE,
  DEPLOYMENT_TREND,
  PROGRAMME_FUNDING,
} from './capital'
export { EXPENDITURES } from './expenditures'
export { CORE_OUTCOMES, CONSERVATION_PERFORMANCE, LANDSCAPE_SUMMARY } from './outcomes'
export { RECENT_ACTIVITY } from './activity'
export { IMPACT_METRICS, getImpactMetricsByPillar } from './impact'
export { LANDSCAPE_CENTER, LANDSCAPE_LAYERS, LANDSCAPE_LAYER_META } from './landscape'
export { EVIDENCE_RECORDS, getEvidenceById } from './evidence'
export { RISK_REGISTER, RISK_CATEGORY_LABELS } from './risks'
export { GOVERNANCE_MEMBERS, GOVERNANCE_PROCESS } from './governance'
export { REPORTS, REPORT_STATUS_LABELS } from './reports'
export { ADDITIONALITY_SCENARIOS } from './additionality'
