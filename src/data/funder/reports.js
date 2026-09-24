// DEMO DATA — see src/lib/contracts/programme.js (`ReportInstance`).
//
// A report is a frozen snapshot issued by NTZDC after PIU review and PTC
// approval — its figures are stored at issue and never recomputed from live
// data, so a report can be reproduced exactly later. Downloads remain
// placeholders: no report-generation pipeline exists yet.

const approved = (piu, ptc, issued) => [
  { step: 'PIU review', at: piu },
  { step: 'PTC approval', at: ptc },
  { step: 'Issued to funder', at: issued },
]

/** @type {import('../../lib/contracts/programme').ReportInstance[]} */
export const REPORT_INSTANCES = [
  // Funder A (placeholder — ABSA)
  {
    id: 'rpt-a-h1',
    title: 'Contribution report',
    agreementIds: ['agr-funder-a'],
    period: 'H1 2026',
    coverage: '01 Mar – 30 Jun 2026',
    status: 'ready',
    approvals: approved('2026-07-15', '2026-07-22', '2026-07-25'),
    snapshot: [
      { label: 'Received', value: 'KSh 9.0M' },
      { label: 'Spent', value: 'KSh 5.8M' },
      { label: 'Tea infilled (verified)', value: '14.5 ha' },
      { label: 'Fuelwood established (verified)', value: '18 ha' },
      { label: 'Indigenous seedlings (verified)', value: '6,400' },
    ],
    dataCoverage: 'Funded activities, verification status, spend by allocation',
    evidenceCoveragePct: 100,
    dataSources: ['Field', 'GIS', 'Operations'],
  },
  {
    id: 'rpt-a-survival-3m',
    title: '3-month survival check summary',
    agreementIds: ['agr-funder-a'],
    period: 'Jul 2026',
    coverage: 'Plantings of April 2026',
    status: 'ready',
    approvals: approved('2026-07-27', '2026-07-29', '2026-07-30'),
    snapshot: [
      { label: 'Tree seedling survival (fuelwood)', value: '86%' },
      { label: 'Tea plant establishment', value: '91%' },
    ],
    dataCoverage: 'Survival counts for the SEG-02 tea infill and SEG-03 fuelwood plantings',
    evidenceCoveragePct: 100,
    dataSources: ['Field'],
  },
  {
    id: 'rpt-a-q3',
    title: 'Contribution report',
    agreementIds: ['agr-funder-a'],
    period: 'Q3 2026',
    coverage: '01 Jul – 30 Sep 2026',
    status: 'in_review',
    approvals: approved('2026-09-20', null, null),
    snapshot: null,
    dataCoverage: 'Funded activities, open corrections, overdue survival checks',
    evidenceCoveragePct: 71,
    dataSources: ['Field', 'GIS', 'Operations'],
  },

  // Funder B
  {
    id: 'report-quarterly-impact',
    title: 'Quarterly Impact Report',
    agreementIds: ['agr-funder-b'],
    period: 'Q3 2026',
    coverage: '01 Jul – 30 Sep 2026',
    status: 'ready',
    approvals: approved('2026-09-18', '2026-09-19', '2026-09-20'),
    snapshot: [
      { label: 'Deployed to date', value: 'KSh 31.4M' },
      { label: 'Farmers onboarded (verified)', value: '1,842' },
      { label: 'Plots audited (verified)', value: '214' },
    ],
    dataCoverage: 'All core outcomes, impact metrics, evidence summary',
    evidenceCoveragePct: 96,
    dataSources: ['Satellite', 'Field', 'GIS', 'Operations'],
  },
  {
    id: 'report-financial-deployment',
    title: 'Financial Deployment Report',
    agreementIds: ['agr-funder-b'],
    period: 'Q3 2026',
    coverage: '01 Jul – 30 Sep 2026',
    status: 'ready',
    approvals: approved('2026-09-18', '2026-09-19', '2026-09-20'),
    snapshot: [
      { label: 'Received', value: 'KSh 40.0M' },
      { label: 'Deployed', value: 'KSh 31.4M' },
      { label: 'With verified activity', value: 'KSh 29.8M' },
    ],
    dataCoverage: 'Use of funds, capital accountability chain, tranches',
    evidenceCoveragePct: 100,
    dataSources: ['Operations'],
  },
  {
    id: 'report-conservation-evidence',
    title: 'Conservation Evidence Package',
    agreementIds: ['agr-funder-b'],
    period: 'Q3 2026',
    coverage: '01 Jul – 30 Sep 2026',
    status: 'ready',
    approvals: approved('2026-09-16', '2026-09-17', '2026-09-18'),
    snapshot: null,
    dataCoverage: 'Evidence records, satellite + field audit + GIS',
    evidenceCoveragePct: 96,
    dataSources: ['Satellite', 'Field', 'GIS'],
  },
  {
    id: 'report-verification',
    title: 'Verification Report',
    agreementIds: ['agr-funder-b'],
    period: 'H1 2026',
    coverage: '01 Jan – 30 Jun 2026',
    status: 'in_review',
    approvals: approved('2026-09-22', null, null),
    snapshot: null,
    dataCoverage: 'Independent verification partner sample review, H1 2026',
    evidenceCoveragePct: 8,
    dataSources: ['Field', 'Satellite'],
  },
]

export const REPORT_STATUS_LABELS = {
  ready: 'Issued',
  in_review: 'In review',
  scheduled: 'Scheduled',
}
