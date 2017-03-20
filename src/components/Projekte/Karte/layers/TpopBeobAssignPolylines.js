import React, { Component, PropTypes } from 'react'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import 'leaflet'
import '../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const enhance = compose(
  getContext({ map: PropTypes.object.isRequired }),
)

class BeobTpopAssignPolylines extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    highlightedIds: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    assignPolylines: PropTypes.object,
  }

  componentDidMount() {
    const { map, assignPolylines, visible } = this.props
    if (visible) {
      map.addLayer(assignPolylines)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { map } = this.props
    if (this.props.assignPolylines && this.props.assignPolylines !== nextProps.assignPolylines) {
      map.removeLayer(this.props.assignPolylines)
    }
  }

  componentDidUpdate() {
    const { map, assignPolylines, visible } = this.props
    if (visible) {
      map.addLayer(assignPolylines)
    }
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(BeobTpopAssignPolylines)
