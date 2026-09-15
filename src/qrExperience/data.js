// ── QR → Experience batch: mock experience config ───────────────────────────
// This batch demonstrates the client's reframed product: a brand/community
// owns the consumer-facing experience, ForestOS is the trust/verification
// layer underneath it. `experiences.majani` is the first demonstration
// experience — not the whole platform renamed "Majani".
//
// Deliberately shaped so a second brand (a football club, an airline, a
// hotel) is a new key here, not a new route or a new set of screens — see
// `EXPERIENCES` below. Only `majani` is implemented.
//
// Real data, not invented geography: the batch this experience verifies is
// `resolveBatch('921')` — the actual Nyashinski × ForestOS record in
// `src/lib/batchChain.js` (Mariashoni Block, South West Mau, EUDR-verified,
// field + satellite checked). This module only adds the consumer-facing copy,
// participation/reward framing and mock passport state around that real
// record — it does not re-describe the land.

import { resolveBatch } from '../lib/mock'
import { BRANDS } from '../lib/brands'

const NYASHINSKI_BATCH_ID = '921'

export const EXPERIENCES = {
  majani: {
    id: 'majani',
    communityName: 'Majani Passport',
    poweredBy: 'ForestOS',
    theme: 'tenant-majani',
    brand: BRANDS.nyashinski,
    getBatch: () => resolveBatch(NYASHINSKI_BATCH_ID),
    media: {
      scanLoop: '/media/tea-pour.webm',
      scanPoster: '/media/tea-pour-poster.jpg',
      storyLoop: '/media/forest1.webm',
      storyPoster: '/media/forest1-poster.jpg',
      originPhoto: '/media/forests/mau.webp',
      originPhotoFallback: '/media/forests/mau.jpg',
      originPhotoAlt: 'South West Mau forest canopy above the Mariashoni buffer zone.',
    },
    copy: {
      scanKicker: 'MAJANI PASSPORT',
      scanHeadline: 'A new experience is waiting.',
      scanBody: 'Scan. Verify. Discover. Become part of the story.',
      verifyHeadline: 'This tin is the real thing.',
      verifyBody:
        'Every I.D TAICHI Guardian Edition tin carries a batch checked against the forest it claims to protect.',
      discoverEyebrow: 'This story starts here',
      discoverHeadline: 'A product can have an origin. This one has a story.',
      discoverBeats: ['People.', 'Landscape.', 'Work.', 'Conservation.'],
      discoverClose: 'Now discover where yours begins.',
      proofHeadline: 'Now see the proof',
      participateHeadline: "Your story doesn't end here.",
      participateSub: 'You can take part.',
      participateBody: 'Every verified experience can become participation.',
      participateActionLabel: 'Explore the Mariashoni conservation story',
      earnHeadline: 'You unlocked something',
      earnBadgeLabel: 'Landscape Explorer',
      belongHeadline: 'Your Majani Passport',
      belongBody:
        "The record stays here if you want to go deeper. Everything else, new drops, the next Road to COP32 milestone, the Majani community, lives with Nyashinski.",
    },
    // TODO: swap for Nyashinski's real Instagram once confirmed — placeholder
    // Spotify link stands in for now (verified: open.spotify.com/artist/7KY9NaOVRmptl8vlpVomi6).
    belongCta: {
      label: 'Listen on Spotify',
      href: 'https://open.spotify.com/artist/7KY9NaOVRmptl8vlpVomi6',
    },
    collection: {
      seriesLabel: 'Road to COP32 — Guardian Series',
      totalStamps: 6,
      stampGlyphs: ['leaf', 'sprout', 'trees', 'mountain', 'droplet', 'sun'],
      tierLabel: 'Guardian',
    },
  },
}

export function resolveExperience(id) {
  return EXPERIENCES[id] ?? EXPERIENCES.majani
}

/** A fresh, empty passport for one browser session. Session-only, no backend. */
export function createPassport() {
  return {
    stamps: [],
    experiences: 0,
    conservationActions: 0,
  }
}

/** Append a stamp for the batch just verified. Returns a new passport (immutable). */
export function addStamp(passport, batchId) {
  const stampIndex = passport.stamps.length
  return {
    ...passport,
    stamps: [
      ...passport.stamps,
      {
        batchId,
        earnedAt: new Date().toISOString(),
        glyphIndex: stampIndex % EXPERIENCES.majani.collection.stampGlyphs.length,
      },
    ],
    experiences: passport.experiences + 1,
    conservationActions: passport.conservationActions + 1,
  }
}
