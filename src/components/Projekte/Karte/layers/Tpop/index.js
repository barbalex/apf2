import React, { useContext, useMemo } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useQuery } from 'react-apollo-hooks'

import Marker from './Marker'
import filterNodesByNodeFilterArray from '../../../TreeContainer/filterNodesByNodeFilterArray'
import mobxStoreContext from '../../../../../mobxStoreContext'
import query from './data'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'

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
}: {
  treeName: string,
  clustered: Boolean,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const {
    nodeFilter,
    mapFilter,
    activeApfloraLayers,
    setRefetchKey,
    addError,
  } = mobxStore
  const tree = mobxStore[treeName]
  const { map } = tree
  const { setTpopIdsFiltered } = map

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
  var { data, error, refetch } = useQuery(query, {
    suspend: false,
    variables: { projId, apId },
  })
  setRefetchKey({ key: 'tpopForMap', value: refetch })

  if (error) {
    addError(
      new Error(
        `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      ),
    )
  }

  const pops = get(
    data,
    'projektById.apsByProjId.nodes[0].popsByApId.nodes',
    [],
  )
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
  const tpopsToUse = activeApfloraLayers.includes('tpop') ? tpops : []
  const tpopMarkers = tpopsToUse.map(tpop => (
    <Marker key={tpop.id} treeName={treeName} tpop={tpop} />
  ))

  const mapTpopIdsFiltered = useMemo(
    () =>
      idsInsideFeatureCollection({
        mapFilter,
        data: tpops,
      }),
    [mapFilter, tpops],
  )
  setTpopIdsFiltered(mapTpopIdsFiltered)

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
