import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { DEMO_FOREST_REF } from '../data/verification'

const EXPERIENCE = `/enterprise-partners/experience/safaricom?ref=${DEMO_FOREST_REF}&scanned=1`
const EXPERIENCE_JH = `/enterprise-partners/experience/java-house?ref=${DEMO_FOREST_REF}&scanned=1`

const ITEMS = [
  { to: '/enterprise-partners', label: 'Hub' },
  { to: EXPERIENCE, label: 'Safaricom journey' },
  { to: EXPERIENCE_JH, label: 'Java House journey' },
  { to: '/enterprise-partners/packaging', label: 'Packaging' },
  { to: '/enterprise-partners/touchpoints', label: 'Touchpoints' },
  { to: '/enterprise-partners/investor', label: 'Investor deck' },
]

/**
 * The one piece of navigation the enterprise prototype shares. Every page
 * below the hub used to be a dead end — you could only go back to the index —
 * so this bar carries the whole prototype on every page, with the current one
 * marked `aria-current` as well as for sighted readers.
 *
 * It scrolls horizontally instead of wrapping: on a phone a wrapping nav eats
 * the fold before the page content starts.
 *
 * @param {{ current: string, variant?: 'dark' | 'light', sticky?: boolean, className?: string }} props
 * `current` matches an item's `to` (query strings included). `sticky` is off
 * only where the page already owns a sticky header and the bar sits in it.
 */
export default function EnterpriseNav({ current, variant = 'dark', sticky = true, className = '' }) {
  const dark = variant === 'dark'
  const base = dark
    ? 'border-bone/10 bg-forest-950/92 text-sage-500'
    : 'border-forest-800/15 bg-bone/92 text-forest-800/70'
  const active = dark
    ? 'border-bone/70 text-bone'
    : 'border-forest-950/70 text-forest-950'

  return (
    <nav
      aria-label="Enterprise prototype"
      className={`${sticky ? 'sticky top-0 z-30' : 'relative z-30'} border-b backdrop-blur-md ${base} ${className}`}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-2.5 sm:px-6">
        <Link
          to="/enterprise-partners"
          aria-label="Enterprise hub"
          className={`mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
            dark ? 'border-bone/20 text-sage-300 hover:text-bone' : 'border-forest-800/25 text-forest-800 hover:text-forest-950'
          }`}
        >
          <Leaf className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </Link>
        {ITEMS.map((item) => {
          const isCurrent = item.to === current
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isCurrent ? 'page' : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                isCurrent
                  ? active
                  : dark
                    ? 'border-transparent hover:border-bone/25 hover:text-bone'
                    : 'border-transparent hover:border-forest-800/25 hover:text-forest-950'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
