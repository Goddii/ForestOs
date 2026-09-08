// Platform-wide mock data for the ForestOS macro home page and the B2B ESG
// portal. There is no backend — every figure here is an illustrative placeholder.

export const PLATFORM = {
  tagline: '940 Kilometres of Protected Forest Edge. 16 Counties. Five Water Towers.',
  subtext:
    "Kenya's tea grows in a ring around the country's five great forest blocks — " +
    'the water towers that feed every major river. ForestOS turns the belt of ' +
    'smallholder tea farms along that edge into a living, verifiable buffer that ' +
    'holds the forest boundary and proves it, plot by plot.',
  stats: [
    {
      id: 'protected',
      label: 'Total Forest Belt Protected',
      value: '14,250',
      unit: 'hectares under covenant',
      trend: '+312 ha this quarter',
    },
    {
      id: 'eudr',
      label: 'Deforestation-Free Output',
      value: '100%',
      unit: 'EUDR compliant',
      trend: 'Every plot geolocated',
    },
    {
      id: 'premium',
      label: 'Direct Plucker Premium Distributed',
      value: 'KES 18.4M',
      unit: 'paid to pickers, not the auction',
      trend: 'Sent to M-Pesa, not the auction',
    },
    {
      id: 'network',
      label: 'Active Farmer Network',
      value: '12,000+',
      unit: 'farmers & pluckers',
      trend: '38 collection centres',
    },
  ],
}

// The five contiguous forest blocks the tea belt wraps. Rings are rough
// lon/lat pairs; views are oblique camera framings for the macro Cesium map.
export const BELT_BLOCKS = [
  {
    id: 'mau',
    name: 'Mau Forest Complex',
    shortName: 'Mau',
    counties: ['Nakuru', 'Bomet', 'Narok', 'Kericho'],
    ring: [35.3, -0.3, 35.78, -0.24, 35.98, -0.66, 35.74, -1.02, 35.3, -0.92, 35.14, -0.58],
    view: { lon: 35.55, lat: -1.15, height: 240000, pitchDeg: -38, headingDeg: 8 },
    hectares: 4820,
    collectionCentres: ['Kiptunga', 'Nessuit', 'Mariashoni', 'Tinet'],
    sponsor: 'Rift Valley Tea Co.',
    sector: 'South West Mau Sector',
  },
  {
    id: 'aberdares',
    name: 'Aberdare Range',
    shortName: 'Aberdares',
    counties: ['Nyandarua', 'Nyeri', 'Murang’a', 'Kiambu'],
    ring: [36.55, -0.18, 36.9, -0.12, 37.02, -0.55, 36.8, -0.82, 36.55, -0.64, 36.48, -0.36],
    view: { lon: 36.75, lat: -0.95, height: 200000, pitchDeg: -40, headingDeg: -6 },
    hectares: 3140,
    collectionCentres: ['Wanjohi', 'Ndunyu Njeru', 'Othaya'],
    sponsor: 'Highland Leaf Brands',
    sector: 'Aberdare East Belt',
  },
  {
    id: 'mt-kenya',
    name: 'Mt. Kenya Forest',
    shortName: 'Mt. Kenya',
    counties: ['Meru', 'Nyeri', 'Kirinyaga', 'Embu', 'Tharaka-Nithi'],
    ring: [37.1, 0.1, 37.55, 0.16, 37.66, -0.26, 37.4, -0.46, 37.1, -0.3, 37.0, -0.04],
    view: { lon: 37.35, lat: -0.62, height: 210000, pitchDeg: -38, headingDeg: 12 },
    hectares: 3960,
    collectionCentres: ['Kangaita', 'Ndima', 'Weru', 'Michimikuru'],
    sponsor: 'Meridian Beverages',
    sector: 'Mt. Kenya West Ridge',
  },
  {
    id: 'cherangany',
    name: 'Cherangany Hills',
    shortName: 'Cherangany',
    counties: ['Elgeyo-Marakwet', 'Trans-Nzoia', 'West Pokot'],
    ring: [35.3, 0.8, 35.62, 0.9, 35.72, 1.3, 35.5, 1.56, 35.28, 1.34, 35.2, 1.02],
    view: { lon: 35.5, lat: 0.6, height: 195000, pitchDeg: -41, headingDeg: 4 },
    hectares: 1490,
    collectionCentres: ['Kapsara', 'Kabolet'],
    sponsor: 'Nordic Chai Import',
    sector: 'Cherangany Escarpment',
  },
  {
    id: 'mt-elgon',
    name: 'Mt. Elgon Forest',
    shortName: 'Mt. Elgon',
    counties: ['Bungoma', 'Trans-Nzoia'],
    ring: [34.4, 0.9, 34.75, 0.96, 34.88, 1.3, 34.66, 1.53, 34.4, 1.34, 34.32, 1.1],
    view: { lon: 34.6, lat: 0.55, height: 200000, pitchDeg: -40, headingDeg: -8 },
    hectares: 840,
    collectionCentres: ['Kaptama', 'Kimothon'],
    sponsor: 'West Ridge Organics',
    sector: 'Elgon Southern Foot',
  },
]

// Camera framing that holds the whole belt in view.
export const BELT_OVERVIEW_VIEW = {
  lon: 36.25,
  lat: -0.4,
  height: 1250000,
  pitchDeg: -64,
  headingDeg: 0,
}

// The macro globe's scroll-triggered fly-in: a high orbit over East Africa
// that descends to frame the whole tea belt. Mirrors PROOF_FLIGHT's shape.
export const BELT_FLIGHT = {
  start: { lon: 37.4, lat: -3.4, height: 1850000, pitchDeg: -78, headingDeg: 0 },
  target: BELT_OVERVIEW_VIEW,
  durationSec: 3,
}

// Partner cards, largest sponsored block first, each carrying its block id so a
// card click can fly the belt globe to that sector.
export const PARTNERS = [...BELT_BLOCKS]
  .sort((a, b) => b.hectares - a.hectares)
  .map((block) => ({
    id: block.id,
    brand: block.sponsor,
    sector: block.sector,
    block: block.name,
    hectares: block.hectares,
    counties: block.counties.length,
    centres: block.collectionCentres.length,
  }))

export const PARTNER_MAX_HECTARES = Math.max(...BELT_BLOCKS.map((b) => b.hectares))
