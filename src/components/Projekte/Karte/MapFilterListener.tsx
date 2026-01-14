import { useContext, useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.ts'

export const MapFilterListener = observer(() => {
  const map = useMap()
  const store = useContext(MobxContext)
  const { mapFilter } = store.tree

  useEffect(() => {
    if (!mapFilter) {
      map.fireEvent('draw:deletedFromOutside')
    }
  }, [map, mapFilter])

  return null
})
