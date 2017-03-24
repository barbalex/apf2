import React, { Component, PropTypes } from 'react'
import 'leaflet'
import 'leaflet-draw'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import { inject } from 'mobx-react'

const enhance = compose(
  inject(`store`),
  getContext({ map: PropTypes.object.isRequired }),
)

class DrawControl extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { map, store } = this.props
    if (!store.map.mapFilter) {
      const mapFilter = new window.L.FeatureGroup()
      store.map.setMapFilter(mapFilter)
      map.addLayer(mapFilter)
      const drawControl = new window.L.Control.Draw({
        draw: {
          marker: false,
          polyline: false,
          circle: false,
        },
        edit: {
          featureGroup: mapFilter,
        }
      })
      map.addControl(drawControl)

      map.on('draw:created', (e) => {
        mapFilter.addLayer(e.layer)
        store.node.updateMapFilter(mapFilter)
      })
      map.on('draw:edited', (e) =>
        store.node.updateMapFilter(mapFilter)
      )
      map.on('draw:deleted', (e) =>
        store.node.updateMapFilter(mapFilter)
      )
    }
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(DrawControl)
