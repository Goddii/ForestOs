// DEMO DATA — see src/lib/contracts/programme.js (`Programme`,
// `ProgrammeComponent`, `Indicator`).
//
// The component structure follows how NTZDC has historically designed buffer
// programmes (GZDSP: buffer-belt tea and fuelwood, indigenous restoration,
// livelihoods, management — audit §2.2). Every target below is illustrative,
// not an agreed NTZDC or funder target.

/** The console's fixed "today" — keeps overdue/scheduled states deterministic in the demo. */
export const AS_OF = '2026-09-24'

/** @type {import('../../lib/contracts/programme').Programme & Record<string, string>} */
export const PROGRAMME = {
  id: 'prg-ntz-swm',
  implementerOrgId: 'org-ntzdc',
  name: 'Nyayo Tea Zone buffer programme, South West Mau',
  location: 'Kiptunga & Kilombe, South West Mau',
  status: 'active',
  startDate: '2026-01-01',
  endDate: '2028-12-31',
  goal: 'Protect the South West Mau forest edge by consolidating the ~100 m tea-and-trees buffer belt, restoring indigenous cover on sensitive sites, and improving the livelihoods of forest-adjacent households.',
  currency: 'KES',
}

/** @type {import('../../lib/contracts/programme').ProgrammeComponent[]} */
export const COMPONENTS = [
  { id: 'cmp-buffer', code: 'B.1', title: 'Buffer belt consolidation: tea and fuelwood' },
  { id: 'cmp-restoration', code: 'B.2', title: 'Indigenous restoration in the buffer and sensitive areas' },
  { id: 'cmp-livelihoods', code: 'C', title: 'Forest-adjacent livelihoods' },
  { id: 'cmp-protection', code: 'P', title: 'Buffer protection and compliance' },
  { id: 'cmp-monitoring', code: 'M', title: 'Monitoring, verification and data' },
  { id: 'cmp-management', code: 'D', title: 'Programme management and coordination' },
]

const REPORTS_MOV = ['Activity records with GPS and photo evidence', 'Quarterly PIU progress report']

/** Output indicators — every value on the Progress page is computed from activity records. */
/** @type {import('../../lib/contracts/programme').Indicator[]} */
export const OUTPUT_INDICATORS = [
  {
    id: 'ind-tea-ha',
    componentId: 'cmp-buffer',
    level: 'output',
    label: 'Buffer gaps infilled with tea',
    unit: 'ha',
    target: 40,
    targetDate: '2027-12-31',
    method: 'GPS-walked polygon of each infilled gap, summed',
    meansOfVerification: REPORTS_MOV,
    disaggregations: ['buffer segment'],
  },
  {
    id: 'ind-fuelwood-ha',
    componentId: 'cmp-buffer',
    level: 'output',
    label: 'Fuelwood plantation established',
    unit: 'ha',
    target: 60,
    targetDate: '2027-12-31',
    method: 'GPS-walked polygon, split by tenure (NTZDC buffer / community land)',
    meansOfVerification: REPORTS_MOV,
    disaggregations: ['tenure'],
  },
  {
    id: 'ind-seedlings',
    componentId: 'cmp-restoration',
    level: 'output',
    label: 'Indigenous seedlings planted',
    unit: 'seedlings',
    target: 20_000,
    targetDate: '2027-12-31',
    method: 'Planting tally per site, reconciled to nursery dispatch notes',
    meansOfVerification: REPORTS_MOV,
    disaggregations: ['species', 'site'],
  },
  {
    id: 'ind-restored-ha',
    componentId: 'cmp-restoration',
    level: 'output',
    label: 'Area under indigenous restoration',
    unit: 'ha',
    target: 30,
    targetDate: '2027-12-31',
    method: 'GPS-walked polygon of planted area',
    meansOfVerification: REPORTS_MOV,
    disaggregations: ['site'],
  },
  {
    id: 'ind-hives',
    componentId: 'cmp-livelihoods',
    level: 'output',
    label: 'Beehives installed with trained groups',
    unit: 'hives',
    target: 200,
    targetDate: '2027-12-31',
    method: 'Hive register with GPS point per apiary',
    meansOfVerification: ['Group register', 'Hive GPS points', 'Training attendance'],
    disaggregations: ['group'],
  },
  {
    id: 'ind-households',
    componentId: 'cmp-livelihoods',
    level: 'output',
    label: 'Households supported',
    unit: 'households',
    target: 400,
    targetDate: '2027-12-31',
    method: 'Signed group register, de-duplicated across activities',
    meansOfVerification: ['Signed group register'],
    disaggregations: ['women-headed'],
  },
  {
    id: 'ind-patrols',
    componentId: 'cmp-protection',
    level: 'output',
    label: 'Buffer patrol runs',
    unit: 'runs',
    target: 480,
    targetDate: '2026-12-31',
    method: 'Patrol app runs with GPS track',
    meansOfVerification: ['Patrol log with GPS tracks'],
    disaggregations: ['segment'],
  },
  {
    id: 'ind-plots-audited',
    componentId: 'cmp-protection',
    level: 'output',
    label: 'Plots audited for buffer compliance',
    unit: 'plots',
    target: 1_200,
    targetDate: '2026-12-31',
    method: 'Structured field checklist per plot',
    meansOfVerification: ['Audit checklists'],
    disaggregations: ['sector'],
  },
  {
    id: 'ind-farmers-onboarded',
    componentId: 'cmp-protection',
    level: 'output',
    label: 'Farmers onboarded with mapped plots',
    unit: 'farmers',
    target: 2_000,
    targetDate: '2026-12-31',
    method: 'Participant register with plot GPS capture',
    meansOfVerification: ['Participant register', 'Plot GPS capture'],
    disaggregations: ['sex'],
  },
]

