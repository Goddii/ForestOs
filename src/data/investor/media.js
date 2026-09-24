// DEMO DATA — illustrative only. See src/data/investor/types.js
// (`MediaAsset`, `SeedlingBatch`, `ProgrammeStory`) for the shapes — the
// proposed hand-off contract for the backend's field-media store.
//
// Every photo below is a real, openly-licensed Wikimedia Commons image chosen
// to match its activity (resized into /public/media/investor) — NOT a photo
// of this programme. `isIllustrative` drives an "Illustrative photo" label on
// every rendering, and each asset carries the author/licence credit its
// licence requires. `showsPeople` flags images to replace with consented
// field photos before any public marketing use. When the field app uploads
// real geotagged captures, they replace these one-for-one by id.

const COMMONS = 'https://commons.wikimedia.org/wiki/File:'

/** @type {import('./types').MediaAsset[]} */
export const MEDIA_ASSETS = [
  {
    id: 'nursery-polybags',
    src: '/media/investor/nursery-polybags',
    width: 1200,
    height: 900,
    alt: 'Rows of tree seedlings growing in black polybags in a nursery',
    caption: 'Nursery stock in polybags ahead of outplanting',
    isIllustrative: true,
    credit: {
      author: 'NigerianScribe',
      license: 'CC0',
      url: `${COMMONS}Tree_seedlings_in_a_local_nursery,_Irawo,_Atisbo,_Oyo_State,_Nigeria.jpg`,
    },
  },
  {
    id: 'nursery-beds',
    src: '/media/investor/nursery-beds',
    width: 1200,
    height: 540,
    alt: 'Raised nursery beds of young tree seedlings with a species label',
    caption: 'Raised nursery beds, labelled by species',
    isIllustrative: true,
    credit: {
      author: 'Issaka2007',
      license: 'CC BY-SA 4.0',
      url: `${COMMONS}Millettia_(Millettia_thonningii)_seedlings_at_the_Forestry_Commission_nursery,_Ghana.jpg`,
    },
  },
  {
    id: 'seedling-trays',
    src: '/media/investor/seedling-trays',
    width: 1200,
    height: 900,
    alt: 'African wild olive seedlings in tube trays, ready for transport to the planting site',
    caption: 'Batch hardened off and ready for outplanting',
    isIllustrative: true,
    credit: {
      author: 'Forest and Kim Starr',
      license: 'CC BY 3.0 US',
      url: `${COMMONS}Starr-010330-0593-Olea_europaea_subsp_cuspidata-seedlings_in_dibble_tubes-Kahului-Maui_(24532103995).jpg`,
    },
  },
  {
    id: 'planting-pit',
    src: '/media/investor/planting-pit',
    width: 1200,
    height: 900,
    alt: 'A freshly dug planting hole in grassy ground',
    caption: 'Planting pits dug ahead of the rains',
    isIllustrative: true,
    credit: {
      author: "Peter O'Connor",
      license: 'CC BY-SA 2.0',
      url: `${COMMONS}I_dug_a_whole_hole!_(5542931744).jpg`,
    },
  },
  {
    id: 'site-preparation',
    src: '/media/investor/site-preparation',
    width: 1200,
    height: 900,
    alt: 'Community members gathered at a freshly dug restoration site in Kenya',
    caption: 'Community site-preparation day',
    isIllustrative: true,
    showsPeople: true,
    credit: {
      author: 'Caroletravis',
      license: 'CC BY-SA 4.0',
      url: `${COMMONS}Rachel_the_tireless_tree_planter,_Kenya_photo_2.jpg`,
    },
  },
  {
    id: 'seedling-planted',
    src: '/media/investor/seedling-planted',
    width: 1200,
    height: 900,
    alt: 'A newly planted seedling in red soil beside a marker flag',
    caption: 'Seedling planted and tagged for survival checks',
    isIllustrative: true,
    credit: {
      author: 'Wikimedia Commons uploader',
      license: 'Public domain',
      url: `${COMMONS}Newly_planted_tree.JPG`,
    },
  },
  {
    id: 'river-patrol',
    src: '/media/investor/river-patrol',
    width: 1200,
    height: 800,
    alt: 'Two community conservancy rangers paddling a dug-out canoe on patrol',
    caption: 'Community rangers on a buffer-zone river patrol',
    isIllustrative: true,
    showsPeople: true,
    credit: {
      author: 'Athuman Komora Garisse',
      license: 'CC BY-SA 4.0',
      url: `${COMMONS}Community_conservancy_Rangers_rowing_a_dug-out_canoe_during_patrol.jpg`,
    },
  },
  {
    id: 'tea-landscape',
    src: '/media/investor/tea-landscape',
    width: 1200,
    height: 803,
    alt: 'Smallholder tea gardens climbing a green valley below forest',
    caption: 'Smallholder tea at the forest edge',
    isIllustrative: true,
    credit: { author: 'Kamweti wa Mutu', license: 'CC BY-SA 4.0', url: `${COMMONS}Fresh_tea.jpg` },
  },
  {
    id: 'tea-pickers',
    src: '/media/investor/tea-pickers',
    width: 1200,
    height: 797,
    alt: 'Tea pickers with baskets working among tea bushes and shade trees near Kericho',
    caption: 'Participating farmers picking tea near Kericho',
    isIllustrative: true,
    showsPeople: true,
    credit: {
      author: 'Josep M. Gracia',
      license: 'CC BY-SA 4.0',
      url: `${COMMONS}KER_-_Tea_pickers_working_near_Kericho,_Kenya,_2012.jpg`,
    },
  },
  {
    id: 'mau-forest',
    src: '/media/investor/mau-forest',
    width: 1200,
    height: 800,
    alt: 'Tall montane forest trees in the Mau Forest',
    caption: 'Montane forest the buffer belt protects',
    isIllustrative: true,
    credit: { author: 'Kaa.rie', license: 'CC BY-SA 4.0', url: `${COMMONS}A_part_of_Mau_Forest.jpg` },
  },
  {
    id: 'farmer-training',
    src: '/media/investor/farmer-training',
    width: 1200,
    height: 797,
    alt: 'An extension officer training a group of women farmers in Nyando, Kenya',
    caption: 'Farmer training on conservation-compliant growing',
    isIllustrative: true,
    showsPeople: true,
    credit: {
      author: 'CGIAR Climate Change, Agriculture and Food Security',
      license: 'CC BY 2.0',
      url: `${COMMONS}Training_women_farmers_on_climate_smart_innovations_in_Nyando,_Kenya_(9417196732).jpg`,
    },
  },
]

