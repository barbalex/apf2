import { useAtomValue, useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client/react'
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

interface BeobNichtZuzuordnenNode {
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

interface BeobNichtZuzuordnenQueryResult {
  allBeobs: {
    nodes: BeobNichtZuzuordnenNode[]
  }
}

const iconCreateFunction = function (cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedTpop = markers.some(
    (m) => m.options.icon.options.className === 'beobIconHighlighted',
  )
  const className =
    hasHighlightedTpop ?
      'beobZugeordnetClusterHighlighted'
    : 'beobZugeordnetCluster'

  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const BeobNichtZuzuordnenMarker = ({ clustered }) => {
  // const leafletMap = useMap()
  const beobNichtZuzuordnenGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('nichtZuzuordnen'),
  )
  const apolloClient = useApolloClient()

  const { data, error } = useQuery({
    queryKey: [
      'KarteBeobNichtZuzuordnenQuery',
      beobNichtZuzuordnenGqlFilter.filtered,
    ],
    queryFn: () =>
      apolloClient.query({
        query,
        variables: {
          beobFilter: beobNichtZuzuordnenGqlFilter.filtered,
        },
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
      message: `Fehler beim Laden der Nicht zuzuordnenden Beobachtungen für die Karte: ${error.message}`,
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

export const BeobNichtZuzuordnen = ({ clustered }) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const beobNichtZuzuordnenGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('nichtZuzuordnen'),
  )

  const { apId } = useParams()

  // Problem: gqlFilter updates AFTER apId
  // if navigating from ap to pop, apId is set before gqlFilter
  // thus query fetches data for all aps
  // Solution: do not return pop if apId exists but gqlFilter does not contain it (yet)
  const gqlFilterHasApId =
    !!beobNichtZuzuordnenGqlFilter.filtered?.aeTaxonomyByArtId?.apartsByArtId
      ?.some?.apId
  const apIdExistsButGqlFilterDoesNotKnowYet = !!apId && !gqlFilterHasApId

  if (apIdExistsButGqlFilterDoesNotKnowYet) return null

  return <BeobNichtZuzuordnenMarker clustered={clustered} />
}
