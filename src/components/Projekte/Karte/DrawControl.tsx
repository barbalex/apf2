import { useEffect } from 'react'
import 'leaflet'
import 'leaflet-draw'
import { useMap } from 'react-leaflet'
import { useAtomValue, useSetAtom, useAtom } from 'jotai'

import {
  treeMapFilterAtom,
  treeMapFilterResetterAtom,
} from '../../../store/index.ts'

window.L.drawLocal.draw.toolbar.buttons.polygon =
  'Umriss zeichnen, um räumlich zu filtern'
window.L.drawLocal.draw.toolbar.buttons.rectangle =
  'Rechteck(e) zeichnen, um zu filtern'
window.L.drawLocal.draw.toolbar.actions.title = 'Zeichnen rückgängig machen'
window.L.drawLocal.draw.toolbar.actions.text = 'rückgängig machen'
window.L.drawLocal.draw.toolbar.finish.title = 'Zeichnen beenden'
window.L.drawLocal.draw.toolbar.finish.text = 'beenden'
window.L.drawLocal.draw.toolbar.undo.title = 'Zuletzt erfassten Punkt löschen'
window.L.drawLocal.draw.toolbar.undo.text = 'letzten Punkt löschen'
window.L.drawLocal.draw.handlers.polygon.tooltip.start =
  'Klicken um Polygon zu beginnen'
window.L.drawLocal.draw.handlers.polygon.tooltip.cont =
  'Klicken um Polygon weiter zu zeichnen'
window.L.drawLocal.draw.handlers.polygon.tooltip.end =
  'ersten Punkt klicken, um Polygon zu beenden'
window.L.drawLocal.draw.handlers.rectangle.tooltip.start =
  'Klicken und ziehen, um Rechteck zu zeichnen'
window.L.drawLocal.edit.toolbar.actions.save.title = 'Zeichnung speichern'
window.L.drawLocal.edit.toolbar.actions.save.text = 'speichern'
window.L.drawLocal.edit.toolbar.actions.cancel.title =
  'Zeichnung abbrechen und verwerfen'
window.L.drawLocal.edit.toolbar.actions.cancel.text = 'abbrechen'
window.L.drawLocal.edit.toolbar.actions.clearAll.title = 'alle Umrisse löschen'
window.L.drawLocal.edit.toolbar.actions.clearAll.text = 'alle löschen'
window.L.drawLocal.edit.toolbar.buttons.edit = 'Filter-Umriss ändern'
window.L.drawLocal.edit.toolbar.buttons.editDisabled =
  'Filter-Umriss ändern (aktuell gibt es keine)'
window.L.drawLocal.edit.toolbar.buttons.remove = 'Filter-Umriss löschen'
window.L.drawLocal.edit.toolbar.buttons.removeDisabled =
  'Filter-Umriss löschen (aktuell gibt es keine)'
window.L.drawLocal.edit.handlers.edit.tooltip.text = `dann auf 'speichern' klicken`
window.L.drawLocal.edit.handlers.edit.tooltip.subtext =
  'Punkte ziehen, um Filter-Umriss zu ändern'
window.L.drawLocal.edit.handlers.remove.tooltip.text = `zum Löschen auf Filter-Umriss klicken, dann auf 'speichern'`

export const DrawControl = () => {
  const map = useMap()
  const [mapFilter, setMapFilter] = useAtom(treeMapFilterAtom)
  const mapFilterResetter = useAtomValue(treeMapFilterResetterAtom)

  useEffect(() => {
    // solution to allow only one geometry to be drawn
    // see: https://github.com/Leaflet/Leaflet.draw/issues/315#issuecomment-500246272
    // also: pass in mapFilter if exists
    const drawnItems = mapFilter
      ? window.L.geoJSON(mapFilter)
      : new window.L.FeatureGroup()
    map.addLayer(drawnItems)

    const drawControlFull = new window.L.Control.Draw({
      draw: {
        marker: false,
        polyline: false,
        circle: false,
        circlemarker: false,
        rectangle: false,
      },
      // edit: {
      //   featureGroup: drawnItems,
      // },
    })
    const drawControlEditOnly = new window.L.Control.Draw({
      draw: false,
      edit: {
        featureGroup: drawnItems,
      },
    })

    if (mapFilter) {
      drawControlFull.remove(map)
      drawControlEditOnly.addTo(map)
    } else {
      map.addControl(drawControlFull)
    }

    const onDrawCreated = (e) => {
      // console.log('map, draw:created')
      drawnItems.addLayer(e.layer)
      drawControlFull.remove(map)
      drawControlEditOnly.addTo(map)
      setMapFilter(drawnItems.toGeoJSON()?.features?.[0]?.geometry)
    }
    const onDrawEdited = () => {
      // console.log('map, draw:edited')
      setMapFilter(drawnItems.toGeoJSON()?.features?.[0]?.geometry)
    }
    const onDrawDeleted = () => {
      // console.log('map, draw:deleted')
      setMapFilter(undefined)
      if (drawnItems.getLayers().length === 0) {
        drawControlEditOnly.remove(map)
        drawControlFull.remove(map)
        drawControlFull.addTo(map)
      }
    }
    const onDrawDeletedFromOutside = () => {
      // console.log('map, draw:deletedFromOutside')
      drawControlEditOnly.remove(map)
      drawControlFull.remove(map)
      drawControlFull.addTo(map)
    }
    const onDrawClearFromOutside = () => {
      // console.log('map, draw:clearFromOutside')
      drawnItems.clearLayers()
    }

    map.on('draw:created', onDrawCreated)
    map.on('draw:edited', onDrawEdited)
    map.on('draw:deleted', onDrawDeleted)
    map.on('draw:deletedFromOutside', onDrawDeletedFromOutside)
    map.on('draw:clearFromOutside', onDrawClearFromOutside)

    return () => {
      map.removeLayer(drawnItems)
      drawControlFull.remove(map)
      drawControlEditOnly.remove(map)
      map.off('draw:created', onDrawCreated)
      map.off('draw:edited', onDrawEdited)
      map.off('draw:deleted', onDrawDeleted)
      map.off('draw:deletedFromOutside', onDrawDeletedFromOutside)
      map.off('draw:clearFromOutside', onDrawClearFromOutside)
      // setMapFilter(undefined)
    }
    // do not want this to re-run on every change of mapFilter!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, setMapFilter, mapFilterResetter])

  return <div style={{ display: 'none' }} />
}
