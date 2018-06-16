import React from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'

import buildMarkers from './buildMarkers'
import buildMarkersClustered from './buildMarkersClustered'
import Marker from './Marker'
import MarkerCluster from './MarkerCluster'

const TpopMarkerMarker = ({
  tree,
  /**
   * need to fetch data from ProjektContainer
   * because refetch after localizing then makes
   * sure, new tpop appears
   */
  data,
  activeNodes,
  apfloraLayers,
  clustered,
  tpopLabelUsingNr,
  mapIdsFiltered,
} : {
  tree: Object,
  data: Object,
  activeNodes: Array<Object>,
  apfloraLayers: Array<Object>,
  clustered: Boolean,
  tpopLabelUsingNr: Boolean,
  mapIdsFiltered: Array<String>,
}) => {
  const tpopFilterString = get(tree, 'nodeLabelFilter.tpop')
  const pops = get(data, 'tpopForMap.apsByProjId.nodes[0].popsByApId.nodes', [])
  const tpops = flatten(pops.map(pop => get(pop, 'tpopsByPopId.nodes', [])))
    // filter them by nodeLabelFilter
    .filter(el => {
      if (!tpopFilterString) return true
      return `${el.nr || '(keine Nr)'}: ${el.flurname || '(kein Flurname)'}`
        .toLowerCase()
        .includes(tpopFilterString.toLowerCase())
    })

  if (clustered) {
    const markers = buildMarkersClustered({
      tpops,
      activeNodes,
      apfloraLayers,
      data,
      tpopLabelUsingNr,
      mapIdsFiltered,
    })
    return <MarkerCluster markers={markers} />
  }
  const markers = buildMarkers({
    tpops,
    activeNodes,
    apfloraLayers,
    data,
    tpopLabelUsingNr,
    mapIdsFiltered,
  })
  return <Marker markers={markers} />
}


export default TpopMarkerMarker
