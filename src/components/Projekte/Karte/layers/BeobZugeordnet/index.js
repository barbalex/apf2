import React, { useContext } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import { withLeaflet } from 'react-leaflet'
import { observer } from 'mobx-react-lite'

import buildMarkers from './buildMarkers'
import buildMarkersClustered from './buildMarkersClustered'
import Marker from './Marker'
import MarkerCluster from './MarkerCluster'
import mobxStoreContext from '../../../../../mobxStoreContext'

const enhance = compose(
  withLeaflet,
  observer,
)

const BeobZugeordnetMarker = ({
  treeName,
  data,
  clustered,
  refetchTree,
  leaflet,
}: {
  treeName: string,
  data: Object,
  clustered: Boolean,
  refetchTree: () => void,
  leaflet: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const tree = mobxStore[treeName]

  const beobZugeordnetFilterString = get(tree, 'nodeLabelFilter.beobZugeordnet')
  const aparts = get(
    data,
    'beobZugeordnetForMap.apsByProjId.nodes[0].apartsByApId.nodes',
    [],
  )
  const beobs = flatten(
    aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', [])),
  )
    // filter them by nodeLabelFilter
    .filter(el => {
      if (!beobZugeordnetFilterString) return true
      const datum = el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
      const autor = el.autor || '(kein Autor)'
      const quelle = get(el, 'beobQuelleWerteByQuelleId.name', '')
      return `${datum}: ${autor} (${quelle})`
        .toLowerCase()
        .includes(beobZugeordnetFilterString.toLowerCase())
    })

  if (clustered) {
    const markers = buildMarkersClustered({
      beobs,
      treeName,
      data,
      mobxStore,
    })
    return <MarkerCluster markers={markers} />
  }
  const markers = buildMarkers({
    beobs,
    treeName,
    data,
    refetchTree,
    map: leaflet.map,
    mobxStore,
  })
  return <Marker markers={markers} />
}

export default enhance(BeobZugeordnetMarker)
