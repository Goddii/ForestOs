// ── The visitor's own passport — durable across scans ───────────────────────
// Edwin's second major point: "The QR code should not just give someone
// information once. Every scan should progressively build something around
// that person: their profile, collection, status, rewards, experiences and
// community participation."
//
// The earlier prototype held the passport in React state for one visit, so a
// second scan started from zero and there was no "progressively" to show. This
// module makes it survive a reload, a new scan and a move between tenants, and
// implements the `VisitorPassport` shape already specified (as PROPOSED) in
// `contracts/shapes.js` — so a real backend replaces the storage line and
// nothing else.
//
// Still a prototype: `localStorage` is per-browser, so this is one device's
// passport, not an account. A real deployment needs `ownerContact` (a phone
// number — see the contract) because USSD and SMS scanners have no browser at
// all. That limitation is stated on screen rather than hidden.

import { makeVisitorPassportId } from './contracts/ids'

const STORAGE_KEY = 'forestos.visitor-passport.v1'

/**
 * Status ladder. Edwin asks for "status" as a first-class part of what a scan
 * builds; a tenant can rename these (`tenant.collection.tiers`) because the
 * community owns the experience, but the thresholds are ForestOS's so status
 * means the same thing everywhere.
 */
export const DEFAULT_TIERS = [
  { id: 'visitor', label: 'Visitor', atStamps: 0 },
  { id: 'explorer', label: 'Landscape Explorer', atStamps: 1 },
  { id: 'guardian', label: 'Guardian', atStamps: 3 },
  { id: 'custodian', label: 'Custodian', atStamps: 5 },
]

/** The tier held at `count` distinct verified products. */
export function tierFor(count, tiers = DEFAULT_TIERS) {
  return [...tiers].reverse().find((t) => count >= t.atStamps) ?? tiers[0]
}

/** The next tier up, or null at the top of the ladder. */
export function nextTierFor(count, tiers = DEFAULT_TIERS) {
  return tiers.find((t) => count < t.atStamps) ?? null
}

/** A fresh passport. The id is stable for this browser once created. */
export function createPassport() {
  const year = new Date().getFullYear()
  // No backend to allocate a sequence, so derive a stable-looking one.
  const seq = Math.floor(Math.random() * 99_000) + 1000
  return {
    passportId: makeVisitorPassportId(year, seq),
    createdAt: new Date().toISOString(),
    stamps: [],
  }
}

function isPassport(value) {
  return Boolean(value) && typeof value === 'object' && Array.isArray(value.stamps)
}

/**
 * Read the stored passport, or mint a new one. Every storage access is guarded:
 * private windows, blocked site data and thumbnail capture can all throw or
 * return nothing, and the experience has to render regardless.
 */
export function loadPassport() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (isPassport(parsed)) return parsed
    }
  } catch {
    // Unavailable or corrupt — fall through to a fresh in-memory passport.
  }
  return createPassport()
}

/** Persist, best-effort. A failed write must never break the journey. */
export function savePassport(passport) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(passport))
  } catch {
    // Session-only this visit; the UI states when nothing could be saved.
  }
  return passport
}

/** True when the browser will actually keep this passport. */
export function storageAvailable() {
  try {
    const probe = `${STORAGE_KEY}.probe`
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

/**
 * Record a scan. A batch already in the collection does not mint a second
 * stamp — it increments that stamp's `scans` and moves its `lastScanAt`, so a
 * re-scan is visible as a re-scan instead of inflating the collection. Returns
 * a new passport (immutable) plus what actually happened, which the Earn screen
 * needs in order to say "new" or "you've scanned this before" honestly.
 */
export function recordScan(passport, scan) {
  const { batchId, tenantSlug, brand = null, product = null } = scan
  const now = new Date().toISOString()
  const existing = passport.stamps.find(
    (s) => s.batchId === batchId && s.tenantSlug === tenantSlug,
  )

  if (existing) {
    return {
      passport: {
        ...passport,
        stamps: passport.stamps.map((s) =>
          s === existing ? { ...s, scans: (s.scans ?? 1) + 1, lastScanAt: now } : s,
        ),
      },
      isNew: false,
      stamp: existing,
    }
  }

  const stamp = {
    batchId,
    tenantSlug,
    brand,
    product,
    earnedAt: now,
    lastScanAt: now,
    scans: 1,
    glyphIndex: passport.stamps.length,
  }
  return {
    passport: { ...passport, stamps: [...passport.stamps, stamp] },
    isNew: true,
    stamp,
  }
}

/** Wipe the passport — the demo's "start over" control. */
export function resetPassport() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing stored to clear.
  }
  return createPassport()
}

/**
 * Everything the screens display, derived in one place so Earn, Belong and the
 * tenant sections cannot drift apart.
 *
 * `experiences` counts distinct verified products (the collection); `scans`
 * counts every scan including repeats — the two differ as soon as someone
 * re-scans, which is exactly the repeat engagement Edwin is asking us to show.
 */
export function passportStats(passport, tiers = DEFAULT_TIERS) {
  const stamps = passport.stamps ?? []
  const experiences = stamps.length
  const scans = stamps.reduce((sum, s) => sum + (s.scans ?? 1), 0)
  const tenants = [...new Set(stamps.map((s) => s.tenantSlug))]
  const brands = [...new Set(stamps.map((s) => s.brand).filter(Boolean))]
  const tier = tierFor(experiences, tiers)
  const next = nextTierFor(experiences, tiers)

  return {
    experiences,
    scans,
    repeatScans: scans - experiences,
    tenants,
    brands,
    communities: tenants.length,
    tier,
    nextTier: next,
    toNextTier: next ? next.atStamps - experiences : 0,
    // One conservation story discovered per distinct verified product.
    conservationActions: experiences,
  }
}
