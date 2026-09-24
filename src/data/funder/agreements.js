// DEMO DATA — see src/lib/contracts/programme.js (`FundingAgreement`).
//
// Two funders on one programme, each funding different work — so outputs
// attribute *directly* (expenditure → allocation → agreement), not pro-rata.
// Every amount, tranche and restriction is illustrative. Funder A's terms in
// particular are placeholders until the ABSA agreement is confirmed.

/** @type {Array<import('../../lib/contracts/programme').FundingAgreement & { isIllustrative: boolean, label: string }>} */
export const FUNDING_AGREEMENTS = [
  {
    id: 'agr-funder-a',
    label: 'Buffer belt establishment contribution',
    funderOrgId: 'org-funder-a',
    programmeId: 'prg-ntz-swm',
    type: 'csr',
    amountKes: 18_000_000,
    signedDate: '2026-02-20',
    period: { start: '2026-03-01', end: '2027-12-31' },
    isIllustrative: true,
    restrictions: [
      'Ring-fenced to buffer-belt establishment in South West Mau (components B.1, B.2 and C)',
      'Tranche 2 released on verified establishment of the first 30 ha',
      'At most 6% of the contribution on monitoring and coordination',
    ],
    tranches: [
      { id: 'trn-a-1', milestone: 'Agreement signed', plannedDate: '2026-03-15', plannedKes: 9_000_000, receivedDate: '2026-03-20', receivedKes: 9_000_000 },
      { id: 'trn-a-2', milestone: 'First 30 ha verified as established', plannedDate: '2026-09-30', plannedKes: 5_400_000, receivedDate: null, receivedKes: null },
      { id: 'trn-a-3', milestone: '12-month survival report accepted', plannedDate: '2027-04-30', plannedKes: 3_600_000, receivedDate: null, receivedKes: null },
    ],
    allocations: [
      {
        id: 'alc-a-tea',
        label: 'Tea infilling of buffer gaps',
        componentId: 'cmp-buffer',
        budgetKes: 6_000_000,
        allocatedKes: 5_000_000,
        outputs: ['Gaps in SEG-01 and SEG-02 infilled with tea'],
        outcomeIds: [],
      },
      {
        id: 'alc-a-fuelwood',
        label: 'Fuelwood buffer plantations',
        componentId: 'cmp-buffer',
        budgetKes: 5_000_000,
        allocatedKes: 4_000_000,
        outputs: ['Fuelwood plantations on the Nessuit spur and the Block C community edge'],
        outcomeIds: [],
      },
      {
        id: 'alc-a-indigenous',
        label: 'Indigenous planting on sensitive sites',
        componentId: 'cmp-restoration',
        budgetKes: 4_000_000,
        allocatedKes: 3_000_000,
        outputs: ['Indigenous planting on the Kilombe ridge ESA strip'],
        outcomeIds: [],
      },
      {
        id: 'alc-a-apiary',
        label: 'Apiaries for buffer households',
        componentId: 'cmp-livelihoods',
        budgetKes: 2_000_000,
        allocatedKes: 1_500_000,
        outputs: ['Hives and training for three household groups'],
        outcomeIds: [],
      },
      {
        id: 'alc-a-monitoring',
        label: 'Survival monitoring & verification',
        componentId: 'cmp-monitoring',
        budgetKes: 1_000_000,
        allocatedKes: 800_000,
        outputs: ['3-month survival counts on funded sites'],
        outcomeIds: [],
      },
    ],
    disclosurePolicyId: 'dp-funder',
  },
  {
    id: 'agr-funder-b',
    label: 'Conservation capital commitment',
    funderOrgId: 'org-funder-b',
    programmeId: 'prg-ntz-swm',
    type: 'investment',
    amountKes: 50_000_000,
    signedDate: '2026-01-15',
    period: { start: '2026-01-15', end: '2028-12-31' },
    isIllustrative: true,
    restrictions: ['Programme-wide; no ring-fencing beyond the agreed use-of-funds plan'],
    tranches: [
      { id: 'trn-b-1', milestone: 'Commitment confirmed', plannedDate: '2026-01-31', plannedKes: 25_000_000, receivedDate: '2026-02-04', receivedKes: 25_000_000 },
      { id: 'trn-b-2', milestone: 'H1 independent verification signed off', plannedDate: '2026-07-31', plannedKes: 15_000_000, receivedDate: '2026-08-06', receivedKes: 15_000_000 },
      { id: 'trn-b-3', milestone: 'Full-cycle monitoring pass', plannedDate: '2027-01-31', plannedKes: 10_000_000, receivedDate: null, receivedKes: null },
    ],
    // The original investor-console budget categories, now allocations of
    // this one agreement. Ids stay the same so the ledger rows still match.
    allocations: [
      {
        id: 'conservation-operations',
        label: 'Conservation operations',
        componentId: 'cmp-protection',
        budgetKes: 12_000_000,
        allocatedKes: 11_000_000,
        outputs: ['Buffer-zone patrols across the full project boundary', 'Sector 4 compliance audit, 214 plot checks'],
        outcomeIds: ['conservation', 'compliance'],
      },
      {
        id: 'farmer-incentives',
        label: 'Farmer & community incentives',
        componentId: 'cmp-livelihoods',
        budgetKes: 10_000_000,
        allocatedKes: 9_000_000,
        outputs: ['Farmers onboarded with GPS-mapped plots', 'Q2 and Q3 incentive tranches paid to verified participants'],
        outcomeIds: ['participation', 'compliance'],
      },
      {
        id: 'restoration',
        label: 'Restoration',
        componentId: 'cmp-restoration',
        budgetKes: 8_000_000,
        allocatedKes: 6_400_000,
        outputs: ['Block E nursery established', 'Seedlings outplanted in Block E'],
        outcomeIds: ['conservation'],
      },
      {
        id: 'monitoring-verification',
        label: 'Monitoring & verification',
        componentId: 'cmp-monitoring',
        budgetKes: 7_000_000,
        allocatedKes: 6_600_000,
        outputs: ['Conservation boundary re-surveyed (v3)', 'H1 independent verification signed off'],
        outcomeIds: ['conservation', 'evidence-coverage'],
      },
      {
        id: 'technology-data',
        label: 'Technology & data',
        componentId: 'cmp-monitoring',
        budgetKes: 7_000_000,
        allocatedKes: 5_600_000,
        outputs: ['Canopy composite across the monitored landscape', 'Field data capture app in use'],
        outcomeIds: ['landscape', 'evidence-coverage'],
      },
      {
        id: 'programme-management',
        label: 'Programme management',
        componentId: 'cmp-management',
        budgetKes: 6_000_000,
        allocatedKes: 5_400_000,
        outputs: ['Programme coordination and reporting'],
        outcomeIds: [],
      },
    ],
    disclosurePolicyId: 'dp-funder',
  },
]

/** Contributions outside ForestOS funding agreements — shown as programme context only. */
export const IN_KIND_CONTRIBUTIONS = [
  { orgId: 'org-county', label: 'County government', type: 'In kind (extension staff, road access)', amountKes: 12_000_000 },
]

export function agreementsForOrg(orgId) {
  return FUNDING_AGREEMENTS.filter((agreement) => agreement.funderOrgId === orgId)
}
