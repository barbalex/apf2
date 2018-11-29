import React, { useContext } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'

import buildMarkers from './buildMarkers'
import PopMarkerCluster from './Cluster'
import filterNodesByNodeFilterArray from '../../../TreeContainer/filterNodesByNodeFilterArray'
import mobxStoreContext from '../../../../../mobxStoreContext'

const enhance = compose(observer)

const PmcComponent = ({
  treeName,
  data,
}: {
  treeName: string,
  data: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { nodeFilter } = mobxStore
  const tree = mobxStore[treeName]

  const popFilterString = get(tree, 'nodeLabelFilter.pop')
  const nodeFilterArray = Object.entries(nodeFilter[tree.name].pop).filter(
    ([key, value]) => value || value === 0 || value === false,
  )
  let pops = get(
    data,
    'popForMapMarkers.apsByProjId.nodes[0].popsByApId.nodes',
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
    // TODO: would be much better to filter this in query
    // this is done
    // but unfortunately query does not immediatly update
    .filter(node => filterNodesByNodeFilterArray({ node, nodeFilterArray }))

  // if tpop are filtered, only show their pop
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
  const tpopNodeFilterArray = Object.entries(nodeFilter[tree.name].tpop).filter(
    ([key, value]) => value || value === 0 || value === false,
  )
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

  const popMarkers = buildMarkers({
    pops,
    treeName,
    data,
    mobxStore,
  })
  return <PopMarkerCluster markers={popMarkers} />
}

export default enhance(PmcComponent)
