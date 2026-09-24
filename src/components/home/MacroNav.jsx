import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Leaf, Menu, X } from 'lucide-react'
import OperationsTicker from './OperationsTicker'
import NavMegaMenu from './NavMegaMenu'
import { RECORD_MENU_COLUMNS, PARTNERS_MENU_COLUMNS } from '../../data/navMenus'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const SOLID_AFTER = 120 // px scrolled before the bar takes a background
const EASE = [0.16, 1, 0.3, 1]
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])'

const MOBILE_LINKS = [
  { href: '#proof', label: '3D Proof Map' },
  { href: '#buffer-belt', label: 'Buffer Belt' },
  { href: '#belt-ledger', label: 'Trees Funded' },
  { to: '/solutions/eudr-compliance', label: 'EUDR Compliance' },
  { href: '#partners', label: 'Sponsoring Brands' },
]

/**
 * Top navigation for the macro home. Transparent over the hero, then a solid
 * forest bar; hides on scroll-down and returns on scroll-up so it never blankets
 * the belt globe yet stays one gesture away when a visitor wants to navigate.
 */
export default function MacroNav() {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const reduced = usePrefersReducedMotion()
  const closeButtonRef = useRef(null)
  const menuButtonRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    let last = window.scrollY
    let ticking = false

    const update = () => {
      const y = window.scrollY
      setSolid(y > SOLID_AFTER)
      setHidden(y > last && y > window.innerHeight * 0.9)
      last = y
      ticking = false
    }

    // Batch to one state update per animation frame — a raw scroll listener
    // can fire far more often than that and drives redundant re-renders.
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the full-screen mobile menu is open — otherwise
  // the page behind it scrolls along with a touch drag on the drawer.
  useEffect(() => {
    if (!mobileOpen) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [mobileOpen])

  // Closing via Escape or the close button hands focus back to the trigger;
  // following a link doesn't, so focus lands where the link went instead.
  // Only touches a state setter and refs, so it's safe to call from the
  // effect below without listing it as a dependency.
  const closeMenu = () => {
    setMobileOpen(false)
    requestAnimationFrame(() => menuButtonRef.current?.focus())
  }

  // Escape closes the mobile menu too, matching the mega-menu's own pattern,
  // and Tab cycles within the drawer — it's `aria-modal`, so focus must not
  // wander to the page hidden behind it.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeMenu()
        return
      }
      if (e.key !== 'Tab' || !menuRef.current) return
      const focusables = menuRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen])

  // Move focus into the drawer on open, so a keyboard/screen-reader user
  // lands somewhere inside it rather than on the now-hidden trigger button.
  useEffect(() => {
    if (mobileOpen) closeButtonRef.current?.focus()
  }, [mobileOpen])

  return (
    <header
      className={
        'fixed inset-x-0 top-0 z-40 transition-transform duration-300 ' +
        (hidden ? '-translate-y-full' : 'translate-y-0')
      }
    >
      {/* Only shown pre-scroll, over the transparent hero — a hero-arrival
          flourish, not permanent chrome (mirrors the rest of the page:
          the cinematic budget spends early, then gets out of the way). */}
      {!solid && <OperationsTicker />}

      <div
        className={
          'transition-colors duration-300 ' +
          (solid ? 'border-b border-bone/10 bg-forest-950/85 backdrop-blur-md' : '')
        }
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8 sm:py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 py-1 font-mono text-sm font-medium uppercase tracking-[0.22em] text-bone"
          >
            <Leaf className="h-4 w-4 text-amber-400" strokeWidth={2.25} aria-hidden="true" />
            ForestOS
          </Link>

          <nav className="hidden items-center gap-4 sm:flex sm:gap-5">
            <NavMegaMenu label="The Record" columns={RECORD_MENU_COLUMNS} />
            <NavMegaMenu
              label="Partners"
              columns={PARTNERS_MENU_COLUMNS}
              panelWidthClass="w-[min(92vw,52rem)]"
              gridColsClass="sm:grid-cols-2 lg:grid-cols-4"
            />
            <Link
              to="/launch"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-amber-400/40 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-400 transition-colors duration-200 hover:border-amber-400 hover:bg-amber-400/10"
            >
              Request a Forest Edition
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
            </Link>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="macro-mobile-menu"
            className="grid h-10 w-10 place-items-center rounded-full text-bone sm:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            id="macro-mobile-menu"
            role="dialog"
            aria-label="Menu"
            aria-modal="true"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="fixed inset-0 z-50 flex flex-col overscroll-contain bg-forest-950/98 backdrop-blur-md sm:hidden"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="inline-flex items-center gap-2 font-mono text-sm font-medium uppercase tracking-[0.22em] text-bone">
                <Leaf className="h-4 w-4 text-amber-400" strokeWidth={2.25} aria-hidden="true" />
                ForestOS
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full text-bone"
              >
                <X className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
              {MOBILE_LINKS.map((item) =>
                item.to ? (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-bone/10 py-4 font-display text-2xl text-bone transition-colors hover:text-amber-400"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-bone/10 py-4 font-display text-2xl text-bone transition-colors hover:text-amber-400"
                  >
                    {item.label}
                  </a>
                ),
              )}
              <Link
                to="/qr-experience"
                onClick={() => setMobileOpen(false)}
                className="border-b border-bone/10 py-4 font-display text-2xl text-bone transition-colors hover:text-amber-400"
              >
                Scan Experience
              </Link>
            </nav>

            <div className="px-6 pb-10">
              <Link
                to="/launch"
                onClick={() => setMobileOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-400/40 px-5 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-amber-400 transition-colors duration-200 hover:border-amber-400 hover:bg-amber-400/10"
              >
                Request a Forest Edition
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
