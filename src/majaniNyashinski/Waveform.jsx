const BAR_COUNT = 40

// Deterministic pseudo-random bar heights (no Math.random — stable across
// server/client and re-renders), shaped so the middle of the strip reads
// taller than the edges, like a real waveform silhouette rather than static.
const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = i / (BAR_COUNT - 1)
  const envelope = Math.sin(t * Math.PI) // 0 at edges, 1 at centre
  const jitter = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
  return 0.18 + envelope * 0.55 + jitter * 0.27
})

/**
 * A waveform silhouette — used as a recurring visual motif (hook detail,
 * music-moment centerpiece, and the transition into the tea/forest beats),
 * never a real audio analyser (no audio element exists to analyse). `active`
 * drives a gentle per-bar pulse; static and legible either way.
 *
 * @param {{ active?: boolean, className?: string, barClassName?: string }} props
 */
export default function Waveform({ active = false, className = '', barClassName = '' }) {
  return (
    <div className={`flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {BAR_HEIGHTS.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${barClassName} ${active ? 'animate-pulse' : ''}`}
          style={{
            height: `${Math.round(h * 100)}%`,
            animationDelay: active ? `${(i % 8) * 90}ms` : undefined,
            animationDuration: active ? `${900 + (i % 5) * 120}ms` : undefined,
          }}
        />
      ))}
    </div>
  )
}
