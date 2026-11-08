import { useAtomValue, useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { DivIcon, Point } from 'leaflet'
import { apiFetch } from '../../../../../modules/api.ts'
// import { useMap } from 'react-leaflet'

import { ClusterGroup } from '../../ClusterGroup.tsx'
import { useProgressiveElements } from '../../useProgressiveCount.ts'
import type { MarkerCluster } from 'leaflet.markercluster'
import { Marker } from './Marker.tsx'
import type { BeobZugeordnetNode } from './Marker.tsx'

import {
  addNotificationAtom,
  treeBeobGqlFilterAtom,
} from '../../../../../store/index.ts'

interface BeobZugeordnetQueryResult {
  allBeobs: {
    nodes: BeobZugeordnetNode[]
  }
}

const iconCreateFunction = (cluster: MarkerCluster) => {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedTpop = markers.some(
    (m) => (m.options.icon as DivIcon | undefined)?.options.className === 'beobIconHighlighted',
  )
  const className =
    hasHighlightedTpop ?
      'beobZugeordnetClusterHighlighted'
    : 'beobZugeordnetCluster'

  return new DivIcon({
    html: String(markers.length),
    className,
    iconSize: new Point(40, 40),
  })
}

const BeobZugeordnetMarker = ({ clustered }: { clustered: boolean }) => {
  // const leafletMap = useMap()
  const addNotification = useSetAtom(addNotificationAtom)
  const beobZugeordnetGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('zugeordnet'),
  )

  const { data, error } = useQuery({
    queryKey: ['BeobZugeordnetForMapQuery', beobZugeordnetGqlFilter.filtered],
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
              p_filter: beobZugeordnetGqlFilter.filtered,
            }),
          },
        )) ?? []

      // zugeordnet: the tpop context joins client-side
      const tpopIds = [
        ...new Set((rows ?? []).map((r) => r.tpop_id).filter(Boolean)),
      ]
      const tpops =
        tpopIds.length ?
          ((await apiFetch<
            {
              id: string
              pop_id: string | null
              nr: number | null
              flurname: string | null
            }[]
          >(
            `/q_tpop?id=in.(${tpopIds.join(',')})&select=id,pop_id,nr,flurname`,
          )) ?? [])
        : []
      const popIds = [...new Set(tpops.map((t) => t.pop_id).filter(Boolean))]
      const pops =
        popIds.length ?
          ((await apiFetch<{ id: string; label: string | null }[]>(
            `/q_pop?id=in.(${popIds.join(',')})&select=id,label`,
          )) ?? [])
        : []
      const tpopById = new Map(tpops.map((t) => [t.id, t]))
      const popById = new Map(pops.map((p) => [p.id, p]))
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
        tpopByTpopId: (() => {
          const t = r.tpop_id ? tpopById.get(r.tpop_id) : undefined
          if (!t) return null
          const pop = t.pop_id ? popById.get(t.pop_id) : undefined
          return {
            id: t.id,
            popId: t.pop_id,
            nr: t.nr,
            flurname: t.flurname,
            popByPopId: pop ? { id: pop.id, label: pop.label } : null,
          }
        })(),
      }))
      return { allBeobs: { nodes } } as BeobZugeordnetQueryResult
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
      message: `Fehler beim Laden der Nicht zugeordneten Beobachtungen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  // thousands of markers with "Layer auch anzeigen...": mount in chunks
  // so the UI stays responsive
  const beobMarkers = useProgressiveElements(
    data?.allBeobs?.nodes ?? [],
    (beob) => <Marker key={beob.id} beob={beob} />,
  )

  if (clustered) {
    return (
      <ClusterGroup
        maxClusterRadius={66}
        iconCreateFunction={iconCreateFunction}
      >
        {beobMarkers}
      </ClusterGroup>
    )
  }
  return beobMarkers
}

export const BeobZugeordnet = ({ clustered }: { clustered: boolean }) => {
  const beobZugeordnetGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('zugeordnet'),
  )

  const { apId } = useParams()

  // Problem: gqlFilter updates AFTER apId
  // if navigating from ap to pop, apId is set before gqlFilter
  // thus query fetches data for all aps
  // Solution: do not return beobs while gqlFilter does not contain
  // the route's apId. Comparing (instead of only checking presence) also
  // hides the previous ap's beobs while navigating between aps
  const gqlFilterApIds =
    beobZugeordnetGqlFilter.filtered?.aeTaxonomyByArtId?.apartsByArtId?.some
      ?.apId?.in ?? []
  const apIdDoesNotMatchGqlFilter = !!apId && !gqlFilterApIds.includes(apId)

  if (apIdDoesNotMatchGqlFilter) return null

  return <BeobZugeordnetMarker clustered={clustered} />
}
