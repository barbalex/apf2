import { useMapEvents } from 'react-leaflet'

import { mapViewAtom, store } from '../../../store/index.ts'

/**
 * persist the current map view (center and zoom) whenever it changes,
 * so re-opening the map (or reloading the page) restores the exact
 * same view, not just the same layers
 */
export const MapPersister = () => {
  const map = useMapEvents({
    // moveend fires after panning and after zooming ends
    moveend: () => {
      store.set(mapViewAtom, {
        center: map.getCenter(),
        zoom: map.getZoom(),
      })
    },
  })

  return null
}
