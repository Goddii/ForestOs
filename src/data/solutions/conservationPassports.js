// Content for the Conservation Passports solution page (Brands & Offtakers).
// Grounded in the real tenant passport product already shipped at
// /passport/majani/:batchId (TenantPassportView.jsx) — a 7-stage, tenant-
// branded consumer experience — not a page invented for this menu.

export const conservationPassports = {
  slug: 'conservation-passports',
  segment: 'For Brands & Offtakers',
  eyebrow: 'Conservation Passports',
  title: 'A record your customer can hold, not just a claim on your label.',
  subtitle:
    'Every pack carries a QR into a passport your brand owns the look of — ' +
    'scan, verification, the forest it protected, and the people it paid — ' +
    'built on the same plot-level record your compliance team already relies on.',
  heroImage: '/media/forests/mau.jpg',
  heroImageAlt: 'Tea rows along the South West Mau forest edge',
  heroStats: [
    { value: '7', label: 'Passport stages, scan to belong' },
    { value: '3.2 ha', label: 'Preserved per batch, on average' },
    { value: '1', label: 'Live tenant pilot, Majani × Nyashinski' },
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
        id: 'geolocated',
        label: 'Deforestation-Free Output',
        value: '100%',
        unit: 'EUDR compliant, every plot geolocated',
      },
      {
        id: 'farmers',
        label: 'Active Farmer Network',
        value: '12,000+',
        unit: 'farmers & pluckers behind every passport',
      },
      {
        id: 'preserved',
        label: 'Preserved Per Batch',
        value: '3.2',
        unit: 'hectares, held under covenant for the life of the batch',
      },
    ],
  },

  problem: {
    eyebrow: 'Your challenge',
    title: 'A sustainability claim on a label is just a claim.',
    intro:
      'Your customer has no way to check it, no reason to trust it over any other ' +
      'brand’s, and no memory of it past the shelf. The proof you’ve built for ' +
      'compliance never reaches the person who actually paid for the product.',
    points: [
      {
        title: 'The QR code usually leads nowhere interesting',
        body: 'A link to a static sustainability page reads as marketing, not evidence — customers can tell the difference.',
      },
      {
        title: 'Your brand identity disappears at the point of proof',
        body: 'Generic traceability tools show a generic interface — the moment that should feel most like your brand looks like everyone else’s.',
      },
      {
        title: 'There’s no reason for a customer to come back',
        body: 'A one-time scan proves a fact and ends. It doesn’t build the kind of relationship a co-branded edition is supposed to earn.',
      },
      {
        title: 'Compliance evidence and consumer story live in different systems',
        body: 'Rebuilding the same plot and verification data twice — once for auditors, once for customers — doubles the maintenance for no reason.',
      },
    ],
  },

  solution: {
    eyebrow: 'Our solution',
    title: 'One passport, your brand’s look, built on the compliance record you already have.',
    body:
      'A Conservation Passport takes the same plot-level, satellite-verified record ' +
      'behind your EUDR compliance export and turns it into a scan-to-story ' +
      'experience under your own tenant identity — the same trust layer, a ' +
      'completely different front door.',
  },

  modules: [
    {
      name: 'Seven-stage scan experience',
      description:
        'Scan, Verify, Discover, Proof, Participate, Earn, Belong — a customer moves from ' +
        '"is this real?" to "I’m part of this," not just a one-screen certificate.',
      stats: ['Scan → Verify → Belong', 'Live pilot: Majani × Nyashinski'],
    },
    {
      name: 'Tenant-owned visual identity',
      description:
        'Your brand’s colour, mark, and voice repaint the entire passport — the ' +
        'underlying verification data and components stay exactly as trustworthy, ' +
        'the surface is entirely yours.',
      stats: ['Full tenant theming', 'No shared-brand look'],
    },
    {
      name: 'Built on the same plot record as your audit export',
      description:
        'The passport and your EUDR GeoJSON export both read from one verified plot ' +
        'record — no second data pipeline to keep in sync.',
      stats: ['One source record', 'Zero duplicate maintenance'],
    },
  ],

  testimonial: {
    illustrative: true,
    quote:
      'Customers scan once out of curiosity. The passport is why they scan the next pack too.',
    name: 'Illustrative brand lead',
    role: 'Marketing & Sustainability',
    org: 'A tea brand on the belt',
  },

  faq: [
    {
      q: 'Is this the same data as the EUDR audit export?',
      a: 'Yes — the passport and the GeoJSON audit export both read from the same underlying plot and verification record, so nothing needs to be maintained twice.',
    },
    {
      q: 'How much of the passport can carry our brand?',
      a: 'The full visual surface — colour, type, and mark — repaints under your identity. The live pilot (Majani × Nyashinski) shows the extent of that theming in production.',
    },
    {
      q: 'Do we need our own QR infrastructure?',
      a: 'No. Each batch already resolves to a passport URL; your packaging only needs to carry the code.',
    },
    {
      q: 'What happens after a customer finishes the passport?',
      a: 'The later stages (Participate, Earn, Belong) are where a one-time scan turns into an ongoing relationship — tier badges and campaign participation live here, not just a static proof screen.',
    },
    {
      q: 'Can we see it before committing?',
      a: 'Yes — the sample batch record and a live passport are both reachable from this site’s own nav ("The Record" → Sample Batch Record) so you can walk the experience yourself.',
    },
  ],

  crossPromo: {
    eyebrow: 'Also for Brands & Offtakers',
    title: 'The rest of what a brand needs from the forest side of sourcing.',
    items: [
      { label: 'EUDR Compliance', note: 'Plot-level proof, export-ready', to: '/solutions/eudr-compliance' },
      { label: 'Fair-Pay Telemetry', note: 'Premium paid vs. the auction', to: '/solutions/fair-pay-telemetry' },
      { label: 'Co-Branded Editions', note: 'Launch a passport of your own', to: '/launch' },
    ],
  },

  finalCta: {
    title: 'See a real passport before you launch your own.',
    body: 'Request a Forest Edition and we’ll walk the live Majani × Nyashinski passport with you, stage by stage.',
    primary: { label: 'Request a Forest Edition', to: '/launch' },
    secondary: { label: 'See a sample batch record', to: '/batch/921' },
  },
}
