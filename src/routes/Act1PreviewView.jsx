import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Act1Scene from '../scenes/act1V2/Act1Scene'
import { resolveBatch } from '../lib/mock'

/**
 * Isolated preview of the "Act I v2" low-poly diorama flyover — a prototype
 * for comparing against the shipped video-based canopy dive in `BatchView`.
 * Not linked from any nav; reachable only at `/batch/:batchId/act1-v2`.
 * Renders Act I alone (no globe, impact, or passport sections).
 */
export default function Act1PreviewView() {
  const { batchId } = useParams()
  const batch = useMemo(() => resolveBatch(batchId), [batchId])

  useEffect(() => {
    document.title = `ForestOS — Act I v2 Preview (${batch.id})`
  }, [batch.id])

  return (
    <>
      <a
        href="#act1-heading"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-forest-950"
      >
        Skip to the scene
      </a>

      <Link
        to="/"
        className="fixed left-4 top-4 z-40 inline-flex items-center gap-1.5 rounded-full border border-bone/15 bg-forest-950/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-sage-300 backdrop-blur transition-colors hover:text-bone"
      >
        ForestOS
        <ArrowUpRight className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
      </Link>

      <Link
        to={`/batch/${batch.id}`}
        className="fixed right-4 top-4 z-40 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-forest-950/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-400 backdrop-blur transition-colors hover:text-amber-300"
      >
        Compare with live Act I
      </Link>

      <main id="act1-heading">
        <Act1Scene batchLabel={`Batch #${batch.id}`} />
      </main>
    </>
  )
}
