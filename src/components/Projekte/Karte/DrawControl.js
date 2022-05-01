import React, { useEffect, useContext } from 'react'
import 'leaflet'
import 'leaflet-draw'
import { useMap } from 'react-leaflet'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'

const DrawControl = () => {
  const map = useMap()
  const store = useContext(storeContext)
  const { setMapFilter } = store

  //console.log('DrawControl, map:', map)

  useEffect(() => {
    window.L.drawLocal.draw.toolbar.buttons.polygon =
      'Polygon(e) zeichnen, um zu filtern'
    window.L.drawLocal.draw.toolbar.buttons.rectangle =
      'Rechteck(e) zeichnen, um zu filtern'
    window.L.drawLocal.draw.toolbar.actions.title = 'Zeichnen rückgängig machen'
    window.L.drawLocal.draw.toolbar.actions.text = 'rückgängig machen'
    window.L.drawLocal.draw.toolbar.finish.title = 'Zeichnen beenden'
    window.L.drawLocal.draw.toolbar.finish.text = 'beenden'
    window.L.drawLocal.draw.toolbar.undo.title =
      'Zuletzt erfassten Punkt löschen'
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
    // window.L.drawLocal.edit.toolbar.actions.clearAll.title = 'alle Umrisse löschen'
    // window.L.drawLocal.edit.toolbar.actions.clearAll.text = 'alle löschen'
    window.L.drawLocal.edit.toolbar.buttons.edit = 'Filter-Umriss(e) ändern'
    window.L.drawLocal.edit.toolbar.buttons.editDisabled =
      'Filter-Umriss(e) ändern (aktuell gibt es keine)'
    window.L.drawLocal.edit.toolbar.buttons.remove = 'Filter-Umriss(e) löschen'
    window.L.drawLocal.edit.toolbar.buttons.removeDisabled =
      'Filter-Umriss(e) löschen (aktuell gibt es keine)'
    window.L.drawLocal.edit.handlers.edit.tooltip.text = `dann auf 'speichern' klicken`
    window.L.drawLocal.edit.handlers.edit.tooltip.subtext =
      'Punkte ziehen, um Filter-Umriss(e) zu verändern'
    window.L.drawLocal.edit.handlers.remove.tooltip.text = `zum Löschen auf Filter-Umriss klicken, dann auf 'speichern'`

    // solution to allow only one geometry to be drawn
    // see: https://github.com/Leaflet/Leaflet.draw/issues/315#issuecomment-500246272
    const mapFilter = new window.L.FeatureGroup()
    map.addLayer(mapFilter)
    const drawControlFull = new window.L.Control.Draw({
      draw: {
        marker: false,
        polyline: false,
        circle: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: mapFilter,
      },
    })
    const drawControlEditOnly = new window.L.Control.Draw({
      draw: false,
      edit: {
        featureGroup: mapFilter,
      },
    })

    map.addControl(drawControlFull)
    map.on('draw:created', (e) => {
      mapFilter.addLayer(e.layer)
      drawControlFull.remove(map)
      drawControlEditOnly.addTo(map)
      setMapFilter(mapFilter.toGeoJSON()?.features)
    })
    map.on('draw:edited', () => setMapFilter(mapFilter.toGeoJSON()?.features))
    map.on('draw:deleted', () => {
      setMapFilter(mapFilter.toGeoJSON()?.features)
      if (mapFilter.getLayers().length === 0) {
        drawControlEditOnly.remove(map)
        drawControlFull.addTo(map)
      }
    })

    return () => {
      map.removeLayer(mapFilter)
      map.removeControl(drawControlFull)
      map.removeControl(drawControlEditOnly)
      map.off('draw:created')
      map.off('draw:edited')
      map.off('draw:deleted')
      setMapFilter([])
    }
  }, [map, setMapFilter])

  return <div style={{ display: 'none' }} />
}

export default observer(DrawControl)
