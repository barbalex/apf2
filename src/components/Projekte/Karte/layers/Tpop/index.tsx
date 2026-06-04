import { useEffect } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { useMapEvents } from 'react-leaflet'
import { cloneDeep } from 'es-toolkit'
import { useParams } from 'react-router'

import MarkerClusterGroup from 'react-leaflet-markercluster'

import { Marker } from './Marker.tsx'
import { query } from './query.ts'
import { updateTpopById } from './updateTpopById.ts'
import { tpop } from '../../../../shared/fragments.ts'

import type {
  TpopId,
  PopId,
  ApId,
} from '../../../../../models/apflora/public/Tpop.ts'
import type { AeTaxonomyId } from '../../../../../models/apflora/public/AeTaxonomy.ts'

import {
  addNotificationAtom,
  idOfTpopBeingLocalizedAtom,
  setIdOfTpopBeingLocalizedAtom,
  treeTpopGqlFilterAtom,
} from '../../../../../store/index.ts'

interface TpopNode {
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
        id: AeTaxonomyId
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

const iconCreateFunction = (cluster) => {
  const hasHighlightedTpop = cluster
    .getAllChildMarkers()
    .some((m) => m.options.icon.options.isHighlighted)
  const className =
    hasHighlightedTpop ? 'tpopClusterHighlighted' : 'tpopCluster'

  return window.L.divIcon({
    html: cluster.getChildCount(),
    className,
    iconSize: window.L.point(40, 40),
  })
}

const getTpopFilter = (tpopGqlFilter) => {
  const filter = cloneDeep(tpopGqlFilter.filtered)
  filter.or.forEach((f) => (f.wgs84Lat = { isNull: false }))

  return filter
}

const ObservedTpop = ({ clustered }) => {
  const tpopGqlFilter = useAtomValue(treeTpopGqlFilterAtom)

  const idOfTpopBeingLocalized = useAtomValue(idOfTpopBeingLocalizedAtom)
  const setIdOfTpopBeingLocalized = useSetAtom(setIdOfTpopBeingLocalizedAtom)
  const addNotification = useSetAtom(addNotificationAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const tpopFilter = getTpopFilter(tpopGqlFilter)

  const { data, error } = useQuery({
    queryKey: ['TpopForMapQuery', tpopFilter],
    queryFn: async () =>
      apolloClient.query({
        query,
        variables: { tpopFilter },
      }),
  })

  const leafletMap = useMapEvents({
    async dblclick(event) {
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
      window.L.DomEvent.stopPropagation(event)
      /**
       * how to update a geometry value?
       * v1: "SRID=4326;POINT(long lat)" https://github.com/graphile/postgraphile/issues/575#issuecomment-372030995
       */
      try {
        await apolloClient.mutate({
          mutation: updateTpopById,
          variables: {
            id: idOfTpopBeingLocalized,
            geomPoint,
          },
        })
        // refetch so it appears on map
        // need to also refetch pop in case it was new
        tsQueryClient.invalidateQueries({
          queryKey: [`PopForMapQuery`],
        })
        tsQueryClient.invalidateQueries({
          queryKey: [`TpopForMapQuery`],
        })
      } catch (error) {
        addNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      setIdOfTpopBeingLocalized(null)
    },
  })

  useEffect(() => {
    if (idOfTpopBeingLocalized) {
      // see: https://stackoverflow.com/a/28724847/712005
      // altering the maps css corrupted the map ui
      window.L.DomUtil.addClass(
        leafletMap._container,
        'crosshair-cursor-enabled',
      )
    } else {
      window.L.DomUtil.removeClass(
        leafletMap._container,
        'crosshair-cursor-enabled',
      )
    }
  }, [idOfTpopBeingLocalized, leafletMap._container])

  if (error) {
    addNotification({
      message: `Fehler beim Laden der Teil-Populationen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  const tpopMarkers = (data?.data?.allTpops?.nodes ?? []).map((tpop) => (
    <Marker
      key={tpop.id}
      tpop={tpop}
    />
  ))

  if (clustered) {
    return (
      <MarkerClusterGroup
        key={tpopMarkers.toString()} // to force rerendering when data changes, see https://github.com/barbalex/apf2/issues/750
        maxClusterRadius={66}
        iconCreateFunction={iconCreateFunction}
        chunkedLoading
      >
        {tpopMarkers}
      </MarkerClusterGroup>
    )
  }

  return tpopMarkers
}

export const Tpop = ({ clustered }) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const tpopGqlFilter = useAtomValue(treeTpopGqlFilterAtom)

  const { apId } = useParams()

  // Problem: gqlFilter updates AFTER apId
  // if navigating from ap to pop, apId is set before gqlFilter
  // thus query fetches data for all aps
  // Solution: do not return pop if apId exists but gqlFilter does not contain it (yet)
  const gqlFilterHasApId = !!tpopGqlFilter.filtered?.or?.[0]?.popByPopId?.apId
  const apIdExistsButGqlFilterDoesNotKnowYet = !!apId && !gqlFilterHasApId

  if (apIdExistsButGqlFilterDoesNotKnowYet) return null

  return <ObservedTpop clustered={clustered} />
}
