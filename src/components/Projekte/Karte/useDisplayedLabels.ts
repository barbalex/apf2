import { useEffect, useRef } from 'react'
import { Marker } from 'leaflet'
import type { Map as LeafletMap, LatLngLiteral } from 'leaflet'
import type { MarkerClusterGroup } from 'leaflet.markercluster'

import { LABELS_MAX_MARKERS } from './useProgressiveCount.ts'

interface DisplayedLabelsOptions {
  map: LeafletMap
  group: React.RefObject<MarkerClusterGroup<Marker> | null>
  nodes: { wgs84Lat: number; wgs84Long: number }[]
  tooltipClassName: string
  /**
   * reruns when the mounted marker count changed (progressive mounting)
   * so markers that streamed in later get their labels too
   */
  mountedCount: number
}

const isCluster = (marker: Marker) =>
  typeof (marker as unknown as { getAllChildMarkers?: unknown }).getAllChildMarkers ===
  'function'

/**
 * Permanent label tooltips for the markers of a big layer — but only for
 * the markers actually displayed, and only while at most
 * LABELS_MAX_MARKERS of the layer's markers are in view (i.e. zoomed in
 * enough that the clusters have mostly broken apart). Binding at most a
 * few hundred tooltips costs milliseconds, so zooming never blocks —
 * unlike React-rendered tooltips, which position each marker's tooltip
 * as it is added to the map.
 */
export const useDisplayedLabels = ({
  map,
  group,
  nodes,
  tooltipClassName,
  mountedCount,
}: DisplayedLabelsOptions) => {
  const labeledRef = useRef(new Set<Marker>())

  useEffect(() => {
    const applyLabels = () => {
      const bounds = map.getBounds()
      let inView = 0
      for (const n of nodes) {
        if (bounds.contains({ lat: n.wgs84Lat, lng: n.wgs84Long } as LatLngLiteral)) {
          inView++
        }
        if (inView > LABELS_MAX_MARKERS) break
      }
      const shouldLabel = inView <= LABELS_MAX_MARKERS

      for (const marker of labeledRef.current) {
        marker.closeTooltip()
        marker.unbindTooltip()
      }
      labeledRef.current.clear()
      if (!shouldLabel) return

      group.current?.eachLayer((layer) => {
        const marker = layer as Marker
        if (!(marker instanceof Marker)) return
        // cluster icons are markers too — they have no label
        if (isCluster(marker)) return
        // clustered-away and out-of-view markers are not on the map;
        // their tooltips would only position themselves once displayed
        if ((marker as unknown as { _map?: unknown })._map == null) return
        const label = marker.options.label
        if (!label) return
        marker.bindTooltip(`<span class="mapTooltip">${label}</span>`, {
          permanent: true,
          direction: 'bottom',
          opacity: 1,
          className: tooltipClassName,
        })
        marker.openTooltip()
        labeledRef.current.add(marker)
      })
    }

    applyLabels()
    map.on('moveend', applyLabels)
    return () => {
      map.off('moveend', applyLabels)
      for (const marker of labeledRef.current) {
        marker.closeTooltip()
        marker.unbindTooltip()
      }
      labeledRef.current.clear()
    }
  }, [map, group, nodes, tooltipClassName, mountedCount])
}
