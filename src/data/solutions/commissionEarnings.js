// Content for the Commission & Earnings solution page (Creators & Artists).
// Grounded in the one real, published number for this mechanic: the
// per-pack conservation contribution rate (BRANDS.nyashinski
// .conservationKesPerPack = KES 75/pack, used as-is in
// EditionConfiguratorForm's own estimate). A creator's own commission
// split is a partnership term, not a platform-wide rate, so this page
// describes the mechanism honestly rather than inventing a payout figure.

export const commissionEarnings = {
  slug: 'commission-earnings',
  segment: 'For Creators & Artists',
  eyebrow: 'Commission & Earnings',
  title: 'Earnings tied to conservation that actually happened, not a projected estimate.',
  subtitle:
    'Every pack of your edition carries a published per-pack conservation ' +
    'contribution — the same rate the League already reports — settled against ' +
    'verified sales, not a forecast made before the drop launched.',
  heroImage: '/media/forests/mt-elgon.jpg',
  heroImageAlt: 'Forest edge on the southern foot of Mt. Elgon',
  heroStats: [
    { value: 'KES 75', label: 'Published conservation rate per pack' },
    { value: '1', label: 'Live edition already reporting against it' },
    { value: '5', label: 'Forest blocks a drop can be tied to' },
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
        id: 'hectares',
        label: 'Total Forest Belt Protected',
        value: '14,250',
        unit: 'hectares behind every edition',
      },
      {
        id: 'farmers',
        label: 'Active Farmer Network',
        value: '12,000+',
        unit: 'farmers & pluckers behind every drop',
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
    title: 'A "portion of proceeds" claim is hard for anyone to verify.',
    intro:
      'Co-branded conservation products commonly promise a share of proceeds toward ' +
      'impact, with no visible mechanism showing that share was ever paid.',
    points: [
      {
        title: 'A percentage claim has no settlement behind it',
        body: '"A portion of every purchase" rarely resolves to a specific rate, a specific fund, or a specific payment record.',
      },
      {
        title: 'Projected impact isn’t actual impact',
        body: 'Pre-launch estimates ("this drop could fund X hectares") often never get reconciled against what actually sold.',
      },
      {
        title: 'Creators can’t independently confirm the number',
        body: 'Without a shared record, a creator is trusting the brand’s own accounting of how much conservation their drop actually funded.',
      },
      {
        title: 'Fans have the same trust gap',
        body: 'If the creator can’t verify the claim, neither can the fan who bought the product because of it.',
      },
    ],
  },

  solution: {
    eyebrow: 'Our solution',
    title: 'A published rate, settled per pack sold, visible to everyone in the chain.',
    body:
      'Editions carry a published per-pack conservation rate — KES 75 on the live ' +
      'pilot — the same figure the Impact League reports against publicly. As packs ' +
      'sell, the contribution accrues against real sales, not a pre-launch estimate, ' +
      'and the deal terms for your own share are set during onboarding, not guessed at.',
  },

  modules: [
    {
      name: 'Published, not private, rate',
      description:
        'The per-pack conservation contribution is a public figure — the same one ' +
        'the Impact League standings report against — not a number only the brand can see.',
      stats: ['KES 75/pack, published', 'Reported in League standings'],
    },
    {
      name: 'Settled against real sales',
      description:
        'Contribution accrues as packs actually sell, tracked through the same batch ' +
        'and settlement record used for plucker premium payouts, not a pre-launch estimate.',
      stats: ['Tied to real sales', 'Same settlement rail as fair pay'],
    },
    {
      name: 'Your commission terms, set at onboarding',
      description:
        'The platform-wide conservation rate is public; your own creator commission is ' +
        'a partnership term agreed during onboarding, not a rate we publish for every deal.',
      stats: ['Deal-specific terms', 'Set at onboarding, not guessed'],
    },
  ],

  testimonial: {
    illustrative: true,
    quote:
      'I could finally tell my audience the exact number, not "a portion of proceeds."',
    name: 'Illustrative creator partner',
    role: 'Co-Branded Edition',
    org: 'An artist on the belt',
  },

  faq: [
    {
      q: 'What is the conservation rate, and is it real?',
      a: 'KES 75 per pack on the live Nyashinski edition — a published figure the Impact League reports against, not an estimate made for this page.',
    },
    {
      q: 'Is this the same as my own commission as a creator?',
      a: 'No — the conservation rate is public and platform-wide; your own commission split is a partnership term set during onboarding for your specific deal.',
    },
    {
      q: 'How is the conservation contribution settled?',
      a: 'It accrues against verified sales through the same settlement record used for plucker premium payouts, not a projection made before launch.',
    },
    {
      q: 'Can I see this in action before agreeing to a drop?',
      a: 'Yes — the Nyashinski edition’s conservation contribution and campaign ("Road to COP32") are live and reportable right now.',
    },
    {
      q: 'When do I see my own edition’s numbers?',
      a: 'Once your edition is onboarded, you get dashboard access scoped to your own drop’s settlement and conservation contribution.',
    },
  ],

  crossPromo: {
    eyebrow: 'Also for Creators & Artists',
    title: 'What a creator needs to launch and track a drop.',
    items: [
      { label: 'Co-Branded Editions', note: 'Adopt a sector of the belt', to: '/launch' },
      { label: 'Audience & Scan Analytics', note: 'Who traced your drop, and where', to: '/solutions/audience-scan-analytics' },
      { label: 'Fair-Pay Telemetry', note: 'The same settlement rail, for brands', to: '/solutions/fair-pay-telemetry' },
    ],
  },

  finalCta: {
    title: 'See a real conservation contribution, pack to payout.',
    body: 'Request a Forest Edition and we’ll walk the live per-pack rate and settlement record with you.',
    primary: { label: 'Request a Forest Edition', to: '/launch' },
    secondary: { label: 'See a sample batch record', to: '/batch/921' },
  },
}
