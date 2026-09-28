import { expect, test } from 'vitest'
import { DEMO_DASHBOARDS, audienceFrom, dashboardsFor } from './demoDashboards'

test('audienceFrom accepts only known audiences', () => {
  expect(audienceFrom('offtaker')).toBe('offtaker')
  expect(audienceFrom('nope')).toBeNull()
  expect(audienceFrom(null)).toBeNull()
})

test('the dashboards for an audience come first and are flagged', () => {
  const ordered = dashboardsFor('funder')
  expect(ordered[0]).toMatchObject({ id: 'funder', recommended: true })
  expect(ordered.filter((dashboard) => dashboard.recommended)).toHaveLength(1)
  expect(ordered).toHaveLength(DEMO_DASHBOARDS.length)
})

test('with no audience every dashboard shows in its usual order, none flagged', () => {
  expect(dashboardsFor(null).map((dashboard) => dashboard.id)).toEqual(DEMO_DASHBOARDS.map((dashboard) => dashboard.id))
  expect(dashboardsFor(null).some((dashboard) => dashboard.recommended)).toBe(false)
})

test('every dashboard points at a real portal route', () => {
  expect(DEMO_DASHBOARDS.map((dashboard) => dashboard.to)).toEqual(['/brand', '/offtaker', '/funder', '/creator'])
})

test('creators are sent to the creative partner portal, not the brand portal', () => {
  const ordered = dashboardsFor('creator')
  expect(ordered[0]).toMatchObject({ id: 'creator', recommended: true })
  expect(ordered.filter((dashboard) => dashboard.recommended)).toHaveLength(1)
})
