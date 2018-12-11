import React, { useContext, useMemo } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useQuery } from 'react-apollo-hooks'
import { getSnapshot } from 'mobx-state-tree'
import { withLeaflet } from 'react-leaflet'

import Marker from './Marker'
import filterNodesByNodeFilterArray from '../../../TreeContainer/filterNodesByNodeFilterArray'
import mobxStoreContext from '../../../../../mobxStoreContext'
import query from './data'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'
import objectsInsideBounds from '../../../../../modules/objectsInsideBounds'

const iconCreateFunction = function(cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedTpop = markers.some(
    m => m.options.icon.options.className === 'tpopIconHighlighted',
  )

  const className = hasHighlightedTpop
    ? 'tpopClusterHighlighted'
    : 'tpopCluster'
  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const Tpop = ({
  treeName,
  clustered,
  leaflet,
}: {
  treeName: string,
  clustered: Boolean,
  leaflet: Object,
}) => {
  const { map: leafletMap } = leaflet
  const mobxStore = useContext(mobxStoreContext)
  const {
    nodeFilter,
    mapFilter,
    activeApfloraLayers,
    setRefetchKey,
    addError,
  } = mobxStore
  const tree = mobxStore[treeName]
  const { bounds: boundsRaw } = mobxStore
  const { map } = tree
  const { setTpopIdsFiltered } = map
  const bounds = boundsRaw ? getSnapshot(boundsRaw) : boundsRaw

  const popFilterString = get(tree, 'nodeLabelFilter.pop')
  const popNodeFilterArray = Object.entries(nodeFilter[tree.name].pop).filter(
    ([key, value]) => value || value === 0 || value === false,
  )
  const tpopFilterString = get(tree, 'nodeLabelFilter.tpop')
  const tpopNodeFilterArray = Object.entries(nodeFilter[tree.name].tpop).filter(
    ([key, value]) => value || value === 0 || value === false,
  )

  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('tpop')
  const perProj = apId === '99999999-9999-9999-9999-999999999999'
  const perAp = apId !== '99999999-9999-9999-9999-999999999999'
  var { data, error, refetch } = useQuery(query, {
    suspend: false,
    variables: { projId, apId, perAp, perProj, isActiveInMap },
  })
  setRefetchKey({ key: 'tpopForMap', value: refetch })

  if (error) {
    addError(
      new Error(
        `Fehler beim Laden der Teil-Populationen für die Karte: ${
          error.message
        }`,
      ),
    )
  }

  const aps = get(
    data,
    `projektById.${!!perAp ? 'perAp' : 'perProj'}.nodes`,
    [],
  )
  const pops = flatten(aps.map(ap => get(ap, 'popsByApId.nodes', [])))
    // filter them by nodeLabelFilter
    .filter(p => {
      if (!popFilterString) return true
      return `${p.nr || '(keine Nr)'}: ${p.name || '(kein Name)'}`
        .toLowerCase()
        .includes(popFilterString.toLowerCase())
    })
    // filter by nodeFilter
    .filter(node =>
      filterNodesByNodeFilterArray({
        node,
        nodeFilterArray: popNodeFilterArray,
        table: 'pop',
      }),
    )
  const tpops = flatten(pops.map(pop => get(pop, 'tpopsByPopId.nodes', [])))
    // filter them by nodeLabelFilter
    .filter(el => {
      if (!tpopFilterString) return true
      return `${el.nr || '(keine Nr)'}: ${el.flurname || '(kein Flurname)'}`
        .toLowerCase()
        .includes(tpopFilterString.toLowerCase())
    })
    // filter by nodeFilter
    .filter(node =>
      filterNodesByNodeFilterArray({
        node,
        nodeFilterArray: tpopNodeFilterArray,
        table: 'tpop',
      }),
    )

  const mapTpopIdsFiltered = useMemo(
    () =>
      idsInsideFeatureCollection({
        mapFilter,
        data: tpops,
      }),
    [mapFilter, tpops],
  )
  setTpopIdsFiltered(mapTpopIdsFiltered)

  // TODO:
  // if > 1000 tpops
  // filter to inside bounds of map

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
    addError(
      new Error(
        `Zuviele Teil-Populationen: Es werden maximal 1'500 angezeigt, im aktuellen Ausschnitt sind es: ${
          tpopsForMap.length
        }. Bitte wählen Sie einen kleineren Ausschnitt.`,
      ),
    )
    tpopsForMap = []
  }
  if (tpopsForMap.length <= 1500 && tpops.length > 1500) {
    addError(
      new Error(
        `Weil das Layer mehr als 1'500 Teil-Populationen enthält (nämlich: ${
          tpops.length
        }), wurden nur diejenigen im aktuellen Ausschnitt dargestellt. Falls Sie den Ausschnitt verändern sollten, müssen Sie das Layer aus- und wieder einschalten, um die Teil-Populationen anzuzeigen.`,
      ),
    )
  }
  console.log('Tpop after filtering for bounds', {
    tpopsLength: tpops.length,
    tpopsForMapLength: tpopsForMap.length,
  })

  // TODO
  // if tpops.length > 1500 tell user only tpops in current view are built
  // if tpopsForMap.length > 1500 tell user to zoom in more for tpops to be built

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

export default withLeaflet(observer(Tpop))
