/**
 * DEMO VALUES for the Figma placeholders `[LIVE_COUNT_PLACEHOLDER]`,
 * `[LIVE_MT_CO2_PLACEHOLDER]`, and `[FAN_ID_PLACEHOLDER]`. The backend
 * (owned by the platform team) will supply the real live telemetry and fan
 * identity — swap these constants for that feed; nothing else depends on
 * where they come from.
 */
export const DEMO_LIVE_TREE_COUNT = 12480
export const DEMO_LIVE_CARBON_TONS = 318.6
export const DEMO_FAN_ID = 'SENTINEL-0921'
export const STARTING_SEEDS_SOWN = 2
export const STARTING_AUDIO_BADGES = 1

export const TRACK = {
  title: 'Mau Anthem (Roots in the Dirt)',
  byline: 'Nyashinski • Verified Forest Ecosystem Track',
  startSeconds: 74, // 1:14, as shown in the Figma frame
  totalSeconds: 225, // 3:45
}

// Bar heights (px) from the Figma "waves" frame, left to right.
export const WAVE_HEIGHTS = [6, 12, 18, 14, 8, 24, 18, 12, 16, 22, 10, 8, 14, 18, 24, 20, 14, 8, 12, 6, 10, 16]

// No official track links exist yet, so the platform buttons open an artist
// search on each service rather than a guessed URL.
export const PLATFORM_LINKS = {
  spotify: 'https://open.spotify.com/search/Nyashinski',
  appleMusic: 'https://music.apple.com/search?term=Nyashinski',
}

export const CHAPTER_COUNT = 7
