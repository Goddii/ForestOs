import { CANOPY_COMPARISONS, WAYBACK_TILE_URL, LANDSCAPE_LAYERS } from '../../data/investor'

const OFFSETS = [-1, 0, 1]
const ZONE_LABELS = Object.fromEntries(LANDSCAPE_LAYERS.map((feature) => [feature.id, feature.label]))

function tileUrl(releaseId, z, x, y) {
  return WAYBACK_TILE_URL.replace('{release}', releaseId).replace('{z}', z).replace('{x}', x).replace('{y}', y)
}

/**
 * A 3×3 block of real archive tiles around a zone's centre, for one release.
 *
 * @param {{ releaseId: string, tile: { z: number, x: number, y: number }, label: string, date: string }} props
 */
function ImageryPanel({ releaseId, tile, label, date }) {
  return (
    <figure>
      <div className="relative grid aspect-square grid-cols-3 overflow-hidden rounded-lg bg-canvas-sunk">
        {OFFSETS.map((dy) =>
          OFFSETS.map((dx) => (
            <img
              key={`${dx}:${dy}`}
              src={tileUrl(releaseId, tile.z, tile.x + dx, tile.y + dy)}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          )),
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 font-mono text-label uppercase tracking-label text-white">
          {label} · {date}
        </span>
      </div>
    </figure>
  )
}

/**
 * Canopy before/after for each conservation zone — the swipe-to-compare
 * pattern Restor and Esri's World Imagery Wayback use, built from real,
 * dated archive imagery of the landscape. Framed honestly: this is
 * landscape context, and the change shown is not attributed to the
 * programme; programme-captured imagery replaces it once the backend
 * provides it. (Static side-by-side for design review; the draggable swipe
 * comes after sign-off.)
 */
export default function CanopyComparison() {
  return (
    <div className="space-y-10">
      {CANOPY_COMPARISONS.map((comparison) => (
        <article key={comparison.zoneId}>
          <h3 className="text-base font-semibold text-ink">{ZONE_LABELS[comparison.zoneId]}</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ImageryPanel releaseId={comparison.baseline.releaseId} tile={comparison.tile} label="Baseline" date={comparison.baseline.date} />
            <ImageryPanel releaseId={comparison.latest.releaseId} tile={comparison.tile} label="Latest" date={comparison.latest.date} />
          </div>
          <p className="mt-2 text-label leading-relaxed text-ink-faint">
            Real archive imagery of this landscape — Esri World Imagery Wayback; dates are archive releases, and the
            underlying capture can be earlier. Landscape context only: change between the two is not attributed to the
            programme.
          </p>
        </article>
      ))}
    </div>
  )
}
