import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from '@changey/react-leaflet-markercluster'
import { useQuery } from '@apollo/client'
import { useMap } from 'react-leaflet'
import cloneDeep from 'lodash/cloneDeep'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'

const iconCreateFunction = function (cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedPop = markers.some(
    (m) => m.options.icon.options.className === 'popIconHighlighted',
  )
  const className = hasHighlightedPop ? 'popClusterHighlighted' : 'popCluster'
  if (typeof window === 'undefined') return () => {}
  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const Pop = ({ treeName }) => {
  const leafletMap = useMap()
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const tree = store[treeName]
  const { popGqlFilter } = tree

  const popFilter = cloneDeep(popGqlFilter.filtered)
  popFilter.or.forEach((f) => (f.wgs84Lat = { isNull: false }))

  var { data, error } = useQuery(query, {
    variables: {
      popFilter,
    },
  })

  // eslint-disable-next-line no-unused-vars
  const [refetchProvoker, setRefetchProvoker] = useState(1)
  useEffect(() => {
    // DO NOT use:
    // leafletMap.on('zoomend dragend', refetch
    // see: https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
    // Also: leafletMap.on('zoomend dragend', ()=> refetch()) never refetches!!??
    // Also: use dragend, not moveend because moveend fires on zoomend as well
    leafletMap.on('zoomend dragend', () => {
      // console.log('zoomend dragend')
      setRefetchProvoker(Math.random())
    })
    return () => {
      leafletMap.off('zoomend dragend', () => {
        setRefetchProvoker(Math.random())
      })
    }
  }, [leafletMap])

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  return (
    <MarkerClusterGroup
      maxClusterRadius={66}
      iconCreateFunction={iconCreateFunction}
    >
      {(data?.allPops?.nodes ?? []).map((pop) => (
        <Marker key={pop.id} treeName={treeName} pop={pop} />
      ))}
    </MarkerClusterGroup>
  )
}

export default observer(Pop)
