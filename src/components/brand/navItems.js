// The Brand Portal IA, grouped by the job each set of pages does. Shared by
// the rail and the tests; every page renders its own visible <h1>.
export const NAV_GROUPS = [
  {
    label: 'Product',
    items: [
      { sub: '', label: 'Brand overview', end: true },
      { sub: 'products', label: 'Products' },
      { sub: 'sources', label: 'Tea sources' },
      { sub: 'story', label: 'Conservation story' },
    ],
  },
  {
    label: 'Engage',
    items: [
      { sub: 'campaigns', label: 'Campaigns' },
      { sub: 'experiences', label: 'QR experiences' },
      { sub: 'content', label: 'Content & claims' },
    ],
  },
  {
    label: 'Measure',
    items: [
      { sub: 'impact', label: 'Impact' },
      { sub: 'analytics', label: 'Analytics' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { sub: 'assets', label: 'Assets' },
      { sub: 'team', label: 'Team' },
      { sub: 'settings', label: 'Settings' },
    ],
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
