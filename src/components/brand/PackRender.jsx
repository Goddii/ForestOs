/**
 * A flat render of a product's pack, generated from the product record and
 * the brand kit so every product has a consistent visual before the brand's
 * own photography exists. Silhouette follows the pack type; colours are the
 * brand's (the one place brand colour appears in the portal besides the
 * experience preview). The QR placement is marked where the pack carries it.
 *
 * @param {{
 *   product: { name: string, line: string, packaging: { type: 'tin' | 'pouch' | 'box' | 'sachet', size: string } },
 *   kit: import('../../data/brand/accounts').BrandKit,
 *   className?: string,
 * }} props
 */
export default function PackRender({ product, kit, aspect = 'aspect-[4/5]', className = '' }) {
  const { type } = product.packaging
  return (
    <figure
      className={`relative isolate grid ${aspect} place-items-center overflow-hidden rounded-2xl ${className}`}
      style={{ background: `linear-gradient(160deg, ${kit.primary}14, ${kit.accent}24)` }}
    >
      <svg viewBox="0 0 200 250" className="h-[82%] w-auto drop-shadow-[0_18px_22px_rgba(20,40,32,0.22)]" role="img" aria-label={`${product.name}, ${product.packaging.size} ${type}`}>
        <PackShape type={type} kit={kit} />
        <text x="100" y={LABEL_Y[type]} textAnchor="middle" fill={kit.ink} style={{ font: '700 11px Archivo, sans-serif', letterSpacing: '0.22em' }}>
          {kit.wordmark}
        </text>
        <text x="100" y={LABEL_Y[type] + 22} textAnchor="middle" fill={kit.ink} style={{ font: '600 12px Archivo, sans-serif' }}>
          {truncate(product.name, 20)}
        </text>
        <text x="100" y={LABEL_Y[type] + 38} textAnchor="middle" fill={kit.ink} opacity="0.72" style={{ font: '500 8.5px Archivo, sans-serif', letterSpacing: '0.08em' }}>
          {truncate(product.packaging.size.toUpperCase(), 28)}
        </text>
        <QrMark type={type} kit={kit} />
      </svg>
    </figure>
  )
}

const LABEL_Y = { tin: 118, pouch: 128, box: 112, sachet: 122 }

const truncate = (text, length) => (text.length > length ? `${text.slice(0, length - 1)}…` : text)

function PackShape({ type, kit }) {
  if (type === 'tin') {
    return (
      <g>
        <rect x="44" y="42" width="112" height="176" rx="10" fill={kit.primary} />
        <rect x="40" y="30" width="120" height="26" rx="8" fill={kit.accent} />
        <rect x="44" y="84" width="112" height="3" fill={kit.accent} opacity="0.9" />
        <rect x="44" y="186" width="112" height="3" fill={kit.accent} opacity="0.9" />
        <rect x="52" y="42" width="10" height="176" fill="#fff" opacity="0.08" />
      </g>
    )
  }
  if (type === 'pouch') {
    return (
      <g>
        <path d="M46 44 H154 L160 226 Q100 236 40 226 Z" fill={kit.primary} />
        <rect x="46" y="36" width="108" height="16" rx="3" fill={kit.accent} />
        <path d="M46 96 H154" stroke={kit.accent} strokeWidth="3" />
        <path d="M56 44 L52 226" stroke="#fff" strokeOpacity="0.08" strokeWidth="10" />
      </g>
    )
  }
  if (type === 'box') {
    return (
      <g>
        <path d="M34 72 L100 48 L166 72 L100 96 Z" fill={kit.accent} />
        <path d="M34 72 V190 L100 214 V96 Z" fill={kit.primary} />
        <path d="M166 72 V190 L100 214 V96 Z" fill={kit.primary} opacity="0.86" />
        <rect x="34" y="72" width="132" height="142" fill="none" />
      </g>
    )
  }
  return (
    <g>
      <rect x="52" y="54" width="96" height="150" rx="6" fill={kit.primary} />
      <path d="M52 60 L60 54 L68 60 L76 54 L84 60 L92 54 L100 60 L108 54 L116 60 L124 54 L132 60 L140 54 L148 60" stroke={kit.primary} strokeWidth="6" fill="none" />
      <rect x="52" y="86" width="96" height="3" fill={kit.accent} />
      <line x1="100" y1="204" x2="100" y2="232" stroke={kit.accent} strokeWidth="1.5" />
      <rect x="90" y="228" width="20" height="12" rx="2" fill={kit.accent} />
    </g>
  )
}

/** A small QR placeholder where the pack carries its code, so placement reads at a glance. */
function QrMark({ type, kit }) {
  const at = { tin: [132, 194], pouch: [134, 204], box: [70, 176], sachet: [124, 180] }[type]
  const [x, y] = at
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <rect width="16" height="16" rx="2" fill={kit.ink} />
      <rect x="2" y="2" width="5" height="5" fill={kit.primary} />
      <rect x="9" y="2" width="5" height="5" fill={kit.primary} />
      <rect x="2" y="9" width="5" height="5" fill={kit.primary} />
      <rect x="10" y="10" width="3" height="3" fill={kit.primary} />
    </g>
  )
}
