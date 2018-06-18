import React, { Component } from 'react'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import 'leaflet'
import PropTypes from 'prop-types'
import '../../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const enhance = compose(getContext({ map: PropTypes.object.isRequired }))

class BeobMarkerCluster extends Component {
  props: {
    markers: Object,
  }

  componentDidMount() {
    const { map, markers } = this.props
    map.addLayer(markers)
  }

  /**
   * seems that this component never updates
   * instead it unmounts and mounts again
   */

  componentWillUnmount() {
    const { map, markers } = this.props
    map.removeLayer(markers)
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(BeobMarkerCluster)
