import React, { useContext, useMemo } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'

const iconCreateFunction = function(cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedBeob = markers.some(
    m => m.options.icon.options.className === 'beobIconHighlighted',
  )
  const className = hasHighlightedBeob
    ? 'beobClusterHighlighted'
    : 'beobCluster'
  if (typeof window === 'undefined') return {}
  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const BeobNichtBeurteiltMarker = ({ treeName, clustered }) => {
  const store = useContext(storeContext)
  const {
    setRefetchKey,
    enqueNotification,
    mapFilter,
    activeApfloraLayers,
  } = store
  const tree = store[treeName]
  const { setBeobNichtBeurteiltIdsFiltered } = store[treeName].map

  const activeNodes = store[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('beobNichtBeurteilt')
  const beobFilter = {
    tpopId: { isNull: true },
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
  setRefetchKey({ key: 'beobNichtBeurteiltForMap', value: refetch })

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Nicht beurteilten Beobachtungen für die Karte: ${
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
          get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', []),
        ),
      ),
    [aparts],
  )

  const beobNichtBeurteiltForMapAparts = get(
    data,
    `projektById.apsByProjId.nodes[0].apartsByApId.nodes`,
    [],
  )
  const beobNichtBeurteiltForMapNodes = useMemo(
    () =>
      flatten(
        beobNichtBeurteiltForMapAparts.map(n =>
          get(n, 'aeEigenschaftenByArtId.beobsByArtId.nodes', []),
        ),
      ),
    [beobNichtBeurteiltForMapAparts],
  )
  const mapBeobNichtBeurteiltIdsFiltered = idsInsideFeatureCollection({
    mapFilter,
    data: beobNichtBeurteiltForMapNodes,
  })
  setBeobNichtBeurteiltIdsFiltered(mapBeobNichtBeurteiltIdsFiltered)

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

export default observer(BeobNichtBeurteiltMarker)
