import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useMapEvent } from 'react-leaflet/hooks'
import isEqual from 'lodash/isEqual'

import storeContext from '../../../storeContext'

const ZoomListener = () => {
  const store = useContext(storeContext)
  const { zoom, setZoom, center, setCenter } = store

  const map = useMapEvent('zoomend', async () => {
    const newZoom = map.getZoom()
    const newCenter = map.getCenter()
    const newCenterConverted = [newCenter.lat, newCenter.lng]
    // sometimes exact same numbers > do not update

    console.log('ZoomListener', {
      newZoom,
      newCenter,
    })
    if (zoom !== newZoom) setZoom(newZoom)
    if (!isEqual(newCenterConverted, center)) setCenter(newCenterConverted)
  })

  return null
}

export default observer(ZoomListener)
