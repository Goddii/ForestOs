import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf } from 'lucide-react'

const SOLID_AFTER = 120 // px scrolled before the bar takes a background

/**
 * Top navigation for the macro home. Transparent over the hero, then a solid
 * forest bar; hides on scroll-down and returns on scroll-up so it never blankets
 * the belt globe yet stays one gesture away when a visitor wants to navigate.
 */
export default function MacroNav() {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)

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

  return (
    <header
      className={
        'fixed inset-x-0 top-0 z-40 transition-transform duration-300 ' +
        (hidden ? '-translate-y-full' : 'translate-y-0')
      }
    >
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

          <nav className="flex items-center gap-4 sm:gap-5">
            <a
              href="#proof"
              className="hidden px-1 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-300 transition-colors hover:text-bone sm:inline"
            >
              The Belt
            </a>
            <a
              href="#buffer-belt"
              className="hidden px-1 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-300 transition-colors hover:text-bone sm:inline"
            >
              Buffer Belt
            </a>
            <a
              href="#partners"
              className="hidden px-1 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-300 transition-colors hover:text-bone sm:inline"
            >
              Partners
            </a>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 font-sans text-[13px] font-semibold text-forest-950 transition-colors duration-200 hover:bg-amber-500"
            >
              <span className="sm:hidden">Login</span>
              <span className="hidden sm:inline">Offtaker &amp; Brand Login</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
