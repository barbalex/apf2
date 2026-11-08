import { apiUpdateByVariables } from '../../../../../modules/api.ts'
import { useEffect, useRef } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { useMapEvents } from 'react-leaflet'
import { cloneDeep } from 'es-toolkit'
import { useParams } from 'react-router'
import { DivIcon, DomEvent, Point } from 'leaflet'
import type { LeafletMouseEvent, Marker as LeafletMarkerType } from 'leaflet'

import { ClusterGroup } from '../../ClusterGroup.tsx'
import { useDisplayedLabels } from '../../useDisplayedLabels.ts'
import {
  LABELS_MAX_MARKERS,
  useProgressiveElements,
} from '../../useProgressiveCount.ts'
import type {
  MarkerCluster,
  MarkerClusterGroup,
} from 'leaflet.markercluster'

import { apiFetch } from '../../../../../modules/api.ts'
import { Marker } from './Marker.tsx'

import markerStyles from '../BeobNichtBeurteilt/Marker.module.css'

import type {
  TpopId,
  PopId,
  ApId,
  AeTaxonomiesId,
} from '../../../../../models/apflora/index.ts'
import type { TpopFilter } from '../../../../../modules/gqlFilterTypes.ts'

import {
  addNotificationAtom,
  idOfTpopBeingLocalizedAtom,
  setIdOfTpopBeingLocalizedAtom,
  treeTpopGqlFilterAtom,
} from '../../../../../store/index.ts'

export interface TpopNode {
  id: TpopId
  nr: number | null
  status: number | null
  wgs84Lat: number
  wgs84Long: number
  lv95X: number | null
  lv95Y: number | null
  flurname: string | null
  popStatusWerteByStatus: {
    id: number
    text: string | null
  } | null
  popByPopId: {
    id: PopId
    nr: number | null
    name: string | null
    apByApId: {
      id: ApId
      aeTaxonomyByArtId: {
        id: AeTaxonomiesId
        artname: string | null
      } | null
    } | null
  } | null
}

interface TpopQueryResult {
  allTpops: {
    nodes: TpopNode[]
  }
}

const iconCreateFunction = (cluster: MarkerCluster) => {
  const hasHighlightedTpop = cluster
    .getAllChildMarkers()
    .some((m) => (m.options.icon.options as { isHighlighted?: boolean }).isHighlighted)
  const className =
    hasHighlightedTpop ? 'tpopClusterHighlighted' : 'tpopCluster'

  return new DivIcon({
    html: String(cluster.getChildCount()),
    className,
    iconSize: new Point(40, 40),
  })
}

const getTpopFilter = (tpopGqlFilter: { filtered: { or: TpopFilter[] } }) => {
  const filter = cloneDeep(tpopGqlFilter.filtered)
  filter.or.forEach((f) => (f.wgs84Lat = { isNull: false }))

  return filter
}

