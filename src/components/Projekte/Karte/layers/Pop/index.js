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
  const hasHighlightedPop = markers.some(
    m => m.options.icon.options.className === 'popIconHighlighted',
  )
  const className = hasHighlightedPop ? 'popClusterHighlighted' : 'popCluster'
  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const Pop = ({ treeName }: { treeName: string }) => {
  const mobxStore = useContext(mobxStoreContext)
  const {
    nodeFilter,
    activeApfloraLayers,
    addError,
    mapFilter,
    setRefetchKey,
  } = mobxStore
  const tree = mobxStore[treeName]
  const { map } = tree
  const { setPopIdsFiltered } = map

  const popFilterString = get(tree, 'nodeLabelFilter.pop')
  const nodeFilterArray = Object.entries(nodeFilter[tree.name].pop).filter(
    ([key, value]) => value || value === 0 || value === false,
  )

  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
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
    },
  })
  setRefetchKey({ key: 'popForMap', value: refetch })

  if (error) {
    addError(
      new Error(
        `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      ),
    )
  }

  const aps = get(
    data,
    `projektById.${!!perAp ? 'perAp' : 'perProj'}.nodes`,
    [],
  )
  let pops = useMemo(
    () =>
      flatten(aps.map(ap => get(ap, 'popsByApId.nodes', [])))
        // filter them by nodeLabelFilter
        .filter(p => {
          if (!popFilterString) return true
          return `${p.nr || '(keine Nr)'}: ${p.name || '(kein Name)'}`
            .toLowerCase()
            .includes(popFilterString.toLowerCase())
        })
        // filter by nodeFilter
        .filter(node =>
          filterNodesByNodeFilterArray({ node, nodeFilterArray }),
        ),
    [aps, popFilterString, nodeFilterArray],
  )

  // if tpop are filtered, only show their pop
  if (activeApfloraLayers.includes('tpop')) {
    // adding useMemo here results in error ???
    const popsForTpops = flatten(aps.map(ap => get(ap, 'popsByApId.nodes', [])))
      .filter(p => {
        if (!popFilterString) return true
        return `${p.nr || '(keine Nr)'}: ${p.name || '(kein Name)'}`
          .toLowerCase()
          .includes(popFilterString.toLowerCase())
      })
      .filter(node =>
        filterNodesByNodeFilterArray({
          node,
          nodeFilterArray,
          table: 'pop',
        }),
      )
    const tpopFilterString = get(tree, 'nodeLabelFilter.tpop')
    const tpopNodeFilterArray = Object.entries(
      nodeFilter[tree.name].tpop,
    ).filter(([key, value]) => value || value === 0 || value === false)
    // adding useMemo here results in error ???
    const tpops = flatten(
      popsForTpops.map(pop => get(pop, 'tpopsByPopId.nodes', [])),
    )
      // filter them by nodeLabelFilter
      .filter(el => {
        if (!tpopFilterString) return true
        return `${el.nr || '(keine Nr)'}: ${el.flurname || '(kein Flurname)'}`
          .toLowerCase()
          .includes(tpopFilterString.toLowerCase())
      })
      .filter(node =>
        filterNodesByNodeFilterArray({
          node,
          nodeFilterArray: tpopNodeFilterArray,
          table: 'tpop',
        }),
      )
    const popIdsOfTpops = tpops.map(t => t.popId)
    pops = pops.filter(p => popIdsOfTpops.includes(p.id))
  }

  const mapPopIdsFiltered = useMemo(
    () =>
      idsInsideFeatureCollection({
        mapFilter,
        data: pops,
        idKey: 'id',
        xKey: 'x',
        yKey: 'y',
      }),
    [mapFilter, pops],
  )
  setPopIdsFiltered(mapPopIdsFiltered)

  return (
    <MarkerClusterGroup
      maxClusterRadius={66}
      iconCreateFunction={iconCreateFunction}
    >
      {pops.map(pop => (
        <Marker key={pop.id} treeName={treeName} pop={pop} />
      ))}
    </MarkerClusterGroup>
  )
}

export default observer(Pop)
