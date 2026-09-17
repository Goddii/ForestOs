// Content for the Impact Verification solution page (ESG & Corporate).
// Grounded in the real satellite/NDVI verification layer already used for
// EUDR compliance (SATELLITE data, VerificationClaimDetail in forestos-ops,
// and the NDVI-grid mock data in this repo's dashboardData) — reframed here
// for an ESG audience asking "how do we know this is real" rather than
// "is this deforestation-free."

export const impactVerification = {
  slug: 'impact-verification',
  segment: 'For ESG & Corporate Partners',
  eyebrow: 'Impact Verification',
  title: 'Satellite-backed proof, not a self-reported impact narrative.',
  subtitle:
    'A conservation outcome is either checkable against independent evidence or it ' +
    'isn’t. ForestOS verifies every sponsored hectare against ongoing satellite ' +
    'imagery, the same layer that underwrites EUDR compliance for brands on the belt.',
  heroImage: '/media/forests/cherangany.jpg',
  heroImageAlt: 'Forest escarpment along the Cherangany Hills',
  heroStats: [
    { value: '5', label: 'Forest blocks under satellite monitoring' },
    { value: '100%', label: 'Sponsored plots geolocated' },
    { value: '14,250', label: 'Hectares verified, not asserted' },
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
        id: 'blocks',
        label: 'Forest Blocks Monitored',
        value: '5',
        unit: 'continuous NDVI canopy tracking',
      },
      {
        id: 'centres',
        label: 'Collection Centres Mapped',
        value: '38',
        unit: 'the ground-level record satellite checks against',
      },
    ],
  },

  problem: {
    eyebrow: 'Your challenge',
    title: 'Most conservation impact is reported, not verified.',
    intro:
      'An annual impact report from the organization receiving your capital is, by ' +
      'definition, self-reported. Independent verification is the part most ' +
      'conservation partnerships skip.',
    points: [
      {
        title: 'Site visits don’t scale to a 940 km belt',
        body: 'Physically inspecting every sponsored hectare is impractical — most partnerships settle for a sample, if any.',
      },
      {
        title: 'A canopy photo from last year proves last year',
        body: 'Without continuous monitoring, a forest-edge claim can quietly go stale between the report that made it and the report that repeats it.',
      },
      {
        title: 'Verification and reporting are usually the same party',
        body: 'When the organization reporting impact is also the one verifying it, there’s no independent check in the loop.',
      },
      {
        title: 'Regression is invisible without a baseline',
        body: 'A single snapshot can’t show whether canopy is holding, recovering, or eroding — you need a tracked baseline to know which.',
      },
    ],
  },

  solution: {
    eyebrow: 'Our solution',
    title: 'NDVI canopy tracking against a fixed baseline, continuously.',
    body:
      'Every forest block’s edge is monitored against a fixed baseline using satellite ' +
      'NDVI readings, run on an ongoing basis rather than a periodic site visit. The ' +
      'same verification layer grounds a brand’s EUDR audit export and a corporate ' +
      'partner’s impact report — one verified record, two audiences.',
  },

  modules: [
    {
      name: 'Continuous NDVI canopy monitoring',
      description:
        'Satellite readings track each block’s forest edge against a fixed baseline, ' +
        'flagging canopy change rather than waiting for an annual snapshot to catch it.',
      stats: ['Continuous monitoring', '5 forest blocks covered'],
    },
    {
      name: 'Independent of the recipient’s own reporting',
      description:
        'Verification runs on satellite imagery, not a narrative submitted by the ' +
        'organization your capital funds — the check sits outside that relationship.',
      stats: ['Satellite-sourced', 'Not self-reported'],
    },
    {
      name: 'One verified record, shared with compliance',
      description:
        'The same plot-level verification that grounds a brand’s EUDR export grounds ' +
        'your impact report — nothing here is a separate, ESG-only data pipeline.',
      stats: ['Shared verification layer', 'Cross-checked with compliance data'],
    },
  ],

  testimonial: {
    illustrative: true,
    quote:
      'Our auditors used to ask how we knew the forest was still standing. Now we show them the satellite pass.',
    name: 'Illustrative ESG lead',
    role: 'Sustainability & Impact',
    org: 'A corporate partner on the belt',
  },

  faq: [
    {
      q: 'What exactly does the satellite check?',
      a: 'NDVI (vegetation health) readings for the forest edge nearest each sponsored block, tracked against a fixed baseline rather than a one-time survey.',
    },
    {
      q: 'How often does verification run?',
      a: 'On an ongoing basis — canopy change is flagged as it happens rather than surfacing only at an annual report.',
    },
    {
      q: 'Is this the same layer used for EUDR compliance?',
      a: 'Yes — the satellite verification behind a brand’s deforestation-free plot record is the same layer that grounds this impact verification for capital partners.',
    },
    {
      q: 'What happens if canopy loss is detected?',
      a: 'A flagged block surfaces in the verification record rather than being smoothed over in an annual summary — the same honesty standard applied to every plot on the belt.',
    },
    {
      q: 'Can our own auditors access the underlying data?',
      a: 'Once your organization is onboarded, dashboard access is scoped to your sponsored block’s verification history for exactly this kind of independent review.',
    },
  ],

  crossPromo: {
    eyebrow: 'Also for ESG & Corporate Partners',
    title: "Deploy conservation capital where it's verified, not just promised.",
    items: [
      { label: 'Capital Deployment', note: 'Fund a block, sector by sector', to: '/solutions/capital-deployment' },
      { label: 'Transparent Reporting', note: 'Audit-ready, exportable', to: '/solutions/transparent-reporting' },
      { label: 'EUDR Compliance', note: 'The same satellite layer, for brands', to: '/solutions/eudr-compliance' },
    ],
  },

  finalCta: {
    title: 'See the verification record behind a real block.',
    body: 'Request a Forest Edition and we’ll walk a real forest block’s NDVI history with you, baseline to present.',
    primary: { label: 'Request a Forest Edition', to: '/launch' },
    secondary: { label: 'See a sample batch record', to: '/batch/921' },
  },
}
