// ── Tenant-owned consumer experiences ────────────────────────────────────────
// A "tenant" is a community/brand front end that sits on top of ForestOS's
// verification, proof and conservation data — the shift the client asked for:
// the community owns the experience, ForestOS is the trust/data engine
// underneath it. `PartnerArchetypes` (home page) already names the intended
// tenant categories (musicians, football clubs, airlines, hotels, diaspora
// communities); this module is where one of those becomes a real, addressable
// front end instead of a roadmap line.
//
// A tenant is deliberately a different concept from a `brands.js` BRAND: a
// brand is "who sponsors this batch's covenant" (funds the premium, appears in
// the belt standings); a tenant is "whose front end is the visitor standing
// in" (palette, voice, the Earn/Belong programme). One brand can back a
// tenant experience (`ownerBrandId`), but not every brand has one yet.
//
// Illustrative mock data; there is no ForestOS backend. The `collection` field
// drives the Earn section's visual-only stamp/series state — nothing here is
// persisted per visitor. See `src/lib/contracts/shapes.js`'s `VisitorPassport`
// for the shape a real backend would use to make this durable per person.

export const TENANTS = {
  majani: {
    slug: 'majani',
    name: 'Majani Passport',
    ownerBrandId: 'nyashinski',
    voice: {
      kicker: 'MAJANI PASSPORT',
      tagline: 'Good music grows better forests.',
      scanBody: 'Scan confirmed against the batch printed on your tin.',
      verifyHeadline: 'This tin is the real thing.',
      verifyBody:
        'Every I.D TAICHI Guardian Edition tin carries a batch that was checked against the forest it claims to protect — not a slogan on a box.',
      discoverEyebrow: 'Where your batch stood',
      discoverHeadline: 'The ridge behind the record.',
      discoverBody:
        'Nyashinski adopted this sector of the Mau buffer belt. This is the actual ground your tin is tied to — the same plot, checked twice: once by a field officer, once by satellite.',
      proofHeadline: 'Every figure here traces to one record.',
      proofBody:
        'The GIS boundary, satellite imagery and verification chain for this batch live in ForestOS’s public record. Open to anyone. Unchanged by Majani or any other tenant.',
      participateEyebrow: 'The programme you just joined',
      participateHeadline: "You're part of the belt now.",
      participateBody:
        'Majani Passport members fund the plucker premium and the conservation covenant on this sector, one pack at a time — and get a standing invitation to Nyashinski’s Road to COP32 push.',
      earnHeadline: 'Your Passport just gained a stamp.',
      earnBody:
        'Every verified batch you scan adds a stamp. Collect the set and your status on the belt climbs with it.',
      belongHeadline: "There's more where this came from.",
      belongBody:
        'The record stays here if you want to go deeper. Everything else — new drops, the next Road to COP32 milestone, the Majani community — lives with Nyashinski.',
    },
    theme: 'tenant-majani',
    heroImage: '/media/brand/nyashinski-tin',
    heroImageAlt:
      'Majani × Nyashinski conservation tea — terracotta tin and refill pouch with a beaded Kenyan-flag band.',
    participateImage: '/media/brand/nyashinski-ritual',
    participateImageAlt:
      'Nyashinski I.D TAICHI Guardian Edition gift box on a stone ledge above the Mau tea landscape.',
    // The Instagram link this held (`instagram.com/nyashinski`) turned out to
    // be the wrong account, so it's removed rather than left pointing at
    // someone else's profile. `communityCta` is `null` until the correct
    // owned channel is decided — `TenantBelongSection` renders an honest
    // "coming soon" note instead of a CTA when this is unset.
    communityCta: null,
    // Verified against the artist's own Spotify search result — safe to
    // ship now even though the community link above still isn't.
    musicCta: {
      label: 'Listen on Spotify',
      href: 'https://open.spotify.com/artist/7KY9NaOVRmptl8vlpVomi6',
    },
    collection: {
      seriesLabel: 'Road to COP32 — Guardian Series',
      totalStamps: 6,
      // Deterministic, illustrative-only "which stamp is this" — derived from
      // the scanned batch id in TenantEarnSection, not stored anywhere.
      stampArt: ['🌱', '🌿', '🍃', '🌳', '🏔️', '💧'],
      tierLabel: 'Guardian',
      // The ladder this passport climbs as more batches are scanned — only
      // `tierLabel` (the current tier) is real state; the rest render as
      // upcoming. Visual-only, same scope note as the stamp grid above.
      tiers: ['Guardian', 'Keeper', 'Steward'],
    },
  },
}

/**
 * A tenant's full profile, or `null` for an unknown slug so callers can fall
 * back to the plain ForestOS `/batch/:id` view instead of rendering nothing.
 *
 * @param {string | null | undefined} slug
 */
export function resolveTenant(slug) {
  return (slug && TENANTS[slug]) || null
}
