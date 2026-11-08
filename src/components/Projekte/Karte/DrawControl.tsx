import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { useAtom } from 'jotai'
import * as L from 'leaflet'
// the vendored fork's own typings are disabled (see
// scripts/patch-leaflet2.mjs); the geoman surface used here is declared in
// src/types/leaflet2-compat.d.ts, but the runtime default export is not
// declared, hence the cast
import * as geomanModule from '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import type { PrimitiveAtom } from 'jotai'
import type { GeomanMapApi } from 'leaflet'
import type { FeatureCollection, Geometry, GeometryCollection } from 'geojson'

import { treeMapFilterAtom } from '../../../store/index.ts'

const Geoman = (geomanModule as unknown as {
  default: { initialize(): void }
}).default

// Registers the init hooks that attach `map.geoman` / `layer.geoman`.
// Must run before the first map is created (module evaluation time is fine).
Geoman.initialize()

// Toggled on the map container while any geoman mode is active so
// ClickListener can ignore map clicks and CSS can adapt the cursor.
export const GEOMAN_ACTIVE_CLASS = 'geoman-active'

// the atom is typed as undefined (its initial value) but holds
// a GeoJSON geometry at runtime
// (drawn filter shapes are never GeometryCollections,
// which are the only geometries without coordinates)
const mapFilterAtom = treeMapFilterAtom as unknown as PrimitiveAtom<
  Exclude<Geometry, GeometryCollection> | undefined
>

