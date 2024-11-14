import { memo, useContext, useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../storeContext.js'

export const MapFilterListener = memo(
  observer(() => {
    const map = useMap()
    const store = useContext(StoreContext)
    const { mapFilter } = store.tree

    useEffect(() => {
      if (!mapFilter) {
        map.fireEvent('draw:deletedFromOutside')
      }
    }, [map, mapFilter])

    return null
  }),
)
