import React, { Component } from 'react'
import compose from 'recompose/compose'
import 'leaflet'
import { withLeaflet } from 'react-leaflet'
import '../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const enhance = compose(withLeaflet)

class TpopMarkerCluster extends Component {
  props: {
    visible: boolean,
    markers: Object,
    leaflet: Object,
  }

  componentDidMount() {
    const { leaflet, markers, visible } = this.props
    if (visible) {
      leaflet.map.addLayer(markers)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { leaflet, markers } = this.props
    if (markers && markers !== nextProps.markers) {
      leaflet.map.removeLayer(markers)
    }
  }

  componentDidUpdate() {
    const { leaflet, markers, visible } = this.props
    if (visible) {
      leaflet.map.addLayer(markers)
    }
  }

  componentWillUnmount() {
    const { leaflet, markers } = this.props
    leaflet.map.removeLayer(markers)
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(TpopMarkerCluster)
