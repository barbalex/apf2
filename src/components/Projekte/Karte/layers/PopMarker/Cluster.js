import React, { Component } from 'react'
import compose from 'recompose/compose'
import { withLeaflet } from 'react-leaflet'
import 'leaflet'

import '../../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const enhance = compose(withLeaflet)

class PopMarkerCluster extends Component {
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

export default enhance(PopMarkerCluster)
