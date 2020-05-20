import React, {
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useQuery } from '@apollo/react-hooks'
import bboxPolygon from '@turf/bbox-polygon'
import { useLeaflet } from 'react-leaflet'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'
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
  const { map: leafletMap } = useLeaflet()
  const store = useContext(storeContext)
  const {
    activeApfloraLayers,
    enqueNotification,
    mapFilter,
    setRefetchKey,
  } = store
  const tree = store[treeName]
  const { map, dataFilter } = tree
  const { setPopIdsFiltered } = map

  const activeNodes = store[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('pop')
  const tpopLayerIsActive = activeApfloraLayers.includes('tpop')
  const perProj = apId === '99999999-9999-9999-9999-999999999999'
  const perAp = apId !== '99999999-9999-9999-9999-999999999999'

  const bounds = leafletMap.getBounds()
  const boundsArray = [
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth(),
  ]
  const myBbox = bboxPolygon(boundsArray).geometry

  const popFilter = {
    wgs84Lat: { isNull: false },
    geomPoint: { within: myBbox },
  }
  const popFilterValues = Object.entries(dataFilter.pop).filter(
    (e) => e[1] || e[1] === 0,
  )
  popFilterValues.forEach(([key, value]) => {
    const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
    popFilter[key] = { [expression]: value }
  })
  if (!!tree.nodeLabelFilter.pop) {
    popFilter.label = {
      includesInsensitive: tree.nodeLabelFilter.pop,
    }
  }

  const tpopFilter = {
    wgs84Lat: { isNull: false },
    geomPoint: { within: myBbox },
  }
  const tpopFilterValues = Object.entries(dataFilter.tpop).filter(
    (e) => e[1] || e[1] === 0,
  )
  tpopFilterValues.forEach(([key, value]) => {
    const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
    tpopFilter[key] = { [expression]: value }
  })
  if (!!tree.nodeLabelFilter.tpop) {
    tpopFilter.label = {
      includesInsensitive: tree.nodeLabelFilter.tpop,
    }
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
    // leafletMap.on('zoomend moveend', refetch
    // see: https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
    // Also: leafletMap.on('zoomend moveend', ()=> refetch()) never refetches!!??
    leafletMap.on('zoomend moveend', () => setRefetchProvoker(Math.random()))
    return () => {
      leafletMap.off('zoomend moveend', () => setRefetchProvoker(Math.random()))
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

  const aps = get(
    data,
    `projektById.${!!perAp ? 'perAp' : 'perProj'}.nodes`,
    [],
  )
  let pops = useMemo(
    () => flatten(aps.map((ap) => get(ap, 'popsByApId.nodes', []))),
    [aps],
  )

  // if tpop are filtered, only show their pop
  if (activeApfloraLayers.includes('tpop')) {
    const popsForTpops = flatten(
      aps.map((ap) => get(ap, 'popsByApId.nodes', [])),
    )
    // adding useMemo here results in error ???
    const tpops = flatten(
      popsForTpops.map((pop) => get(pop, 'tpopsByPopId.nodes', [])),
    )
    const popIdsOfTpops = tpops.map((t) => t.popId)
    pops = pops.filter((p) => popIdsOfTpops.includes(p.id))
  }

  const mapPopIdsFiltered = idsInsideFeatureCollection({
    mapFilter,
    data: pops,
  })
  setPopIdsFiltered(mapPopIdsFiltered)
  //console.log('layers Pop, pops.length:', pops.length)

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
