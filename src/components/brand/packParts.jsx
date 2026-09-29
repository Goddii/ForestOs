import { BRAND_MARK_ART } from './brandMarkArtMap'
import { truncate, wrapWords } from './packText'

/** The mark drawn at (x, y), `size` wide, from the brand's own art. Nothing when the kit has none. */
export function PackMark({ kit, x, y, size, ink, accent }) {
  const Art = kit.mark ? BRAND_MARK_ART[kit.mark] : undefined
  if (!Art) return null
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 256})`}>
      <Art ink={ink} accent={accent} />
    </g>
  )
}

/** Centred pack text in the portal's own face. */
export function PackText({ x, y, size, weight = 600, tracking = 0, fill, opacity = 1, children }) {
  return (
    <text x={x} y={y} textAnchor="middle" fill={fill} opacity={opacity} style={{ font: `${weight} ${size}px Archivo, sans-serif`, letterSpacing: `${tracking}em` }}>
      {children}
    </text>
  )
}

/** A small QR placeholder where the pack carries its code, so placement reads at a glance. */
export function MiniQr({ x, y, size, fg, bg }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 16})`} aria-hidden="true">
      <rect width="16" height="16" rx="2" fill={bg} />
      <rect x="2" y="2" width="5" height="5" fill={fg} />
      <rect x="9" y="2" width="5" height="5" fill={fg} />
      <rect x="2" y="9" width="5" height="5" fill={fg} />
      <rect x="10" y="10" width="3" height="3" fill={fg} />
    </g>
  )
}

/**
 * The cream paper label every flat-fronted pack carries: mark, wordmark, rule,
 * product name, size and QR. `scale` shrinks the type for smaller labels.
 */
export function PackLabel({ kit, product, cx, top, width, height, scale = 1 }) {
  const markSize = 28 * scale
  const nameLines = wrapWords(product.name, Math.round(15 / scale))
  const wordmarkY = top + 9 * scale + markSize + 10 * scale
  const ruleY = wordmarkY + 6 * scale
  const nameY = ruleY + 13 * scale
  const sizeY = nameY + (nameLines.length - 1) * 11 * scale + 12 * scale
  return (
    <g>
      <rect x={cx - width / 2} y={top} width={width} height={height} rx="3" fill={kit.ink} />
      <rect x={cx - width / 2 + 3.5} y={top + 3.5} width={width - 7} height={height - 7} rx="1.5" fill="none" stroke={kit.accent} strokeWidth="0.8" />
      <PackMark kit={kit} x={cx - markSize / 2} y={top + 9 * scale} size={markSize} ink={kit.primary} accent={kit.accent} />
      <PackText x={cx} y={wordmarkY} size={8 * scale} weight={700} tracking={0.2} fill={kit.primary}>{kit.wordmark}</PackText>
      <rect x={cx - 12} y={ruleY} width="24" height="0.9" fill={kit.accent} />
      {nameLines.map((line, index) => (
        <PackText key={`${index}-${line}`} x={cx} y={nameY + index * 11 * scale} size={8.6 * scale} fill={kit.primary}>{line}</PackText>
      ))}
      <PackText x={cx} y={sizeY} size={5.6 * scale} weight={500} tracking={0.1} fill={kit.primary} opacity={0.7}>{truncate(product.packaging.size.toUpperCase(), 28)}</PackText>
      <MiniQr x={cx - 6} y={top + height - 19} size={12} fg={kit.primary} bg={kit.ink} />
    </g>
  )
}

/** Shared shading: a cylinder-style overlay for bodies, a top highlight for lids, and one soft drop shadow. */
export function PackDefs({ id }) {
  return (
    <defs>
      <linearGradient id={`cyl-${id}`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.3" />
        <stop offset="0.16" stopColor="#000" stopOpacity="0" />
        <stop offset="0.3" stopColor="#fff" stopOpacity="0.2" />
        <stop offset="0.46" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id={`top-${id}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <filter id={`shadow-${id}`} x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="#142820" floodOpacity="0.26" />
      </filter>
    </defs>
  )
}
