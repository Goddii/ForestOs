// Mock data for the Creator & Artist view. Illustrative only.

export const CREATOR = {
  commissionRatePct: 12,

  // Headline figures for the Creator & Artist Engine KPI grid. Royalty is the
  // artist's cut (paid YTD + pending); AOV is the average retail order value of
  // an edition; trees planted is the artist's attributed share of the buffer.
  royaltyKes: 1304000,
  unitsSold: 1119,
  aovKes: 9800,
  treesPlanted: 8900,

  campaigns: [
    {
      id: 'DROP-07',
      name: 'Origin Story — Ridge Line',
      channel: 'IG Reels + shelf tag',
      status: 'live',
      dropDate: '2026-08-24',
      editions: 500,
      sold: 431,
      scans: 8120,
      conversions: 690,
    },
    {
      id: 'DROP-06',
      name: 'Canopy Field Notes',
      channel: 'Newsletter',
      status: 'ended',
      dropDate: '2026-06-11',
      editions: 300,
      sold: 300,
      scans: 5400,
      conversions: 512,
    },
    {
      id: 'DROP-08',
      name: 'Water Tower Series',
      channel: 'Gallery pop-up',
      status: 'scheduled',
      dropDate: '2026-10-02',
      editions: 250,
      sold: 0,
      scans: 0,
      conversions: 0,
    },
    {
      id: 'DROP-05',
      name: 'First Flush Labels',
      channel: 'In-store',
      status: 'ended',
      dropDate: '2026-03-19',
      editions: 400,
      sold: 388,
      scans: 6200,
      conversions: 470,
    },
  ],

  audience: {
    totalScans: 19720,
    rangeLabel: 'last 90 days',
    trendK: [1.1, 1.6, 2.2, 2.6, 3.4, 3.9, 4.4, 4.6],
    cities: [
      { city: 'London', country: 'United Kingdom', scans: 6120, x: 46, y: 30 },
      { city: 'Berlin', country: 'Germany', scans: 3110, x: 51, y: 28 },
      { city: 'New York', country: 'United States', scans: 4880, x: 27, y: 33 },
      { city: 'Nairobi', country: 'Kenya', scans: 2600, x: 57.5, y: 58 },
      { city: 'Tokyo', country: 'Japan', scans: 3010, x: 84, y: 34 },
    ],
    dwell: [
      { stage: 'Drop landing', seconds: 18 },
      { stage: 'Artist statement', seconds: 39 },
      { stage: '3D proof map', seconds: 44 },
      { stage: 'Conservation record', seconds: 27 },
    ],
  },

  impact: {
    hectaresAttributed: 34.6,
    treesAttributed: 8900,
    canopyRecoveredPp: 9,
    waterLitresPerEdition: 240,
    cumulativeHa: [4.1, 8.0, 12.6, 17.4, 22.0, 27.1, 31.0, 34.6],
    note: 'Share of the Kiptunga Block buffer covenant funded by verified sales of this creator’s editions.',
  },

  // Messages the artist has published to the QR-scanning audience. Newest first.
  // `scanReach` is the number of tag scans the note has been served to so far;
  // a freshly published note starts at 0 (reach accrues as buyers scan).
  messages: [
    {
      id: 'MSG-04',
      body: 'Ridge Line is 86% gone. The final hundred prints carry the hand-numbered foil seal — and every one still funds three trees in the Kiptunga block.',
      publishedDate: '2026-08-29',
      scanReach: 5400,
    },
    {
      id: 'MSG-03',
      body: 'Field note from the Mau: the spur we replanted last season is closing canopy faster than the modellers predicted. Your editions paid for those 1,200 seedlings.',
      publishedDate: '2026-07-15',
      scanReach: 4120,
    },
    {
      id: 'MSG-02',
      body: 'Canopy Field Notes sold out in nine days — thank you. Water Tower Series opens at the gallery pop-up on 2 October; scan holders get first access.',
      publishedDate: '2026-06-20',
      scanReach: 3760,
    },
    {
      id: 'MSG-01',
      body: 'Every print in this collaboration is tied to a real hectare under a conservation covenant. Scan the tag on the back to find yours on the map.',
      publishedDate: '2026-03-19',
      scanReach: 2900,
    },
  ],

  earnings: {
    pendingKes: 184000,
    paidYtdKes: 1120000,
    nextPayout: '2026-09-15',
    breakdown: [
      { label: 'Edition commission (12%)', kes: 128000 },
      { label: 'Scan-through bonus', kes: 34000 },
      { label: 'Conservation match', kes: 22000 },
    ],
    payouts: [
      { id: 'PO-2609', date: '2026-08-15', amountKes: 210000, status: 'paid' },
      { id: 'PO-2607', date: '2026-07-15', amountKes: 176000, status: 'paid' },
      { id: 'PO-2611', date: '2026-09-15', amountKes: 184000, status: 'pending' },
    ],
  },
}
