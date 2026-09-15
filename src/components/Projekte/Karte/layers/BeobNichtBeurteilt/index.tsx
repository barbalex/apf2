import { useAtomValue, useSetAtom } from 'jotai'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useParams } from 'react-router'
import type { Marker as LeafletMarkerType } from 'leaflet'
// import { useMap } from 'react-leaflet'

import { Marker } from './Marker.tsx'
import type { BeobNichtBeurteiltNode } from './Marker.tsx'
import { query } from './query.ts'

import {
  addNotificationAtom,
  treeBeobGqlFilterAtom,
} from '../../../../../store/index.ts'

interface BeobNichtBeurteiltQueryResult {
  allBeobs: {
    nodes: BeobNichtBeurteiltNode[]
  }
}

const iconCreateFunction = (cluster: {
  getAllChildMarkers: () => LeafletMarkerType[]
}) => {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedBeob = markers.some(
    (m) => m.options.icon?.options.className === 'beobIconHighlighted',
  )
  const className =
    hasHighlightedBeob ? 'beobClusterHighlighted' : 'beobCluster'

  return window.L.divIcon({
    html: String(markers.length),
    className,
    iconSize: window.L.point(40, 40),
  })
}

const BeobNichtBeurteiltMarker = ({ clustered }: { clustered: boolean }) => {
  // const leafletMap = useMap()
  const addNotification = useSetAtom(addNotificationAtom)
  const beobNichtBeurteiltGqlFilter = useAtomValue(treeBeobGqlFilterAtom('nichtBeurteilt'))

  const apolloClient = useApolloClient()

  const { data, error } = useQuery({
    queryKey: [
      'BeobNichtBeurteiltForMapQuery',
      beobNichtBeurteiltGqlFilter.filtered,
    ],
    queryFn: async () => {
      const result = await apolloClient.query<BeobNichtBeurteiltQueryResult>({
        query: query,
        variables: { beobFilter: beobNichtBeurteiltGqlFilter.filtered },
      })
      if (result.error) throw result.error
      return result.data
    },
  })


  // const [refetchProvoker, setRefetchProvoker] = useState(1)
  // useEffect(() => {
  //   // DO NOT use:
  //   // leafletMap.on('zoomend dragend', refetch
  //   // see: https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
  //   // Also: leafletMap.on('zoomend dragend', ()=> refetch()) never refetches!!??
  //   // Also: use dragend, not moveend because moveend fires on zoomend as well
  //   leafletMap.on('zoomend dragend', () => setRefetchProvoker(Math.random()))
  //   return () => {
  //     leafletMap.off('zoomend dragend', () => setRefetchProvoker(Math.random()))
  //   }
  // }, [leafletMap])

  if (error) {
    addNotification({
      message: `Fehler beim Laden der Nicht beurteilten Beobachtungen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  const beobMarkers = (data?.allBeobs?.nodes ?? []).map((beob) => (
    <Marker
      key={beob.id}
      beob={beob}
    />
  ))

  if (clustered) {
    return (
      <MarkerClusterGroup
        key={beobMarkers.toString()} // to force rerendering when data changes, see https://github.com/barbalex/apf2/issues/750
        maxClusterRadius={66}
        iconCreateFunction={iconCreateFunction}
      >
        {beobMarkers}
      </MarkerClusterGroup>
    )
  }
  return beobMarkers
}

export const BeobNichtBeurteilt = ({ clustered }: { clustered: boolean }) => {
  const beobNichtBeurteiltGqlFilter = useAtomValue(treeBeobGqlFilterAtom('nichtBeurteilt'))

  const { apId } = useParams()

  // Problem: gqlFilter updates AFTER apId
  // if navigating from ap to pop, apId is set before gqlFilter
  // thus query fetches data for all aps
  // Solution: do not return pop if apId exists but gqlFilter does not contain it (yet)
  const gqlFilterHasApId =
    !!beobNichtBeurteiltGqlFilter.filtered?.aeTaxonomyByArtId?.apartsByArtId
      ?.some?.apId
  const apIdExistsButGqlFilterDoesNotKnowYet = !!apId && !gqlFilterHasApId

  if (apIdExistsButGqlFilterDoesNotKnowYet) return null

  return <BeobNichtBeurteiltMarker clustered={clustered} />
}
