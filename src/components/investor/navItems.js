// The funder workspace IA (audit §10): strategic first, then each page is
// the single home for its kind of record. Shared by the sidebar and the
// shell's page title so the two never disagree. `hasVisibleTitle` marks
// pages that render their own visible <h1>; every other page gets a
// screen-reader-only one from the shell.
export const NAV_ITEMS = [
  { sub: '', label: 'Overview', end: true, hasVisibleTitle: true },
  { sub: 'programme', label: 'Programme', hasVisibleTitle: true },
  { sub: 'funding', label: 'Funding' },
  { sub: 'landscape', label: 'Landscape' },
  { sub: 'progress', label: 'Progress' },
  { sub: 'evidence', label: 'Evidence' },
  { sub: 'outcomes', label: 'Outcomes' },
  { sub: 'issues', label: 'Issues & risks' },
  { sub: 'reports', label: 'Reports' },
  { sub: 'organisation', label: 'Organisation' },
]

/**
 * The nav item for the page at `pathname` inside the workspace at
 * `basePath`, or null for a path the workspace doesn't define.
 *
 * @param {string} pathname
 * @param {string} basePath
 * @returns {typeof NAV_ITEMS[number] | null}
 */
export function sectionFor(pathname, basePath) {
  const sub = pathname.slice(basePath.length).replace(/^\/+|\/+$/g, '').split('/')[0]
  return NAV_ITEMS.find((item) => item.sub === sub) ?? null
}
