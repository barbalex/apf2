import { memo, useContext, useEffect, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useQuery } from "@apollo/client/react";
import { useMap } from 'react-leaflet'
import cloneDeep from 'lodash/cloneDeep'
import { useParams } from 'react-router'

import { Marker } from './Marker.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { query } from './query.js'

const iconCreateFunction = function (cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedPop = markers.some(
    (m) => m.options.icon.options.className === 'popIconHighlighted',
  )
  const className = hasHighlightedPop ? 'popClusterHighlighted' : 'popCluster'

  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const ObservedPop = memo(
  observer(() => {
    const map = useMap()
    const store = useContext(MobxContext)
    const { enqueNotification } = store
    const tree = store.tree
    const { popGqlFilter } = tree

    const popFilter = cloneDeep(popGqlFilter.filtered)
    popFilter.or.forEach((f) => (f.wgs84Lat = { isNull: false }))

    const { data, error } = useQuery(query, {
      variables: {
        popFilter,
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [refetchProvoker, setRefetchProvoker] = useState(1)
    const refetch = useCallback(() => {
      setRefetchProvoker(Math.random())
    }, [])
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
      enqueNotification({
        message: `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }

    return (
      <MarkerClusterGroup
        maxClusterRadius={66}
        iconCreateFunction={iconCreateFunction}
      >
        {(data?.allPops?.nodes ?? []).map((pop) => (
          <Marker
            key={pop.id}
            pop={pop}
          />
        ))}
      </MarkerClusterGroup>
    )
  }),
)

export const Pop = memo(
  observer(() => {
    const store = useContext(MobxContext)
    const tree = store.tree
    const { popGqlFilter } = tree

    const { apId } = useParams()

    // Problem: popGqlFilter updates AFTER apId
    // if navigating from ap to pop, apId is set before popGqlFilter
    // thus query fetches data for all aps
    // Solution: do not return pop if apId exists but popGqlFilter does not contain it (yet)
    const gqlFilterHasApId = !!popGqlFilter.filtered?.or?.[0]?.apId
    const apIdExistsButGqlFilterDoesNotKnowYet = !!apId && !gqlFilterHasApId

    if (apIdExistsButGqlFilterDoesNotKnowYet) return null
    return <ObservedPop />
  }),
)
