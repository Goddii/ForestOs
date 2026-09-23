import { Leaf } from 'lucide-react'
import Reveal from '../components/Reveal'

/**
 * Final ForestOS reveal + the three closing actions. `discoverUrl` is the
 * real, already-built `/batch/921` proof page — reused, not rebuilt.
 *
 * @param {{
 *   spotifyUrl: string, discoverUrl: string,
 *   onSpotifyClick: () => void, onDiscoverClick: () => void, onActClick: () => void,
 * }} props
 */
export default function Finale({ spotifyUrl, discoverUrl, onSpotifyClick, onDiscoverClick, onActClick }) {
  return (
    <section className="bg-ink px-6 py-28 text-bone sm:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Leaf className="mx-auto h-6 w-6 text-emerald-400" strokeWidth={1.75} aria-hidden="true" />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-bone-500">
            ForestOS
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[1.02] sm:text-5xl">
            The technology behind the story.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-bone-300">
            Trace. Verify. Act. Every claim on this page traced back to a real
            record — that's what ForestOS is, quietly, underneath all of it.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 grid gap-3 sm:grid-cols-3">
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onSpotifyClick}
            className="rounded-full bg-emerald-500 px-5 py-3.5 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Listen
          </a>
          <a
            href={discoverUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDiscoverClick}
            className="rounded-full border border-bone/40 px-5 py-3.5 font-sans text-sm font-semibold text-bone transition-colors duration-200 hover:border-bone hover:bg-bone hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Discover
          </a>
          <button
            type="button"
            onClick={onActClick}
            className="rounded-full border border-bone/40 px-5 py-3.5 font-sans text-sm font-semibold text-bone transition-colors duration-200 hover:border-bone hover:bg-bone hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Act
          </button>
        </Reveal>
      </div>
    </section>
  )
}
