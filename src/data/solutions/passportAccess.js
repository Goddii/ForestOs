// Content for the Passport Access solution page (Buyers). Grounded in the
// same real Conservation Passport product (TenantPassportView.jsx) named on
// the Brands-segment page, framed here for a buyer who wants their own
// end customers to see the proof, not just their own compliance team.

export const passportAccess = {
  slug: 'passport-access',
  segment: 'For Buyers',
  eyebrow: 'Passport Access',
  title: 'Give your own customers the proof you already asked for.',
  subtitle:
    'You verify a batch’s origin for your own due-diligence file. A Conservation ' +
    'Passport lets your customers see the same verified record, under your brand, ' +
    'without your team building a second proof layer from scratch.',
  heroImage: '/media/forests/mau.jpg',
  heroImageAlt: 'Tea rows along the South West Mau forest edge',
  heroStats: [
    { value: '7', label: 'Passport stages, scan to belong' },
    { value: '1', label: 'Live tenant pilot, browsable now' },
    { value: '100%', label: 'Built on verified plot records' },
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
        unit: 'farmers & pluckers behind every passport',
      },
      {
        id: 'centres',
        label: 'Collection Centres Mapped',
        value: '38',
        unit: 'the ground-level record behind every scan',
      },
    ],
  },

  problem: {
    eyebrow: 'Your challenge',
    title: 'You have the proof. Your customer never sees it.',
    intro:
      'A buyer’s due-diligence file usually stays internal — the verification work ' +
      'your team already did rarely reaches the end customer who’d actually value ' +
      'seeing it.',
    points: [
      {
        title: 'Building a customer-facing proof layer is its own project',
        body: 'Turning internal due-diligence records into something presentable to a customer usually means a separate design and engineering effort.',
      },
      {
        title: 'A generic traceability widget doesn’t carry your brand',
        body: 'Off-the-shelf QR traceability tools show a generic interface at the exact moment that should feel most like your own product.',
      },
      {
        title: 'Customers scan once and never come back',
        body: 'A static proof page answers one question and ends — there’s no reason for a customer to return to it.',
      },
      {
        title: 'Proof and product experience live in separate systems',
        body: 'When a compliance record and a customer-facing experience are built separately, keeping them consistent is ongoing work.',
      },
    ],
  },

  solution: {
    eyebrow: 'Our solution',
    title: 'The verified record you already have, as a passport your customer can scan.',
    body:
      'A Conservation Passport takes the same plot-level record behind your ' +
      'due-diligence file and turns it into a branded scan-to-story experience — ' +
      'the proof your team already assembled, now visible to the person who cares ' +
      'about it most.',
  },

  modules: [
    {
      name: 'Built on your existing evidence',
      description:
        'The passport reads from the same verified plot record as your evidence ' +
        'export — nothing new to assemble, just a new surface for what already exists.',
      stats: ['Same source record', 'No duplicate data entry'],
    },
    {
      name: 'Your brand, not a generic scanner',
      description:
        'Colour, type, and mark repaint the full passport experience under your own ' +
        'identity — proved live on the Majani × Nyashinski pilot.',
      stats: ['Full tenant theming', 'Live pilot, browsable now'],
    },
    {
      name: 'Seven stages, not one static screen',
      description:
        'Scan, Verify, Discover, Proof, Participate, Earn, Belong — a customer moves ' +
        'through the record rather than glancing at a single certificate.',
      stats: ['Scan → Verify → Belong', 'A reason to scan again'],
    },
  ],

  testimonial: {
    illustrative: true,
    quote:
      'We already had the evidence. We just never had a reason to let a customer see it.',
    name: 'Illustrative procurement lead',
    role: 'Sourcing & Due Diligence',
    org: 'A tea buyer on the belt',
  },

  faq: [
    {
      q: 'Is this built from the same data as our evidence export?',
      a: 'Yes — the passport and the evidence export both read from the same plot-level, verified record, so nothing needs to be maintained twice.',
    },
    {
      q: 'Can the passport carry our own brand?',
      a: 'Yes — the full visual surface repaints under your identity, the same way it does for the live Majani × Nyashinski pilot.',
    },
    {
      q: 'What does a customer actually see?',
      a: 'A seven-stage experience — Scan, Verify, Discover, Proof, Participate, Earn, Belong — not a single static proof screen.',
    },
    {
      q: 'Can we see a live example first?',
      a: 'Yes — this site’s own nav ("The Record" → Sample Batch Record) links to a real batch, and the live Majani × Nyashinski passport is browsable directly.',
    },
    {
      q: 'How do we get this set up for our own customers?',
      a: 'Once your organization is onboarded, your team gets dashboard access to configure and launch a passport under your own identity.',
    },
  ],

  crossPromo: {
    eyebrow: 'Also for Buyers',
    title: 'What a buyer needs from the forest side of a shipment.',
    items: [
      { label: 'Batch Traceability', note: 'Every pack, followed to source', to: '/solutions/batch-traceability' },
      { label: 'Evidence Export', note: 'For your own due-diligence file', to: '/solutions/evidence-export' },
      { label: 'Conservation Passports', note: 'The same product, for brands', to: '/solutions/conservation-passports' },
    ],
  },

  finalCta: {
    title: 'See a real passport before you launch your own.',
    body: 'Request a Forest Edition and we’ll walk the live Majani × Nyashinski passport with you, stage by stage.',
    primary: { label: 'Request a Forest Edition', to: '/launch' },
    secondary: { label: 'See a sample batch record', to: '/batch/921' },
  },
}
