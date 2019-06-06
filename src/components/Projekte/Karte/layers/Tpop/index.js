import React, { useContext, useMemo } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useQuery } from 'react-apollo-hooks'
import { useLeaflet } from 'react-leaflet'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'
import objectsInsideBounds from '../../../../../modules/objectsInsideBounds'
import { simpleTypes as popType } from '../../../../../store/NodeFilterTree/pop'
import { simpleTypes as tpopType } from '../../../../../store/NodeFilterTree/tpop'

const iconCreateFunction = function(cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedTpop = markers.some(
    m => m.options.icon.options.isHighlighted,
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
    nodeFilter,
    mapFilter,
    activeApfloraLayers,
    setActiveApfloraLayers,
    setRefetchKey,
    enqueNotification,
  } = store
  const tree = store[treeName]
  const { map } = tree
  const { setTpopIdsFiltered } = map

  const activeNodes = store[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('tpop')
  const perProj = apId === '99999999-9999-9999-9999-999999999999'
  const perAp = apId !== '99999999-9999-9999-9999-999999999999'

  const popFilter = {
    wgs84Lat: { isNull: false },
  }
  const popFilterValues = Object.entries(nodeFilter[treeName].pop).filter(
    e => e[1] || e[1] === 0,
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

  const tpopFilter = { wgs84Lat: { isNull: false } }
  const tpopFilterValues = Object.entries(nodeFilter[treeName].tpop).filter(
    e => e[1] || e[1] === 0,
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

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Teil-Populationen für die Karte: ${
        error.message
      }`,
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
    () => flatten(aps.map(ap => get(ap, 'popsByApId.nodes', []))),
    [aps],
  )
  const tpops = useMemo(
    () => flatten(pops.map(pop => get(pop, 'tpopsByPopId.nodes', []))),
    [pops],
  )

  const mapTpopIdsFiltered = idsInsideFeatureCollection({
    mapFilter,
    data: tpops,
  })
  setTpopIdsFiltered(mapTpopIdsFiltered)

  // use tpops for filtering on map,
  // tpopsForMap for presenting on map
  let tpopsForMap = []
  if (tpops.length > 1500) {
    tpopsForMap = objectsInsideBounds({
      map: leafletMap,
      data: tpops,
    })
  } else {
    tpopsForMap = [...tpops]
  }

  if (tpopsForMap.length > 1500) {
    enqueNotification({
      message: `Zuviele Teil-Populationen: Es werden maximal 1'500 angezeigt, im aktuellen Ausschnitt sind es: ${tpopsForMap.length.toLocaleString(
        'de-CH',
      )}. Bitte wählen Sie einen kleineren Ausschnitt.`,
      options: {
        variant: 'warning',
      },
    })
    tpopsForMap = []
    setActiveApfloraLayers(activeApfloraLayers.filter(l => l !== 'tpop'))
  } else if (tpops.length > 1500) {
    enqueNotification({
      message: `Weil das Layer mehr als 1'500 Teil-Populationen enthält (nämlich: ${tpops.length.toLocaleString(
        'de-CH',
      )}), wurden nur die ${tpopsForMap.length.toLocaleString(
        'de-CH',
      )} im aktuellen Ausschnitt dargestellt. Falls Sie den Ausschnitt verändern sollten, müssen Sie das Layer aus- und wieder einschalten, um die passenden Teil-Populationen neu aufzubauen.`,
      options: {
        variant: 'info',
      },
    })
  }

  const tpopMarkers = tpopsForMap.map(tpop => (
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