// Seedling batch diaries — one batch's whole life on one timeline (Treedom's
// per-tree diary / Greenstand's periodic geotagged captures): nursery →
// land preparation → planting → survival checks. A stage that hasn't happened
// yet is `scheduled` with no photo and no metric — never a projected result.
/** @type {import('./types').SeedlingBatch[]} */
export const SEEDLING_BATCHES = [
  {
    id: 'batch-e-01',
    label: 'Batch E-01 — Block E',
    zoneId: 'conservation-kiptunga',
    species: ['Prunus africana', 'Croton megalocarpus', 'Juniperus procera'],
    quantity: 4_200,
    expenditureIds: ['exp-re-1', 'exp-re-2'],
    stages: [
      { stage: 'Nursery', date: '2026-05-12', status: 'done', mediaId: 'nursery-polybags', note: '4,200 seedlings raised from locally collected seed', evidenceId: 'ev-005' },
      { stage: 'Hardening off', date: '2026-08-10', status: 'done', mediaId: 'seedling-trays', note: 'Batch counted and hardened off for transport', evidenceId: 'ev-005' },
      { stage: 'Land preparation', date: '2026-08-20', status: 'done', mediaId: 'planting-pit', note: 'Planting pits dug across the Block E restoration strip', evidenceId: 'ev-005' },
      { stage: 'Planting', date: '2026-08-30', status: 'done', mediaId: 'seedling-planted', note: 'Outplanted and tagged for survival checks', evidenceId: 'ev-005' },
      { stage: '3-month survival check', date: '2026-11-30', status: 'scheduled', mediaId: null, note: 'Scheduled — survival count and photo set', evidenceId: null },
    ],
  },
  {
    id: 'batch-k-01',
    label: 'Batch K-01 — Kilombe ridge',
    zoneId: 'conservation-kilombe',
    species: ['Podocarpus latifolius', 'Prunus africana'],
    quantity: 2_600,
    expenditureIds: ['exp-re-3'],
    stages: [
      { stage: 'Nursery', date: '2026-07-01', status: 'done', mediaId: 'nursery-beds', note: '2,600 seedlings in raised beds, labelled by species', evidenceId: null },
      { stage: 'Land preparation', date: '2026-09-12', status: 'in_review', mediaId: 'site-preparation', note: 'Community site-preparation day — evidence awaiting verification', evidenceId: null },
      { stage: 'Planting', date: '2026-10-15', status: 'scheduled', mediaId: null, note: 'Scheduled for the short rains', evidenceId: null },
    ],
  },
  {
    id: 'batch-kr-02',
    label: 'Batch KR-02 — Kilombe ESA strip',
    zoneId: 'conservation-kilombe',
    species: ['Prunus africana', 'Croton megalocarpus', 'Podocarpus latifolius'],
    quantity: 6_400,
    expenditureIds: ['exp-a-3'],
    stages: [
      { stage: 'Nursery', date: '2026-03-20', status: 'done', mediaId: 'nursery-beds', note: '6,400 seedlings raised for the river-valley strip', evidenceId: null },
      { stage: 'Planting', date: '2026-06-03', status: 'done', mediaId: 'seedling-planted', note: 'Planted and independently checked (10% line sample)', evidenceId: 'ev-017' },
      { stage: '3-month survival check', date: '2026-09-03', status: 'overdue', mediaId: null, note: 'Count not yet taken; flagged to the zone M&E officer', evidenceId: null },
    ],
  },
]

