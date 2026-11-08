// Leaflet 2 compatibility declarations, in two parts. Both are workarounds
// for the app's TypeScript 6 pin (see package.json devRemarks); ps, which
// compiles with TypeScript 7, needs neither. Drop both once this app
// compiles with TypeScript 7+.
import type {
  ControlPosition,
  InteractiveLayerEventMap,
  LeafletEvent,
  LeafletPointerEvent,
  Layer,
  MapEventMap,
  TileLayerEventMap,
  TileLayerOptions,
  WMSTileLayer,
} from 'leaflet'

declare module 'leaflet' {
  /**
   * Part 1: react-leaflet 5's type definitions were written against
   * @types/leaflet 1.9 and reference names that Leaflet 2's bundled types no
   * longer export. Re-added here so react-leaflet's d.ts (hooks,
   * WMSTileLayer, …) resolves without errors. Drop once react-leaflet ships
   * Leaflet 2 types.
   */

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

  // the map layers pass the marker label text through the marker options
  // so it is available to the imperative label management in the layer
  // components (Pop, Tpop)
  interface MarkerOptions {
    label?: string
  }

  /**
   * Part 2: minimal typings for the vendored
   * @geoman-io/leaflet-geoman-free fork (vendor/, see README there). The
   * fork ships complete typings in dist/leaflet-geoman.d.ts, but they are
   * disabled by scripts/patch-leaflet2.mjs: their interface merges onto
   * Leaflet classes trigger a TypeScript 6 bug that both breaks the other
   * module augmentations in THIS file and overrides the merged class's own
   * method overloads. Only the surface the DrawControl uses is declared
   * here, without merging onto any class; keep aligned with the fork's d.ts.
   */

  export interface GeomanToolbarOptions {
    position?: ControlPosition
    drawMarker?: boolean
    drawCircleMarker?: boolean
    drawPolyline?: boolean
    drawRectangle?: boolean
    drawPolygon?: boolean
    drawText?: boolean
    drawCircle?: boolean
    editMode?: boolean
    dragMode?: boolean
    cutPolygon?: boolean
    removalMode?: boolean
    rotateMode?: boolean
  }

  export interface GeomanMapApi {
    addControls(options?: GeomanToolbarOptions): void
    removeControls(): void
    // customTranslations is deep-merged over the fallback locale
    // (see the fork's buttonTitles)
    setLang(lang: string, customTranslations?: object, fallback?: string): void
    globalDrawModeEnabled(): boolean
    globalEditModeEnabled(): boolean
    globalRemovalModeEnabled(): boolean
  }

  // accessed as (map as { geoman: GeomanMapApi }).geoman — see DrawControl

  // geoman's map events, added to the standard event map so map.on(...)
  // accepts them with typed payloads
  export interface MapEventMap {
    'geoman:create': { layer: Layer }
    'geoman:drawstart': LeafletEvent
    'geoman:drawend': LeafletEvent
    'geoman:globaldrawmodetoggled': { enabled: boolean }
    'geoman:globaleditmodetoggled': { enabled: boolean }
    'geoman:globalremovalmodetoggled': { enabled: boolean }
  }

  // geoman's layer event when an edit session (vertex drag) ends
  export interface InteractiveLayerEventMap {
    'geoman:update': LeafletEvent
  }
}
