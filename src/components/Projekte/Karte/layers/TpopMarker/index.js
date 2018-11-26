import React, { useContext } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'

import buildMarkers from './buildMarkers'
import buildMarkersClustered from './buildMarkersClustered'
import Marker from './Marker'
import MarkerCluster from './MarkerCluster'
import filterNodesByNodeFilterArray from '../../../TreeContainer/filterNodesByNodeFilterArray'
import mobxStoreContext from '../../../../../mobxStoreContext'

const enhance = compose(observer)

const TpopMarkerMarker = ({
  treeName,
  /**
   * need to fetch data from ProjektContainer
   * because refetch after localizing then makes
   * sure, new tpop appears
   */
  data,
  activeNodes,
  clustered,
  mapIdsFiltered,
}: {
  treeName: string,
  data: Object,
  activeNodes: Array<Object>,
  clustered: Boolean,
  mapIdsFiltered: Array<String>,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { apfloraLayers, tpopLabelUsingNr, nodeFilter } = mobxStore
  const tree = mobxStore[treeName]

  const popFilterString = get(tree, 'nodeLabelFilter.pop')
  const popNodeFilterArray = Object.entries(nodeFilter[tree.name].pop).filter(
    ([key, value]) => value || value === 0 || value === false,
  )
  const tpopFilterString = get(tree, 'nodeLabelFilter.tpop')
  const tpopNodeFilterArray = Object.entries(nodeFilter[tree.name].tpop).filter(
    ([key, value]) => value || value === 0 || value === false,
  )
  const pops = get(data, 'tpopForMap.apsByProjId.nodes[0].popsByApId.nodes', [])
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

  if (clustered) {
    const markers = buildMarkersClustered({
      tpops,
      treeName,
      data,
      mapIdsFiltered,
      mobxStore,
    })
    return <MarkerCluster markers={markers} />
  }
  const markers = buildMarkers({
    tpops,
    treeName,
    data,
    mapIdsFiltered,
    mobxStore,
  })
  return <Marker markers={markers} />
}

export default enhance(TpopMarkerMarker)