// Replaces leaflet-draw (unmaintained, Leaflet-1-only): a polygon drawn on
// the map acts as a spatial filter and is persisted as GeoJSON in
// treeMapFilterAtom. The atom is also set and cleared from outside the map
// (tree filter UI, "Kanton Zürich filtern"), so it is the single source of
// truth and the drawn shape is reconciled with it.
export const DrawControl = () => {
  const map = useMap()
  const [mapFilter, setMapFilter] = useAtom(mapFilterAtom)
  const drawLayerRef = useRef<L.FeatureGroup | null>(null)
  const persistRef = useRef<() => void>(() => {})
  const removalModeRef = useRef(false)
  const removeShapeRef = useRef<() => void>(() => {})

  // geoman toolbar and the map -> atom direction
  useEffect(() => {
    // map.geoman is not typed on the Map class (class merges are off-limits
    // under TypeScript 6, see leaflet2-compat.d.ts)
    const geoman = (map as unknown as { geoman?: GeomanMapApi }).geoman
    if (!geoman) return

    const drawLayer = new L.FeatureGroup()
    map.addLayer(drawLayer)
    drawLayerRef.current = drawLayer

    const filterGeometryFromDrawLayer = () => {
      const geometry = (
        drawLayer.toGeoJSON() as FeatureCollection
      ).features[0]?.geometry as
        | Exclude<Geometry, GeometryCollection>
        | undefined
      setMapFilter(geometry)
    }
    persistRef.current = filterGeometryFromDrawLayer

    // persist when geoman's removal mode removes the layer from the draw layer
    drawLayer.on('layerremove', filterGeometryFromDrawLayer)

    // geoman:edit fires on every vertex move; persist only when a layer's
    // edit session ends (geoman:update)
    const wireLayerEvents = (layer: L.Layer) => {
      layer.on('geoman:update', () => persistRef.current())
    }

    // leaflet-draw's German UI, restored: the draw button explains its
    // purpose, edit/delete say what they do to the filter shape
    geoman.setLang('de', {
      buttonTitles: {
        drawPolyButton: 'Umriss zeichnen, um räumlich zu filtern',
        editButton: 'Filter-Umriss ändern',
        deleteButton: 'Filter-Umriss löschen',
      },
    })

    geoman.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawPolygon: true,
      drawText: false,
      drawCircle: false,
      editMode: true,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
      rotateMode: false,
    })

    // The fork's removal mode removes geoman-drawn layers, but not layers
    // restored from the filter atom (they are not marked as drawn by
    // geoman). The filter shape is the only layer in the draw layer, so
    // remove it directly on click while removal mode is active.
    const removeNow = () => {
      drawLayer.clearLayers()
      filterGeometryFromDrawLayer()
    }
    removeShapeRef.current = removeNow
    const onRemovalToggled = (e: { enabled: boolean }) => {
      removalModeRef.current = e.enabled
      drawLayer.eachLayer((layer) => {
        if (e.enabled) layer.on('click', removeNow)
        else layer.off('click', removeNow)
      })
    }

    // only one filter geometry at a time
    const onCreate = (e: { layer: L.Layer }) => {
      drawLayer.clearLayers()
      wireLayerEvents(e.layer)
      drawLayer.addLayer(e.layer)
      filterGeometryFromDrawLayer()
    }
    map.on('geoman:create', onCreate)

    // Toggle the active class so ClickListener suppresses click handling
    // and the cursor changes while drawing/editing/deleting.
    const anyGeomanModeActive = () =>
      geoman.globalDrawModeEnabled() ||
      geoman.globalEditModeEnabled() ||
      geoman.globalRemovalModeEnabled()
    const setActive = (e: { enabled: boolean }) => {
      map
        .getContainer()
        ?.classList.toggle(
          GEOMAN_ACTIVE_CLASS,
          e.enabled || anyGeomanModeActive(),
        )
    }
    const onDrawStart = () =>
      map.getContainer()?.classList.add(GEOMAN_ACTIVE_CLASS)
    const onDrawEnd = () => {
      // fires on shape completion and on leaving draw mode; keep the class
      // while another geoman mode is still active
      if (!anyGeomanModeActive()) {
        map.getContainer()?.classList.remove(GEOMAN_ACTIVE_CLASS)
      }
    }
    map.on('geoman:drawstart', onDrawStart)
    map.on('geoman:drawend', onDrawEnd)
    map.on('geoman:globaldrawmodetoggled', setActive)
    map.on('geoman:globaleditmodetoggled', setActive)
    map.on('geoman:globalremovalmodetoggled', onRemovalToggled)
    map.on('geoman:globalremovalmodetoggled', setActive)

    return () => {
      map.removeLayer(drawLayer)
      drawLayerRef.current = null
      geoman.removeControls()
      map.off('geoman:create', onCreate)
      map.off('geoman:drawstart', onDrawStart)
      map.off('geoman:drawend', onDrawEnd)
      map.off('geoman:globaldrawmodetoggled', setActive)
      map.off('geoman:globaleditmodetoggled', setActive)
      map.off('geoman:globalremovalmodetoggled', onRemovalToggled)
      map.off('geoman:globalremovalmodetoggled', setActive)
      map.getContainer()?.classList.remove(GEOMAN_ACTIVE_CLASS)
      map.getContainer()?.classList.remove('filter-shape-drawn')
    }
    // setMapFilter is a stable jotai setter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  // the atom -> map direction: reconcile the drawn shape with the filter.
  // The filter is also set/cleared from outside the map (tree filter UI)
  // and survives unmounts of the Karte
  useEffect(() => {
    const drawLayer = drawLayerRef.current
    if (!drawLayer) return

    // like leaflet-draw's two toolbars: while no filter shape exists only
    // the draw button is shown, otherwise only edit/delete (see app.css)
    const syncToolbarVisibility = () => {
      map
        .getContainer()
        ?.classList.toggle(
          'filter-shape-drawn',
          drawLayer.getLayers().length > 0,
        )
    }

    const drawnGeometry = (drawLayer.toGeoJSON() as FeatureCollection)
      .features[0]?.geometry as Exclude<Geometry, GeometryCollection> | undefined

    if (!mapFilter) {
      // filter was cleared from outside the map
      if (drawnGeometry) drawLayer.clearLayers()
      syncToolbarVisibility()
      return
    }
    if (
      drawnGeometry &&
      JSON.stringify(drawnGeometry) === JSON.stringify(mapFilter)
    ) {
      // the change originated here
      syncToolbarVisibility()
      return
    }
    // restore: on mount, or a filter set from outside ("Kanton Zürich
    // filtern"). leaflet 2's GeoJSON types are narrower than the geojson
    // package's, but the values are compatible
    drawLayer.clearLayers()
    const geojsonArg =
      mapFilter as unknown as ConstructorParameters<typeof L.GeoJSON>[0]
    new L.GeoJSON(geojsonArg).eachLayer((layer) => {
      layer.on('geoman:update', () => persistRef.current())
      if (removalModeRef.current) {
        layer.on('click', () => removeShapeRef.current())
      }
      drawLayer.addLayer(layer)
    })
    syncToolbarVisibility()
  }, [mapFilter, setMapFilter, map])

  return null
}
