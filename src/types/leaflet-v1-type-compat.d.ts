// react-leaflet 5's type definitions were written against @types/leaflet 1.9
// and reference three names that Leaflet 2's bundled types no longer export.
// This module augmentation re-adds them on top of the Leaflet 2 types so
// react-leaflet's d.ts (hooks, WMSTileLayer, …) resolves without errors.
// Drop once react-leaflet ships Leaflet 2 types.
import type {
  InteractiveLayerEventMap,
  LeafletPointerEvent,
  MapEventMap,
  TileLayerEventMap,
  TileLayerOptions,
  WMSTileLayer,
} from 'leaflet'

declare module 'leaflet' {
  // @types/leaflet called the click/pointer event LeafletMouseEvent
  export type LeafletMouseEvent = LeafletPointerEvent

  // @types/leaflet's catch-all handler map for map.on({...}) /
  // react-leaflet's useMapEvents and eventHandlers props. v2 types event
  // maps per class; merge the ones this app (and react-leaflet) uses.
  export type LeafletEventHandlerFnMap = {
    [K in
      | keyof MapEventMap
      | keyof TileLayerEventMap
      | keyof InteractiveLayerEventMap]?: (
      event: (
        MapEventMap &
        TileLayerEventMap &
        InteractiveLayerEventMap
      )[K],
    ) => void
  }

  // @types/leaflet kept the WMS request params on WMSOptions; Leaflet 2
  // sends unknown extra options to the WMS server as request parameters,
  // so allow the classic param names
  export interface WMSOptions extends TileLayerOptions {
    layers?: string
    styles?: string
    format?: string
    transparent?: boolean
    version?: string
    uppercase?: boolean
    crs?: unknown
  }

  // @types/leaflet exposed the WMS layer class as TileLayer.WMS
  export namespace TileLayer {
    export import WMS = WMSTileLayer
  }
}
