import React, { useContext, useMemo, useEffect, useState } from 'react'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from '@changey/react-leaflet-markercluster'
import { useQuery } from '@apollo/client'
import { useMap } from 'react-leaflet'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'
import { simpleTypes as tpopType } from '../../../../../store/Tree/DataFilter/tpop'

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
  const { activeApfloraLayers, enqueNotification, setRefetchKey, mapFilter } =
    store
  const tree = store[treeName]
  const {
    dataFilter,
    projIdInActiveNodeArray,
    apIdInActiveNodeArray,
    popGqlFilter,
    tpopGqlFilter,
  } = tree

  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('pop')
  const tpopLayerIsActive = activeApfloraLayers.includes('tpop')
  const perProj = apId === '99999999-9999-9999-9999-999999999999'
  const perAp = apId !== '99999999-9999-9999-9999-999999999999'

  var { data, error, refetch } = useQuery(query, {
    variables: {
      perAp,
      apId,
      perProj,
      projId,
      tpopLayerIsActive,
      isActiveInMap,
      popFilter: popGqlFilter,
      tpopFilter: tpopGqlFilter,
    },
  })
  setRefetchKey({ key: 'popForMap', value: refetch })

  // eslint-disable-next-line no-unused-vars
  const [refetchProvoker, setRefetchProvoker] = useState(1)
  useEffect(() => {
    // DO NOT use:
    // leafletMap.on('zoomend dragend', refetch
    // see: https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
    // Also: leafletMap.on('zoomend dragend', ()=> refetch()) never refetches!!??
    // Also: use dragend, not moveend because moveend fires on zoomend as well
    leafletMap.on('zoomend dragend', () => {
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

  const aps = useMemo(
    () => data?.projektById?.[perAp ? 'perAp' : 'perProj']?.nodes ?? [],
    [data?.projektById, perAp],
  )
  let pops = useMemo(
    () =>
      flatten(aps.map((ap) => ap?.popsByApId?.nodes ?? [])).filter(
        (pop) => !!pop.wgs84Lat,
      ),
    [aps],
  )

  // if tpop are filtered, only show their pop
  if (activeApfloraLayers.includes('tpop')) {
    const popsForTpops = flatten(aps.map((ap) => ap?.popsByApId?.nodes ?? []))
    // adding useMemo here results in error ???
    const tpops = flatten(
      popsForTpops.map((pop) => pop?.tpopsByPopId?.nodes ?? []),
    )
    const popIdsOfTpops = tpops.map((t) => t.popId)
    pops = pops.filter((p) => popIdsOfTpops.includes(p.id))
  }

  return (
    <MarkerClusterGroup
      maxClusterRadius={66}
      iconCreateFunction={iconCreateFunction}
    >
      {pops.map((pop) => (
        <Marker key={pop.id} treeName={treeName} pop={pop} />
      ))}
    </MarkerClusterGroup>
  )
}

export default observer(Pop)