/**
 * Outcome indicators. A value exists only where a method has been applied;
 * everything else is shown as "not yet measurable", never estimated.
 * `source` says where a live value comes from.
 */
export const OUTCOME_INDICATORS = [
  {
    id: 'out-tree-survival-3m',
    level: 'outcome',
    label: 'Tree seedling survival at 3 months',
    unit: '%',
    target: 80,
    method: 'Pooled count of surviving ÷ planted seedlings across fuelwood and indigenous sites',
    source: { kind: 'survival', category: 'trees', monthsAfter: 3 },
  },
  {
    id: 'out-tea-establishment-3m',
    level: 'outcome',
    label: 'Tea plant establishment at 3 months',
    unit: '%',
    target: 90,
    method: 'Pooled count of established ÷ planted tea plants in infilled gaps',
    source: { kind: 'survival', category: 'tea', monthsAfter: 3 },
  },
  {
    id: 'out-tree-survival-12m',
    level: 'outcome',
    label: 'Tree seedling survival at 12 months',
    unit: '%',
    target: 70,
    method: 'Pooled count at the 12-month check',
    source: { kind: 'survival', category: 'trees', monthsAfter: 12 },
  },
  {
    id: 'out-compliance',
    level: 'outcome',
    label: 'Audited plots passing buffer compliance on first visit',
    unit: '%',
    target: 90,
    method: 'Field audit first-visit pass rate, Sector 4 (198 of 214 plots)',
    source: { kind: 'fixed', value: 93, evidenceId: 'ev-003', asOf: '2026-09-05' },
  },
]

/** Long-term goals — named so a funder can see them, never given a number. */
export const IMPACT_GOALS = [
  {
    id: 'imp-forest-cover',
    label: 'Forest cover along the South West Mau edge',
    status: 'Not yet measurable: needs a baseline and an independent evaluation',
  },
  {
    id: 'imp-incomes',
    label: 'Incomes of forest-adjacent households',
    status: 'Not yet measurable: the socio-economic baseline study has not been run',
  },
  {
    id: 'imp-water',
    label: 'Water and catchment condition',
    status: 'Not yet measurable: this programme has no hydrological monitoring',
  },
]

export function getComponent(id) {
  return COMPONENTS.find((component) => component.id === id) ?? null
}
