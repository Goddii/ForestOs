// Content for the Transparent Reporting solution page (ESG & Corporate).
// Grounded in the same GeoJSON/export mechanism named for EUDR compliance
// and the "Read this in plain language" panel concept from the ops
// dashboard — reframed here as an exportable ESG reporting record rather
// than an audit artifact.

export const transparentReporting = {
  slug: 'transparent-reporting',
  segment: 'For ESG & Corporate Partners',
  eyebrow: 'Transparent Reporting',
  title: 'A report your board can trace back to the record it came from.',
  subtitle:
    'Every figure in a Transparent Reporting export — hectares, farmers, premium ' +
    'paid, canopy status — links back to the plot-level, satellite-verified record ' +
    'it was pulled from. Nothing here is a summary of a summary.',
  heroImage: '/media/forests/mt-elgon.jpg',
  heroImageAlt: 'Forest edge on the southern foot of Mt. Elgon',
  heroStats: [
    { value: '100%', label: 'Figures traceable to source records' },
    { value: '14,250', label: 'Hectares reportable, block by block' },
    { value: '38', label: 'Collection centres in the reporting chain' },
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
        id: 'premium',
        label: 'Direct Plucker Premium Distributed',
        value: 'KES 18.4M',
        unit: 'paid to pickers, not the auction',
      },
      {
        id: 'farmers',
        label: 'Active Farmer Network',
        value: '12,000+',
        unit: 'farmers & pluckers reportable per block',
      },
      {
        id: 'geolocated',
        label: 'Deforestation-Free Output',
        value: '100%',
        unit: 'EUDR compliant, every plot geolocated',
      },
    ],
  },

  problem: {
    eyebrow: 'Your challenge',
    title: 'ESG reports are trusted less every year, for good reason.',
    intro:
      'Sustainability reporting has a credibility problem, and generic dashboards ' +
      'with unlinked figures are part of why — a number with no path back to its ' +
      'source reads as marketing, however accurate it is.',
    points: [
      {
        title: 'Headline figures rarely show their working',
        body: 'A "14,250 hectares protected" statistic means little without a way to see which blocks, which plots, and which verification runs it came from.',
      },
      {
        title: 'Reporting formats don’t match audit formats',
        body: 'A polished PDF impact report and a raw compliance export are usually built by different teams, from different data, and don’t reconcile.',
      },
      {
        title: 'Stakeholders ask questions the report can’t answer',
        body: 'When a board member or investor asks "how do we know," most sustainability reports have no deeper layer to point to.',
      },
      {
        title: 'Reporting cadence lags the underlying reality',
        body: 'An annual report describes conditions from months earlier — by the time it’s read, the record has already moved on.',
      },
    ],
  },

  solution: {
    eyebrow: 'Our solution',
    title: 'Every figure links to the record, all the way down to the plot.',
    body:
      'A Transparent Reporting export presents the same headline figures a board ' +
      'expects — hectares, premium distributed, farmers reached — each one traceable ' +
      'to the plot-level, satellite-verified record behind it, in the same GeoJSON ' +
      'format your compliance team already exports for EUDR audits.',
  },

  modules: [
    {
      name: 'Board-ready summary, audit-depth underneath',
      description:
        'A headline figure and, one click down, the block, plot, and verification run ' +
        'it was built from — no separate audit-only version of the truth.',
      stats: ['Summary + source, linked', 'One reporting record'],
    },
    {
      name: 'Same export format as EUDR compliance',
      description:
        'Reporting data exports as GeoJSON, the same format your compliance team ' +
        'already hands to auditors — one pipeline, two audiences.',
      stats: ['Shared GeoJSON export', 'No parallel data pipeline'],
    },
    {
      name: 'Current, not annual',
      description:
        'Because the underlying record updates continuously, a report pulled today ' +
        'reflects today’s verification status, not a snapshot from months ago.',
      stats: ['Continuously current', 'Pulled on your own cadence'],
    },
  ],

  testimonial: {
    illustrative: true,
    quote:
      'Someone on our board asked where a number came from. For the first time, we could show them.',
    name: 'Illustrative ESG lead',
    role: 'Sustainability & Impact',
    org: 'A corporate partner on the belt',
  },

  faq: [
    {
      q: 'What format does a Transparent Reporting export come in?',
      a: 'The same GeoJSON format used for EUDR audit exports — headline figures alongside the plot and verification records they were built from.',
    },
    {
      q: 'Can a non-technical board member read this, or is it audit-only?',
      a: 'The export is built to summarise first (hectares, premium, farmers reached) and let a reader drill into the underlying record only if they want to — it’s not a raw data dump.',
    },
    {
      q: 'How current is the data in a report?',
      a: 'The underlying record updates continuously, so a report pulled today reflects the current verification status, not a stale annual snapshot.',
    },
    {
      q: 'Does this replace our existing ESG reporting process?',
      a: 'No — it’s a source-of-truth layer your existing reporting process can pull from, so the figures your team publishes trace back to something real.',
    },
    {
      q: 'Who can access this after we’re onboarded?',
      a: 'Your organization’s dashboard access is scoped to your own sponsored blocks’ reporting data — not the platform-wide totals shown here for demonstration.',
    },
  ],

  crossPromo: {
    eyebrow: 'Also for ESG & Corporate Partners',
    title: "Deploy conservation capital where it's verified, not just promised.",
    items: [
      { label: 'Capital Deployment', note: 'Fund a block, sector by sector', to: '/solutions/capital-deployment' },
      { label: 'Impact Verification', note: 'Satellite-backed, not self-reported', to: '/solutions/impact-verification' },
      { label: 'EUDR Compliance', note: 'The same export format, for brands', to: '/solutions/eudr-compliance' },
    ],
  },

  finalCta: {
    title: 'See a report that traces back to the record.',
    body: 'Request a demo and we’ll walk a real reporting export with you, headline figure to source plot — or open the Conservation Capital console yourself.',
    primary: { label: 'Open Conservation Capital', to: '/investor' },
    secondary: { label: 'See a sample batch record', to: '/batch/921' },
  },
}
