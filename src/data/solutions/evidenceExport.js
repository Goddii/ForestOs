// Content for the Evidence Export solution page (Buyers). Grounded in the
// same GeoJSON audit export named on the EUDR Compliance page, framed here
// for a buyer building their own due-diligence file rather than a brand
// preparing for a regulator.

export const evidenceExport = {
  slug: 'evidence-export',
  segment: 'For Buyers',
  eyebrow: 'Evidence Export',
  title: 'Your due-diligence file, built from records you didn’t have to assemble yourself.',
  subtitle:
    'Every batch you purchase carries an exportable evidence bundle — plot ' +
    'geolocation, forest-edge verification, and chain of custody — ready to drop ' +
    'into your own compliance file rather than built from scratch after the fact.',
  heroImage: '/media/forests/aberdares.jpg',
  heroImageAlt: 'Tea plucking along the Aberdare Range forest edge',
  heroStats: [
    { value: 'GeoJSON', label: 'Export format, audit-ready' },
    { value: '100%', label: 'Plots geolocated per batch' },
    { value: '38', label: 'Collection centres in the record' },
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
        id: 'centres',
        label: 'Collection Centres Mapped',
        value: '38',
        unit: 'first link in the chain of custody',
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
    title: 'Assembling due-diligence evidence after a shipment lands is the hard way to do it.',
    intro:
      'When a regulator or a downstream customer asks for origin evidence, most buyers ' +
      'start from a manifest and work backwards — chasing coordinates, dates, and ' +
      'supplier attestations under a deadline.',
    points: [
      {
        title: 'Evidence requests arrive after the fact',
        body: 'A due-diligence request rarely comes with lead time — by then, the records you need should already exist, not be under construction.',
      },
      {
        title: 'Supplier attestations aren’t independent evidence',
        body: 'A signed statement from a supplier is not the same as a geolocated, satellite-verified plot record a regulator will actually accept.',
      },
      {
        title: 'Formats rarely match what’s asked for',
        body: 'Assembling scattered PDFs and spreadsheets into the geospatial format a due-diligence review expects costs real time under pressure.',
      },
      {
        title: 'Every buyer re-does the same work',
        body: 'Without a shared evidence layer, every company in a supply chain rebuilds the same origin evidence independently.',
      },
    ],
  },

  solution: {
    eyebrow: 'Our solution',
    title: 'An evidence bundle that already exists when the question is asked.',
    body:
      'Every batch’s plot geolocation, forest-edge verification history, and chain of ' +
      'custody export as GeoJSON on demand — the same format and record a brand’s ' +
      'compliance team uses for their own EUDR audit, available to you as the buyer ' +
      'of that batch.',
  },

  modules: [
    {
      name: 'Plot-level GeoJSON export',
      description:
        'Geolocation, boundary polygons, and verification history for every plot ' +
        'behind a batch, exportable in the format a due-diligence review expects.',
      stats: ['Plot-level GeoJSON', 'Available per batch'],
    },
    {
      name: 'Chain of custody included',
      description:
        'The export carries the batch’s full chain — plot, collection centre, batch — ' +
        'not just a coordinate list disconnected from how the tea actually moved.',
      stats: ['Full custody chain', 'Not a coordinate list alone'],
    },
    {
      name: 'Ready before the question is asked',
      description:
        'Because verification runs continuously, the evidence bundle for a batch you ' +
        'purchased months ago is exportable today, current, not reconstructed.',
      stats: ['Always current', 'No reconstruction under deadline'],
    },
  ],

  testimonial: {
    illustrative: true,
    quote:
      'A due-diligence request used to mean a week of chasing our suppliers. Now it means an export.',
    name: 'Illustrative procurement lead',
    role: 'Sourcing & Due Diligence',
    org: 'A tea buyer on the belt',
  },

  faq: [
    {
      q: 'What format does the export come in?',
      a: 'GeoJSON — the same plot-level format used for brand-side EUDR audit exports, carrying geolocation, boundary polygons, and verification history.',
    },
    {
      q: 'Does the export include chain of custody, or just coordinates?',
      a: 'Both — the export links plot geolocation to the collection centre and batch it moved through, not a coordinate list on its own.',
    },
    {
      q: 'How current is the evidence in an export?',
      a: 'Verification runs continuously, so an export pulled today reflects the batch’s current record, not a stale snapshot from when it was purchased.',
    },
    {
      q: 'Can we hand this evidence to our own downstream customers?',
      a: 'Yes — the same record underlies a Conservation Passport your customers can scan directly, so the evidence and the customer-facing proof come from one source.',
    },
    {
      q: 'What access do we get once onboarded?',
      a: 'Once your organization is onboarded, dashboard access is scoped to export evidence for the batches you’ve actually purchased.',
    },
  ],

  crossPromo: {
    eyebrow: 'Also for Buyers',
    title: 'What a buyer needs from the forest side of a shipment.',
    items: [
      { label: 'Batch Traceability', note: 'Every pack, followed to source', to: '/solutions/batch-traceability' },
      { label: 'Passport Access', note: 'The proof your customers see', to: '/solutions/passport-access' },
      { label: 'EUDR Compliance', note: 'The same export format, for brands', to: '/solutions/eudr-compliance' },
    ],
  },

  finalCta: {
    title: 'See a real evidence export before your next audit.',
    body: 'Open the offtaker portal to export a real batch’s traceability, quality and compliance records yourself, plot to pack.',
    primary: { label: 'Open the offtaker portal', to: '/offtaker' },
    secondary: { label: 'See a sample batch record', to: '/batch/921' },
  },
}
