import React, { useContext, useMemo, useEffect, useState } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import bboxPolygon from '@turf/bbox-polygon'
import { useLeaflet } from 'react-leaflet'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'

const iconCreateFunction = function (cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedBeob = markers.some(
    (m) => m.options.icon.options.className === 'beobIconHighlighted',
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
  const { map: leafletMap } = useLeaflet()
  const store = useContext(storeContext)
  const {
    setRefetchKey,
    enqueNotification,
    mapFilter,
    activeApfloraLayers,
  } = store
  const tree = store[treeName]
  const { apIdInActiveNodeArray, projIdInActiveNodeArray } = tree
  const { setBeobNichtBeurteiltIdsFiltered } = store[treeName].map

  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('beobNichtBeurteilt')

  const bounds = leafletMap.getBounds()
  const boundsArray = [
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth(),
  ]
  const myBbox = bboxPolygon(boundsArray).geometry

  const beobFilter = {
    tpopId: { isNull: true },
    nichtZuordnen: { equalTo: false },
    wgs84Lat: { isNull: false },
    geomPoint: { within: myBbox },
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

  // eslint-disable-next-line no-unused-vars
  const [refetchProvoker, setRefetchProvoker] = useState(1)
  useEffect(() => {
    // DO NOT use:
    // leafletMap.on('zoomend moveend', refetch
    // see: https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
    // Also: leafletMap.on('zoomend moveend', ()=> refetch()) never refetches!!??
    leafletMap.on('zoomend moveend', () => setRefetchProvoker(Math.random()))
    return () => {
      leafletMap.off('zoomend moveend', () => setRefetchProvoker(Math.random()))
    }
  }, [leafletMap])

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Nicht beurteilten Beobachtungen für die Karte: ${error.message}`,
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
  let beobs = useMemo(
    () =>
      flatten(
        aparts.map((a) => get(a, 'aeTaxonomyByArtId.beobsByArtId.nodes', [])),
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
        beobNichtBeurteiltForMapAparts.map((n) =>
          get(n, 'aeTaxonomyByArtId.beobsByArtId.nodes', []),
        ),
      ),
    [beobNichtBeurteiltForMapAparts],
  )
  const mapBeobNichtBeurteiltIdsFiltered = idsInsideFeatureCollection({
    mapFilter,
    data: beobNichtBeurteiltForMapNodes,
  })
  setBeobNichtBeurteiltIdsFiltered(mapBeobNichtBeurteiltIdsFiltered)

  if (!clustered && beobs.length > 2000) {
    enqueNotification({
      message: `Zuviele Beobachtungen: Es werden maximal 2'000 angezeigt, im aktuellen Ausschnitt sind es: ${beobs.length.toLocaleString(
        'de-CH',
      )}. Bitte wählen Sie einen kleineren Ausschnitt.`,
      options: {
        variant: 'warning',
      },
    })
    beobs = []
  }

  const beobMarkers = beobs.map((beob) => (
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
