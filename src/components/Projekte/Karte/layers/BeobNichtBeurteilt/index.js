import React, { useContext, useMemo, useEffect, useState } from 'react'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import MarkerClusterGroup from '@changey/react-leaflet-markercluster'
import { useMap } from 'react-leaflet'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'

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
  const leafletMap = useMap()
  const store = useContext(storeContext)
  const { setRefetchKey, enqueNotification } = store
  const tree = store[treeName]
  const { apIdInActiveNodeArray, projIdInActiveNodeArray } = tree

  const projId =
    projIdInActiveNodeArray ?? '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray ?? '99999999-9999-9999-9999-999999999999'

  const beobFilter = {
    tpopId: { isNull: true },
    nichtZuordnen: { equalTo: false },
    wgs84Lat: { isNull: false },
    // 2021.08.16: needed to remove this filter
    // because icons where added every time a tpop left, then reentered the bbox
    // geomPoint: { within: myBbox },
  }
  if (tree.nodeLabelFilter.beob) {
    beobFilter.label = {
      includesInsensitive: tree.nodeLabelFilter.beob,
    }
  }

  var { data, error, refetch } = useQuery(query, {
    variables: { projId, apId, beobFilter },
  })
  setRefetchKey({ key: 'beobNichtBeurteiltForMap', value: refetch })

  // eslint-disable-next-line no-unused-vars
  const [refetchProvoker, setRefetchProvoker] = useState(1)
  useEffect(() => {
    // DO NOT use:
    // leafletMap.on('zoomend dragend', refetch
    // see: https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
    // Also: leafletMap.on('zoomend dragend', ()=> refetch()) never refetches!!??
    // Also: use dragend, not moveend because moveend fires on zoomend as well
    leafletMap.on('zoomend dragend', () => setRefetchProvoker(Math.random()))
    return () => {
      leafletMap.off('zoomend dragend', () => setRefetchProvoker(Math.random()))
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

  const aparts = useMemo(
    () => data?.projektById?.apsByProjId?.nodes?.[0]?.apartsByApId?.nodes ?? [],
    [data?.projektById?.apsByProjId?.nodes],
  )
  let beobs = useMemo(
    () =>
      flatten(
        aparts.map((a) => a?.aeTaxonomyByArtId?.beobsByArtId?.nodes ?? []),
      ),
    [aparts],
  )

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
