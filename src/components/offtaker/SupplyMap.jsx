import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

const TILES = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors',
}

/**
 * Collection centres on a light, desaturated basemap (the white-canvas
 * counterpart of the funder console's dark `LandscapeMap`, same thin
 * imperative Leaflet wrapper, no react-leaflet). Circle area follows the
 * volume on offer; centres with nothing on offer are hollow. The table
 * beside the map carries every value as text.
 *
 * @param {{ centres: Array<{ id: string, name: string, zone: string, lat: number, lon: number, availableKg: number, forecastKg: number, conservationLinked: boolean }>, onSelect?: (id: string) => void, className?: string }} props
 */
export default function SupplyMap({ centres, onSelect, className = '' }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    import('leaflet').then((module) => {
      if (cancelled || !containerRef.current || mapRef.current) return
      const L = module.default
      const map = L.map(containerRef.current, { zoomControl: false, scrollWheelZoom: false })
      L.control.zoom({ position: 'topright' }).addTo(map)
      L.tileLayer(TILES.url, { attribution: TILES.attribution, maxZoom: 16, className: 'offtaker-map-tiles' }).addTo(map)
      mapRef.current = map

      const maxKg = Math.max(1, ...centres.map((centre) => centre.availableKg + centre.forecastKg))
      for (const centre of centres) {
        const total = centre.availableKg + centre.forecastKg
        const marker = L.circleMarker([centre.lat, centre.lon], {
          radius: 6 + 14 * Math.sqrt(total / maxKg),
          color: '#176b45',
          weight: 2,
          fillColor: '#176b45',
          fillOpacity: centre.availableKg > 0 ? 0.55 : 0,
        })
          .bindTooltip(
            `<strong>${centre.name}</strong> · ${centre.zone}<br/>${centre.availableKg.toLocaleString('en-US')} kg available now<br/>~${centre.forecastKg.toLocaleString('en-US')} kg expected next quarter${
              centre.conservationLinked ? '<br/>Linked to verified conservation work' : ''
            }`,
            { sticky: true },
          )
          .addTo(map)
        if (onSelect) marker.on('click', () => onSelect(centre.id))
      }
      map.fitBounds(L.latLngBounds(centres.map((centre) => [centre.lat, centre.lon])), { padding: [36, 36] })
    })
    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
    }
    // Built once per mount; the centre list is static for a workspace.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line bg-canvas shadow-card ${className}`}>
      <div ref={containerRef} className="h-full min-h-[22rem] w-full" role="img" aria-label="Map of Nyayo Tea Zone collection centres; values are listed in the table" />
      <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-line bg-card/95 px-3 py-2 text-xs text-ink-muted shadow-card">
        <p className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-forest-accent bg-forest-accent/55" aria-hidden="true" /> Tea available now
        </p>
        <p className="mt-1 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-forest-accent" aria-hidden="true" /> Expected production only
        </p>
        <p className="mt-1 text-ink-faint">Circle area follows volume</p>
      </div>
    </div>
  )
}
