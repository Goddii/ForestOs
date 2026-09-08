import { ArrowDown } from 'lucide-react'
import CinematicHero from '../cinematic/CinematicHero'
import BatchLookupBar from './BatchLookupBar'
import { PLATFORM } from '../../lib/platformData'

const STORY_LINES = [
  'This canopy is a water tower for the whole country.',
  'Smallholder tea farms hold its edge, plot by plot.',
  'From the canopy to the cup, verified on one record.',
]

function scrollToProof() {
  document.getElementById('proof')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** The macro home hero — the same canopy dive, framed for the whole belt. */
export default function MacroHero({ videoRef }) {
  return (
    <CinematicHero videoRef={videoRef} storyLines={STORY_LINES} cueLabel={null}>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-sage-300">
        940 km · 5 water towers · 16 counties
      </p>
      <h1
        id="hero-heading"
        className="mt-4 max-w-[22ch] font-display text-4xl leading-[1.05] text-bone sm:text-6xl"
      >
        {PLATFORM.tagline}
      </h1>
      <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-bone-300">
        Kenya&rsquo;s tea grows in a ring around five great forest blocks. ForestOS
        turns that belt into a verifiable buffer, proven plot by plot.
      </p>

      <div className="mt-7 flex flex-col gap-4">
        <button
          type="button"
          onClick={scrollToProof}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 text-sm font-semibold text-forest-950 transition-colors duration-200 hover:bg-amber-500"
        >
          Explore the whole belt
          <ArrowDown className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
        </button>

        <div className="max-w-md">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
            Scanned a pack of this tea?
          </p>
          <BatchLookupBar variant="compact" />
        </div>
      </div>
    </CinematicHero>
  )
}
