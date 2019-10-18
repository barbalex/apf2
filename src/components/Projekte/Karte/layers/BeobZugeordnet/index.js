import React, { useContext, useMemo } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'

const iconCreateFunction = function(cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedTpop = markers.some(
    m => m.options.icon.options.className === 'beobIconHighlighted',
  )
  if (typeof window === 'undefined') return {}
  const className = hasHighlightedTpop
    ? 'beobZugeordnetClusterHighlighted'
    : 'beobZugeordnetCluster'
  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const BeobZugeordnetMarker = ({ treeName, clustered }) => {
  const store = useContext(storeContext)
  const {
    setRefetchKey,
    enqueNotification,
    activeApfloraLayers,
    mapFilter,
  } = store
  const tree = store[treeName]
  const { map } = tree
  const { setBeobZugeordnetIdsFiltered } = map

  const activeNodes = store[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('beobZugeordnet')

  const beobFilter = {
    tpopId: { isNull: false },
    nichtZuordnen: { equalTo: false },
    wgs84Lat: { isNull: false },
  }
  if (!!tree.nodeLabelFilter.beob) {
    beobFilter.label = {
      includesInsensitive: tree.nodeLabelFilter.beob,
    }
  }
  var { data, error, refetch } = useQuery(query, {
    variables: { projId, apId, isActiveInMap, beobFilter },
  })
  setRefetchKey({ key: 'beobZugeordnetForMap', value: refetch })

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Nicht zugeordneten Beobachtungen für die Karte: ${
        error.message
      }`,
      options: {
        variant: 'error',
      },
    })
  }

  const aparts = get(
    data,
    'projektById.apsByProjId.nodes[0].apartsByApId.nodes',
    [],
  )
  const beobs = useMemo(
    () =>
      flatten(
        aparts.map(a =>
          get(a, 'aeTaxonomyByArtId.beobsByArtId.nodes', []),
        ),
      ),
    [aparts],
  )

  const beobZugeordnetForMapAparts = get(
    data,
    `projektById.apsByProjId.nodes[0].apartsByApId.nodes`,
    [],
  )
  const beobZugeordnetForMapNodes = useMemo(
    () =>
      flatten(
        beobZugeordnetForMapAparts.map(n =>
          get(n, 'aeTaxonomyByArtId.beobsByArtId.nodes', []),
        ),
      ),
    [beobZugeordnetForMapAparts],
  )
  const mapBeobZugeordnetIdsFiltered = idsInsideFeatureCollection({
    mapFilter,
    data: beobZugeordnetForMapNodes,
  })
  setBeobZugeordnetIdsFiltered(mapBeobZugeordnetIdsFiltered)

  const beobMarkers = beobs.map(beob => (
    <Marker key={beob.id} treeName={treeName} beob={beob} />
  ))

  if (clustered) {
    return (
      <MarkerClusterGroup
        maxClusterRadius={66}
        iconCreateFunction={iconCreateFunction}
      >
        {beobMarkers}
      </MarkerClusterGroup>
    )
  }
  return beobMarkers
}

export default observer(BeobZugeordnetMarker)
