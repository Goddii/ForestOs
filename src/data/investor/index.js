// DEMO DATA — illustrative only. Barrel for the programme-wide investor data
// (landscape, evidence, risks, media). Funder-scoped figures — capital,
// tranches, progress, reports — come from the funder workspace
// (src/data/funder/workspace.js) instead, never from here.
// This flag drives the persistent "DEMO ENVIRONMENT" indicator in
// InvestorShell — flip it only once a real API backs every module below.
export const IS_DEMO_ENVIRONMENT = true

export { INVESTOR_PROJECT } from './project'
export { EXPENDITURES } from './expenditures'
export { MEDIA_ASSETS, SEEDLING_BATCHES, PROGRAMME_STORIES, getMediaById, getMediaForEvidence } from './media'
export { CANOPY_COMPARISONS, WAYBACK_TILE_URL } from './canopy'
export { CORE_OUTCOMES, CONSERVATION_PERFORMANCE, LANDSCAPE_SUMMARY } from './outcomes'
export { getRecentActivity } from './activity'
export { IMPACT_METRICS, getImpactMetricsByPillar } from './impact'
export { LANDSCAPE_CENTER, LANDSCAPE_LAYERS, LANDSCAPE_LAYER_META } from './landscape'
export { EVIDENCE_RECORDS, getEvidenceById } from './evidence'
export { RISK_REGISTER, RISK_CATEGORY_LABELS } from './risks'
export { GOVERNANCE_MEMBERS, GOVERNANCE_PROCESS } from './governance'
export { ADDITIONALITY_SCENARIOS } from './additionality'
