import React, { useContext, useMemo, useEffect } from 'react'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useApolloClient, useLazyQuery } from '@apollo/client'
import { useMapEvents } from 'react-leaflet'

import Marker from './Marker'
import storeContext from '../../../../../storeContext'
import query from './query'
import { simpleTypes as popType } from '../../../../../store/Tree/DataFilter/pop'
import { simpleTypes as tpopType } from '../../../../../store/Tree/DataFilter/tpop'
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
    activeApfloraLayers,
    setRefetchKey,
    enqueNotification,
    setIdOfTpopBeingLocalized,
    idOfTpopBeingLocalized,
    refetch,
  } = store

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
  const tree = store[treeName]
  const { dataFilter, projIdInActiveNodeArray, apIdInActiveNodeArray } = tree

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

  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes('tpop')
  const perProj = apId === '99999999-9999-9999-9999-999999999999'
  const perAp = apId !== '99999999-9999-9999-9999-999999999999'

  // need this so apFilter changes on any change inside a member of dataFilter.ap
  const dataFilterPopStringified = JSON.stringify(dataFilter.pop)

  const popFilter = useMemo(() => {
    const filterArrayInStore = dataFilter.pop ? getSnapshot(dataFilter.pop) : []
    // need to remove empty filters - they exist when user clicks "oder" but has not entered a value yet
    const filterArrayInStoreWithoutEmpty = filterArrayInStore.filter(
      (f) => Object.values(f).filter((v) => v !== null).length !== 0,
    )
    const filterArray = []
    for (const filter of filterArrayInStoreWithoutEmpty) {
      const popFilter = apId ? { apId: { equalTo: apId } } : {}
      const dataFilterPop = { ...filter }
      const popApFilterValues = Object.entries(dataFilterPop).filter(
        (e) => e[1] || e[1] === 0,
      )
      popApFilterValues.forEach(([key, value]) => {
        const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
        popFilter[key] = { [expression]: value }
      })
      if (tree.nodeLabelFilter.pop) {
        popFilter.label = {
          includesInsensitive: tree.nodeLabelFilter.pop,
        }
      }
      filterArray.push(popFilter)
    }
    // need to filter by apId
    if (filterArray.length === 0 && apId) {
      filterArray.push({ apId: { equalTo: apId } })
    }
    return { or: filterArray }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apId, dataFilter.pop, dataFilterPopStringified])

  const tpopFilter = useMemo(
    () => ({
      wgs84Lat: { isNull: false },
      // 2021.08.16: needed to remove this filter
      // because icons where added every time a tpop left, then reentered the bbox
      //geomPoint: { within: myBbox },
    }),
    [],
  )
  const tpopFilterValues = Object.entries(dataFilter.tpop).filter(
    (e) => e[1] || e[1] === 0,
  )
  tpopFilterValues.forEach(([key, value]) => {
    const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
    tpopFilter[key] = { [expression]: value }
  })
  if (tree.nodeLabelFilter.tpop) {
    tpopFilter.label = {
      includesInsensitive: tree.nodeLabelFilter.tpop,
    }
  }

  const [fetchTpopDataForMap, { error: errorLoadingTpopForMap, data }] =
    useLazyQuery(query, {
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

  const aps = useMemo(
    () =>
      perAp
        ? data?.projektById?.perAp?.nodes ?? []
        : data?.projektById?.perProj?.nodes ?? [],
    [data?.projektById?.perAp?.nodes, data?.projektById?.perProj?.nodes, perAp],
  )
  const pops = useMemo(
    () => flatten(aps.map((ap) => ap?.popsByApId?.nodes ?? [])),
    [aps],
  )
  let tpops = useMemo(
    () => flatten(pops.map((pop) => pop?.tpopsByPopId?.nodes ?? [])),
    [pops],
  )

  const tpopMarkers = tpops.map((tpop) => (
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
