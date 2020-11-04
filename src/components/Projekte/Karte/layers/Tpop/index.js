import React, { useContext, useMemo, useEffect, useState } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useQuery, useApolloClient } from '@apollo/client'
import { useMapEvents } from 'react-leaflet'
import bboxPolygon from '@turf/bbox-polygon'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'
import { simpleTypes as popType } from '../../../../../store/Tree/DataFilter/pop'
import { simpleTypes as tpopType } from '../../../../../store/Tree/DataFilter/tpop'
import updateTpopById from './updateTpopById'

const iconCreateFunction = function (cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedTpop = markers.some(
    (m) => m.options.icon.options.isHighlighted,
  )

  const className = hasHighlightedTpop
    ? 'tpopClusterHighlighted'
    : 'tpopCluster'
  if (typeof window === 'undefined') return () => {}
  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const Tpop = ({ treeName, clustered, leaflet }) => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const {
    mapFilter,
    activeApfloraLayers,
    setRefetchKey,
    enqueNotification,
    setIdOfTpopBeingLocalized,
    idOfTpopBeingLocalized,
    refetch,
  } = store

  const leafletMap = useMapEvents({
    async dblclick(event) {
      console.log('doubleclick')

      // since 2018 10 31 using idOfTpopBeingLocalized directly
      // returns null, so need to use store.idOfTpopBeingLocalized
      const { idOfTpopBeingLocalized } = store
      console.log('Tpop, on dblclick', { idOfTpopBeingLocalized })
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
      console.log('Tpop, on dblclick', { lat, lng, geomPoint })
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
          // no optimistic responce as geomPoint
          /*optimisticResponse: {
                      __typename: 'Mutation',
                      updateTpopById: {
                        tpop: {
                          id: idOfTpopBeingLocalized,
                          __typename: 'Tpop',
                        },
                        __typename: 'Tpop',
                      },
                    },*/
        })
        console.log('Tpop, on dblclick', { refetch })
        // refetch so it appears on map
        if (refetch.tpopForMap) {
          // need to also refetch pop in case it was new
          refetch.popForMap && refetch.popForMap()
          refetch.tpopForMap()
        }
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
  const tree = store[treeName]
  const {
    map,
    dataFilter,
    projIdInActiveNodeArray,
    apIdInActiveNodeArray,
  } = tree
  const { setTpopIdsFiltered } = map

  useEffect(() => {
    if (!!idOfTpopBeingLocalized) {
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

  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('tpop')
  const perProj = apId === '99999999-9999-9999-9999-999999999999'
  const perAp = apId !== '99999999-9999-9999-9999-999999999999'

  const bounds = leafletMap.getBounds()
  const boundsArray = [
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth(),
  ]
  const myBbox = bboxPolygon(boundsArray).geometry

  const popFilter = {
    // used to filter: wgs84Lat: { isNull: false }
    // but then tpop with wgs84Lat with pop without would not show
    id: { isNull: false },
  }
  const popFilterValues = Object.entries(dataFilter.pop).filter(
    (e) => e[1] || e[1] === 0,
  )
  popFilterValues.forEach(([key, value]) => {
    const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
    popFilter[key] = { [expression]: value }
  })
  if (!!tree.nodeLabelFilter.pop) {
    popFilter.label = {
      includesInsensitive: tree.nodeLabelFilter.pop,
    }
  }

  const tpopFilter = {
    wgs84Lat: { isNull: false },
    geomPoint: { within: myBbox },
  }
  const tpopFilterValues = Object.entries(dataFilter.tpop).filter(
    (e) => e[1] || e[1] === 0,
  )
  tpopFilterValues.forEach(([key, value]) => {
    const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
    tpopFilter[key] = { [expression]: value }
  })
  if (!!tree.nodeLabelFilter.tpop) {
    tpopFilter.label = {
      includesInsensitive: tree.nodeLabelFilter.tpop,
    }
  }

  var { data, error, refetch: refetchQuery } = useQuery(query, {
    variables: {
      projId,
      apId,
      perAp,
      perProj,
      isActiveInMap,
      popFilter,
      tpopFilter,
    },
  })
  setRefetchKey({ key: 'tpopForMap', value: refetchQuery })

  // eslint-disable-next-line no-unused-vars
  const [refetchProvoker, setRefetchProvoker] = useState(1)
  useEffect(() => {
    // DO NOT use:
    // leafletMap.on('zoomend moveend', refetchQuery
    // see: https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
    // Also: leafletMap.on('zoomend moveend', ()=> refetchQuery()) never refetches!!??
    leafletMap.on('zoomend moveend', () => setRefetchProvoker(Math.random()))
    return () => {
      leafletMap.off('zoomend moveend', () => setRefetchProvoker(Math.random()))
    }
  }, [leafletMap])

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Teil-Populationen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  const aps = get(
    data,
    `projektById.${!!perAp ? 'perAp' : 'perProj'}.nodes`,
    [],
  )
  const pops = useMemo(
    () => flatten(aps.map((ap) => get(ap, 'popsByApId.nodes', []))),
    [aps],
  )
  let tpops = useMemo(
    () => flatten(pops.map((pop) => get(pop, 'tpopsByPopId.nodes', []))),
    [pops],
  )

  const mapTpopIdsFiltered = idsInsideFeatureCollection({
    mapFilter,
    data: tpops,
  })
  setTpopIdsFiltered(mapTpopIdsFiltered)
  //console.log('layers Tpop, tpops.length:', tpops.length)

  if (!clustered && tpops.length > 2000) {
    enqueNotification({
      message: `Zuviele Teil-Populationen: Es werden maximal 2'000 angezeigt, im aktuellen Ausschnitt sind es: ${tpops.length.toLocaleString(
        'de-CH',
      )}. Bitte wählen Sie einen kleineren Ausschnitt.`,
      options: {
        variant: 'warning',
      },
    })
    tpops = []
  }

  const tpopMarkers = tpops.map((tpop) => (
    <Marker key={tpop.id} treeName={treeName} tpop={tpop} />
  ))

  /*if (clustered) {
    return (
      <MarkerClusterGroup
        maxClusterRadius={66}
        iconCreateFunction={iconCreateFunction}
      >
        {tpopMarkers}
      </MarkerClusterGroup>
    )
  }*/
  return tpopMarkers
}

export default observer(Tpop)
