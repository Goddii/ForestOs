// Logo artwork for the demo brands, drawn on a 256 x 256 grid. Colours come
// from the brand kit (`ink` for the main shapes, `accent` for the one detail
// that carries the brand's colour), so the mark follows the kit and any
// colours the studio overrides.

const CHEVRON_DEPTH = 28

/** A 45-degree chevron with horizontal ends: apex at (128, top), reaching `reach` each side. */
const chevron = (top, reach) =>
  `M${128 - reach} ${top + reach} L128 ${top} L${128 + reach} ${top + reach} V${top + reach + CHEVRON_DEPTH} L128 ${top + CHEVRON_DEPTH} L${128 - reach} ${top + reach + CHEVRON_DEPTH} Z`

/**
 * Kilele: "two leaves and a bud" as terraces that read as one peak. The bud
 * (top row) carries the accent colour.
 */
export function Terraces({ ink, accent }) {
  return (
    <>
      <path d={chevron(40, 40)} fill={accent} />
      <path d={chevron(88, 60)} fill={ink} />
      <path d={chevron(136, 76)} fill={ink} />
    </>
  )
}

/** Mara Crest: a flat-topped acacia with a forked trunk, held in a seal; the ring carries the accent colour. */
export function Acacia({ ink, accent }) {
  return (
    <>
      <path fillRule="evenodd" fill={accent} d="M128 16 A112 112 0 1 1 127.9 16 Z M128 28 A100 100 0 1 0 128.1 28 Z" />
      <g transform="translate(0 -18)" fill={ink}>
        <path d="M48 104 C78 92 178 92 208 104 C198 122 158 118 128 118 C98 118 58 122 48 104 Z" />
        <path d="M116 204 L122 160 C122 150 110 140 92 118 L106 112 C118 124 124 132 128 138 C132 132 138 124 150 112 L164 118 C146 140 134 150 134 160 L140 204 Z" />
      </g>
    </>
  )
}

/** The Halden: an H whose crossbar is a doorway arch; the arch block carries the accent colour. */
export function ArchedH({ ink, accent }) {
  return (
    <>
      <path fill={ink} d="M72 48 H104 V208 H72 Z M152 48 H184 V208 H152 Z" />
      <path fill={accent} d="M104 112 H152 V176 H138 V146 A10 10 0 0 0 118 146 V176 H104 Z" />
    </>
  )
}
