import React, { Component } from 'react'
import compose from 'recompose/compose'
import 'leaflet'
import { withLeaflet } from 'react-leaflet'

const enhance = compose(withLeaflet)

class TpopMarker extends Component {
  props: {
    visible: boolean,
    markers: Array<Object>,
    leaflet: Object,
  }

  componentDidMount() {
    const { leaflet, markers, visible } = this.props
    if (visible) {
      markers.forEach(m => m.addTo(leaflet.map))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { leaflet, markers } = this.props
    if (markers && markers !== nextProps.markers) {
      markers.forEach(m => leaflet.map.removeLayer(m))
    }
  }

  componentDidUpdate() {
    const { leaflet, markers, visible } = this.props
    if (visible) {
      markers.forEach(m => m.addTo(leaflet.map))
    }
  }

  componentWillUnmount() {
    const { leaflet, markers } = this.props
    markers.forEach(m => leaflet.map.removeLayer(m))
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(TpopMarker)
