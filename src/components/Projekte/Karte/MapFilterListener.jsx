import { useContext, useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'

const MapFilterListener = () => {
  const map = useMap()
  const store = useContext(storeContext)
  const { mapFilter } = store.tree

  useEffect(() => {
    if (!mapFilter) {
      // console.log('firing draw:deletedFromOutside')
      map.fireEvent('draw:deletedFromOutside')
    }
  }, [map, mapFilter])

  return null
}

export default observer(MapFilterListener)
