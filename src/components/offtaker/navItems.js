// The Offtaker Portal IA, grouped by the question each page answers. Shared
// by the sidebar and the tests; every page renders its own visible <h1>.
export const NAV_GROUPS = [
  {
    label: 'Source',
    items: [
      { sub: '', label: 'Overview', end: true },
      { sub: 'supply', label: 'Supply' },
      { sub: 'available', label: 'Available tea' },
      { sub: 'batches', label: 'Batches' },
    ],
  },
  {
    label: 'Assure',
    items: [
      { sub: 'traceability', label: 'Traceability' },
      { sub: 'quality', label: 'Quality' },
      { sub: 'compliance', label: 'Compliance' },
      { sub: 'sources', label: 'Suppliers & sources' },
      { sub: 'origin', label: 'Origin & impact' },
    ],
  },
  {
    label: 'Records',
    items: [
      { sub: 'documents', label: 'Documents' },
      { sub: 'orders', label: 'Orders & commitments' },
      { sub: 'reports', label: 'Reports' },
    ],
  },
  {
    label: 'Account',
    items: [{ sub: 'settings', label: 'Organisation settings' }],
  },
]

export const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items)

/**
 * @param {string} pathname
 * @param {string} basePath
 */
export function sectionFor(pathname, basePath) {
  const sub = pathname.slice(basePath.length).replace(/^\/+|\/+$/g, '').split('/')[0]
  return NAV_ITEMS.find((item) => item.sub === sub) ?? null
}
