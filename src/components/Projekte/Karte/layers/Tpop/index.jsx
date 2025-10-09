import { memo, useContext, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { useMapEvents } from 'react-leaflet'
import { cloneDeep } from 'es-toolkit'
import { useParams } from 'react-router'

import MarkerClusterGroup from 'react-leaflet-markercluster'

import { Marker } from './Marker.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { query } from './query.js'
import { updateTpopById } from './updateTpopById.js'
import { tpop } from '../../../../shared/fragments.js'

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

const ObservedTpop = memo(
  observer(({ clustered }) => {
    const store = useContext(MobxContext)
    const {
      enqueNotification,
      setIdOfTpopBeingLocalized,
      idOfTpopBeingLocalized,
    } = store
    const { tpopGqlFilter } = store.tree

    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()

    const tpopFilter = useMemo(() => {
      const filter = cloneDeep(tpopGqlFilter.filtered)
      filter.or.forEach((f) => (f.wgs84Lat = { isNull: false }))

      return filter
    }, [tpopGqlFilter.filtered])
    //

    const { data, error } = useQuery({
      queryKey: ['TpopForMapQuery', tpopFilter],
      queryFn: async () =>
        apolloClient.query({
          query,
          variables: { tpopFilter },
          fetchPolicy: 'no-cache',
        }),
    })

    const leafletMap = useMapEvents({
      async dblclick(event) {
        //console.log('doubleclick')

        // since 2018 10 31 using idOfTpopBeingLocalized directly
        // returns null, so need to use store.idOfTpopBeingLocalized
        const { idOfTpopBeingLocalized } = store
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
          enqueNotification({
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
      enqueNotification({
        message: `Fehler beim Laden der Teil-Populationen für die Karte: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }

    const tpopMarkers = useMemo(
      () =>
        (data?.data?.allTpops?.nodes ?? []).map((tpop) => (
          <Marker
            key={tpop.id}
            tpop={tpop}
          />
        )),
      [data?.data?.allTpops?.nodes],
    )

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
  }),
)

export const Tpop = memo(
  observer(({ clustered }) => {
    const store = useContext(MobxContext)
    const tree = store.tree
    const { tpopGqlFilter } = tree

    const { apId } = useParams()

    // Problem: gqlFilter updates AFTER apId
    // if navigating from ap to pop, apId is set before gqlFilter
    // thus query fetches data for all aps
    // Solution: do not return pop if apId exists but gqlFilter does not contain it (yet)
    const gqlFilterHasApId = !!tpopGqlFilter.filtered?.or?.[0]?.popByPopId?.apId
    const apIdExistsButGqlFilterDoesNotKnowYet = !!apId && !gqlFilterHasApId

    if (apIdExistsButGqlFilterDoesNotKnowYet) return null

    return <ObservedTpop clustered={clustered} />
  }),
)
