import React, { Component, PropTypes } from 'react'
import 'leaflet'
import 'leaflet-draw'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'

const enhance = compose(
  getContext({ map: PropTypes.object.isRequired }),
)

class DrawControl extends Component {

  componentDidMount() {
    const { map } = this.props
    const drawnItems = new window.L.FeatureGroup()
    map.addLayer(drawnItems)
    const drawControl = new window.L.Control.Draw({
      draw: {
        marker: false,
        polyline: false,
      },
      edit: {
        featureGroup: drawnItems,
      }
    })
    map.addControl(drawControl)

    map.on('draw:created', (e) => {
      console.log(`created e:`, e)
      drawnItems.addLayer(e.layer)
    })
    map.on('draw:edited', (e) => {
      console.log(`edited e:`, e)
    })
    map.on('draw:deleted', (e) => {
      console.log(`deleted e:`, e)
    })
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(DrawControl)
