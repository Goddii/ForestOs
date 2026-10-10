// ── Emblem artwork for brands with no downloadable official logo ─────────────
//
// ORIGINAL artwork drawn for this prototype: the fictional Impact League
// brands (Rift Valley Tea Co., Meridian Beverages, Nordic Chai Import, West
// Ridge Organics) and the Nyashinski collaboration ship no logo file, and
// NTZDC publishes none. Each emblem is drawn on a 72 × 72 grid and takes the
// surface's `currentColor` as ink, so one drawing works on every ground.
//
// The real partner brands (Safaricom, Java House, Carrefour, M-PESA,
// Sentinel) are NOT drawn here — they load the actual brand files from
// `public/media/logos/`. How an emblem is paired with its wordmark lives in
// `brandMarkArtMap.js`.

/** A disc and a leaf, nothing else. */
export function Nyashinski({ ink, accent }) {
  return (
    <g>
      <circle cx="36" cy="36" r="30" fill={accent} />
      <path d="M36 17 C 50 27 52 45 36 55 C 20 45 22 27 36 17 Z" fill={ink} />
      <path d="M36 51 V 25" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M36 35 L 44.5 28.5 M36 42.5 L 44.5 36"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  )
}

/** Two ridges over a valley floor — the block landscape, ringed. */
export function RiftValley({ ink, accent }) {
  return (
    <g>
      <circle cx="36" cy="36" r="28" fill="none" stroke={ink} strokeWidth="3" />
      <path
        d="M16 45 L 27 29 L 36 39 L 47 22 L 56 45"
        fill="none"
        stroke={accent}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 51 H 56" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

/** A meridian globe — the import house. */
export function Meridian({ ink, accent }) {
  return (
    <g>
      <circle cx="36" cy="36" r="28" fill="none" stroke={ink} strokeWidth="3" />
      <ellipse cx="36" cy="36" rx="13" ry="28" fill="none" stroke={accent} strokeWidth="3" />
      <path d="M8 36 H 64" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <path d="M13.5 22 H 58.5 M13.5 50 H 58.5" stroke={ink} strokeWidth="2" opacity="0.5" />
    </g>
  )
}

/** Six-point crystal with a chai core. */
export function NordicChai({ ink, accent }) {
  return (
    <g>
      <circle cx="36" cy="36" r="28" fill="none" stroke={ink} strokeWidth="2.5" opacity="0.7" />
      <path
        d="M36 14 V 58 M17.2 25 L 54.8 47 M17.2 47 L 54.8 25"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M36 22 l-5.5 5.5 M36 22 l5.5 5.5 M36 50 l-5.5 -5.5 M36 50 l5.5 -5.5"
        stroke={accent}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="36" cy="36" r="6.5" fill={accent} />
    </g>
  )
}

/** Sunrise over an organic ridge line. */
export function WestRidge({ ink, accent }) {
  return (
    <g>
      <circle cx="36" cy="36" r="28" fill="none" stroke={ink} strokeWidth="3" />
      <circle cx="36" cy="27" r="8.5" fill={accent} />
      <path
        d="M15 49 L 27 37 L 37 45 L 48 33 L 57 49"
        fill="none"
        stroke={ink}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 55 H 57" stroke={accent} strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

/** Institutional seal: leaf, ring, ground line. */
export function Ntzdc({ ink, accent }) {
  return (
    <g>
      <circle cx="36" cy="36" r="30" fill={accent} />
      <circle cx="36" cy="36" r="24.5" fill="none" stroke={ink} strokeWidth="1.6" opacity="0.75" />
      <path d="M36 22 C 45.5 28.5 46.5 41 36 47 C 25.5 41 26.5 28.5 36 22 Z" fill={ink} />
      <path d="M36 45 V 25.5" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M23 53 H 49" stroke={ink} strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
    </g>
  )
}
