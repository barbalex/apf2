import React from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'

import buildMarkers from './buildMarkers'
import buildMarkersClustered from './buildMarkersClustered'
import Marker from './Marker'
import MarkerCluster from './MarkerCluster'

const BeobNichtZuzuordnenMarker = ({
  tree,
  data,
  activeNodes,
  apfloraLayers,
  clustered,
  mapIdsFiltered,
} : {
  tree: Object,
  data: Object,
  activeNodes: Array<Object>,
  apfloraLayers: Array<Object>,
  clustered: Boolean,
  mapIdsFiltered: Array<String>,
}) => {
  const beobNichtZuzuordnenFilterString = get(tree, 'nodeLabelFilter.beobNichtZuzuordnen')
  const aparts = get(data, 'beobNichtZuzuordnenForMapMarkers.apsByProjId.nodes[0].apartsByApId.nodes', [])
  const beobs = flatten(
    aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', []))
  )
    // filter them by nodeLabelFilter
    .filter(el => {
      if (!beobNichtZuzuordnenFilterString) return true
      const datum = el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
      const autor = el.autor || '(kein Autor)'
      const quelle = get(el, 'beobQuelleWerteByQuelleId.name', '')
      return `${datum}: ${autor} (${quelle})`
        .toLowerCase()
        .includes(beobNichtZuzuordnenFilterString.toLowerCase())
    })

  if (clustered) {
    const markers = buildMarkersClustered({
      beobs,
      activeNodes,
      apfloraLayers,
      data,
      mapIdsFiltered,
    })
    return <MarkerCluster markers={markers} />
  }
  const markers = buildMarkers({
    beobs,
    tree,
    activeNodes,
    apfloraLayers,
    data,
    mapIdsFiltered,
  })
  return <Marker markers={markers} />
}

export default BeobNichtZuzuordnenMarker
