/**
 * Jar — minimal honey jar SVG.
 *
 * A deliberate, quiet silhouette: glass body, amber fill, lid, label band.
 * The label carries a small QR-glyph (grid of blocks) that the journey
 * animation pulses via the `qrRef`. A glow circle (`glowRef`) sits behind
 * the jar for the QR pulse effect.
 *
 * Each sub-part exposes a callback ref prop so GSAP can animate it.
 */
const NoopRef = { current: null }

export default function Jar({
  width = 96,
  height,
  scale = 1,
  groupRef = NoopRef,
  bodyRef = NoopRef,
  lidRef = NoopRef,
  labelRef = NoopRef,
  qrRef = NoopRef,
  glowRef = NoopRef,
  style,
}) {
  const w = width
  const h = height || width * 2.13

  return (
    <g
      ref={groupRef}
      className="jar"
      style={{ width: w, height: h, transform: `scale(${scale})`, ...style }}
    >
      {/* Glass sheen */}
      <path
        d="M22 14 C 22 14, 20 22, 24 30"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={2}
        opacity={0.5}
      />

      {/* Honey glow behind the jar (pulsed by the scan animation) */}
      <circle ref={glowRef} cx={50} cy={50} r={64} fill="#e8a85c" opacity={0} />

      {/* Jar body — straight sides, rounded shoulders */}
      <rect
        ref={bodyRef}
        x={20}
        y={14}
        width={60}
        height={64}
        rx={6}
        fill="rgba(255,255,255,0.04)"
        stroke="var(--pitch-ink, #17251c)"
        strokeWidth={1.6}
      />

      {/* Amber honey fill (lower two-thirds) */}
      <path
        d="M24 48 C 24 44, 76 44, 76 48 L76 74 C76 76, 24 76, 24 74 Z"
        fill="var(--pitch-honey, #e8a85c)"
        opacity={0.5}
        stroke="none"
      />
      <path
        d="M24 74 C 24 76, 76 76, 76 74"
        stroke="var(--pitch-honey, #e8a85c)"
        strokeWidth={1}
      />

      {/* Meniscus */}
      <path d="M24 48 C 40 44, 60 44, 76 48" stroke="var(--pitch-honey, #e8a85c)" strokeWidth={1.2} />

      {/* Label band */}
      <rect
        ref={labelRef}
        x={22}
        y={34}
        width={56}
        height={18}
        rx={3}
        fill="#fff"
        stroke="var(--pitch-ink, #17251c)"
        strokeWidth={1}
      />

      {/* Brand wordmark on the label */}
      <text
        x={50}
        y={41}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--pitch-ink, #17251c)"
        style={{ fontFamily: 'Instrument Serif, serif', fontSize: 7, fontWeight: 400 }}
      >
        Bree's Bees
      </text>
      <text
        x={50}
        y={48}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--pitch-honey-deep, #ce8e4e)"
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 4.5, fontWeight: 500 }}
      >
        FOREST HONEY
      </text>

      {/* QR glyph on the label (pulse target) */}
      <g ref={qrRef}>
        <rect x={74} y={36} width={10} height={10} rx={1} fill="var(--pitch-ink, #17251c)" />
        <rect x={76} y={38} width={2} height={2} fill="#fff" />
        <rect x={80} y={38} width={2} height={2} fill="#fff" />
        <rect x={76} y={42} width={2} height={2} fill="#fff" />
        <rect x={80} y={42} width={2} height={2} fill="#fff" />
        <rect x={78} y={40} width={2} height={2} fill="#fff" />
        <rect x={76} y={44} width={6} height={2} fill="#fff" />
        <rect x={76} y={44} width={2} height={6} fill="#fff" />
      </g>

      {/* Lid */}
      <rect
        ref={lidRef}
        x={18}
        y={6}
        width={64}
        height={10}
        rx={3}
        fill="var(--pitch-forest, #176b45)"
        stroke="var(--pitch-ink, #17251c)"
        strokeWidth={1.4}
      />

      {/* Lid rim */}
      <path d="M20 11 C 20 13, 80 13, 80 11" stroke="var(--pitch-ink, #17251c)" strokeWidth={1} />
    </g>
  )
}
