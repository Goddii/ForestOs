// Content for the Capital Deployment solution page (ESG & Corporate).
// Grounded in the real block-sponsorship model already live on the home
// page (PARTNERS / STANDINGS in src/lib/brands.js, platformData.js) — a
// corporate partner adopts a named forest block, the same mechanism a
// consumer brand uses, framed here for capital rather than product.

export const capitalDeployment = {
  slug: 'capital-deployment',
  segment: 'For ESG & Corporate Partners',
  eyebrow: 'Capital Deployment',
  title: "Deploy conservation capital where it's verified, not just promised.",
  subtitle:
    'Fund a named sector of the belt, not a general fund. Every hectare your ' +
    'capital covers is geolocated, satellite-monitored, and reported back ' +
    'against — the same plot-level record a brand’s compliance team relies on.',
  heroImage: '/media/forests/mt-kenya.jpg',
  heroImageAlt: 'Tea terraces on the western ridge of Mt. Kenya Forest',
  heroStats: [
    { value: '5', label: 'Forest blocks open to sponsorship' },
    { value: '14,250', label: 'Hectares already under covenant' },
    { value: '16', label: 'Counties across the belt' },
  ],

  impact: {
    eyebrow: 'Belt totals · illustrative figures',
    stats: [
      {
        id: 'hectares',
        label: 'Total Forest Belt Protected',
        value: '14,250',
        unit: 'hectares under covenant',
      },
      {
        id: 'blocks',
        label: 'Forest Blocks',
        value: '5',
        unit: 'Mau, Aberdares, Mt. Kenya, Cherangany, Mt. Elgon',
      },
      {
        id: 'counties',
        label: 'Counties Covered',
        value: '16',
        unit: 'across five water towers',
      },
      {
        id: 'geolocated',
        label: 'Deforestation-Free Output',
        value: '100%',
        unit: 'every sponsored plot geolocated',
      },
    ],
  },

  problem: {
    eyebrow: 'Your challenge',
    title: "A conservation-fund line item is hard to defend in a board review.",
    intro:
      'Capital committed to conservation is frequently capital committed to a claim — ' +
      'a fund name, a country, a broad hectare target — with no way to show a specific ' +
      'outcome for a specific deployment.',
    points: [
      {
        title: 'Funds are pooled, not attributable',
        body: 'A general conservation fund can’t show your capital protected this hectare rather than a hectare someone else already funded.',
      },
      {
        title: 'Outcomes are self-reported',
        body: 'Impact reports from the recipient organization are difficult to independently verify without an outside monitoring layer.',
      },
      {
        title: 'Reporting cadence rarely matches a board calendar',
        body: 'Annual impact reports arrive too infrequently to support quarterly ESG disclosures or investor updates.',
      },
      {
        title: 'There’s no link between capital and the people on the ground',
        body: 'A hectare-protection figure says nothing about whether the smallholders on that land were paid fairly for the tea it still produces.',
      },
    ],
  },

  solution: {
    eyebrow: 'Our solution',
    title: 'A named block, a covenant, and a satellite record that updates continuously.',
    body:
      'Capital adopts a specific sector of the belt — a named forest block with its ' +
      'own hectare covenant, farmer network, and collection centres. Verification ' +
      'runs against ongoing satellite imagery, not an annual site visit, so the ' +
      'record stays current between reporting cycles.',
  },

  modules: [
    {
      name: 'Block-level sponsorship',
      description:
        'Capital is tied to one named forest block — its hectare covenant, its ' +
        'farmer network, its collection centres — not a pooled regional fund.',
      stats: ['5 blocks available', '14,250 ha total covenant'],
    },
    {
      name: 'Continuous satellite verification',
      description:
        'NDVI canopy monitoring tracks the sponsored block’s forest edge on an ' +
        'ongoing basis, the same verification layer behind every EUDR export.',
      stats: ['Continuous NDVI monitoring', '5 forest blocks covered'],
    },
    {
      name: 'A milestone your team can report against',
      description:
        'A shared conservation milestone (a live countdown and progress marker) gives ' +
        'deployed capital a visible, time-bound target rather than an open-ended fund.',
      stats: ['Live progress tracking', 'Board-ready cadence'],
    },
  ],

  testimonial: {
    illustrative: true,
    quote:
      'Our last conservation report named a fund. This one names a forest block, and shows it standing.',
    name: 'Illustrative ESG lead',
    role: 'Sustainability & Impact',
    org: 'A corporate partner on the belt',
  },

  faq: [
    {
      q: 'What does "deploying capital" actually fund?',
      a: 'A named forest block’s conservation covenant and the plucker-premium network on its edge — the same structure a consumer brand sponsors, framed for a capital rather than a product partner.',
    },
    {
      q: 'How is impact verified, and by whom?',
      a: 'Satellite NDVI imagery tracks the sponsored block’s forest edge against baseline on an ongoing basis — verification runs independently of self-reported updates from any recipient organization.',
    },
    {
      q: 'How often do we get a report?',
      a: 'The underlying satellite and settlement records update continuously; your organization’s dashboard access after onboarding is scoped to pull reporting on your own cadence, not wait for an annual cycle.',
    },
    {
      q: 'Can we choose which block to sponsor?',
      a: 'Yes — the five forest blocks along the belt (Mau, Aberdares, Mt. Kenya, Cherangany, Mt. Elgon) each carry their own hectare covenant and are shown ranked by size on the home page’s standings.',
    },
    {
      q: 'Who else is already involved?',
      a: 'NTZDC, the M-PESA Foundation, and Sentinel-2 satellite monitoring already underpin the belt-wide verification network this deployment plugs into.',
    },
  ],

  crossPromo: {
    eyebrow: 'Also for ESG & Corporate Partners',
    title: "Deploy conservation capital where it's verified, not just promised.",
    items: [
      { label: 'Impact Verification', note: 'Satellite-backed, not self-reported', to: '/solutions/impact-verification' },
      { label: 'Transparent Reporting', note: 'Audit-ready, exportable', to: '/solutions/transparent-reporting' },
      { label: 'EUDR Compliance', note: 'The same plot-level proof, for brands', to: '/solutions/eudr-compliance' },
    ],
  },

  finalCta: {
    title: 'See a sponsored block before you commit capital.',
    body: 'Request a Forest Edition and we’ll walk a real forest block’s covenant, network, and verification record with you.',
    primary: { label: 'Request a Forest Edition', to: '/launch' },
    secondary: { label: 'See a sample batch record', to: '/batch/921' },
  },
}
