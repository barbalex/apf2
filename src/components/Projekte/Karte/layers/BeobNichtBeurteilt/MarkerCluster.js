import React, { Component } from 'react'
import compose from 'recompose/compose'
import { withLeaflet } from 'react-leaflet'
import 'leaflet'
import '../../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const enhance = compose(withLeaflet)

class BeobMarkerCluster extends Component {
  props: {
    markers: Object,
  }

  componentDidMount() {
    const { leaflet, markers } = this.props
    leaflet.map.addLayer(markers)
  }

  /**
   * seems that this component never updates
   * instead it unmounts and mounts again
   */

  componentWillUnmount() {
    const { leaflet, markers } = this.props
    leaflet.map.removeLayer(markers)
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(BeobMarkerCluster)
