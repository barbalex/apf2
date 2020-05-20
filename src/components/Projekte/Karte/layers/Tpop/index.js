import React, { useContext, useMemo, useEffect } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useQuery } from '@apollo/react-hooks'
import { useLeaflet } from 'react-leaflet'
import bboxPolygon from '@turf/bbox-polygon'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'
import { simpleTypes as popType } from '../../../../../store/Tree/DataFilter/pop'
import { simpleTypes as tpopType } from '../../../../../store/Tree/DataFilter/tpop'

const iconCreateFunction = function (cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedTpop = markers.some(
    (m) => m.options.icon.options.isHighlighted,
  )

  const className = hasHighlightedTpop
    ? 'tpopClusterHighlighted'
    : 'tpopCluster'
  if (typeof window === 'undefined') return () => {}
  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const Tpop = ({ treeName, clustered, leaflet }) => {
  const { map: leafletMap } = useLeaflet()
  const store = useContext(storeContext)
  const {
    mapFilter,
    activeApfloraLayers,
    setRefetchKey,
    enqueNotification,
  } = store
  const tree = store[treeName]
  const { map, dataFilter } = tree
  const { setTpopIdsFiltered } = map

  const activeNodes = store[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('tpop')
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
    // used to filter: wgs84Lat: { isNull: false }
    // but then tpop with wgs84Lat with pop without would not show
    id: { isNull: false },
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
      projId,
      apId,
      perAp,
      perProj,
      isActiveInMap,
      popFilter,
      tpopFilter,
    },
  })
  setRefetchKey({ key: 'tpopForMap', value: refetch })

  useEffect(() => {
    // DO NOT use:
    // leafletMap.on('zoomend moveend', refetch
    // see: https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
    leafletMap.on('zoomend moveend', () => refetch())
    return () => {
      leafletMap.on('zoomend moveend', () => refetch())
    }
  }, [leafletMap, refetch])

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Teil-Populationen für die Karte: ${error.message}`,
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
  const pops = useMemo(
    () => flatten(aps.map((ap) => get(ap, 'popsByApId.nodes', []))),
    [aps],
  )
  let tpops = useMemo(
    () => flatten(pops.map((pop) => get(pop, 'tpopsByPopId.nodes', []))),
    [pops],
  )

  const mapTpopIdsFiltered = idsInsideFeatureCollection({
    mapFilter,
    data: tpops,
  })
  setTpopIdsFiltered(mapTpopIdsFiltered)
  //console.log('layers Tpop, tpops.length:', tpops.length)

  if (tpops.length > 2000) {
    enqueNotification({
      message: `Zuviele Teil-Populationen: Es werden maximal 2'000 angezeigt, im aktuellen Ausschnitt sind es: ${tpops.length.toLocaleString(
        'de-CH',
      )}. Bitte wählen Sie einen kleineren Ausschnitt.`,
      options: {
        variant: 'warning',
      },
    })
    tpops = []
  }

  const tpopMarkers = tpops.map((tpop) => (
    <Marker key={tpop.id} treeName={treeName} tpop={tpop} />
  ))

  if (clustered) {
    return (
      <MarkerClusterGroup
        maxClusterRadius={66}
        iconCreateFunction={iconCreateFunction}
      >
        {tpopMarkers}
      </MarkerClusterGroup>
    )
  }
  return tpopMarkers
}

export default observer(Tpop)
