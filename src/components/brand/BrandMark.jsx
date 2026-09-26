/**
 * The brand's logo mark, generated from its brand kit (monogram on the
 * brand colour) until the uploaded logo file is served. Decorative next to
 * the brand's name, so it is hidden from screen readers by default.
 *
 * @param {{ kit: import('../../data/brand/accounts').BrandKit, size?: number, className?: string, label?: string }} props
 */
export default function BrandMark({ kit, size = 40, className = '', label }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-xl font-sans font-bold tracking-[0.06em] ${className}`}
      style={{ width: size, height: size, backgroundColor: kit.primary, color: kit.ink, fontSize: size * 0.34, boxShadow: `inset 0 -3px 0 ${kit.accent}` }}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {kit.monogram}
    </span>
  )
}
