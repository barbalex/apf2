import { useContext, useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'

const MapFilterListener = ({ treeName }) => {
  const map = useMap()
  const store = useContext(storeContext)
  const { mapFilter } = store[treeName]

  useEffect(() => {
    if (!mapFilter) {
      map.fireEvent('draw:deletedFromOutside')
    }
  }, [map, mapFilter])

  return null
}

export default observer(MapFilterListener)
