// Content for the EUDR Compliance solution page — the exemplar for the
// "Partners" offering pages. Every figure traces back to PLATFORM.stats /
// MacroFooter's existing EUDR module claim; nothing here is invented beyond
// what the rest of the site already asserts. The testimonial is explicitly
// marked illustrative, matching the "illustrative figures" disclosure
// convention ImpactTicker already uses for platform totals.

export const eudrCompliance = {
  slug: 'eudr-compliance',
  segment: 'For Brands & Offtakers',
  eyebrow: 'EUDR Compliance',
  title: 'Deforestation-free, proven at plot level — not asserted at company level.',
  subtitle:
    'The EU Deforestation Regulation asks for geolocation, not good intentions. ' +
    'ForestOS geolocates every smallholder plot along the buffer belt, verifies ' +
    'the forest edge by satellite, and exports the evidence in the format an ' +
    'auditor actually wants — before the question is asked.',
  heroImage: '/media/forests/mau.jpg',
  heroImageAlt: 'Tea rows along the South West Mau forest edge',
  heroStats: [
    { value: '100%', label: 'Plots geolocated' },
    { value: '14,250', label: 'Hectares under covenant' },
    { value: '38', label: 'Collection centres mapped' },
  ],

  impact: {
    eyebrow: 'Belt totals · illustrative figures',
    stats: [
      {
        id: 'geolocated',
        label: 'Deforestation-Free Output',
        value: '100%',
        unit: 'EUDR compliant, every plot geolocated',
      },
      {
        id: 'hectares',
        label: 'Total Forest Belt Protected',
        value: '14,250',
        unit: 'hectares under covenant',
      },
      {
        id: 'farmers',
        label: 'Active Farmer Network',
        value: '12,000+',
        unit: 'farmers & pluckers, plot by plot',
      },
      {
        id: 'centres',
        label: 'Collection Centres Mapped',
        value: '38',
        unit: 'first link in the chain of custody',
      },
    ],
  },

  problem: {
    eyebrow: 'Your challenge',
    title: 'A supply chain of smallholders is hard to prove, not hard to believe.',
    intro:
      'Tea reaches your blend through thousands of small plots, aggregated at a ' +
      'collection centre before anyone asks where any of it grew. That aggregation ' +
      'is exactly what due-diligence law now asks you to undo.',
    points: [
      {
        title: 'Geolocation stops at the collection centre',
        body:
          'Most sourcing records name a factory or a co-operative, not a plot. ' +
          'EUDR asks for the coordinate the leaf actually grew on.',
      },
      {
        title: 'Forest-edge risk is invisible from a spreadsheet',
        body:
          'A plot can be fully compliant on paper and still sit against an eroding ' +
          'buffer line — nothing in a procurement ledger shows that.',
      },
      {
        title: 'Audit evidence gets built after the audit is announced',
        body:
          'Assembling coordinates, dates, and satellite history under a deadline ' +
          'is where most compliance teams lose the week.',
      },
      {
        title: 'Smallholder data rarely survives contact with a real audit',
        body:
          'Paper registers and one-off surveys degrade — coordinates drift, plots ' +
          'change hands, records go stale before the next harvest.',
      },
    ],
  },

  solution: {
    eyebrow: 'Our solution',
    title: 'One geolocated record per plot, held current, exportable on demand.',
    body:
      'ForestOS maps every plot along the belt to its own coordinate and polygon, ' +
      'checks the forest edge against satellite imagery on an ongoing basis, and ' +
      'carries that record through the collection centre and into the batch. ' +
      'When an audit lands, the evidence already exists — it just gets exported.',
  },

  modules: [
    {
      name: 'Plot geolocation & polygon mapping',
      description:
        'Every farmer plot along the belt is surveyed to a coordinate and boundary ' +
        'polygon, not a village name or a centre code — the unit EUDR actually asks for.',
      stats: ['14,250 ha under covenant', '12,000+ farmers mapped'],
    },
    {
      name: 'Satellite buffer verification',
      description:
        'NDVI canopy readings track the forest edge against baseline imagery, so a ' +
        'plot’s compliance status reflects the forest as it stands, not as it was ' +
        'surveyed once.',
      stats: ['Continuous NDVI monitoring', '5 forest blocks covered'],
    },
    {
      name: 'GeoJSON audit export',
      description:
        'Plot boundaries, coordinates, and verification history export as GeoJSON — ' +
        'the format a compliance team can hand to an auditor without a translation step.',
      stats: ['Plot-level GeoJSON', 'Chain of custody to batch'],
    },
  ],

  testimonial: {
    illustrative: true,
    quote:
      'We used to spend the week before an audit chasing coordinates. Now the ' +
      'coordinates are already the record.',
    name: 'Illustrative sourcing lead',
    role: 'Compliance & Sourcing',
    org: 'A tea brand on the belt',
  },

  faq: [
    {
      q: 'What does the EU Deforestation Regulation actually require?',
      a: 'At its core, EUDR requires companies placing covered commodities on the EU market to trace them to the geolocation coordinates of the plot of origin, and to show that plot has not been deforested. ForestOS is built around producing exactly that record.',
    },
    {
      q: 'How does ForestOS geolocate a smallholder plot?',
      a: 'Each plot is surveyed to a coordinate and boundary polygon at the point it joins the belt network, tied to the farmer and the collection centre that first receives its leaf.',
    },
    {
      q: 'How is forest-edge risk verified, and how often?',
      a: 'Satellite NDVI imagery is checked against a baseline for the forest edge nearest each plot on an ongoing basis, not as a one-time survey — so a compliance status reflects current canopy, not a historical snapshot.',
    },
    {
      q: 'What format does the audit export come in?',
      a: 'Plot boundaries, coordinates, and verification history export as GeoJSON, alongside the chain-of-custody record linking a plot through its collection centre into a specific batch.',
    },
    {
      q: 'Does this cover the whole supply chain, or just the forest-adjacent plots?',
      a: 'ForestOS is scoped to the buffer belt: the ring of smallholder tea farms along the edge of Kenya’s five major forest blocks. It is the forest-risk layer of your sourcing record, not a replacement for your existing supply-chain systems.',
    },
    {
      q: 'How does this reach my own systems?',
      a: 'The GeoJSON export and batch-level records are built to hand off to a compliance or ERP system directly. ForestOS does not require you to change how you already manage sourcing data.',
    },
  ],

  crossPromo: {
    eyebrow: 'Also for Brands & Offtakers',
    title: 'The rest of what a brand needs from the forest side of sourcing.',
    items: [
      { label: 'Conservation Passports', note: 'A shareable record per batch', to: '/solutions/conservation-passports' },
      { label: 'Fair-Pay Telemetry', note: 'Premium paid vs. the auction', to: '/solutions/fair-pay-telemetry' },
      { label: 'Co-Branded Editions', note: 'Launch a passport of your own', to: '/launch' },
    ],
  },

  finalCta: {
    title: 'See a plot-level record before you commit to one.',
    body: 'Request a Forest Edition and we’ll walk a real batch — from plot to pack — through what an EUDR audit export actually contains.',
    primary: { label: 'Request a Forest Edition', to: '/launch' },
    secondary: { label: 'See a sample batch record', to: '/batch/921' },
  },
}
