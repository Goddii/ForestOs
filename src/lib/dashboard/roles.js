// Role-based views for the ESG portal. The active role is derived from the URL
// path prefix (see `roleFromPath`) — the sidebar's "Role View" switcher just
// navigates to a role's `base`. Each role carries its own identity, nav module
// list, and (in its own data file) mock data. Illustrative only.

export const ROLES = [
  {
    id: 'brand',
    label: 'Brand / Offtaker View',
    base: '/dashboard',
    scopeLabel: 'Sponsored sector',
    org: {
      name: 'Rift Valley Tea Co.',
      role: 'Offtaker & Brand',
      scope: 'South West Mau Sector',
      code: 'SW-MAU',
      since: '2024',
    },
    modules: [
      { to: '', label: 'Overview', end: true },
      { to: 'eudr', label: 'EUDR Compliance' },
      { to: 'passports', label: 'Conservation Passports' },
      { to: 'fairpay', label: 'Fair Pay Telemetry' },
      { to: 'satellite', label: 'Satellite Analytics' },
      { to: 'qr', label: 'QR Scan Analytics' },
    ],
  },
  {
    id: 'buyer',
    label: 'Buyer / Brand View',
    base: '/dashboard/buyer',
    scopeLabel: 'Active sourcing',
    org: {
      name: 'Rift Valley Tea Co.',
      role: 'Buyer & Brand',
      scope: 'Direct-sold volume',
      code: 'RVT-BUYER',
      since: '2024',
    },
    modules: [
      { to: '', label: 'Conservation Passport', end: true },
      { to: 'batches', label: 'Batch Lookup' },
      { to: 'reports', label: 'ESG Report Export' },
    ],
  },
  {
    id: 'creator',
    label: 'Creator & Artist View',
    base: '/dashboard/creator',
    scopeLabel: 'Active campaigns',
    org: {
      name: '@leaf.and.ridge',
      role: 'Creator & Artist',
      scope: 'Origin Story drop series',
      code: 'CRTR-118',
      since: '2025',
    },
    modules: [
      { to: '', label: 'Campaign Drops', end: true },
      { to: 'scans', label: 'Audience QR Scans' },
      { to: 'impact', label: 'Conservation Impact' },
      { to: 'earnings', label: 'Commission & Earnings' },
    ],
  },
  {
    id: 'ntzdc',
    label: 'NTZDC Operations View',
    base: '/dashboard/ops',
    scopeLabel: 'Operating zone',
    org: {
      name: 'NTZDC — South West Mau',
      role: 'Zone Development Council',
      scope: 'Kiptunga Block operations',
      code: 'NTZDC-SWM',
      since: '2019',
    },
    modules: [
      { to: '', label: 'Operations & QC Hub', end: true },
      { to: 'verification', label: 'Verification Queue' },
      { to: 'problems', label: 'Problem Reports' },
      { to: 'quality', label: 'Quality & Rejections' },
      { to: 'pricing', label: 'Price Configurator' },
      { to: 'training', label: 'Farmer Training Alerts' },
      { to: 'buffer', label: 'Buffer Maintenance' },
    ],
  },
  {
    id: 'ntzdc-mgmt',
    label: 'NTZDC Management View',
    base: '/dashboard/management',
    scopeLabel: 'Coverage',
    org: {
      name: 'NTZDC — National',
      role: 'Zone Development Council',
      scope: 'All zones',
      code: 'NTZDC-NAT',
      since: '2016',
    },
    modules: [
      { to: '', label: 'Landscape Overview', end: true },
      { to: 'zones', label: 'Zone Comparison' },
      { to: 'buffer', label: 'Buffer & Conservation Rollup' },
    ],
  },
  {
    id: 'esg',
    label: 'ESG Capital Manager View',
    base: '/dashboard/capital',
    scopeLabel: 'Managed fund',
    org: {
      name: 'Highland Impact Partners',
      role: 'ESG Capital Manager',
      scope: 'Mau Belt Conservation Fund I',
      code: 'MBCF-I',
      since: '2023',
    },
    modules: [
      { to: '', label: 'Fund Allocation', end: true },
      { to: 'drawdowns', label: 'Capital Drawdowns' },
      { to: 'recovery', label: 'Satellite Recovery' },
      { to: 'audit', label: 'Impact Audit Logs' },
    ],
  },
]

export const DEFAULT_ROLE = ROLES[0]

/**
 * Resolve the active role from a pathname (URL is the source of truth). Matches
 * the most specific role `base` that prefixes the path; the Brand role's
 * `/dashboard` base is the fallback so it never shadows the others.
 */
export function roleFromPath(pathname) {
  const match = ROLES.filter((role) => role.base !== '/dashboard').find(
    (role) => pathname === role.base || pathname.startsWith(role.base + '/'),
  )
  return match ?? ROLES[0]
}

/** Full path for a module `to` within a role. */
export function modulePath(role, to) {
  return to ? `${role.base}/${to}` : role.base
}
