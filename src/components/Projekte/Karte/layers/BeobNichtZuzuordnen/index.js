import React, { useContext, useMemo } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import Marker from './Marker'
import mobxStoreContext from '../../../../../mobxStoreContext'
import query from './data'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'

const iconCreateFunction = function(cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedTpop = markers.some(
    m => m.options.icon.options.className === 'beobIconHighlighted',
  )
  const className = hasHighlightedTpop
    ? 'beobZugeordnetClusterHighlighted'
    : 'beobZugeordnetCluster'
  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const BeobNichtZuzuordnenMarker = ({
  treeName,
  clustered,
}: {
  treeName: string,
  clustered: Boolean,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { activeApfloraLayers, mapFilter, setRefetchKey, addError } = mobxStore
  const tree = mobxStore[treeName]
  const { map } = tree
  const { setBeobNichtZuzuordnenIdsFiltered } = map
  const beobNichtZuzuordnenFilterString = get(
    tree,
    'nodeLabelFilter.beobNichtZuzuordnen',
  )

  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('beobNichtZuzuordnen')
  var { data, error, refetch } = useQuery(query, {
    variables: { projId, apId, isActiveInMap },
  })
  setRefetchKey({ key: 'beobNichtZuzuordnenForMap', value: refetch })

  if (error) {
    addError(
      new Error(
        `Fehler beim Laden der Nicht zuzuordnenden Beobachtungen für die Karte: ${
          error.message
        }`,
      ),
    )
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
      )
        // filter them by nodeLabelFilter
        .filter(el => {
          if (!beobNichtZuzuordnenFilterString) return true
          // some dates are not valid
          // need to account for that
          let datum = '(kein Datum)'
          if (!isValid(new Date(el.datum))) {
            datum = '(ungültiges Datum)'
          } else if (!!el.datum) {
            datum = format(new Date(el.datum), 'yyyy.MM.dd')
          }
          const autor = el.autor || '(kein Autor)'
          const quelle = get(el, 'beobQuelleWerteByQuelleId.name', '')
          return `${datum}: ${autor} (${quelle})`
            .toLowerCase()
            .includes(beobNichtZuzuordnenFilterString.toLowerCase())
        }),
    [aparts, beobNichtZuzuordnenFilterString],
  )

  const beobNichtZuzuordnenForMapNodesAparts = get(
    data,
    `projektById.apsByProjId.nodes[0].apartsByApId.nodes`,
    [],
  )
  const beobNichtZuzuordnenForMapNodes = useMemo(
    () =>
      flatten(
        beobNichtZuzuordnenForMapNodesAparts.map(n =>
          get(n, 'aeEigenschaftenByArtId.beobsByArtId.nodes', []),
        ),
      ),
    [beobNichtZuzuordnenForMapNodesAparts],
  )
  const mapBeobNichtZuzuordnenIdsFiltered = useMemo(
    () =>
      idsInsideFeatureCollection({
        mapFilter,
        data: beobNichtZuzuordnenForMapNodes,
      }),
    [mapFilter, beobNichtZuzuordnenForMapNodes],
  )
  setBeobNichtZuzuordnenIdsFiltered(mapBeobNichtZuzuordnenIdsFiltered)

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

export default observer(BeobNichtZuzuordnenMarker)
