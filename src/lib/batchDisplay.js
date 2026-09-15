// `toLegacyBatch` (see `lib/mock.js`) sets a batch's `region` to its block's
// own `region` field, which already reads "<Block name>, <area>" (e.g.
// "Kiptunga Block, South West Mau") — so pairing `block.name` with `region`
// verbatim repeats the block name. This strips that leading "<name>, "
// prefix when present, leaving just the area ("South West Mau").
export function regionOnly(batch) {
  const prefix = `${batch.block.name}, `
  return batch.region.startsWith(prefix) ? batch.region.slice(prefix.length) : batch.region
}
