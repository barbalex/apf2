import React, { Component } from 'react'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import 'leaflet'
import PropTypes from 'prop-types'
import '../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const enhance = compose(
  getContext({ map: PropTypes.object.isRequired }),
)

class PopMarkerCluster extends Component {

  props: {
    visible: boolean,
    markers: Object,
  }

  componentDidMount() {
    const { map, markers, visible } = this.props
    if (visible) {
      map.addLayer(markers)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { map, markers } = this.props
    if (markers && markers !== nextProps.markers) {
      map.removeLayer(markers)
    }
  }

  componentDidUpdate() {
    const { map, markers, visible } = this.props
    if (visible) {
      map.addLayer(markers)
    }
  }

  componentWillUnmount() {
    const { map, markers } = this.props
    map.removeLayer(markers)
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(PopMarkerCluster)
