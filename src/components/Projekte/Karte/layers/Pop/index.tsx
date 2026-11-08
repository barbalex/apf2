import { useEffect, useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { useMap } from 'react-leaflet'
import { cloneDeep } from 'es-toolkit'
import { useParams } from 'react-router'
import { DivIcon, Point } from 'leaflet'

import { ClusterGroup } from '../../ClusterGroup.tsx'
import type { MarkerCluster } from 'leaflet.markercluster'
import { apiFetch } from '../../../../../modules/api.ts'
import { Marker } from './Marker.tsx'

import type {
  PopId,
  ApId,
  AeTaxonomiesId,
} from '../../../../../models/apflora/index.ts'

import {
  addNotificationAtom,
  treePopGqlFilterAtom,
} from '../../../../../store/index.ts'

export interface PopNode {
  id: PopId
  nr: number | null
  name: string | null
  status: number | null
  wgs84Lat: number
  wgs84Long: number
  lv95X: number | null
  lv95Y: number | null
  popStatusWerteByStatus: {
    id: number
    text: string | null
  } | null
  apByApId: {
    id: ApId
    aeTaxonomyByArtId: {
      id: AeTaxonomiesId
      artname: string | null
    } | null
  } | null
}

interface PopQueryResult {
  allPops: {
    nodes: PopNode[]
  }
}

const iconCreateFunction = function (cluster: MarkerCluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedPop = markers.some(
    (m) =>
      (m.options.icon as DivIcon).options.className === 'popIconHighlighted',
  )
  const className = hasHighlightedPop ? 'popClusterHighlighted' : 'popCluster'

  return new DivIcon({
    html: String(markers.length),
    className,
    iconSize: new Point(40, 40),
  })
}

const ObservedPop = () => {
  const map = useMap()
  const popGqlFilter = useAtomValue(treePopGqlFilterAtom)
  const addNotification = useSetAtom(addNotificationAtom)

  const popFilter = cloneDeep(popGqlFilter.filtered)
  popFilter.or.forEach((f) => (f.wgs84Lat = { isNull: false }))

  const { data, error } = useQuery({
    queryKey: ['PopForMapQuery', popFilter],
    queryFn: async () => {
      // phase 5: the cascade filter runs through query_pop; status text
      // and artname join client-side
      const [popsR, statusWerteR, apsR] = await Promise.all([
        apiFetch<
          {
            id: string
            nr: number | null
            name: string | null
            status: number | null
            wgs84_lat: number | null
            wgs84_long: number | null
            lv95_x: number | null
            lv95_y: number | null
            ap_id: string | null
          }[]
        >(
          '/rpc/query_pop?select=id,nr,name,status,wgs84_lat,wgs84_long,lv95_x,lv95_y,ap_id',
          {
            method: 'POST',
            body: JSON.stringify({ p_filter: popFilter }),
          },
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/pop_status_werte?select=code,text`,
        ),
        apiFetch<
          {
            id: string
            ae_taxonomy_by_art_id: { artname: string | null } | null
          }[]
        >(`/v_ap?select=id,ae_taxonomy_by_art_id`),
      ])
      const statusWerte = new Map(
        (statusWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      const apById = new Map((apsR ?? []).map((a) => [a.id, a]))
      const nodes = (popsR ?? []).map((p) => ({
        id: p.id,
        nr: p.nr,
        name: p.name,
        status: p.status,
        wgs84Lat: p.wgs84_lat,
        wgs84Long: p.wgs84_long,
        lv95X: p.lv95_x,
        lv95Y: p.lv95_y,
        popStatusWerteByStatus:
          p.status == null ?
            null
          : { id: p.status, text: statusWerte.get(p.status) ?? null },
        apByApId:
          p.ap_id ?
            {
              id: p.ap_id,
              aeTaxonomyByArtId:
                apById.get(p.ap_id)?.ae_taxonomy_by_art_id ?? null,
            }
          : null,
      }))
      return { allPops: { nodes } } as PopQueryResult
    },
  })

  const [, setRefetchProvoker] = useState(1)
  const refetch = () => setRefetchProvoker(Math.random())

  useEffect(() => {
    // DO NOT use:
    // leafletMap.on('zoomend dragend', refetch
    // see: https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
    // Also: leafletMap.on('zoomend dragend', ()=> refetch()) never refetches!!??
    // Also: use dragend, not moveend because moveend fires on zoomend as well
    map.on('zoomend dragend', refetch)
    return () => {
      map.off('zoomend dragend', refetch)
    }
  }, [map])

  if (error) {
    addNotification({
      message: `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  return (
    <ClusterGroup maxClusterRadius={66} iconCreateFunction={iconCreateFunction}>
      {(data?.allPops?.nodes ?? []).map((pop) => (
        <Marker
          key={pop.id}
          pop={pop}
        />
      ))}
    </ClusterGroup>
  )
}

export const Pop = () => {
  const popGqlFilter = useAtomValue(treePopGqlFilterAtom)
  const { apId } = useParams()

  // Problem: popGqlFilter updates AFTER apId
  // if navigating from ap to pop, apId is set before popGqlFilter
  // thus query fetches data for all aps
  // Solution: do not return pop while popGqlFilter does not contain
  // the route's apId. Comparing (instead of only checking presence) also
  // hides the previous ap's data while navigating between aps
  const gqlFilterApId = popGqlFilter.filtered?.or?.[0]?.apId?.equalTo
  const apIdDoesNotMatchGqlFilter = !!apId && gqlFilterApId !== apId

  if (apIdDoesNotMatchGqlFilter) return null
  return <ObservedPop />
}
