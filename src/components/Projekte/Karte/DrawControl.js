import React, { Component, PropTypes } from 'react'
import 'leaflet'
import 'leaflet-draw'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import withState from 'recompose/withState'
import { inject } from 'mobx-react'

const enhance = compose(
  inject(`store`),
  withState(`mapFilter`, `setMapFilter`, null),
  withState(`drawControl`, `setDrawControl`, null),
  getContext({ map: PropTypes.object.isRequired }),
)

class DrawControl extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
    mapFilter: PropTypes.object,
    setMapFilter: PropTypes.func.isRequired,
    drawControl: PropTypes.object,
    setDrawControl: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { map, store, setMapFilter, setDrawControl } = this.props
    window.L.drawLocal.draw.toolbar.buttons.polygon = `Polygon zeichnen, um zu filtern`
    const mapFilter = new window.L.FeatureGroup()
    setMapFilter(mapFilter)
    map.addLayer(mapFilter)
    const drawControl = new window.L.Control.Draw({
      draw: {
        marker: false,
        polyline: false,
        circle: false,
        toolbar: {
          buttons: {
            polygon: `Mit Polygon filtern`,
          }
        }
      },
      edit: {
        featureGroup: mapFilter,
      }
    })

    map.addControl(drawControl)
    setDrawControl(drawControl)
    map.on(`draw:created`, (e) => {
      mapFilter.addLayer(e.layer)
      store.node.updateMapFilter(mapFilter)
    })
    map.on(`draw:edited`, (e) =>
      store.node.updateMapFilter(mapFilter)
    )
    map.on(`draw:deleted`, (e) =>
      store.node.updateMapFilter(mapFilter)
    )
  }

  componentWillUnmount() {
    const { store, map, mapFilter, drawControl } = this.props
    map.removeLayer(mapFilter)
    map.removeControl(drawControl)
    map.off(`draw:created`)
    map.off(`draw:edited`)
    map.off(`draw:deleted`)
    store.node.updateMapFilter(null)
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(DrawControl)
