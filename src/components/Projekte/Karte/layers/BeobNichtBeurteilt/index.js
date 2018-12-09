import React, { useContext } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'

import buildMarkers from './buildMarkers'
import buildMarkersClustered from './buildMarkersClustered'
import Marker from './Marker'
import MarkerCluster from './MarkerCluster'
import mobxStoreContext from '../../../../../mobxStoreContext'

const BeobNichtBeurteiltMarker = ({
  treeName,
  data,
  clustered,
  refetchTree,
}: {
  treeName: string,
  data: Object,
  clustered: Boolean,
  refetchTree: () => void,
}) => {
  const client = useApolloClient()
  const mobxStore = useContext(mobxStoreContext)
  const tree = mobxStore[treeName]
  const { idsFiltered: mapIdsFiltered } = mobxStore[treeName].map
  const beobNichtBeurteiltFilterString = get(
    tree,
    'nodeLabelFilter.beobNichtBeurteilt',
  )
  const aparts = get(
    data,
    'beobNichtBeurteiltForMap.apsByProjId.nodes[0].apartsByApId.nodes',
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
      treeName,
      data,
      mapIdsFiltered,
      mobxStore,
    })
    return <MarkerCluster markers={markers} />
  }
  const markers = buildMarkers({
    beobs,
    treeName,
    data,
    mapIdsFiltered,
    client,
    mobxStore,
  })
  return <Marker markers={markers} />
}

export default observer(BeobNichtBeurteiltMarker)
