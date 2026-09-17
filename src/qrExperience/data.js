// ── QR → Experience: the tenant-owned consumer experiences ──────────────────
// A brand or community owns the consumer-facing experience; ForestOS is the
// trust/verification layer underneath it. Edwin's framing: the person scanning
// does not think of themselves as a "consumer" — they are a Nyashinski fan, a
// football supporter, an airline customer, a hotel guest. They enter through
// something they already care about.
//
// Two experiences are implemented so that claim is demonstrated rather than
// asserted: `majani` (a musician's audience) and `rangers` (a club's
// supporters). They share every screen, every verification path and one
// visitor passport; they differ only in the config below. A third — an
// airline, a hotel, a luxury brand — is another key here.
//
// Real data, not invented geography: each experience verifies an actual record
// in `src/lib/batchChain.js`. This module only adds the consumer-facing copy,
// participation framing and collection labels around that record — it never
// re-describes the land.

import { resolveBatch } from '../lib/mock'
import { BRANDS } from '../lib/brands'

export const EXPERIENCES = {
  majani: {
    id: 'majani',
    batchId: '921',
    communityName: 'Majani Passport',
    // What the scanner already came for — not "customer".
    memberNoun: 'listener',
    poweredBy: 'ForestOS',
    theme: 'tenant-majani',
    brand: BRANDS.nyashinski,
    getBatch: () => resolveBatch('921'),
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

  rangers: {
    id: 'rangers',
    batchId: '733',
    // Kapsara Rangers FC is fictional on purpose — see the batch record's note
    // in `src/lib/batchChain.js`. A real club's identity on a mock
    // conservation record would be a false claim about a real organisation.
    communityName: 'Rangers Forest Club',
    memberNoun: 'supporter',
    poweredBy: 'ForestOS',
    theme: 'tenant-rangers',
    brand: null, // a tenant front end, not a belt-standings block sponsor
    getBatch: () => resolveBatch('733'),
    media: {
      scanLoop: '/media/tea-pour.webm',
      scanPoster: '/media/tea-pour-poster.jpg',
      storyLoop: '/media/forest1.webm',
      storyPoster: '/media/forest1-poster.jpg',
      originPhoto: '/media/forests/cherangany.webp',
      originPhotoFallback: '/media/forests/cherangany.jpg',
      originPhotoAlt: 'Cherangany Hills forest edge above the Kapsara buffer zone.',
    },
    copy: {
      scanKicker: 'RANGERS FOREST CLUB',
      scanHeadline: 'Matchday goes further.',
      scanBody: 'Scan your tin. See the ground the club is holding.',
      verifyHeadline: 'This tin is the real thing.',
      verifyBody:
        'Every Supporters’ Edition tin carries a batch checked against the forest the club adopted — not a badge printed on a box.',
      discoverEyebrow: 'The club’s ground',
      discoverHeadline: 'Every tin holds a piece of the Cherangany escarpment.',
      discoverBeats: ['Supporters.', 'Escarpment.', 'Pluckers.', 'Canopy.'],
      discoverClose: 'Now see the ground yours is tied to.',
      proofHeadline: 'Now see the proof',
      participateHeadline: 'The season doesn’t end at the whistle.',
      participateSub: 'You can take part.',
      participateBody: 'Every verified tin can become participation.',
      participateActionLabel: 'Explore the Kapsara conservation story',
      earnHeadline: 'You unlocked something',
      earnBadgeLabel: 'Terrace Guardian',
      belongHeadline: 'Your Rangers Forest Club card',
      belongBody:
        'The record stays here if you want to go deeper. Fixtures, the supporters’ forest total and next season’s edition live with the club.',
    },
    belongCta: {
      label: 'Back to the club',
      href: '/',
    },
    collection: {
      seriesLabel: 'Supporters’ Forest — 2026 Season',
      totalStamps: 6,
      stampGlyphs: ['leaf', 'sprout', 'trees', 'mountain', 'droplet', 'sun'],
      tierLabel: 'Terrace Guardian',
    },
  },
}

/**
 * The order "Scan another" walks. Each step is a real pack from a different
 * community, so a second scan demonstrates the thing Edwin actually asked for:
 * one passport that accumulates across communities, with the front end
 * changing while the verification layer underneath does not.
 */
export const SCAN_WALK = ['majani', 'rangers']

export function resolveExperience(id) {
  return EXPERIENCES[id] ?? EXPERIENCES.majani
}

/** The next experience in the walk, wrapping at the end. */
export function nextExperienceId(currentId) {
  const at = SCAN_WALK.indexOf(currentId)
  return SCAN_WALK[(at + 1) % SCAN_WALK.length]
}
