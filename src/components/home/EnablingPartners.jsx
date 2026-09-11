const ROLES = [
  { role: 'Field verification', name: 'NTZDC field officers' },
  { role: 'Farmer settlement', name: 'M-PESA Foundation' },
  { role: 'Canopy monitoring', name: 'Sentinel-2 · ESA Copernicus' },
  { role: 'Retail distribution', name: 'Carrefour Kenya' },
]

/**
 * The institutions the covenant leans on — named plainly, no logo wall. Closes
 * the section by grounding the brand competition in who actually does the
 * verification, the payments, the satellite work and the shelf placement.
 */
export default function EnablingPartners() {
  return (
    <div className="border-t border-bone/10 pt-8">
      <p className="max-w-[46ch] text-[15px] leading-relaxed text-sage-300">
        A name on a sector only counts because independent hands stand behind it.
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {ROLES.map(({ role, name }) => (
          <div key={role}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
              {role}
            </dt>
            <dd className="mt-1 text-[13px] leading-snug text-bone-300">{name}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