const ObservedTpop = ({ clustered }: { clustered: boolean }) => {
  const tpopGqlFilter = useAtomValue(treeTpopGqlFilterAtom)

  const idOfTpopBeingLocalized = useAtomValue(idOfTpopBeingLocalizedAtom)
  const setIdOfTpopBeingLocalized = useSetAtom(setIdOfTpopBeingLocalizedAtom)
  const addNotification = useSetAtom(addNotificationAtom)

  const tsQueryClient = useQueryClient()

  const tpopFilter = getTpopFilter(tpopGqlFilter)

  const { data, error } = useQuery({
    queryKey: ['TpopForMapQuery', tpopFilter],
    queryFn: async () => {
      // phase 5: the cascade filter runs through query_tpop; status text
      // and the pop/ap context join client-side
      const [tpopsR, popsR, statusWerteR, apsR] = await Promise.all([
        apiFetch<
          {
            id: string
            nr: number | null
            status: number | null
            wgs84_lat: number | null
            wgs84_long: number | null
            lv95_x: number | null
            lv95_y: number | null
            flurname: string | null
            pop_id: string | null
          }[]
        >(
          '/rpc/query_tpop?select=id,nr,status,wgs84_lat,wgs84_long,lv95_x,lv95_y,flurname,pop_id',
          {
            method: 'POST',
            body: JSON.stringify({ p_filter: tpopFilter }),
          },
        ),
        apiFetch<
          {
            id: string
            nr: number | null
            name: string | null
            ap_id: string | null
          }[]
        >(`/q_pop?select=id,nr,name,ap_id`),
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
      const popById = new Map((popsR ?? []).map((p) => [p.id, p]))
      const apById = new Map((apsR ?? []).map((a) => [a.id, a]))
      const nodes = (tpopsR ?? []).map((t) => {
        const pop = t.pop_id ? popById.get(t.pop_id) : undefined
        const apBy = pop?.ap_id ? apById.get(pop.ap_id) : undefined
        return {
          id: t.id,
          nr: t.nr,
          status: t.status,
          wgs84Lat: t.wgs84_lat,
          wgs84Long: t.wgs84_long,
          lv95X: t.lv95_x,
          lv95Y: t.lv95_y,
          flurname: t.flurname,
          popStatusWerteByStatus:
            t.status == null ?
              null
            : { id: t.status, text: statusWerte.get(t.status) ?? null },
          popByPopId:
            pop ?
              {
                id: pop.id,
                nr: pop.nr,
                name: pop.name,
                apByApId:
                  pop.ap_id ?
                    {
                      id: pop.ap_id,
                      aeTaxonomyByArtId: apBy?.ae_taxonomy_by_art_id ?? null,
                    }
                  : null,
              }
            : null,
        }
      })
      return { allTpops: { nodes } } as TpopQueryResult
    },
  })

  const onDblclick = async (event: LeafletMouseEvent) => {
    //console.log('doubleclick')

    // since 2018 10 31 using idOfTpopBeingLocalized directly
    // returns null, so need to use store.idOfTpopBeingLocalized
    //console.log('Tpop, on dblclick', { idOfTpopBeingLocalized })
    if (!idOfTpopBeingLocalized) return
    /**
     * TODO
     * When clicking on Layertool
     * somehow Mapelement grabs the click event
     * although Layertool lies _over_ map element ??!!
     * So when localizing, if user wants to change base map,
     * click on Layertool sets new coordinates!
     */
    const { lat, lng } = event.latlng
    const geomPoint = {
      type: 'Point',
      coordinates: [lng, lat],
      // need to add crs otherwise PostGIS v2.5 (on server) errors
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:EPSG::4326',
        },
      },
    }
    // TODO:
    // Idea: set Gemeinde?
    //console.log('Tpop, on dblclick', { lat, lng, geomPoint })
    // DANGER:
    // need to stop propagation of the event
    // if not it is called a second time
    // the crazy thing is:
    // in some areas (not all) the second event
    // has wrong coordinates!!!!
    DomEvent.stopPropagation(event)
    /**
     * how to update a geometry value?
     * v1: "SRID=4326;POINT(long lat)" https://github.com/graphile/postgraphile/issues/575#issuecomment-372030995
     */
    try {
      await apiUpdateByVariables('tpop', {
        id: idOfTpopBeingLocalized,
        geomPoint,
      })
      // refetch so it appears on map
      // need to also refetch pop in case it was new
      void tsQueryClient.invalidateQueries({
        queryKey: [`PopForMapQuery`],
      })
      void tsQueryClient.invalidateQueries({
        queryKey: [`TpopForMapQuery`],
      })
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setIdOfTpopBeingLocalized(null)
  }

  const leafletMap = useMapEvents({
    dblclick: (event) => void onDblclick(event),
  })

  const mapContainer = leafletMap.getContainer()

  useEffect(() => {
    if (idOfTpopBeingLocalized) {
      // see: https://stackoverflow.com/a/28724847/712005
      // altering the maps css corrupted the map ui
      mapContainer.classList.add('crosshair-cursor-enabled')
    } else {
      mapContainer.classList.remove('crosshair-cursor-enabled')
    }
  }, [idOfTpopBeingLocalized, mapContainer])

  if (error) {
    addNotification({
      message: `Fehler beim Laden der Teil-Populationen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  const nodes = data?.allTpops?.nodes ?? []
  // > 20 000 markers with "Layer auch anzeigen...": mount them in chunks
  // so the UI stays responsive. Markers get React-rendered permanent
  // labels only in small layers; big layers label their displayed
  // markers imperatively once zoomed in (useDisplayedLabels)
  const labeled = nodes.length <= LABELS_MAX_MARKERS
  const groupRef = useRef<MarkerClusterGroup<LeafletMarkerType> | null>(null)
  const tpopMarkers = useProgressiveElements(nodes, (tpop) => (
    <Marker key={tpop.id} tpop={tpop} labeled={labeled} />
  ))
  useDisplayedLabels({
    map: leafletMap,
    group: groupRef,
    nodes: labeled || !clustered ? [] : nodes,
    tooltipClassName: markerStyles.tooltip!,
    mountedCount: labeled || !clustered ? 0 : tpopMarkers.length,
  })

  if (clustered) {
    return (
      <ClusterGroup
        ref={groupRef}
        maxClusterRadius={66}
        iconCreateFunction={iconCreateFunction}
        chunkedLoading
      >
        {tpopMarkers}
      </ClusterGroup>
    )
  }

  return tpopMarkers
}

export const Tpop = ({ clustered }: { clustered: boolean }) => {
  const tpopGqlFilter = useAtomValue(treeTpopGqlFilterAtom)

  const { apId } = useParams()

  // Problem: gqlFilter updates AFTER apId
  // if navigating from ap to pop, apId is set before gqlFilter
  // thus query fetches data for all aps
  // Solution: do not return tpop while gqlFilter does not contain
  // the route's apId. Comparing (instead of only checking presence) also
  // hides the previous ap's data while navigating between aps
  const gqlFilterApId = tpopGqlFilter.filtered?.or?.[0]?.popByPopId?.apId?.equalTo
  const apIdDoesNotMatchGqlFilter = !!apId && gqlFilterApId !== apId

  if (apIdDoesNotMatchGqlFilter) return null

  return <ObservedTpop clustered={clustered} />
}
