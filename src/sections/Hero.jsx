import { ArrowDown } from 'lucide-react'
import CinematicHero from '../components/cinematic/CinematicHero'
import { HOTSPOTS } from '../lib/mock'
import { useBatch } from '../lib/batchContext'

const STORY_LINES = [
  '940 kilometres of protected forest edge.',
  'Defended by the farmers who pluck this leaf.',
  'Verified from the canopy to your cup.',
]

function scrollToProof() {
  document.getElementById('proof')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** The batch QR-scan hero — the shared canopy dive framed for one batch. */
export default function Hero({ videoRef }) {
  const BATCH = useBatch()

  return (
    <CinematicHero videoRef={videoRef} storyLines={STORY_LINES} hotspots={HOTSPOTS}>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-sage-300">
        Batch #{BATCH.id}
        <span className="mx-2 text-sage-500">·</span>
        Buffer Zone: {BATCH.bufferZone}
      </p>
      <h1
        id="hero-heading"
        className="mt-4 max-w-[16ch] font-display text-4xl leading-[1.05] text-bone sm:max-w-[20ch] sm:text-6xl"
      >
        This cup protected <span className="text-amber-400">10&nbsp;m²</span> of
        Kenya&rsquo;s natural water towers.
      </h1>
      <button
        type="button"
        onClick={scrollToProof}
        className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-amber-400 px-6 py-3.5 font-sans text-sm font-semibold text-forest-950 transition-colors duration-200 hover:bg-amber-500"
      >
        Explore your tea&rsquo;s origin
        <ArrowDown
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
          strokeWidth={2.25}
        />
      </button>
    </CinematicHero>
  )
}
