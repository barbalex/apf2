import React, { useContext, useMemo, useEffect, useState } from 'react'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from '@changey/react-leaflet-markercluster'
import { useQuery } from '@apollo/client'
import { useMap } from 'react-leaflet'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'
import { simpleTypes as popType } from '../../../../../store/Tree/DataFilter/pop'
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
  const { dataFilter, projIdInActiveNodeArray, apIdInActiveNodeArray } = tree

  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('pop')
  const tpopLayerIsActive = activeApfloraLayers.includes('tpop')
  const perProj = apId === '99999999-9999-9999-9999-999999999999'
  const perAp = apId !== '99999999-9999-9999-9999-999999999999'

  const popFilterArrayInStore = dataFilter.pop
  // need to remove empty filters - they exist when user clicks "oder" but has not entered a value yet
  const popFilterArrayInStoreWithoutEmpty = popFilterArrayInStore.filter(
    (f) => Object.values(f).filter((v) => v !== null).length !== 0,
  )
  const popFilterArray = []
  for (const filter of popFilterArrayInStoreWithoutEmpty) {
    const singleFilter = {
      apId: { equalTo: apId },
      wgs84Lat: { isNull: false },
      // 2021.08.16: needed to remove this filter
      // because icons where added every time a tpop left, then reentered the bbox
      //geomPoint: { within: myBbox },
    }
    const dataFilterPop = { ...filter }
    const popFilterValues = Object.entries(dataFilterPop).filter(
      (e) => e[1] || e[1] === 0,
    )
    popFilterValues.forEach(([key, value]) => {
      const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
      singleFilter[key] = { [expression]: value }
    })
    if (tree.nodeLabelFilter.pop) {
      singleFilter.label = {
        includesInsensitive: tree.nodeLabelFilter.pop,
      }
    }
    popFilterArray.push(singleFilter)
  }
  const popFilter = { or: popFilterArray }

  const tpopFilter = {
    wgs84Lat: { isNull: false },
    //geomPoint: { within: myBbox },
  }
  const tpopFilterValues = Object.entries(dataFilter.tpop).filter(
    (e) => e[1] || e[1] === 0,
  )
  tpopFilterValues.forEach(([key, value]) => {
    const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
    tpopFilter[key] = { [expression]: value }
  })
  if (tree.nodeLabelFilter.tpop) {
    tpopFilter.label = {
      includesInsensitive: tree.nodeLabelFilter.tpop,
    }
  }
  // if mapFilter is set, filter by its geometry
  if (mapFilter?.length) {
    tpopFilter.geomPoint = { coveredBy: mapFilter[0]?.geometry }
  }

  var { data, error, refetch } = useQuery(query, {
    variables: {
      perAp,
      apId,
      perProj,
      projId,
      tpopLayerIsActive,
      isActiveInMap,
      popFilter,
      tpopFilter,
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
    () => flatten(aps.map((ap) => ap?.popsByApId?.nodes ?? [])),
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
