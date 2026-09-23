// DEMO DATA — illustrative only. See src/data/investor/types.js (`Report`).
// Downloads are placeholder actions — no report-generation pipeline exists
// yet (see build brief §19).

/** @type {import('./types').Report[]} */
export const REPORTS = [
  {
    id: 'report-quarterly-impact',
    title: 'Quarterly Impact Report',
    period: 'Q3 2026',
    coverage: '01 Jul – 30 Sep 2026',
    generatedDate: '2026-09-20',
    status: 'ready',
    dataCoverage: 'All core outcomes, impact metrics, evidence summary',
    evidenceCoveragePct: 96,
    dataSources: ['Satellite', 'Field', 'GIS', 'Operations'],
  },
  {
    id: 'report-financial-deployment',
    title: 'Financial Deployment Report',
    period: 'Q3 2026',
    coverage: '01 Jul – 30 Sep 2026',
    generatedDate: '2026-09-20',
    status: 'ready',
    dataCoverage: 'Use of funds, capital accountability chain, timeline',
    evidenceCoveragePct: 100,
    dataSources: ['Operations'],
  },
  {
    id: 'report-conservation-evidence',
    title: 'Conservation Evidence Package',
    period: 'Q3 2026',
    coverage: '01 Jul – 30 Sep 2026',
    generatedDate: '2026-09-18',
    status: 'ready',
    dataCoverage: '10 evidence records, satellite + field audit + GIS',
    evidenceCoveragePct: 96,
    dataSources: ['Satellite', 'Field', 'GIS'],
  },
  {
    id: 'report-verification',
    title: 'Verification Report',
    period: 'H1 2026',
    coverage: '01 Jan – 30 Jun 2026',
    generatedDate: '2026-09-22',
    status: 'in_review',
    dataCoverage: 'Independent verification partner sample review, H1 2026',
    evidenceCoveragePct: 8,
    dataSources: ['Field', 'Satellite'],
  },
  {
    id: 'report-esg-nature',
    title: 'ESG / Nature Metrics',
    period: 'Q3 2026',
    coverage: '01 Jul – 30 Sep 2026',
    generatedDate: '2026-09-19',
    status: 'ready',
    dataCoverage: 'Environmental, social, economic and governance pillar metrics',
    evidenceCoveragePct: 91,
    dataSources: ['Satellite', 'Field', 'GIS', 'Operations'],
  },
]

export const REPORT_STATUS_LABELS = {
  ready: 'Ready',
  in_review: 'In review',
  scheduled: 'Scheduled',
}
