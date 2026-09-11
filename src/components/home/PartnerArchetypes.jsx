const ARCHETYPES = [
  'Artists & musicians',
  'Football clubs',
  'Airlines',
  'Banks',
  'Tourism boards',
  'Hotels & lodges',
  'Diaspora communities',
  'Foundations',
]

/**
 * Who a Forest Edition is built for — plain text, no logos, same convention
 * as `EnablingPartners`. These are categories, not real brand names: the
 * League above only ever names an actual sponsoring brand once it exists.
 */
export default function PartnerArchetypes() {
  return (
    <div className="border-t border-bone/10 pt-8">
      <p className="max-w-[46ch] text-[15px] leading-relaxed text-sage-300">
        Any organisation with a community behind it can adopt a sector of the
        belt.
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {ARCHETYPES.map((label) => (
          <li
            key={label}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone-300"
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
