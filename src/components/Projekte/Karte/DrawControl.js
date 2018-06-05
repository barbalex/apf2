import React, { Component } from 'react'
import 'leaflet'
import 'leaflet-draw'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import withState from 'recompose/withState'
import PropTypes from 'prop-types'

const enhance = compose(
  withState('mapFilter', 'setMapFilter', null),
  withState('drawControl', 'setDrawControl', null),
  getContext({ map: PropTypes.object.isRequired }),
)

class DrawControl extends Component {
  props: {
    map: Object,
    mapFilter?: Object,
    setMapFilter: () => void,
    drawControl?: Object,
    setDrawControl: () => void,
    setStoreMapFilter: () => void,

  }

  componentDidMount() {
    const { map, setStoreMapFilter, setMapFilter, setDrawControl } = this.props
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
    const mapFilter = new window.L.FeatureGroup()
    setMapFilter(mapFilter)
    map.addLayer(mapFilter)
    const drawControl = new window.L.Control.Draw({
      draw: {
        marker: false,
        polyline: false,
        circle: false,
      },
      edit: {
        featureGroup: mapFilter,
      },
    })

    map.addControl(drawControl)
    setDrawControl(drawControl)
    map.on('draw:created', e => {
      mapFilter.addLayer(e.layer)
      setStoreMapFilter(mapFilter)
    })
    map.on('draw:edited', e => setStoreMapFilter(mapFilter))
    map.on('draw:deleted', e => setStoreMapFilter(mapFilter))
  }

  componentWillUnmount() {
    const { setStoreMapFilter, map, mapFilter, drawControl } = this.props
    map.removeLayer(mapFilter)
    map.removeControl(drawControl)
    map.off('draw:created')
    map.off('draw:edited')
    map.off('draw:deleted')
    setStoreMapFilter(null)
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(DrawControl)
