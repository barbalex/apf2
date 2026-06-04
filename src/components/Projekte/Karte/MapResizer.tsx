import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { useAtomValue } from 'jotai'

import { mapBoundsAtom } from '../../../store/index.ts'

export const MapResizer = ({ children, mapContainerRef }) => {
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
  useEffect(() => {
    if (map) {
      // console.log('MapResizer fitting bounds')
      setTimeout(() => {
        // Uncaught TypeError: Cannot read properties of undefined (reading '_leaflet_pos')
        // thus: try/catch
        try {
          map.fitBounds(bounds)
        } catch (error) {
          console.log('MapResizer error fitting bounds:', error)
        }
      }, 800)
    }
  }, [bounds, map])

  return children
}
