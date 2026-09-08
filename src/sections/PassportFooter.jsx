import { useState } from 'react'
import { Download } from 'lucide-react'
import LoopingVideo from '../components/LoopingVideo'
import { downloadConservationPassport } from '../lib/passportPdf'
import { useBatch } from '../lib/batchContext'

export default function PassportFooter() {
  const BATCH = useBatch()
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = () => {
    downloadConservationPassport(BATCH)
    setDownloaded(true)
  }

  return (
    <footer className="relative z-10 overflow-hidden border-t border-bone/10 bg-forest-900">
      <LoopingVideo
        src="/media/teapour.webm"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-900/95 via-forest-900/92 to-forest-950/95" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="max-w-[20ch] font-display text-2xl leading-tight text-bone sm:text-4xl">
              Take the record with you.
            </h2>
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 font-mono text-xs">
              <div>
                <dt className="text-sage-500">Batch ID</dt>
                <dd className="mt-1 text-sm text-bone">#{BATCH.id}</dd>
              </div>
              <div>
                <dt className="text-sage-500">Sourced volume</dt>
                <dd className="mt-1 text-sm text-bone">{BATCH.sourcedVolumeLabel}</dd>
              </div>
              <div>
                <dt className="text-sage-500">Buffer zone</dt>
                <dd className="mt-1 text-sm text-bone">{BATCH.bufferZone}</dd>
              </div>
            </dl>
          </div>

          <div className="md:text-right">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2.5 rounded-full bg-amber-400 px-6 py-3.5 text-sm font-semibold text-forest-950 transition-colors duration-200 hover:bg-amber-500"
            >
              <Download className="h-4 w-4" strokeWidth={2.25} />
              Download Verified Conservation Passport (PDF)
            </button>
            <p
              className="mt-3 font-mono text-[11px] text-sage-500"
              aria-live="polite"
            >
              {downloaded
                ? 'Saved — prototype document, illustrative data.'
                : 'Prototype export · generated in your browser.'}
            </p>
          </div>
        </div>

        <p className="mt-14 max-w-[60ch] text-[11px] leading-relaxed text-bone-500">
          This page is a prototype. There is no ForestOS backend yet; batch
          figures, coordinates, verification references and the 3D recovery
          overlay are illustrative mock data.
        </p>
      </div>
    </footer>
  )
}
