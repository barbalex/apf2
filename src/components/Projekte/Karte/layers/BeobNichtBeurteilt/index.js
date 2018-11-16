import React, { useContext } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'
import { observer } from 'mobx-react-lite'

import buildMarkers from './buildMarkers'
import buildMarkersClustered from './buildMarkersClustered'
import Marker from './Marker'
import MarkerCluster from './MarkerCluster'
import mobxStoreContext from '../../../../../mobxStoreContext'

const BeobNichtBeurteiltMarker = ({
  tree,
  data,
  activeNodes,
  clustered,
  refetchTree,
  mapIdsFiltered,
}: {
  tree: Object,
  data: Object,
  activeNodes: Array<Object>,
  clustered: Boolean,
  refetchTree: () => void,
  mapIdsFiltered: Array<String>,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { apfloraLayers } = mobxStore
  const beobNichtBeurteiltFilterString = get(
    tree,
    'nodeLabelFilter.beobNichtBeurteilt',
  )
  const aparts = get(
    data,
    'beobNichtBeurteiltForMapMarkers.apsByProjId.nodes[0].apartsByApId.nodes',
    [],
  )
  const beobs = flatten(
    aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', [])),
  )
    // filter them by nodeLabelFilter
    .filter(el => {
      if (!beobNichtBeurteiltFilterString) return true
      const datum = el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
      const autor = el.autor || '(kein Autor)'
      const quelle = get(el, 'beobQuelleWerteByQuelleId.name', '')
      return `${datum}: ${autor} (${quelle})`
        .toLowerCase()
        .includes(beobNichtBeurteiltFilterString.toLowerCase())
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
    refetchTree,
  })
  return <Marker markers={markers} />
}

export default observer(BeobNichtBeurteiltMarker)
