import React from 'react'
import get from 'lodash/get'
import compose from 'recompose/compose'

import buildMarkers from './buildMarkers'
import PopMarkerCluster from './Cluster'
import filterNodesByNodeFilterArray from '../../../TreeContainer/filterNodesByNodeFilterArray'
import withNodeFilter from '../../../../../state/withNodeFilter'

const enhance = compose(withNodeFilter)

const PmcComponent = ({
  tree,
  data,
  activeNodes,
  apfloraLayers,
  activeApfloraLayers,
  popLabelUsingNr,
  mapIdsFiltered,
  nodeFilterState,
}: {
  tree: Object,
  data: Object,
  activeNodes: Array<Object>,
  apfloraLayers: Array<Object>,
  activeApfloraLayers: Array<String>,
  popLabelUsingNr: Boolean,
  mapIdsFiltered: Array<String>,
  nodeFilterState: Object,
}) => {
  const popFilterString = get(tree, 'nodeLabelFilter.pop')
  const nodeFilterArray = Object.entries(
    nodeFilterState.state[tree.name].pop,
  ).filter(([key, value]) => value || value === 0)
  const pops = get(
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

  const popMarkers = buildMarkers({
    pops,
    activeNodes,
    apfloraLayers,
    activeApfloraLayers,
    data,
    popLabelUsingNr,
    mapIdsFiltered,
  })
  return <PopMarkerCluster markers={popMarkers} />
}

export default enhance(PmcComponent)
