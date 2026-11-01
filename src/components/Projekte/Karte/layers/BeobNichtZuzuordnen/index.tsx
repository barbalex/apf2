import { useAtomValue, useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useParams } from 'react-router'
import type { Marker as LeafletMarkerType } from 'leaflet'
import { apiFetch } from '../../../../../modules/api.ts'
// import { useMap } from 'react-leaflet'

import { Marker } from './Marker.tsx'
import type { BeobNichtZuzuordnenNode } from './Marker.tsx'

import {
  addNotificationAtom,
  treeBeobGqlFilterAtom,
} from '../../../../../store/index.ts'

interface BeobNichtZuzuordnenQueryResult {
  allBeobs: {
    nodes: BeobNichtZuzuordnenNode[]
  }
}

const iconCreateFunction = (cluster: {
  getAllChildMarkers: () => LeafletMarkerType[]
}) => {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedTpop = markers.some(
    (m) => m.options.icon?.options.className === 'beobIconHighlighted',
  )
  const className =
    hasHighlightedTpop ?
      'beobZugeordnetClusterHighlighted'
    : 'beobZugeordnetCluster'

  return window.L.divIcon({
    html: String(markers.length),
    className,
    iconSize: window.L.point(40, 40),
  })
}

const BeobNichtZuzuordnenMarker = ({ clustered }: { clustered: boolean }) => {
  // const leafletMap = useMap()
  const addNotification = useSetAtom(addNotificationAtom)
  const beobNichtZuzuordnenGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('nichtZuzuordnen'),
  )

  const { data, error } = useQuery({
    queryKey: [
      'KarteBeobNichtZuzuordnenQuery',
      beobNichtZuzuordnenGqlFilter.filtered,
    ],
    queryFn: async () => {
      const rows =
        (await apiFetch<
          {
            id: string
            tpop_id: string | null
            art_id: string | null
            wgs84_lat: number
            wgs84_long: number
            lv95_x: number
            lv95_y: number
            datum: string | null
            autor: string | null
            quelle: string | null
            absenz: boolean | null
          }[]
        >(
          '/rpc/query_beob?select=id,tpop_id,art_id,wgs84_lat,wgs84_long,lv95_x,lv95_y,datum,autor,quelle,absenz',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: beobNichtZuzuordnenGqlFilter.filtered,
            }),
          },
        )) ?? []

      const aeIds = [
        ...new Set((rows ?? []).map((r) => r.art_id).filter(Boolean)),
      ]
      const taxa =
        aeIds.length ?
          ((await apiFetch<{ id: string; artname: string | null }[]>(
            `/ae_taxonomies?id=in.(${aeIds.join(',')})&select=id,artname`,
          )) ?? [])
        : []
      const taxonById = new Map(taxa.map((t) => [t.id, t]))

      const nodes = (rows ?? []).map((r) => ({
        id: r.id,
        wgs84Lat: r.wgs84_lat,
        wgs84Long: r.wgs84_long,
        lv95X: r.lv95_x,
        lv95Y: r.lv95_y,
        datum: r.datum,
        autor: r.autor,
        quelle: r.quelle,
        absenz: r.absenz,
        aeTaxonomyByArtId:
          r.art_id ?
            { id: r.art_id, artname: taxonById.get(r.art_id)?.artname ?? null }
          : null,
      }))
      return { allBeobs: { nodes } } as BeobNichtZuzuordnenQueryResult
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
      message: `Fehler beim Laden der Nicht zuzuordnenden Beobachtungen für die Karte: ${error.message}`,
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

export const BeobNichtZuzuordnen = ({ clustered }: { clustered: boolean }) => {
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
