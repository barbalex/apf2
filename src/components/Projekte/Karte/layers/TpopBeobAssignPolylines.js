import React, { Component } from 'react'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import 'leaflet'
import PropTypes from 'prop-types'
import '../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const enhance = compose(
  getContext({ map: PropTypes.object.isRequired }),
)

class TpopBeobAssignPolylines extends Component {

  props: {
    visible: boolean,
    assignPolylines: Array<Object>,
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
