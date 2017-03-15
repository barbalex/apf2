import React, { Component, PropTypes } from 'react'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import 'leaflet'
import '../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const enhance = compose(
  getContext({ map: PropTypes.object.isRequired }),
)

class BeobMarkerCluster extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    beobs: PropTypes.array.isRequired,
    highlightedIds: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    markers: PropTypes.object,
  }

  componentDidMount() {
    const { map, markers, visible } = this.props
    if (visible) {
      map.addLayer(markers)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { map } = this.props
    if (this.props.markers && this.props.markers !== nextProps.markers) {
      map.removeLayer(this.props.markers)
    }
  }

  componentDidUpdate() {
    const { map, markers, visible } = this.props
    if (visible) {
      map.addLayer(markers)
    }
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(BeobMarkerCluster)
