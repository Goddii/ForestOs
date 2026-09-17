// Content for the Batch Traceability solution page (Buyers). Grounded in
// the real batch-chain record already live on this site: plot -> collection
// centre -> batch -> pack, with a real sample record at /batch/921.

export const batchTraceability = {
  slug: 'batch-traceability',
  segment: 'For Buyers',
  eyebrow: 'Batch Traceability',
  title: 'Follow a shipment back to the plot it came from, not just the port it left.',
  subtitle:
    'Most sourcing records stop at a collection centre or a shipping manifest. ' +
    'ForestOS carries a batch’s record from the plot it grew on, through the ' +
    'centre that received it, into the pack that reaches your own customer.',
  heroImage: '/media/forests/mt-kenya.jpg',
  heroImageAlt: 'Tea terraces on the western ridge of Mt. Kenya Forest',
  heroStats: [
    { value: '4', label: 'Links in the chain: plot to pack' },
    { value: '38', label: 'Collection centres in the network' },
    { value: '1', label: 'Sample record, real and browsable' },
  ],

  impact: {
    eyebrow: 'Belt totals · illustrative figures',
    stats: [
      {
        id: 'centres',
        label: 'Collection Centres Mapped',
        value: '38',
        unit: 'first link in the chain of custody',
      },
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
        unit: 'hectares behind the batches you buy',
      },
      {
        id: 'farmers',
        label: 'Active Farmer Network',
        value: '12,000+',
        unit: 'farmers & pluckers, plot by plot',
      },
    ],
  },

  problem: {
    eyebrow: 'Your challenge',
    title: 'A shipment record proves a shipment happened, not where it started.',
    intro:
      'As an offtaker or buyer, you carry your supplier’s sourcing risk into your own ' +
      'due-diligence file — but most of what you receive is a manifest, not a chain.',
    points: [
      {
        title: 'A lot number doesn’t resolve to a plot',
        body: 'Standard shipping documentation names a shipment, not the geolocated plots that fed it.',
      },
      {
        title: 'Blending obscures origin',
        body: 'Tea from multiple collection centres is often blended before export, making a single batch’s origin claim hard to substantiate after the fact.',
      },
      {
        title: 'Your own customers ask the same questions you do',
        body: 'If you can’t trace a batch back to source, you can’t answer your own buyers’ due-diligence requests either.',
      },
      {
        title: 'Supplier-provided records are hard to independently check',
        body: 'Without a third-party verification layer, a supplier’s traceability claim is only as strong as their own record-keeping.',
      },
    ],
  },

  solution: {
    eyebrow: 'Our solution',
    title: 'One continuous record, plot to pack, that you can hand downstream.',
    body:
      'Every batch on the belt carries its full chain — the plot it grew on, the ' +
      'collection centre that received it, and the pack it became — verified ' +
      'independently of any single supplier’s own reporting. A real sample record is ' +
      'browsable right now, not just described.',
  },

  modules: [
    {
      name: 'Plot → centre → batch → pack',
      description:
        'The full chain of custody for every batch, resolvable from a batch ID to the ' +
        'geolocated plots that fed it — not a shipment record with no origin behind it.',
      stats: ['4-stage chain', 'Resolvable from any batch ID'],
    },
    {
      name: 'Independently verified, not supplier-reported',
      description:
        'Plot geolocation and forest-edge verification run against satellite imagery, ' +
        'not a claim your supplier makes about their own sourcing.',
      stats: ['Satellite-verified', 'Independent of supplier reporting'],
    },
    {
      name: 'A record you can hand your own customers',
      description:
        'The same chain resolves into a Conservation Passport your own downstream ' +
        'customers can scan — your due-diligence answer becomes their proof too.',
      stats: ['Downstream-ready', 'One record, two audiences'],
    },
  ],

  testimonial: {
    illustrative: true,
    quote:
      'When a customer asked where a shipment came from, we used to explain our process. Now we show them the plot.',
    name: 'Illustrative procurement lead',
    role: 'Sourcing & Due Diligence',
    org: 'A tea buyer on the belt',
  },

  faq: [
    {
      q: 'Can I look at a real batch record right now?',
      a: 'Yes — a real sample batch record is browsable at /batch/921, showing the full plot-to-pack chain, not a mockup.',
    },
    {
      q: 'How is this different from a shipment manifest?',
      a: 'A manifest names a shipment; this resolves that shipment back to the specific geolocated plots and collection centre it came from.',
    },
    {
      q: 'Is the origin data verified independently of our supplier?',
      a: 'Yes — plot geolocation and forest-edge status are verified against satellite imagery, not asserted by the supplier alone.',
    },
    {
      q: 'Can we pass this record to our own customers?',
      a: 'Yes — the same chain resolves into a Conservation Passport your downstream customers can scan directly.',
    },
    {
      q: 'What do we get access to once onboarded?',
      a: 'Once your organization is onboarded, your team gets dashboard access scoped to the batches you’ve actually purchased, not the platform-wide sample shown here.',
    },
  ],

  crossPromo: {
    eyebrow: 'Also for Buyers',
    title: 'What a buyer needs from the forest side of a shipment.',
    items: [
      { label: 'Evidence Export', note: 'For your own due-diligence file', to: '/solutions/evidence-export' },
      { label: 'Passport Access', note: 'The proof your customers see', to: '/solutions/passport-access' },
      { label: 'EUDR Compliance', note: 'The same plot record, for brands', to: '/solutions/eudr-compliance' },
    ],
  },

  finalCta: {
    title: 'Trace a real shipment before your next order.',
    body: 'Request a Forest Edition and we’ll walk a real batch’s chain of custody with you, plot to pack.',
    primary: { label: 'Request a Forest Edition', to: '/launch' },
    secondary: { label: 'See a sample batch record', to: '/batch/921' },
  },
}
