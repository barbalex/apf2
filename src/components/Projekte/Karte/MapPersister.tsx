import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useMapEvents } from 'react-leaflet'

import { mapViewAtom, store } from '../../../store/index.ts'
import type { MapView } from '../../../store/index.ts'
import {
  formatMapView,
  mapViewSearchParamName,
} from '../../../modules/mapViewSearchParam.ts'

/**
 * persist the current map view (center and zoom) whenever it changes,
 * so re-opening the map (or reloading the page) restores the exact
 * same view, not just the same layers.
 * The view is also kept in the `map` search param so it is linkable.
 * Writing goes through the router (replace, not push) to keep the router
 * the single source of url truth — a history.replaceState shortcut would
 * be dropped by the next navigation, which rebuilds search from the
 * router's location. Render cost stays within that of a tree click:
 * writes happen on moveend only and are skipped when nothing changed.
 */
export const MapPersister = () => {
  const [, setSearchParams] = useSearchParams()
  const lastWritten = useRef<string | null>(null)

  const writeViewToUrl = (view: MapView) => {
    const formatted = formatMapView(view)
    if (formatted === lastWritten.current) return
    lastWritten.current = formatted
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set(mapViewSearchParamName, formatted)
        return next
      },
      { replace: true },
    )
  }

  const map = useMapEvents({
    // moveend fires after panning and after zooming ends
    moveend: () => {
      const view = { center: map.getCenter(), zoom: map.getZoom() }
      store.set(mapViewAtom, view)
      writeViewToUrl(view)
    },
  })

  // complete the url as soon as the map opens, with the restored view
  useEffect(() => {
    writeViewToUrl({ center: map.getCenter(), zoom: map.getZoom() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  return null
}
