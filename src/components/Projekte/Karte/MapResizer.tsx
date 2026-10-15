import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { useAtomValue } from 'jotai'
import type { LatLngBoundsExpression } from 'leaflet'

import { mapBoundsAtom, mapViewAtom, store } from '../../../store/index.ts'

interface MapResizerProps {
  children: React.ReactNode
  mapContainerRef: React.RefObject<HTMLDivElement | null>
}

export const MapResizer = ({
  children,
  mapContainerRef,
}: MapResizerProps) => {
  const map = useMap()
  const bounds = useAtomValue(mapBoundsAtom)

  // need this to prevent map from greying out on resize
  // https://github.com/PaulLeCam/react-leaflet/issues/1074
  useEffect(() => {
    const container = mapContainerRef?.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      if (map) {
        // console.log('MapResizer, resizeObserver resizing map')
        map.invalidateSize()
      }
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.unobserve(container)
    }
  }, [map, mapContainerRef])

  // this is a bad hack to make sure bounds are set
  // somehow on reload of the page they are not set
  // only needed as long as no exact view (center/zoom) has been persisted;
  // otherwise this would move the map away from the restored view
  useEffect(() => {
    if (map) {
      // console.log('MapResizer fitting bounds')
      setTimeout(() => {
        // Uncaught TypeError: Cannot read properties of undefined (reading '_leaflet_pos')
        // thus: try/catch
        try {
          if (!store.get(mapViewAtom)) {
            // atomWithStorage provides the bounds as number[][],
            // which is a valid LatLngBoundsLiteral at runtime
            map.fitBounds(bounds as LatLngBoundsExpression)
          }
        } catch (error) {
          console.log('MapResizer error fitting bounds:', error)
        }
      }, 800)
    }
  }, [bounds, map])

  return children
}
