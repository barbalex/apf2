import React from 'react'
import get from 'lodash/get'

import buildMarkers from './buildMarkers'
import PopMarkerCluster from './Cluster'

const PmcComponent = ({
  tree,
  data,
  activeNodes,
  apfloraLayers,
  activeApfloraLayers,
  popLabelUsingNr,
  mapIdsFiltered,
}:{
  tree: Object,
  data: Object,
  activeNodes: Array<Object>,
  apfloraLayers: Array<Object>,
  activeApfloraLayers: Array<String>,
  popLabelUsingNr: Boolean,
  mapIdsFiltered: Array<String>,
}) => {
  const popFilterString = get(tree, 'nodeLabelFilter.pop')
  const pops = get(data, 'popForMapMarkers.apsByProjId.nodes[0].popsByApId.nodes', [])
    // filter them by nodeLabelFilter
    .filter(p => {
      if (!popFilterString) return true
      return `${p.nr || '(keine Nr)'}: ${p.name || '(kein Name)'}`
        .toLowerCase()
        .includes(popFilterString.toLowerCase())
    })
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


export default PmcComponent
