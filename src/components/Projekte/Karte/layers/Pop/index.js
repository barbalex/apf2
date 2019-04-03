import React, { useContext, useMemo } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useQuery } from 'react-apollo-hooks'

import Marker from './Marker'
import mobxStoreContext from '../../../../../mobxStoreContext'
import query from './query'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'
import { simpleTypes as popType } from '../../../../../mobxStore/NodeFilterTree/pop'
import { simpleTypes as tpopType } from '../../../../../mobxStore/NodeFilterTree/tpop'

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

  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('pop')
  const tpopLayerIsActive = activeApfloraLayers.includes('tpop')
  const perProj = apId === '99999999-9999-9999-9999-999999999999'
  const perAp = apId !== '99999999-9999-9999-9999-999999999999'

  const popFilter = { x: { isNull: false }, y: { isNull: false } }
  const popFilterValues = Object.entries(nodeFilter[treeName].pop).filter(
    e => e[1] || e[1] === 0,
  )
  popFilterValues.forEach(([key, value]) => {
    const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
    //if (['x', 'y'].includes(key)) delete popFilter[key]
    popFilter[key] = { [expression]: value }
  })
  const tpopFilter = { x: { isNull: false }, y: { isNull: false } }
  const tpopFilterValues = Object.entries(nodeFilter[treeName].tpop).filter(
    e => e[1] || e[1] === 0,
  )
  tpopFilterValues.forEach(([key, value]) => {
    const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
    tpopFilter[key] = { [expression]: value }
  })

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
        }),
    [aps, popFilterString, tpopFilterValues, popFilterValues],
  )

  // if tpop are filtered, only show their pop
  if (activeApfloraLayers.includes('tpop')) {
    const popsForTpops = flatten(
      aps.map(ap => get(ap, 'popsByApId.nodes', [])),
    ).filter(p => {
      if (!popFilterString) return true
      return `${p.nr || '(keine Nr)'}: ${p.name || '(kein Name)'}`
        .toLowerCase()
        .includes(popFilterString.toLowerCase())
    })
    const tpopFilterString = get(tree, 'nodeLabelFilter.tpop')
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
