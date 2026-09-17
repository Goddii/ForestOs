// Content for the Audience & Scan Analytics solution page (Creators &
// Artists). Grounded in the real seven-stage scan experience already live
// on the tenant passport product (Scan, Verify, Discover, Proof,
// Participate, Earn, Belong) — framed here as the funnel a creator's own
// audience moves through, not a separate analytics product.

export const audienceScanAnalytics = {
  slug: 'audience-scan-analytics',
  segment: 'For Creators & Artists',
  eyebrow: 'Audience & Scan Analytics',
  title: 'See how far your audience actually goes, not just that they scanned.',
  subtitle:
    'A scan is the start of the story, not the end of it. ForestOS tracks every fan ' +
    'through the same seven-stage passport experience your edition runs on — scan, ' +
    'verify, discover, and on to where they actually stop.',
  heroImage: '/media/forests/cherangany.jpg',
  heroImageAlt: 'Forest escarpment along the Cherangany Hills',
  heroStats: [
    { value: '7', label: 'Stages tracked, scan to belong' },
    { value: '1', label: 'Live passport experience to study' },
    { value: '38', label: 'Collection centres behind every drop' },
  ],

  impact: {
    eyebrow: 'Belt totals · illustrative figures',
    stats: [
      {
        id: 'geolocated',
        label: 'Deforestation-Free Output',
        value: '100%',
        unit: 'the record your fans are actually verifying',
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
        id: 'centres',
        label: 'Collection Centres Mapped',
        value: '38',
        unit: 'the ground-level record behind every scan',
      },
    ],
  },

  problem: {
    eyebrow: 'Your challenge',
    title: 'A scan count tells you almost nothing about your drop.',
    intro:
      'Most co-branded products treat a QR code as a link — you find out it was ' +
      'clicked, and nothing about what happened after.',
    points: [
      {
        title: 'A raw scan count has no shape',
        body: 'Knowing a code was scanned 4,000 times says nothing about whether fans engaged with the story behind it or bounced immediately.',
      },
      {
        title: 'There’s no funnel to learn from',
        body: 'Without stage-by-stage tracking, you can’t tell whether people drop off at verification, at the impact story, or at the ask to participate.',
      },
      {
        title: 'Impact and audience data live apart',
        body: 'Conservation outcomes and fan engagement are usually reported separately, so you can’t see which parts of the story actually land.',
      },
      {
        title: 'Nothing informs the next drop',
        body: 'Without a record of what worked, every new edition starts from a guess rather than a lesson from the last one.',
      },
    ],
  },

  solution: {
    eyebrow: 'Our solution',
    title: 'The same seven stages your fans move through, visible to you.',
    body:
      'Every Conservation Passport runs the same Scan → Verify → Discover → Proof → ' +
      'Participate → Earn → Belong sequence. That structure doubles as your funnel — ' +
      'where fans continue, and where they stop.',
  },

  modules: [
    {
      name: 'Seven-stage funnel, not a scan counter',
      description:
        'Scan, Verify, Discover, Proof, Participate, Earn, Belong — the same sequence ' +
        'your fans experience is the structure your engagement data is organized around.',
      stats: ['Scan → Verify → Belong', 'Stage-by-stage, not one total'],
    },
    {
      name: 'Impact and audience, one record',
      description:
        'Because the passport is built on the same verified plot and premium data as ' +
        'compliance and reporting, engagement and conservation impact share one source.',
      stats: ['One shared record', 'No separate impact report'],
    },
    {
      name: 'A live example to study',
      description:
        'The Majani × Nyashinski pilot passport is browsable right now — the same ' +
        'structure your own drop would run on, not a hypothetical.',
      stats: ['Live pilot, browsable now', 'Real seven-stage structure'],
    },
  ],

  testimonial: {
    illustrative: true,
    quote:
      'We used to know how many people scanned. Now we know how many actually made it to ‘Belong.’',
    name: 'Illustrative creator partner',
    role: 'Co-Branded Edition',
    org: 'An artist on the belt',
  },

  faq: [
    {
      q: 'What exactly gets tracked?',
      a: 'Progress through the seven passport stages — Scan, Verify, Discover, Proof, Participate, Earn, Belong — not just a total scan count.',
    },
    {
      q: 'Is this a separate analytics tool I have to set up?',
      a: 'No — it’s built into the same Conservation Passport your edition already runs on, so there’s nothing extra to instrument.',
    },
    {
      q: 'Can I see a real example before committing to a drop?',
      a: 'Yes — the live Majani × Nyashinski passport runs the exact structure your own edition would use.',
    },
    {
      q: 'Does this connect to the conservation impact of my drop?',
      a: 'Yes — engagement data and the verified plot/premium record behind your edition share one source, so impact and audience aren’t reported separately.',
    },
    {
      q: 'When do I get access to my own drop’s data?',
      a: 'Once your edition is onboarded, you get dashboard access scoped to your own passport’s funnel — not the platform-wide figures shown here for demonstration.',
    },
  ],

  crossPromo: {
    eyebrow: 'Also for Creators & Artists',
    title: 'What a creator needs to launch and track a drop.',
    items: [
      { label: 'Co-Branded Editions', note: 'Adopt a sector of the belt', to: '/launch' },
      { label: 'Commission & Earnings', note: 'Tied to real conservation outcomes', to: '/solutions/commission-earnings' },
      { label: 'Conservation Passports', note: 'The scan experience itself', to: '/solutions/conservation-passports' },
    ],
  },

  finalCta: {
    title: 'Walk the funnel behind a real drop.',
    body: 'Request a Forest Edition and we’ll show you the live passport structure your own audience would move through.',
    primary: { label: 'Request a Forest Edition', to: '/launch' },
    secondary: { label: 'See a sample batch record', to: '/batch/921' },
  },
}
