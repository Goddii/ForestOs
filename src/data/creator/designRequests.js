// DEMO DATA — requests to the ForestOS design team for something no
// template covers: a custom QR experience, custom tea packaging, or both.
// The team designs the creative layer only; the verified batch record and
// its pack codes stay exactly as they are. Stages mirror the Brand Portal's
// design requests (data/brand/experiences.js). A backend would route these
// to the team's queue; in the demo they are seeds plus the session's own.

export { DESIGN_REQUEST_STAGES } from '../brand/experiences'

export const DESIGN_REQUEST_KINDS = {
  experience: 'QR experience',
  packaging: 'Tea packaging',
  both: 'Experience and packaging',
}

/** What can be asked for, by kind; each is something the team has built before. */
export const DESIGN_FEATURES = {
  experience: {
    music: 'Music player or playlist',
    community: 'Fan sign-up or event booking',
    collectible: 'Collectible stamps or member passport',
    video: 'Video story',
    landscape_map: 'Interactive landscape map',
  },
  packaging: {
    tin_artwork: 'Tin or pouch artwork',
    gift_box: 'Gift box or limited edition',
    batch_panel: 'Batch code panel design',
    merch_insert: 'Insert card or merch tie-in',
  },
}

/**
 * @typedef {Object} CreatorDesignRequest
 * @property {string} id
 * @property {'experience' | 'packaging' | 'both'} kind
 * @property {string} campaignId
 * @property {string} brief
 * @property {string[]} features
 * @property {string} references
 * @property {string} launchBy
 * @property {'received' | 'scoping' | 'in_design' | 'review' | 'delivered'} status
 * @property {string} submittedAt
 */

/** @type {CreatorDesignRequest[]} */
export const CREATOR_DESIGN_REQUESTS = [
  {
    id: 'dr-cr-01',
    kind: 'both',
    campaignId: 'cmp-anthem',
    brief: 'A limited Living Anthem tin with the chapter art on the lid, and a member passport that stamps a new chapter each time a fan scans a different batch.',
    features: ['collectible', 'music', 'tin_artwork', 'batch_panel'],
    references: 'The Living Anthem artwork; lyric portrait by Dante.',
    launchBy: '2026-11-20',
    status: 'in_design',
    submittedAt: '2026-09-10',
  },
]
