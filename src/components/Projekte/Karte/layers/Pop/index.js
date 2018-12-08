import React, { useContext } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import Marker from './Marker'
import filterNodesByNodeFilterArray from '../../../TreeContainer/filterNodesByNodeFilterArray'
import mobxStoreContext from '../../../../../mobxStoreContext'

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

const Pop = ({ treeName, data }: { treeName: string, data: Object }) => {
  const mobxStore = useContext(mobxStoreContext)
  const { nodeFilter, activeApfloraLayers } = mobxStore
  const tree = mobxStore[treeName]

  const popFilterString = get(tree, 'nodeLabelFilter.pop')
  const nodeFilterArray = Object.entries(nodeFilter[tree.name].pop).filter(
    ([key, value]) => value || value === 0 || value === false,
  )
  let pops = get(data, 'popForMap.apsByProjId.nodes[0].popsByApId.nodes', [])
    // filter them by nodeLabelFilter
    .filter(p => {
      if (!popFilterString) return true
      return `${p.nr || '(keine Nr)'}: ${p.name || '(kein Name)'}`
        .toLowerCase()
        .includes(popFilterString.toLowerCase())
    })
    // filter by nodeFilter
    // TODO: would be much better to filter this in query
    // this is done
    // but unfortunately query does not immediatly update
    .filter(node => filterNodesByNodeFilterArray({ node, nodeFilterArray }))

  // if tpop are filtered, only show their pop
  if (activeApfloraLayers.includes('tpop')) {
    const popsForTpops = get(
      data,
      'tpopForMap.apsByProjId.nodes[0].popsByApId.nodes',
      [],
    )
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
  const popsToUse = activeApfloraLayers.includes('pop') ? pops : []

  return (
    <MarkerClusterGroup
      maxClusterRadius={66}
      iconCreateFunction={iconCreateFunction}
    >
      {popsToUse.map(pop => (
        <Marker key={pop.id} treeName={treeName} pop={pop} />
      ))}
    </MarkerClusterGroup>
  )
}

export default observer(Pop)
