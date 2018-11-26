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

const BeobNichtZuzuordnenMarker = ({
  treeName,
  data,
  clustered,
  mapIdsFiltered,
}: {
  treeName: string,
  data: Object,
  clustered: Boolean,
  mapIdsFiltered: Array<String>,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const tree = mobxStore[treeName]

  const beobNichtZuzuordnenFilterString = get(
    tree,
    'nodeLabelFilter.beobNichtZuzuordnen',
  )
  const aparts = get(
    data,
    'beobNichtZuzuordnenForMapMarkers.apsByProjId.nodes[0].apartsByApId.nodes',
    [],
  )
  const beobs = flatten(
    aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', [])),
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
    mobxStore,
  })
  return <Marker markers={markers} />
}

export default observer(BeobNichtZuzuordnenMarker)
