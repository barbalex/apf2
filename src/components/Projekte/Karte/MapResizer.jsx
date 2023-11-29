import { useEffect, useContext } from 'react'
import { useMap } from 'react-leaflet'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import storeContext from '../../../storeContext'

const MapResizer = ({ children, mapContainerRef }) => {
  const map = useMap()
  const store = useContext(storeContext)
  const { bounds: boundsRaw } = store
  const bounds = getSnapshot(boundsRaw)

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
      console.log('MapResizer fitting bounds')
      setTimeout(() => map.fitBounds(bounds), 800)
    }
  }, [bounds, map])

  return children
}

export default observer(MapResizer)
