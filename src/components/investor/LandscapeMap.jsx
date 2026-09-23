import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { LANDSCAPE_CENTER, LANDSCAPE_LAYERS, LANDSCAPE_LAYER_META } from '../../data/investor'
import { useEvidenceDrawer } from './EvidenceDrawerContext'

// CartoDB's dark_all basemap now requires a registered API key (it didn't
// when this was first wired up), so the dark ground uses standard,
// genuinely key-free OpenStreetMap tiles instead, darkened with a CSS
// filter on the tile pane (`investor-map-dark-tiles` in index.css) — the
// standard no-backend way to get a dark basemap from OSM tiles.
const DARK_TILES = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors',
  className: 'investor-map-dark-tiles',
}
const SATELLITE_TILES = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution: 'Tiles &copy; Esri',
  className: '',
}

// The five controls the build brief calls for; boundary-type polygons
// (project boundary, farm/community areas, monitoring zones) all fold under
// "Boundaries" so the control row stays at five, not eight.
const CONTROLS = [
  { key: 'satellite', label: 'Satellite' },
  { key: 'conservation_area', label: 'Conservation' },
  { key: 'field_activity', label: 'Field activity' },
  { key: 'verification_point', label: 'Verification' },
  { key: 'boundaries', label: 'Boundaries' },
]
const BOUNDARY_LAYERS = new Set(['boundary', 'farm_area', 'monitoring_zone'])

/**
 * Landscape Intelligence (build brief §9) — the project's evidence map, not
 * decoration. Hand-rolled thin Leaflet wrapper (imperative `useEffect`)
 * rather than adding `react-leaflet` as a new dependency: `leaflet` itself
 * is already an existing, currently-unused project dependency (see the
 * audit doc), so this reuses it without adding anything new. Points render
 * as `L.circleMarker` (no default-icon asset, no bundler marker-icon
 * workaround needed) colored by confidence status.
 *
 * @param {{ className?: string }} props
 */
export default function LandscapeMap({ className = '' }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const tileLayerRef = useRef(null)
  const overlayLayersRef = useRef({})
  const { openEvidence, openZone } = useEvidenceDrawer()
  const [mapReady, setMapReady] = useState(false)
  const [activeControls, setActiveControls] = useState(
    () => new Set(['conservation_area', 'field_activity', 'verification_point', 'boundaries']),
  )

  // Map creation is async (Leaflet is dynamically imported) — `mapReady`
  // flips once it's actually usable, so the two effects below (which need
  // `mapRef.current`) re-run at that point instead of racing this one and
  // silently no-op'ing forever because they only depend on `activeControls`.
  useEffect(() => {
    let cancelled = false
    import('leaflet').then((leafletModule) => {
      if (cancelled || !containerRef.current || mapRef.current) return
      const L = leafletModule.default

      const map = L.map(containerRef.current, {
        center: LANDSCAPE_CENTER,
        zoom: 12,
        zoomControl: false,
        attributionControl: true,
      })
      L.control.zoom({ position: 'topright' }).addTo(map)
      mapRef.current = map

      const overlays = {}
      for (const feature of LANDSCAPE_LAYERS) {
        const meta = LANDSCAPE_LAYER_META[feature.layer]
        const groupKey = BOUNDARY_LAYERS.has(feature.layer) ? 'boundaries' : feature.layer
        overlays[groupKey] ??= L.layerGroup()

        if (feature.geometryType === 'polygon') {
          const isClickableZone = feature.layer === 'conservation_area' && feature.zone
          const polygon = L.polygon(feature.geometry, {
            color: meta.color,
            weight: 1.5,
            fillColor: meta.color,
            fillOpacity: 0.12,
            className: isClickableZone ? 'cursor-pointer' : undefined,
          }).bindTooltip(
            isClickableZone ? `${feature.label} — click for detail` : feature.label,
            { sticky: true },
          )
          if (isClickableZone) {
            polygon.on('click', () => openZone(feature.id))
            polygon.on('mouseover', () => polygon.setStyle({ fillOpacity: 0.32, weight: 2.5 }))
            polygon.on('mouseout', () => polygon.setStyle({ fillOpacity: 0.12, weight: 1.5 }))
          }
          polygon.addTo(overlays[groupKey])
        } else {
          const marker = L.circleMarker(feature.geometry, {
            radius: 6,
            color: meta.color,
            weight: 2,
            fillColor: meta.color,
            fillOpacity: 0.85,
          }).bindTooltip(feature.label, { sticky: true })
          if (feature.evidenceId) {
            marker.on('click', () => openEvidence(feature.evidenceId))
          }
          marker.addTo(overlays[groupKey])
        }
      }
      overlayLayersRef.current = overlays
      setMapReady(true)
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Base tile layer follows the "Satellite" toggle
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const map = mapRef.current
    const tiles = activeControls.has('satellite') ? SATELLITE_TILES : DARK_TILES
    import('leaflet').then((leafletModule) => {
      const L = leafletModule.default
      if (tileLayerRef.current) map.removeLayer(tileLayerRef.current)
      tileLayerRef.current = L.tileLayer(tiles.url, {
        attribution: tiles.attribution,
        maxZoom: 18,
        className: tiles.className,
      }).addTo(map)
      tileLayerRef.current.bringToBack()
    })
  }, [activeControls, mapReady])

  // Overlay visibility follows the four data-layer toggles
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const map = mapRef.current
    for (const [key, group] of Object.entries(overlayLayersRef.current)) {
      const shouldShow = activeControls.has(key)
      const isOnMap = map.hasLayer(group)
      if (shouldShow && !isOnMap) group.addTo(map)
      if (!shouldShow && isOnMap) map.removeLayer(group)
    }
  }, [activeControls, mapReady])

  function toggleControl(key) {
    setActiveControls((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line shadow-card ${className}`}>
      <div className="absolute left-3 top-3 z-[1000] flex flex-wrap gap-1.5">
        {CONTROLS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => toggleControl(key)}
            className={`cursor-pointer rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 ${
              activeControls.has(key)
                ? 'border-emerald-400/60 bg-forest-accent/25 text-bone shadow-[0_0_0_1px_rgba(16,185,129,0.15)]'
                : 'border-bone/15 bg-forest-950/60 text-sage-300 hover:border-bone/30 hover:bg-forest-950/80 hover:text-bone'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-bone/15 bg-forest-950/80 p-2.5 backdrop-blur-sm">
        <ul className="space-y-1">
          {Object.entries(LANDSCAPE_LAYER_META).map(([key, meta]) => (
            <li key={key} className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-sage-300">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
              {meta.label}
            </li>
          ))}
        </ul>
      </div>

      <div ref={containerRef} className="h-full min-h-[22rem] w-full bg-forest-950" />
    </div>
  )
}
