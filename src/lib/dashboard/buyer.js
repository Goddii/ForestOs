// Buyer / Brand view — aggregates over the buyer's direct-sold (branded)
// batches only. Auction volume is never included. No farmer names, phone
// numbers, or IDs appear anywhere in this view — only aggregate counts.
// Derived from the shared canonical chain in `lib/batchChain.js`.

import { brandedBatches } from '../batchChain'
import { SATELLITE } from '../dashboardData'

export const BUYER = {
  name: 'Rift Valley Tea Co.',
  role: 'Buyer & Brand',
  period: '2026 main crop',
}

/** The buyer's own direct-sold batches — auction volume is never in scope. */
function buyerBatches() {
  return brandedBatches().filter((b) => b.brand === BUYER.name)
}

/** Everything the Conservation Passport screen needs, computed from branded batches. */
export function buyerPassport() {
  const batches = buyerBatches()
  const sum = (pick) => batches.reduce((s, b) => s + pick(b), 0)

  const volumeKg = sum((b) => b.volumeKg)
  const farmersRepresented = sum((b) => b.community.farmersRepresented)
  const pluckers = sum((b) => b.harvest.pluckers)
  const bufferHa = sum((b) => b.hectaresPreserved ?? 0)
  const carbonTonnesCo2 = sum((b) => b.carbonTonnesCo2 ?? 0)

  // Distinct source blocks, with the buyer's volume attributed to each.
  const blockMap = new Map()
  for (const b of batches) {
    const key = b.block.id
    const entry = blockMap.get(key) ?? {
      id: key,
      name: b.block.name,
      bufferZone: b.block.bufferZone,
      region: b.land.region,
      volumeKg: 0,
      covenantHa: b.block.covenantHa,
      patrolsThisMonth: b.block.patrolsThisMonth,
      seedlingsPlanted: b.block.seedlingsPlanted,
    }
    entry.volumeKg += b.volumeKg
    blockMap.set(key, entry)
  }
  const blocks = [...blockMap.values()].sort((a, b) => b.volumeKg - a.volumeKg)

  const wMean = (pick) => sum((b) => pick(b) * b.volumeKg) / (volumeKg || 1)

  return {
    batchCount: batches.length,
    volumeKg,
    farmersRepresented,
    pluckers,
    bufferHa: +bufferHa.toFixed(1),
    carbonTonnesCo2,
    blocks,
    bufferZones: [...new Set(batches.map((b) => b.block.bufferZone))],
    waterTowers: [...new Set(batches.flatMap((b) => b.land.waterTowers))],
    premiumKesPerKg: +wMean((b) => b.premiumKesPerKg).toFixed(1),
    community: {
      farmersRepresented,
      pluckers,
      womenPluckersPct: Math.round(wMean((b) => b.community.womenPluckersPct)),
      paidMobileMoneyPct: Math.round(wMean((b) => b.community.paidMobileMoneyPct)),
      settledSameWeekPct: Math.round(wMean((b) => b.community.settledSameWeekPct)),
    },
    conservation: {
      covenantHa: blocks.reduce((s, b) => s + b.covenantHa, 0),
      patrolsThisMonth: blocks.reduce((s, b) => s + b.patrolsThisMonth, 0),
      seedlingsPlanted: blocks.reduce((s, b) => s + b.seedlingsPlanted, 0),
    },
    environment: {
      ndviCurrent: +wMean((b) => b.plot.ndvi).toFixed(2),
      ndviBaseline: SATELLITE.ndvi.baseline,
      ndviSeries: SATELLITE.ndvi.series,
      ndviQuarters: SATELLITE.ndvi.quarters,
      carbonTonnesCo2,
      carbonPerHectareTonnes: SATELLITE.carbon.perHectareTonnes,
      waterChangePct: SATELLITE.water.changePct,
    },
    verifications: batches.map((b) => ({
      id: b.id,
      plotId: b.plot.id,
      standard: b.verification.standard,
      status: b.verification.status,
      field: b.verification.field,
      satellite: b.verification.satellite,
      timestamp: b.verification.timestamp,
      reference: b.verification.reference,
    })),
  }
}

/** The downloadable ESG report: hectares protected, carbon stored, verification. */
export function buyerEsgReport() {
  const batches = buyerBatches()
  const allVerified = batches.every((b) => b.verification.status === 'Verified')

  const byBlock = new Map()
  for (const b of batches) {
    const entry = byBlock.get(b.block.id) ?? { block: b.block.name, hectares: 0, carbonTonnesCo2: 0, verified: true }
    entry.hectares = +(entry.hectares + (b.hectaresPreserved ?? 0)).toFixed(1)
    entry.carbonTonnesCo2 += b.carbonTonnesCo2 ?? 0
    entry.verified = entry.verified && b.verification.status === 'Verified'
    byBlock.set(b.block.id, entry)
  }

  return {
    brand: BUYER.name,
    period: BUYER.period,
    batchCount: batches.length,
    volumeKg: batches.reduce((s, b) => s + b.volumeKg, 0),
    hectaresProtected: +batches.reduce((s, b) => s + (b.hectaresPreserved ?? 0), 0).toFixed(1),
    carbonTonnesCo2: batches.reduce((s, b) => s + (b.carbonTonnesCo2 ?? 0), 0),
    bufferZones: [...new Set(batches.map((b) => b.block.bufferZone))],
    verification: {
      standard: 'EUDR — Deforestation-Free',
      status: allVerified ? 'Verified' : 'Partially verified',
      field: allVerified ? 'Verified' : 'Incomplete',
      satellite: allVerified ? 'Verified' : 'Incomplete',
    },
    lines: [...byBlock.values()].map((l) => ({
      block: l.block,
      hectares: l.hectares,
      carbonTonnesCo2: l.carbonTonnesCo2,
      verification: l.verified ? 'Verified' : 'Partial',
    })),
  }
}
