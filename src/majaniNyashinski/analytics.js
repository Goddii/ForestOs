// Event hooks for `/majani/nyashinski` — no analytics platform is wired into
// this repo (confirmed: no gtag/segment/mixpanel/posthog anywhere in
// `src/` or `package.json`), so this stays a clean, swappable seam rather
// than integrating a third-party SDK the build brief didn't ask for.
// `trackEvent` logs in development only; wiring a real provider later is a
// one-line change inside this function, not a call-site rewrite.

export const EVENTS = {
  QR_SCAN: 'qr_scan',
  ENTER_EXPERIENCE: 'enter_experience',
  PLAY_MUSIC: 'play_music',
  VIEW_ORIGIN: 'view_origin',
  VIEW_CONSERVATION: 'view_conservation',
  JOIN_COMMUNITY: 'join_community',
  SPOTIFY_CLICK: 'spotify_click',
  FORESTOS_CLICK: 'forestos_click',
}

/**
 * @param {string} name one of `EVENTS`
 * @param {Record<string, unknown>} [payload]
 */
export function trackEvent(name, payload = {}) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[majani-nyashinski]', name, payload)
  }
}
