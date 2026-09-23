// ── Sponsoring brands & the belt standings ──────────────────────────────────
// Every forest block on the belt is adopted by a consumer brand that funds its
// plucker premium and conservation covenant. This module is the single source
// of truth for who those brands are, what they have funded, and how they rank
// against each other — read by the home page's Conservation Impact League
// (`components/home/`) and by the public batch brand-beat (`sections/
// BrandBeatSection`). Illustrative mock data; there is no ForestOS backend.

import { BELT_BLOCKS } from './platformData'

// Keyed by `brandId`. `BELT_BLOCKS[].brandId` and `batchChain` records point
// here. Only Nyashinski Tea is a real collaboration; the rest are plausible
// placeholders that keep the standings honest.
export const BRANDS = {
  nyashinski: {
    id: 'nyashinski',
    name: 'Nyashinski Tea',
    real: true,
    blockId: 'mau',
    product: 'I.D TAICHI — The Guardian Edition',
    line: 'Good music grows better forests.',
    attribution: 'Nyashinski',
    campaign: 'Road to COP32',
    retail: 'Carrefour Kenya',
    conservationKesPerPack: 75,
    conservationFundKes: 8_600_000,
    packsSold: 562_340,
    treesFunded: 12_450,
    trendHa: 312,
    image: '/media/brand/nyashinski-tin',
    imageAlt:
      'Majani × Nyashinski conservation tea — terracotta tin and refill pouch with a beaded Kenyan-flag band.',
    beatImage: '/media/brand/nyashinski-ritual',
    beatImageAlt:
      'Nyashinski I.D TAICHI Guardian Edition gift box on a stone ledge above the Mau tea landscape.',
  },
  riftValley: {
    id: 'riftValley',
    name: 'Rift Valley Tea Co.',
    real: false,
    blockId: 'aberdares',
    treesFunded: 9_200,
    trendHa: 90,
  },
  meridian: {
    id: 'meridian',
    name: 'Meridian Beverages',
    real: false,
    blockId: 'mt-kenya',
    treesFunded: 7_600,
    trendHa: 140,
  },
  nordicChai: {
    id: 'nordicChai',
    name: 'Nordic Chai Import',
    real: false,
    blockId: 'cherangany',
    treesFunded: 3_210,
    trendHa: 20,
  },
  westRidge: {
    id: 'westRidge',
    name: 'West Ridge Organics',
    real: false,
    blockId: 'mt-elgon',
    treesFunded: 1_980,
    trendHa: 0,
  },
}

// Road to COP32 — the shared milestone the league is racing toward.
// Host city and year confirmed by the user (Sept 2026); no specific day is
// published/confirmed. `dateLabel` (month/year) is what every display string
// uses. `date` is kept only as a countdown-timer anchor for `Cop32Milestone`
// (home page + batch brand beat) — the 1st of the confirmed month, not a
// claimed exact conference date; nothing renders it directly as a day.
export const COP32 = {
  label: 'Addis Ababa, Ethiopia',
  dateLabel: 'November 2027',
  date: '2027-11-01',
  packsGoal: 5_000_000,
  packsNow: 2_340_910,
  treesAtGoal: 50_000,
}

const blockById = (id) => BELT_BLOCKS.find((block) => block.id === id) ?? null

// Each brand joined to its block and ranked by trees funded — the league table.
export const STANDINGS = Object.values(BRANDS)
  .map((brand) => {
    const block = blockById(brand.blockId)
    return {
      brandId: brand.id,
      name: brand.name,
      real: brand.real,
      blockId: brand.blockId,
      sector: block?.sector ?? '',
      shortName: block?.shortName ?? '',
      hectares: block?.hectares ?? 0,
      counties: block?.counties.length ?? 0,
      centres: block?.collectionCentres.length ?? 0,
      treesFunded: brand.treesFunded,
      trendHa: brand.trendHa,
    }
  })
  .sort((a, b) => b.treesFunded - a.treesFunded)
  .map((entry, i) => ({ ...entry, rank: i + 1 }))

export const STANDINGS_TREES_MAX = Math.max(...STANDINGS.map((entry) => entry.treesFunded))

const standingByBrand = Object.fromEntries(STANDINGS.map((entry) => [entry.brandId, entry]))

/**
 * A brand's full profile — its `BRANDS` entry merged with its live standings
 * (rank, sector, hectares). Returns null for an unknown or absent brandId so
 * callers can fall back to a minimal, batch-derived brand beat.
 *
 * @param {string | null | undefined} brandId
 */
export function resolveBrand(brandId) {
  const brand = brandId ? BRANDS[brandId] : null
  if (!brand) return null
  return { ...brand, ...standingByBrand[brand.id] }
}
