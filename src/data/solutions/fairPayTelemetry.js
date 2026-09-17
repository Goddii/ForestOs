// Content for the Fair-Pay Telemetry solution page (Brands & Offtakers).
// Grounded in real published figures: KES 18.4M platform-wide premium
// distributed (PLATFORM.stats) and the real per-batch rate — KES 14/kg
// above the Mombasa auction clearing price, paid direct to the picker
// (src/lib/mock.js IMPACT.farmer) — not invented for this page.

export const fairPayTelemetry = {
  slug: 'fair-pay-telemetry',
  segment: 'For Brands & Offtakers',
  eyebrow: 'Fair-Pay Telemetry',
  title: 'Prove the premium reached the picker, not just the cooperative.',
  subtitle:
    'A fair-trade claim is only as strong as its weakest settlement step. ' +
    'ForestOS tracks the premium from plucker to cooperative to your cup, and ' +
    'shows the M-Pesa settlement that bypassed the auction discount entirely.',
  heroImage: '/media/forests/aberdares.jpg',
  heroImageAlt: 'Tea plucking along the Aberdare Range forest edge',
  heroStats: [
    { value: 'KES 18.4M', label: 'Direct plucker premium distributed' },
    { value: 'KES 14', label: 'Paid per kg above the auction price' },
    { value: '12,000+', label: 'Farmers & pluckers in the network' },
  ],

  impact: {
    eyebrow: 'Belt totals · illustrative figures',
    stats: [
      {
        id: 'premium',
        label: 'Direct Plucker Premium Distributed',
        value: 'KES 18.4M',
        unit: 'paid to pickers, not the auction',
      },
      {
        id: 'rate',
        label: 'Per-Kilo Premium',
        value: 'KES 14',
        unit: 'above the Mombasa auction clearing price',
      },
      {
        id: 'network',
        label: 'Active Farmer Network',
        value: '12,000+',
        unit: 'farmers & pluckers, 38 collection centres',
      },
      {
        id: 'hectares',
        label: 'Total Forest Belt Protected',
        value: '14,250',
        unit: 'hectares under the same covenant network',
      },
    ],
  },

  problem: {
    eyebrow: 'Your challenge',
    title: 'A "fair-trade" premium usually stops at the cooperative gate.',
    intro:
      'Most fair-pay claims are audited at the point a cooperative receives funds, ' +
      'not the point a picker actually gets paid. That gap is exactly where trust in ' +
      'the claim breaks down.',
    points: [
      {
        title: 'The auction sets a floor, not a fair price',
        body: 'Mombasa auction clearing prices discount smallholder tea regardless of quality or conservation practice — the premium exists to bypass that discount, but only if it actually reaches the picker.',
      },
      {
        title: 'Settlement records rarely name the individual',
        body: 'A cooperative-level payment record can’t show whether any specific plucker received the premium tied to their harvest.',
      },
      {
        title: 'Cash settlement leaves no audit trail',
        body: 'Without a digital rail, there’s no timestamped record connecting a harvest to a payment — only a claim.',
      },
      {
        title: 'Buyers can’t verify what they’re told',
        body: 'A brand reporting "fair pay" to its own customers has no independent record to point to if the claim is challenged.',
      },
    ],
  },

  solution: {
    eyebrow: 'Our solution',
    title: 'Premium telemetry from plucker to pack, settled and timestamped.',
    body:
      'Every batch carries its per-kilo premium rate, the auction price it beat, and ' +
      'a settlement record — paid via M-Pesa, not cash — tying a specific harvest to ' +
      'a specific payment. The flow (Plucker → Cooperative → Your cup) is the record, ' +
      'not a claim about it.',
  },

  modules: [
    {
      name: 'Per-batch premium rate',
      description:
        'Every batch publishes its premium against the Mombasa auction clearing price ' +
        'it beat, so "fair pay" is a number, not an adjective.',
      stats: ['KES 14/kg above auction', 'Published per batch'],
    },
    {
      name: 'M-Pesa settlement telemetry',
      description:
        'Premiums settle over M-Pesa, not cash — a digital rail that timestamps the ' +
        'payment and ties it back to the harvest that earned it.',
      stats: ['Digital settlement', 'Timestamped per payout'],
    },
    {
      name: 'Plucker → Cooperative → Your cup',
      description:
        'The same flow your compliance evidence already documents, made visible to ' +
        'your own sourcing team and, through a Conservation Passport, your customer.',
      stats: ['Full settlement chain', 'Bypasses the auction discount'],
    },
  ],

  testimonial: {
    illustrative: true,
    quote:
      'We used to report a premium rate. Now we can show the settlement that paid it.',
    name: 'Illustrative sourcing lead',
    role: 'Compliance & Sourcing',
    org: 'A tea brand on the belt',
  },

  faq: [
    {
      q: 'How is the premium rate set?',
      a: 'Each batch’s premium is published against the Mombasa auction clearing price it beat — currently KES 14 per kilo above that benchmark on the reference batch.',
    },
    {
      q: 'How is the premium actually paid?',
      a: 'Settlement runs over M-Pesa rather than cash, so each payout is timestamped and traceable back to the harvest and cooperative it belongs to.',
    },
    {
      q: 'Can this data reach our own ESG or sourcing reports?',
      a: 'Yes — the same settlement figures that ground a batch’s fair-pay claim export alongside the plot and verification data your compliance team already pulls.',
    },
    {
      q: 'Does this replace our existing cooperative relationships?',
      a: 'No. ForestOS adds a verification and telemetry layer on top of existing collection-centre and cooperative structures — it doesn’t change how sourcing relationships work.',
    },
    {
      q: 'What do we get access to once onboarded?',
      a: 'Once your organization is onboarded, your team gets dashboard access scoped to your own batches’ settlement telemetry — not the platform-wide totals shown here for demonstration.',
    },
  ],

  crossPromo: {
    eyebrow: 'Also for Brands & Offtakers',
    title: 'The rest of what a brand needs from the forest side of sourcing.',
    items: [
      { label: 'EUDR Compliance', note: 'Plot-level proof, export-ready', to: '/solutions/eudr-compliance' },
      { label: 'Conservation Passports', note: 'A shareable record per batch', to: '/solutions/conservation-passports' },
      { label: 'Co-Branded Editions', note: 'Launch a passport of your own', to: '/launch' },
    ],
  },

  finalCta: {
    title: 'See the settlement behind a real premium claim.',
    body: 'Request a Forest Edition and we’ll walk a real batch’s premium — rate, benchmark, and settlement — end to end.',
    primary: { label: 'Request a Forest Edition', to: '/launch' },
    secondary: { label: 'See a sample batch record', to: '/batch/921' },
  },
}
