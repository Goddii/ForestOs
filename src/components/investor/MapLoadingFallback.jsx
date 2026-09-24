/**
 * Fills the exact slot `LandscapeMap` occupies while it lazy-loads — kept
 * dark like the map itself (visual-system brief §23: the map stays a
 * deliberate dark "window" on the white canvas, not flattened to match the
 * page) so there's no light-to-dark flash once the real map mounts.
 *
 * @param {{ className?: string }} props
 */
export default function MapLoadingFallback({ className = '' }) {
  return (
    <div
      className={`grid min-h-[22rem] place-items-center rounded-2xl border border-line bg-forest-950 ${className}`}
    >
      <span className="font-mono text-label uppercase tracking-label-wide text-sage-500">
        Loading landscape data…
      </span>
    </div>
  )
}
