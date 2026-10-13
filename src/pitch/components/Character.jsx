/**
 * Character — ForestOS line-art character primitives.
 *
 * A single deliberate visual language: forest-green strokes, geometric
 * simplicity. Four actor types are distinguished by a small identifying
 * glyph so the whole system reads as one family.
 *
 * Each animatable sub-part exposes a **callback ref** prop (e.g.
 * `headRef`, `lArmRef`). The parent passes its own ref objects so
 * GSAP can transform parts independently.
 *
 * @param {'consumer'|'brand'|'retailer'|'steward'} [type='consumer']
 * @param {number} [scale=1]
 * @param {string} [color]  stroke colour (defaults to forest)
 * @param {number} [strokeWidth=2.4]
 * @param {'standing'|'reaching'|'thumbsup'|'pointing'|'offering'} [pose='standing']
 */
const NoopRef = () => {}

const POSES = {
  standing: {
    lArm: 'M-4.5 -11 C -9 -7, -9 2, -6 6',
    rArm: 'M4.5 -11 C 9 -7, 9 2, 6 6',
    lLeg: 'M-3.5 10 L-6 18',
    rLeg: 'M3.5 10 L6 18',
  },
  reaching: {
    lArm: 'M-4.5 -11 C -9 -7, -9 2, -6 6',
    rArm: 'M4.5 -12 C 2 -20, 16 -34, 22 -48',
    lLeg: 'M-3.5 10 L-6 18',
    rLeg: 'M3.5 10 L6 18',
  },
  thumbsup: {
    lArm: 'M-4.5 -11 C -9 -7, -9 2, -6 6',
    rArm: 'M5.5 -11 C 10 -15, 16 -18, 18 -6 C 20 0, 14 4, 10 2',
    lLeg: 'M-3.5 10 L-6 18',
    rLeg: 'M3.5 10 L6 18',
  },
  pointing: {
    lArm: 'M-4.5 -11 C -9 -7, -9 2, -6 6',
    rArm: 'M5.5 -12 C 4 -20, 3 -32, 3 -44',
    lLeg: 'M-3.5 10 L-6 18',
    rLeg: 'M3.5 10 L6 18',
  },
  offering: {
    lArm: 'M-4.5 -11 C -12 -14, -18 -8, -20 0',
    rArm: 'M4.5 -11 C 12 -14, 18 -8, 20 0',
    lLeg: 'M-3.5 10 L-6 18',
    rLeg: 'M3.5 10 L6 18',
  },
}

function ActorGlyph({ type, x, y }) {
  const common = {
    fill: 'none',
    stroke: 'var(--pitch-forest, #176b45)',
    strokeWidth: 2.4,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
  }
  switch (type) {
    case 'brand':
      return (
        <g transform={`translate(${x} ${y})`}>
          <rect x={-6} y={-4} width={12} height={8} rx={2} {...common} />
          <path d="M-3 0h3.5" {...common} strokeWidth={1.2} />
        </g>
      )
    case 'retailer':
      return (
        <g transform={`translate(${x} ${y})`}>
          <path d="M-7 2h14M-7 2l1-4h12l1 4M-4 2v3M3 2v3" {...common} />
        </g>
      )
    case 'steward':
      return (
        <g transform={`translate(${x} ${y})`}>
          <path d="M0 -5 Q4 0 0 4 Q-4 0 0 -5 Z" {...common} />
          <path d="M0 -3 L0 3" {...common} strokeWidth={1.2} />
        </g>
      )
    case 'consumer':
    default:
      return null
  }
}

export default function Character({
  type = 'consumer',
  scale = 1,
  color,
  strokeWidth = 2.4,
  pose = 'standing',
  groupRef = NoopRef,
  headRef = NoopRef,
  torsoRef = NoopRef,
  lArmRef = NoopRef,
  rArmRef = NoopRef,
  lLegRef = NoopRef,
  rLegRef = NoopRef,
  style,
}) {
  const stroke = color || 'var(--pitch-forest, #176b45)'
  const common = {
    fill: 'none',
    stroke,
    strokeWidth,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
  }

  const arms = POSES[pose] || POSES.standing

  return (
    <g
      ref={groupRef}
      className="character"
      style={{ transform: `scale(${scale})`, ...style }}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <circle ref={headRef} cx={0} cy={-20} r={5.5} {...common} />

      <path
        ref={torsoRef}
        d="M0 -14 C -5 -8, -4 4, 0 10 C 4 4, 5 -8, 0 -14 Z"
        {...common}
      />

      <path ref={lArmRef} d={arms.lArm} {...common} />
      <path ref={rArmRef} d={arms.rArm} {...common} />

      <path ref={lLegRef} d={arms.lLeg} {...common} />
      <path ref={rLegRef} d={arms.rLeg} {...common} />

      <ActorGlyph type={type} x={0} y={-2} />
    </g>
  )
}

export { ActorGlyph, POSES }