// Share-ready programme stories — what a fund manager can put in an LP
// letter or a public post. The headline figures are pulled from the data
// layer at render time (`statSource`), never re-typed here, so a story can't
// claim more than the console shows. Video can't be produced in this
// prototype: `video.status: 'pending'` renders a poster with a clear
// "field video pending" state rather than a fake player.
/** @type {import('./types').ProgrammeStory[]} */
export const PROGRAMME_STORIES = [
  {
    id: 'story-restoration',
    programme: 'Restoration',
    title: 'Native seedlings raised, planted and tracked in Block E',
    summary: 'Seedlings grown from local seed in the programme nursery, outplanted on the Block E restoration strip and tagged for survival checks.',
    mediaId: 'nursery-polybags',
    video: { posterMediaId: 'seedling-planted', status: 'pending' },
    statSource: { kind: 'batches' },
    evidenceIds: ['ev-005'],
  },
  {
    id: 'story-farmers',
    programme: 'Farmer & community incentives',
    title: 'Farmers paid to keep the forest edge standing',
    summary: 'Incentive tranches paid to participating smallholders whose plots pass conservation-compliance audits.',
    mediaId: 'tea-pickers',
    video: { posterMediaId: 'tea-landscape', status: 'pending' },
    statSource: { kind: 'outcome', outcomeId: 'participation' },
    evidenceIds: ['ev-008', 'ev-006'],
  },
  {
    id: 'story-protection',
    programme: 'Conservation operations',
    title: 'Hectares under active protection, patrolled every month',
    summary: 'Buffer-zone patrols and compliance audits across the conservation zones bordering the forest reserve.',
    mediaId: 'river-patrol',
    video: { posterMediaId: 'mau-forest', status: 'pending' },
    statSource: { kind: 'outcome', outcomeId: 'conservation' },
    evidenceIds: ['ev-007', 'ev-003'],
  },
  {
    id: 'story-training',
    programme: 'Farmer participation',
    title: 'Farmers mapped, trained and brought into the programme',
    summary: 'Onboarding sessions that GPS-map each plot and train farmers on the conservation conditions their incentives depend on.',
    mediaId: 'farmer-training',
    video: { posterMediaId: 'farmer-training', status: 'pending' },
    statSource: { kind: 'outcome', outcomeId: 'field-activity' },
    evidenceIds: ['ev-004'],
  },
]

/**
 * @param {string | null} id
 * @returns {import('./types').MediaAsset | null}
 */
export function getMediaById(id) {
  return MEDIA_ASSETS.find((asset) => asset.id === id) ?? null
}

/**
 * Photos attached to an evidence record — derived from the batch stages and
 * stories that cite that record, so the link is declared once (where the
 * photo is used) rather than kept in a second, drift-prone mapping.
 *
 * @param {string} evidenceId
 * @returns {import('./types').MediaAsset[]}
 */
export function getMediaForEvidence(evidenceId) {
  const fromBatches = SEEDLING_BATCHES.flatMap((batch) =>
    batch.stages.filter((stage) => stage.evidenceId === evidenceId).map((stage) => stage.mediaId),
  )
  const fromStories = PROGRAMME_STORIES.filter((story) => story.evidenceIds.includes(evidenceId)).map(
    (story) => story.mediaId,
  )
  return [...new Set([...fromBatches, ...fromStories])].map(getMediaById).filter(Boolean)
}
