// Sealed batches a creator can book for their packaged tea. Read from the
// same records the other portals use, so they never disagree: a lot is free
// only when no buyer holds it on a commitment (Offtaker Portal), no brand
// has it on a sourcing record (Brand Portal), it is not already a named
// product (branded or tenant packs), and it is not the auction pool.
// The workspace then removes batches this creator has already booked.

import { BATCH_CHAIN } from '../../lib/batchChain'
import { COMMITMENTS } from '../offtaker/commitments'
import { SOURCING } from '../brand/sourcing'
import { deliveryForBatch } from '../supply/deliveries'

const heldTraceIds = new Set([
  ...COMMITMENTS.filter((commitment) => commitment.status !== 'cancelled').flatMap((commitment) => commitment.batchTraceIds),
  ...SOURCING.map((record) => record.batchTraceId),
])

/** Unbranded, unheld lots, each with whether its delivery weigh-in is flagged. */
export const FREE_LOTS = BATCH_CHAIN.filter((record) => record.traceId && record.channel !== 'auction' && !record.product && !heldTraceIds.has(record.traceId)).map(
  (record) => ({
    batchId: record.id,
    traceId: record.traceId,
    deliveryFlagged: deliveryForBatch(record.traceId)?.varianceStatus === 'flagged',
  }),
)
