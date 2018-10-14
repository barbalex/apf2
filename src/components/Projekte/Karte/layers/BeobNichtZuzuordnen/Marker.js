import React, { Component } from 'react'
import compose from 'recompose/compose'
import 'leaflet'
import { withLeaflet } from 'react-leaflet'

const enhance = compose(withLeaflet)

class BeobMarker extends Component {
  props: {
    markers: Array<Object>,
  }

  componentDidMount() {
    const { leaflet, markers } = this.props
    markers.forEach(m => m.addTo(leaflet.map))
  }

  componentWillUnmount() {
    const { leaflet, markers } = this.props
    markers.forEach(m => leaflet.map.removeLayer(m))
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(BeobMarker)
