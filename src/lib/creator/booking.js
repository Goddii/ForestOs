/**
 * Whether a creator can book packs from a batch. Pure: the caller supplies
 * the batch's standing and what is already booked on it. Verification is
 * not a condition here on purpose: an unverified batch can be booked ahead,
 * and its pack code stays blocked until the checks complete
 * (lib/creator/experience.js packCodeState).
 *
 * @param {{
 *   batch: { madeTeaKg: number, deliveryFlagged: boolean },
 *   bookedKg: number,
 *   packs: number,
 *   packKg: number,
 * }} input
 * @returns {{ ok: boolean, reason: string | null, kg: number }}
 */
export function bookingCheck({ batch, bookedKg, packs, packKg }) {
  const kg = Math.round(packs * packKg * 10) / 10
  if (!Number.isInteger(packs) || packs <= 0) return { ok: false, reason: 'Enter a whole number of packs.', kg: 0 }
  if (batch.deliveryFlagged) {
    return { ok: false, reason: 'This batch’s delivery weigh-in is flagged. It can be booked once the reconciliation is closed.', kg }
  }
  const leftKg = Math.max(0, batch.madeTeaKg - bookedKg)
  if (kg > leftKg) return { ok: false, reason: `Only ${leftKg.toLocaleString('en-GB')} kg is left in this batch; ${kg.toLocaleString('en-GB')} kg was asked for.`, kg }
  return { ok: true, reason: null, kg }
}
