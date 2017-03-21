import React, { Component, PropTypes } from 'react'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import 'leaflet'

const enhance = compose(
  getContext({ map: PropTypes.object.isRequired }),
)

class TpopMarker extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    tpops: PropTypes.array.isRequired,
    labelUsingNr: PropTypes.bool.isRequired,
    highlightedIds: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    markers: PropTypes.array,
  }

  componentDidMount() {
    const { map, markers, visible } = this.props
    if (visible) {
      markers.forEach(m => m.addTo(map))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { map, markers } = this.props
    if (markers && markers !== nextProps.markers) {
      markers.forEach(m => map.removeLayer(m))
    }
  }

  componentDidUpdate() {
    const { map, markers, visible } = this.props
    if (visible) {
      markers.forEach(m => m.addTo(map))
    }
  }

  componentWillUnmount() {
    const { map, markers } = this.props
    markers.forEach(m => map.removeLayer(m))
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(TpopMarker)
