// Content for the macro home's two nav dropdowns. Kept as data so
// `NavMegaMenu` stays a pure interaction shell.

export const RECORD_MENU_COLUMNS = [
  {
    label: 'See the proof',
    links: [
      { href: '#proof', label: '3D Proof Map', note: 'Live buffer verification' },
      { href: '#buffer-belt', label: 'Buffer Belt', note: 'The 940 km line, from above' },
      { href: '#belt-ledger', label: 'Trees Funded', note: 'Every block, counted' },
    ],
  },
  {
    label: 'Trace it yourself',
    links: [
      { to: '/qr-experience', label: 'Scan Experience', note: 'What a buyer sees on-pack' },
      { to: '/batch/921', label: 'Sample Batch Record', note: 'One pack, followed to source' },
    ],
  },
]

// One column per partner segment, each naming what ForestOS offers that
// segment — not proof content. Every offering below now has a live page;
// once a company is actually onboarded, real dashboard access (not these
// demo solution pages) is what they get scoped to their own data.
export const PARTNERS_MENU_COLUMNS = [
  {
    label: 'Brands & Offtakers',
    links: [
      { to: '/solutions/eudr-compliance', label: 'EUDR Compliance', note: 'Plot-level proof, export-ready' },
      { to: '/solutions/conservation-passports', label: 'Conservation Passports', note: 'A shareable record per batch' },
      { to: '/solutions/fair-pay-telemetry', label: 'Fair-Pay Telemetry', note: 'Premium paid vs. the auction' },
    ],
  },
  {
    label: 'ESG & Corporate',
    note: "Deploy conservation capital where it's verified, not just promised.",
    links: [
      { to: '/funder', label: 'Funder workspace', note: 'Funding, progress and evidence — demo data' },
      { to: '/solutions/capital-deployment', label: 'Capital Deployment', note: 'Fund a block, sector by sector' },
      { to: '/solutions/impact-verification', label: 'Impact Verification', note: 'Satellite-backed, not self-reported' },
      { to: '/solutions/transparent-reporting', label: 'Transparent Reporting', note: 'Audit-ready, exportable' },
    ],
  },
  {
    label: 'Buyers',
    links: [
      { to: '/solutions/batch-traceability', label: 'Batch Traceability', note: 'Every pack, followed to source' },
      { to: '/solutions/evidence-export', label: 'Evidence Export', note: 'For your own due-diligence file' },
      { to: '/solutions/passport-access', label: 'Passport Access', note: 'The proof your customers see' },
    ],
  },
  {
    label: 'Creators & Artists',
    links: [
      { to: '/launch', label: 'Co-Branded Editions', note: 'Adopt a sector of the belt' },
      { to: '/solutions/audience-scan-analytics', label: 'Audience & Scan Analytics', note: 'Who traced your drop, and where' },
      { to: '/solutions/commission-earnings', label: 'Commission & Earnings', note: 'Tied to real conservation outcomes' },
    ],
  },
]
