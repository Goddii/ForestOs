import BrandLogo from '../ui/BrandLogo'

const PARTNERS = [
  {
    role: 'Field verification',
    name: 'NTZDC field officers',
    // NTZDC publishes no downloadable mark, so this one is a crafted emblem
    // (see `ui/brandMarkArt`) rather than a real brand file.
    logo: {
      id: 'ntzdc',
      name: 'Nyayo Tea Zone Development Corporation',
      mark: 'ntzdc',
      logoAccent: '#2f7a4f',
    },
    height: 26,
    plate: true,
  },
  {
    role: 'Farmer settlement',
    name: 'M-PESA Foundation',
    logo: { id: 'mpesa', name: 'M-PESA', logo: '/media/logos/mpesa.svg' },
    height: 20,
  },
  {
    role: 'Canopy monitoring',
    name: 'Sentinel-2 · ESA Copernicus',
    logo: { id: 'sentinel-2', name: 'Sentinel', logo: '/media/logos/sentinel-2.png' },
    height: 30,
  },
  {
    role: 'Retail distribution',
    name: 'Carrefour Kenya',
    logo: { id: 'carrefour', name: 'Carrefour', logo: '/media/logos/carrefour.png' },
    height: 22,
  },
]

/**
 * The institutions the covenant leans on, as a logo wall — real marks for the
 * real partners, the crafted NTZDC seal for the one with no published logo.
 * Closes the section by grounding the brand competition in who actually does
 * the verification, the payments, the satellite work and the shelf placement.
 */
export default function EnablingPartners() {
  return (
    <div className="border-t border-bone/10 pt-8">
      <p className="max-w-[46ch] text-[15px] leading-relaxed text-sage-300">
        A name on a sector only counts because independent hands stand behind it.
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        {PARTNERS.map(({ role, name, logo, height, plate }) => (
          <div key={role}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
              {role}
            </dt>
            <dd className="mt-2.5">
              <BrandLogo
                brand={logo}
                size={height}
                plate={plate}
                label={`${name} logo`}
              />
              <span className="mt-2.5 block text-[12px] leading-snug text-bone-300">{name}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
