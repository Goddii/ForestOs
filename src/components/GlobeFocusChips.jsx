import { MapPin, Trees, Droplets } from 'lucide-react'

const ICONS = { pin: MapPin, trees: Trees, droplet: Droplets }

/**
 * Row of floating pill chips over the globe HUD. Clicking one asks the parent
 * to fly the camera to that point and open the telemetry drawer; the active
 * chip carries a subtle amber tint, matching the era toggle's active state.
 */
export default function GlobeFocusChips({ foci, activeId, onFocus }) {
  return (
    <div
      role="group"
      aria-label="Fly to a monitored location"
      className="flex flex-wrap gap-2"
    >
      {foci.map((focus) => {
        const Icon = ICONS[focus.icon] ?? MapPin
        const active = focus.id === activeId
        return (
          <button
            key={focus.id}
            type="button"
            onClick={() => onFocus(focus)}
            aria-pressed={active}
            className={
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] backdrop-blur transition-colors duration-200 ' +
              (active
                ? 'border-amber-400/55 bg-amber-400/15 text-bone'
                : 'border-bone/15 bg-forest-950/70 text-sage-300 hover:border-bone/30 hover:text-bone')
            }
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {focus.label}
          </button>
        )
      })}
    </div>
  )
}
