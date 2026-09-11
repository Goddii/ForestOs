import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import EditionConfiguratorForm from '../components/launch/EditionConfiguratorForm'

/**
 * "Launch your edition" — a self-serve lead-gen page reachable from the home
 * page's corporate-gateway footer. Restrained on purpose: no persistent nav,
 * a single back link and skip link, matching the batch page's convention
 * rather than the home page's fuller chrome.
 */
export default function LaunchEdition() {
  useEffect(() => {
    document.title = 'ForestOS — Launch a Forest Edition'
  }, [])

  return (
    <>
      <a
        href="#launch-heading"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-forest-950"
      >
        Skip to the form
      </a>

      <main className="min-h-svh bg-forest-950 px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-300 transition-colors hover:text-bone"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
            ForestOS
          </Link>

          <div id="launch-heading" className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sage-500">
              Launch your edition
            </p>
            <h1 className="mt-3 max-w-[16ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
              Your community. Your tea. Your forest impact.
            </h1>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-sage-300">
              Pick a tea, bring your mark, and we handle sourcing, packing and
              the conservation ledger from there.
            </p>
          </div>

          <div className="mt-10">
            <EditionConfiguratorForm />
          </div>
        </div>
      </main>
    </>
  )
}
