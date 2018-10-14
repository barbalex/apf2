import React, { Component } from 'react'
import compose from 'recompose/compose'
import 'leaflet'
import { withLeaflet } from 'react-leaflet'
import '../../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const enhance = compose(withLeaflet)

class BeobMarkerCluster extends Component {
  props: {
    markers: Object,
    leaflet: Object,
  }

  componentDidMount() {
    const { leaflet, markers } = this.props
    leaflet.map.addLayer(markers)
  }

  componentWillUnmount() {
    const { leaflet, markers } = this.props
    leaflet.map.removeLayer(markers)
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(BeobMarkerCluster)
