import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

const MapResizer = ({ children, mapContainerRef }) => {
  const map = useMap()

  // need this to prevent map from greying out on resize
  // https://github.com/PaulLeCam/react-leaflet/issues/1074
  useEffect(() => {
    const container = mapContainerRef?.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      if (map) {
        console.log('MapResizer, resizeObserver resizing map')
        map.invalidateSize()
      }
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.unobserve(container)
    }
  }, [map, mapContainerRef])

  return children
}

export default MapResizer
