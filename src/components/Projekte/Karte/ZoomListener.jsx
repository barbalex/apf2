import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useMapEvent } from 'react-leaflet/hooks'
import isEqual from 'lodash/isEqual'
import { getSnapshot } from 'mobx-state-tree'

import storeContext from '../../../storeContext'

const ZoomListener = () => {
  const store = useContext(storeContext)
  const { zoom, setZoom, center: centerIn, setCenter } = store
  const center = getSnapshot(centerIn)

  useMapEvent('zoomend', async (event) => {
    const map = event.target
    console.log('ZoomListener 1', { map, center, zoom })
    const newZoom = map.getZoom()
    const newCenter = map.getCenter()
    const newCenterConverted = [newCenter.lat, newCenter.lng]
    // sometimes exact same numbers > do not update

    if (newZoom === 0) return
    console.log('ZoomListener 2', {
      newZoom,
      newCenter,
    })
    if (zoom !== newZoom) setZoom(newZoom)
    if (!isEqual(newCenterConverted, center)) setCenter(newCenterConverted)
  })

  return null
}

export default observer(ZoomListener)
