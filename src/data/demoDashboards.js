// The demo dashboards listed on /demo, and which one each kind of partner
// should open first. /demo is open for now; a request form goes in front of
// it later. Information pages link here with `?for=<audience>`; the public
// nav menu does not link the dashboards directly.

/** Who is asking, in the partner segments the information pages use. */
export const DEMO_AUDIENCES = {
  brand: { label: 'A brand, café or hotel', detail: 'Premium tea products and QR experiences on verified origin' },
  offtaker: { label: 'A tea buyer, packer or exporter', detail: 'Sourcing, traceability and compliance' },
  funder: { label: 'An ESG funder or investor', detail: 'Conservation capital, progress and evidence' },
  creator: { label: 'A creator or artist', detail: 'Co-branded editions and audience engagement' },
}

export const DEMO_DASHBOARDS = [
  {
    id: 'brand',
    to: '/brand',
    name: 'Brand Portal',
    forWhom: 'Brands, cafés and hotels',
    summary: 'Build tea products on verified lots, check every claim against the records, customise and publish QR experiences, and see scans and impact.',
    audiences: ['brand', 'creator'],
  },
  {
    id: 'offtaker',
    to: '/offtaker',
    name: 'Offtaker Portal',
    forWhom: 'Tea buyers, packers and exporters',
    summary: 'Available tea, each batch’s journey from plot to buyer, quality records, compliance documents and verified origin, with exports.',
    audiences: ['offtaker'],
  },
  {
    id: 'funder',
    to: '/funder',
    name: 'Funder workspace',
    forWhom: 'ESG funders and investors',
    summary: 'Where committed capital went, what was done on the ground, the evidence behind each output, risks and reports.',
    audiences: ['funder'],
  },
]

/** Normalises a `?for=` value; unknown or missing values mean "not said". */
export function audienceFrom(value) {
  return value && DEMO_AUDIENCES[value] ? value : null
}

/**
 * Every dashboard, the ones made for this audience first and flagged, the
 * rest in their usual order. Returns new objects; the list is never mutated.
 *
 * @param {string | null} audience
 */
export function dashboardsFor(audience) {
  const flagged = DEMO_DASHBOARDS.map((dashboard) => ({ ...dashboard, recommended: Boolean(audience) && dashboard.audiences.includes(audience) }))
  return [...flagged.filter((dashboard) => dashboard.recommended), ...flagged.filter((dashboard) => !dashboard.recommended)]
}
