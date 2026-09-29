import { BRAND_MARK_ART } from './brandMarkArtMap'
import { MiniQr, PackLabel, PackMark, PackText } from './packParts'
import { truncate, wrapWords } from './packText'

/** Ridges that read as a heat-sealed crimp, one thin bar every `step` units. */
function Crimp({ x1, x2, y, height, step }) {
  const count = Math.floor((x2 - x1) / step)
  return Array.from({ length: count }, (_, index) => <rect key={index} x={x1 + index * step} y={y} width="1.3" height={height} fill="#000" opacity="0.23" />)
}

const Shade = ({ id, ...rect }) => <rect {...rect} fill={`url(#cyl-${id})`} />
const Floor = ({ rx, cy = 232, ry = 7, opacity = 0.16 }) => <ellipse cx="100" cy={cy} rx={rx} ry={ry} fill="#000" opacity={opacity} />

export function Tin({ kit, product, id }) {
  return (
    <>
      <Floor rx={64} />
      <g filter={`url(#shadow-${id})`}>
        <rect x="42" y="52" width="116" height="168" rx="8" fill={kit.primary} />
        <Shade id={id} x="42" y="52" width="116" height="168" rx="8" />
        <rect x="40" y="208" width="120" height="12" rx="6" fill={kit.primary} />
        <rect x="40" y="208" width="120" height="12" rx="6" fill="#000" opacity="0.22" />
        <rect x="38" y="32" width="124" height="28" rx="7" fill={kit.accent} />
        <Shade id={id} x="38" y="32" width="124" height="28" rx="7" />
        <rect x="38" y="56" width="124" height="4" fill="#000" opacity="0.2" />
        <rect x="42" y="37" width="116" height="1.4" fill="#fff" opacity="0.35" />
      </g>
      <PackLabel kit={kit} product={product} cx={100} top={80} width={84} height={124} />
    </>
  )
}

export function Pouch({ kit, product, id }) {
  const body = 'M44 42 H156 L163 212 Q100 240 37 212 Z'
  return (
    <>
      <Floor rx={66} cy={236} ry={6} opacity={0.14} />
      <g filter={`url(#shadow-${id})`}>
        <path d={body} fill={kit.primary} />
        <path d={body} fill={`url(#cyl-${id})`} />
        <rect x="44" y="42" width="112" height="15" fill="#fff" opacity="0.1" />
        <Crimp x1={46} x2={156} y={42} height={15} step={4} />
        <path d="M44 72 H157" stroke="#000" strokeOpacity="0.22" />
        <path d="M44 73 H157" stroke="#fff" strokeOpacity="0.22" />
        <path d="M42 66 l7 3 -7 3 Z M158 66 l-7 3 7 3 Z" fill="#000" opacity="0.3" />
        <path d="M40 204 Q100 226 160 204" fill="none" stroke="#000" strokeOpacity="0.2" strokeWidth="1.2" />
      </g>
      <PackLabel kit={kit} product={product} cx={100} top={88} width={84} height={112} />
    </>
  )
}

/** Half-width and half-height of the box's top diamond, and how much of it the lid mark fills. */
const LID_HALF_WIDTH = 66
const LID_HALF_HEIGHT = 24
const LID_MARK_SHARE = 0.5
const FACE_SLOPE_DEGREES = 20

export function Box({ kit, product, id }) {
  const Art = kit.mark ? BRAND_MARK_ART[kit.mark] : undefined
  const a = (LID_HALF_WIDTH * LID_MARK_SHARE) / 256
  const b = (LID_HALF_HEIGHT * LID_MARK_SHARE) / 256
  const nameLines = wrapWords(product.name, 11)
  const leftFace = '34,72 34,190 100,214 100,96'
  const rightFace = '166,72 166,190 100,214 100,96'
  return (
    <>
      <Floor rx={72} cy={226} ry={8} />
      <g filter={`url(#shadow-${id})`}>
        <polygon points={leftFace} fill={kit.primary} />
        <polygon points={rightFace} fill={kit.primary} />
        <polygon points={rightFace} fill="#000" opacity="0.24" />
        <polygon points="34,72 34,100 100,124 100,96" fill={kit.accent} />
        <polygon points="166,72 166,100 100,124 100,96" fill={kit.accent} />
        <polygon points="166,72 166,100 100,124 100,96" fill="#000" opacity="0.26" />
        <polygon points="34,72 100,48 166,72 100,96" fill={kit.primary} />
        <polygon points="34,72 100,48 166,72 100,96" fill={`url(#top-${id})`} />
        <polygon points="100,58 143,72 100,86 57,72" fill="none" stroke={kit.accent} strokeWidth="1" />
        {Art && (
          <g transform={`matrix(${a} ${b} ${-a} ${b} 100 ${72 - b * 256})`}>
            <Art ink={kit.ink} accent={kit.accent} />
          </g>
        )}
      </g>
      <g transform={`translate(34 72) skewY(${FACE_SLOPE_DEGREES})`}>
        <PackText x={33} y={56} size={5.8} weight={700} tracking={0.14} fill={kit.ink}>{kit.wordmark}</PackText>
        <rect x="23" y="61" width="20" height="0.8" fill={kit.accent} />
        {nameLines.map((line, index) => (
          <PackText key={`${index}-${line}`} x={33} y={74 + index * 9} size={7.2} fill={kit.ink}>{line}</PackText>
        ))}
        <PackText x={33} y={74 + nameLines.length * 9 + 3} size={4.2} weight={500} tracking={0.06} fill={kit.ink} opacity={0.72}>{truncate(product.packaging.size.toUpperCase(), 24)}</PackText>
      </g>
      <g transform={`translate(100 96) skewY(${-FACE_SLOPE_DEGREES})`} aria-hidden="true">
        <PackMark kit={kit} x={19} y={32} size={28} ink={kit.ink} accent={kit.accent} />
        <PackText x={33} y={78} size={4.6} tracking={0.12} fill={kit.ink} opacity={0.8}>VERIFIED ORIGIN</PackText>
        <MiniQr x={27} y={88} size={12} fg={kit.primary} bg={kit.ink} />
      </g>
    </>
  )
}

export function Sachet({ kit, product, id }) {
  return (
    <>
      <Floor rx={60} cy={222} ry={6} opacity={0.14} />
      <g filter={`url(#shadow-${id})`}>
        <path d="M116 54 C116 34 134 30 148 13" fill="none" stroke={kit.ink} strokeWidth="1.3" />
        <g transform="translate(136 6) rotate(10)" aria-hidden="true">
          <rect width="26" height="34" rx="3" fill={kit.ink} />
          <circle cx="13" cy="5" r="1.8" fill={kit.primary} opacity="0.5" />
          <PackMark kit={kit} x={5} y={12} size={16} ink={kit.primary} accent={kit.accent} />
        </g>
        <rect x="48" y="52" width="104" height="151" rx="3" fill={kit.primary} />
        <Shade id={id} x="48" y="52" width="104" height="151" rx="3" />
        <rect x="48" y="52" width="104" height="11" fill="#fff" opacity="0.1" />
        <Crimp x1={50} x2={150} y={52} height={11} step={3.5} />
        <rect x="48" y="192" width="104" height="11" fill="#fff" opacity="0.06" />
        <Crimp x1={50} x2={150} y={192} height={11} step={3.5} />
        <path d="M46 64 l6 3 -6 3 Z M154 64 l-6 3 6 3 Z" fill="#000" opacity="0.3" />
      </g>
      <PackLabel kit={kit} product={product} cx={100} top={76} width={84} height={108} scale={0.92} />
    </>
  )
}
