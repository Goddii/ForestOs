// Mock data for the ESG Capital Manager view. Illustrative only — figures in
// KES, no real fund. USD mock figures converted at KES 129 / USD.
const KES_PER_USD = 129

export const ESG = {
  fund: {
    committedKes: 12_000_000 * KES_PER_USD,
    deployedKes: 7_450_000 * KES_PER_USD,
    vintage: '2023',
    programs: [
      { name: 'Buffer covenant payments', allocationPct: 38, deployedKes: 3_100_000 * KES_PER_USD },
      { name: 'Satellite MRV & verification', allocationPct: 18, deployedKes: 1_420_000 * KES_PER_USD },
      { name: 'Collection & processing infra', allocationPct: 22, deployedKes: 1_680_000 * KES_PER_USD },
      { name: 'Farmer training & extension', allocationPct: 12, deployedKes: 780_000 * KES_PER_USD },
      { name: 'Fund operations', allocationPct: 10, deployedKes: 470_000 * KES_PER_USD },
    ],
  },

  drawdowns: [
    { id: 'DD-14', date: '2026-09-01', amountKes: 900_000 * KES_PER_USD, purpose: 'Q3 buffer covenant tranche', status: 'scheduled' },
    { id: 'DD-13', date: '2026-06-03', amountKes: 1_100_000 * KES_PER_USD, purpose: 'Nessuit processing line', status: 'drawn' },
    { id: 'DD-12', date: '2026-03-04', amountKes: 850_000 * KES_PER_USD, purpose: 'Q1 covenant + MRV', status: 'drawn' },
    { id: 'DD-11', date: '2025-12-02', amountKes: 1_000_000 * KES_PER_USD, purpose: 'Sentinel tasking + audit', status: 'drawn' },
    { id: 'DD-15', date: '2026-12-01', amountKes: 950_000 * KES_PER_USD, purpose: 'Q4 covenant tranche', status: 'pending' },
  ],
  cumulativeDrawnKesM: [2.0, 2.85, 3.85, 4.95, 6.35, 7.45].map((m) => m * KES_PER_USD),

  recovery: {
    ndviCurrent: 0.71,
    ndviBaseline: 0.58,
    hectaresRecovered: 1240,
    carbonTonnesCo2: 486_000,
    note: 'Belt-wide recovery attributable to the fund’s covenant area, verified against the 2020 EUDR baseline.',
  },

  auditLog: [
    { id: 'AL-231', ts: '2026-09-06 04:12', category: 'MRV', ref: 'NDVI-2026Q3', detail: 'Quarterly NDVI composite verified · sector mean 0.71', verifier: 'Node A · Sentinel-2' },
    { id: 'AL-230', ts: '2026-09-03 16:40', category: 'Payment', ref: 'COV-2609', detail: 'Buffer covenant disbursement reconciled · 1,240 payees', verifier: 'Node B · M-Pesa audit' },
    { id: 'AL-229', ts: '2026-08-30 11:07', category: 'Certificate', ref: 'EUDR-C-118', detail: 'Plot audit certificate rev C issued · Kiptunga Block', verifier: 'Node A' },
    { id: 'AL-228', ts: '2026-08-24 09:20', category: 'Drawdown', ref: 'DD-13', detail: 'Capital drawdown DD-13 released against milestone M4', verifier: 'Fund admin' },
    { id: 'AL-227', ts: '2026-08-18 22:41', category: 'Alert', ref: 'ENC-2288', detail: 'Encroachment signal reconciled — 0.2 ha, replanted', verifier: 'Node A · ranger log' },
    { id: 'AL-226', ts: '2026-08-11 07:55', category: 'MRV', ref: 'CARBON-2026H1', detail: 'Above-ground biomass estimate refreshed · 486 ktCO₂e', verifier: 'Node C · allometric' },
  ],
}
