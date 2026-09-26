// DEMO DATA — see src/lib/contracts/offtaker.js (`CollectionCentre`).
//
// The NTZDC collection centres batches are delivered through. Names match
// `BELT_BLOCKS[].collectionCentres` (lib/platformData.js) and each batch's
// `plot.centre` (lib/batchChain.js); coordinates are the demo centre points
// already used on the public site, not surveyed locations. `segmentIds` /
// `landscapeFeatureIds` are the join to the buffer programme: a centre with
// none is honestly shown as "no verified conservation programme linked yet".

/** @type {import('../../lib/contracts/offtaker').CollectionCentre[]} */
export const COLLECTION_CENTRES = [
  {
    id: 'CC-KPT',
    name: 'Kiptunga',
    blockId: 'KPT',
    beltBlockId: 'mau',
    zone: 'South West Mau',
    factory: 'Kiptunga Tea Factory',
    lat: -0.415,
    lon: 35.618,
    segmentIds: ['seg-01', 'seg-02'],
    landscapeFeatureIds: ['conservation-kiptunga'],
  },
  {
    id: 'CC-NES',
    name: 'Nessuit',
    blockId: 'NES',
    beltBlockId: 'mau',
    zone: 'South West Mau',
    factory: 'Nessuit Tea Factory',
    lat: -0.523,
    lon: 35.702,
    segmentIds: ['seg-03'],
    landscapeFeatureIds: [],
  },
  {
    id: 'CC-MAR',
    name: 'Mariashoni',
    blockId: 'MAR',
    beltBlockId: 'mau',
    zone: 'South West Mau',
    factory: 'Mariashoni Tea Factory',
    lat: -0.552,
    lon: 35.548,
    segmentIds: [],
    landscapeFeatureIds: [],
  },
  {
    id: 'CC-TIN',
    name: 'Tinet',
    blockId: 'TIN',
    beltBlockId: 'mau',
    zone: 'South West Mau',
    factory: 'Kiptunga Tea Factory',
    lat: -0.648,
    lon: 35.502,
    segmentIds: ['seg-04', 'seg-05'],
    landscapeFeatureIds: ['conservation-kilombe'],
  },
  {
    id: 'CC-KAN',
    name: 'Kangaita',
    blockId: 'KAN',
    beltBlockId: 'mt-kenya',
    zone: 'Mount Kenya East',
    factory: 'Kangaita Tea Factory',
    lat: -0.489,
    lon: 37.291,
    segmentIds: [],
    landscapeFeatureIds: [],
  },
  {
    id: 'CC-WAN',
    name: 'Wanjohi',
    blockId: 'WAN',
    beltBlockId: 'aberdares',
    zone: 'Aberdare Range',
    factory: 'Wanjohi Tea Factory',
    lat: -0.402,
    lon: 36.612,
    segmentIds: [],
    landscapeFeatureIds: [],
  },
  {
    id: 'CC-KAP',
    name: 'Kapsara',
    blockId: 'KAP',
    beltBlockId: 'cherangany',
    zone: 'Cherangany Escarpment',
    factory: 'Kapsara Tea Factory',
    lat: 1.042,
    lon: 35.402,
    segmentIds: [],
    landscapeFeatureIds: [],
  },
]

export function getCentre(id) {
  return COLLECTION_CENTRES.find((centre) => centre.id === id) ?? null
}

/** The centre a batch was delivered through, joined on its block id. */
export function centreForBatch(record) {
  return COLLECTION_CENTRES.find((centre) => centre.blockId === record.block.id) ?? null
}
