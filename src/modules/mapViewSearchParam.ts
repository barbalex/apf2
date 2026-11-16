// the map view (center and zoom) is kept in the url as a single `map`
// search param, osm-style `zoom/lat/lng`, so map views are linkable
import type { MapView } from '../store/map.ts'

export const mapViewSearchParamName = 'map'

export const formatMapView = (view: MapView): string =>
  `${String(Math.round(view.zoom * 100) / 100)}/${view.center.lat.toFixed(5)}/${view.center.lng.toFixed(5)}`

export const parseMapView = (
  value: string | null | undefined,
): MapView | undefined => {
  if (!value) return undefined
  const parts = value.split('/')
  if (parts.length !== 3) return undefined
  const zoom = Number(parts[0])
  const lat = Number(parts[1])
  const lng = Number(parts[2])
  if (![zoom, lat, lng].every((n) => Number.isFinite(n))) return undefined
  // keep in sync with the MapContainer's minZoom/maxZoom
  if (zoom < 0 || zoom > 23) return undefined
  if (lat < -90 || lat > 90) return undefined
  if (lng < -180 || lng > 180) return undefined
  return { center: { lat, lng }, zoom }
}
