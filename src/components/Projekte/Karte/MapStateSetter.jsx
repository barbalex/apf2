import { useEffect, useContext } from 'react'
import { useMap } from 'react-leaflet'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'

const PngControl = () => {
  const store = useContext(storeContext)
  const map = useMap()

  useEffect(() => {
    store.map.setMap(map)
  }, [map, store.map])

  return null
}

export default observer(PngControl)
