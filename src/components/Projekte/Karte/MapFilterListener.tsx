import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { useAtomValue } from 'jotai'

import { treeMapFilterAtom } from '../../../store/index.ts'

export const MapFilterListener = () => {
  const map = useMap()
  const mapFilter = useAtomValue(treeMapFilterAtom)

  useEffect(() => {
    if (!mapFilter) {
      map.fireEvent('draw:deletedFromOutside')
    }
  }, [map, mapFilter])

  return null
}
