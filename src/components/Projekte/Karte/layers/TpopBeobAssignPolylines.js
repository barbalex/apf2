import React, { Component, PropTypes } from 'react'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import 'leaflet'
import '../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const enhance = compose(
  getContext({ map: PropTypes.object.isRequired }),
)

class TpopBeobAssignPolylines extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    highlightedIds: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    assignPolylines: PropTypes.array,
  }

  componentDidMount() {
    const { map, assignPolylines, visible } = this.props
    if (visible && assignPolylines) {
      assignPolylines.forEach(p => p.addTo(map))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { map, assignPolylines } = this.props
    if (this.props.assignPolylines && this.props.assignPolylines !== nextProps.assignPolylines) {
      assignPolylines.forEach(p => map.removeLayer(p))
    }
  }

  componentDidUpdate() {
    const { map, assignPolylines, visible } = this.props
    if (visible && assignPolylines) {
      assignPolylines.forEach(p => p.addTo(map))
    }
  }

  componentWillUnmount() {
    const { map, assignPolylines } = this.props
    assignPolylines.forEach(p => map.removeLayer(p))
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(TpopBeobAssignPolylines)
