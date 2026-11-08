import {
  createElementObject,
  createPathComponent,
  extendContext,
} from '@react-leaflet/core'
import type { PathProps } from '@react-leaflet/core'
import type { PropsWithChildren } from 'react'
import { MarkerClusterGroup } from 'leaflet.markercluster'
import type { MarkerClusterGroupOptions } from 'leaflet.markercluster'
import type { Marker } from 'leaflet'

// first-party replacement for react-leaflet-markercluster
// (5.0.0-rc.0, built for Leaflet 1): a layer container that clusters
// its marker children, built on @react-leaflet/core exactly like
// react-leaflet's own FeatureGroup
export type ClusterGroupProps = MarkerClusterGroupOptions &
  PathProps &
  PropsWithChildren

export const ClusterGroup = createPathComponent<
  MarkerClusterGroup<Marker>,
  ClusterGroupProps
>(function createClusterGroup({ children: _children, ...options }, context) {
  const group = new MarkerClusterGroup(options)
  return createElementObject(
    group,
    extendContext(context, {
      layerContainer: group,
      overlayContainer: group,
    }),
  )
})
