import React, { Component } from 'react'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import 'leaflet'
import PropTypes from 'prop-types'

const enhance = compose(getContext({ map: PropTypes.object.isRequired }))

class TpopMarker extends Component {
  props: {
    markers: Array<Object>,
  }

  componentDidMount() {
    const { map, markers } = this.props
    markers.forEach(m => m.addTo(map))
  }

  componentWillUnmount() {
    const { map, markers } = this.props
    markers.forEach(m => map.removeLayer(m))
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(TpopMarker)
