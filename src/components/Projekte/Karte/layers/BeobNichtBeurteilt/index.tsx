import { useAtomValue, useSetAtom } from 'jotai'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useParams } from 'react-router'
// import { useMap } from 'react-leaflet'

import { Marker } from './Marker.tsx'
import { query } from './query.ts'

import type { BeobId } from '../../../../../models/apflora/public/Beob.ts'
import type { AeTaxonomyId } from '../../../../../models/apflora/public/AeTaxonomy.ts'

import {
  addNotificationAtom,
  treeBeobGqlFilterAtom,
} from '../../../../../store/index.ts'


interface BeobNichtBeurteiltNode {
  id: BeobId
  wgs84Lat: number
  wgs84Long: number
  lv95X: number | null
  lv95Y: number | null
  datum: string | null
  autor: string | null
  quelle: string | null
  absenz: boolean | null
  aeTaxonomyByArtId: {
    id: AeTaxonomyId
    artname: string | null
  } | null
}

interface BeobNichtBeurteiltQueryResult {
  allBeobs: {
    nodes: BeobNichtBeurteiltNode[]
  }
}

const iconCreateFunction = function (cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedBeob = markers.some(
    (m) => m.options.icon.options.className === 'beobIconHighlighted',
  )
  const className =
    hasHighlightedBeob ? 'beobClusterHighlighted' : 'beobCluster'

  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const BeobNichtBeurteiltMarker = ({ clustered }) => {
  // const leafletMap = useMap()
  const beobNichtBeurteiltGqlFilter = useAtomValue(treeBeobGqlFilterAtom('nichtBeurteilt'))

  const apolloClient = useApolloClient()

  const { data, error } = useQuery({
    queryKey: [
      'BeobNichtBeurteiltForMapQuery',
      beobNichtBeurteiltGqlFilter.filtered,
    ],
    queryFn: async () =>
      apolloClient.query({
        query: query,
        variables: { beobFilter: beobNichtBeurteiltGqlFilter.filtered },
      }),
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const beobMarkers = (data?.data?.allBeobs?.nodes ?? []).map((beob) => (
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

export const BeobNichtBeurteilt = ({ clustered }) => {
  const addNotification = useSetAtom(addNotificationAtom)
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
