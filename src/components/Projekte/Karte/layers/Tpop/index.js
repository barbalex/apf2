import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from '@changey/react-leaflet-markercluster'
import { useApolloClient, useLazyQuery } from '@apollo/client'
import { useMapEvents } from 'react-leaflet'
import cloneDeep from 'lodash/cloneDeep'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'
import updateTpopById from './updateTpopById'

const iconCreateFunction = (cluster) => {
  if (typeof window === 'undefined') return () => {}

  const hasHighlightedTpop = cluster
    .getAllChildMarkers()
    .some((m) => m.options.icon.options.isHighlighted)
  const className = hasHighlightedTpop
    ? 'tpopClusterHighlighted'
    : 'tpopCluster'

  return window.L.divIcon({
    html: cluster.getChildCount(),
    className,
    iconSize: window.L.point(40, 40),
  })
}

const Tpop = ({ treeName, clustered }) => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const {
    setRefetchKey,
    enqueNotification,
    setIdOfTpopBeingLocalized,
    idOfTpopBeingLocalized,
    refetch,
  } = store
  const { tpopGqlFilter } = store[treeName]

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
      typeof window !== 'undefined' && window.L.DomEvent.stopPropagation(event)
      /**
       * how to update a geometry value?
       * v1: "SRID=4326;POINT(long lat)" https://github.com/graphile/postgraphile/issues/575#issuecomment-372030995
       */
      try {
        await client.mutate({
          mutation: updateTpopById,
          variables: {
            id: idOfTpopBeingLocalized,
            geomPoint,
          },
        })
        //console.log('Tpop, on dblclick', { refetch })
        // refetch so it appears on map
        if (refetch.tpopForMap) {
          // need to also refetch pop in case it was new
          refetch.popForMap && refetch.popForMap()
          refetch.tpopForMap()
        }
        // TODO: if layers are visible
        // client.refetchQueries({
        //   include: ['TpopForMapQuery', 'PopForMapQuery'],
        // })
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

  const tpopFilter = cloneDeep(tpopGqlFilter.filtered)
  tpopFilter.or.forEach((f) => (f.wgs84Lat = { isNull: false }))

  const [fetchTpopDataForMap, { error: errorLoadingTpopForMap, data }] =
    useLazyQuery(query, {
      variables: {
        tpopFilter,
      },
    })

  if (errorLoadingTpopForMap) {
    enqueNotification({
      message: `Fehler beim Laden der Teil-Populationen für die Karte: ${errorLoadingTpopForMap.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  useEffect(() => {
    if (fetchTpopDataForMap !== undefined) {
      fetchTpopDataForMap()
      setRefetchKey({ key: 'tpopForMap', value: fetchTpopDataForMap })
    }
  }, [enqueNotification, fetchTpopDataForMap, setRefetchKey])

  const tpopMarkers = (data?.allTpops?.nodes ?? []).map((tpop) => (
    <Marker key={tpop.id} treeName={treeName} tpop={tpop} />
  ))

  if (clustered) {
    return (
      <MarkerClusterGroup
        maxClusterRadius={66}
        iconCreateFunction={iconCreateFunction}
      >
        {tpopMarkers}
      </MarkerClusterGroup>
    )
  }
  return tpopMarkers
}

export default observer(Tpop)
