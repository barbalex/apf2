import React, { Component } from 'react'
import compose from 'recompose/compose'
import 'leaflet'
import { withLeaflet } from 'react-leaflet'

const enhance = compose(withLeaflet)

class Polylines extends Component {
  props: {
    lines: Array<Object>,
    leaflet: Object,
  }

  componentDidMount() {
    const { leaflet, lines } = this.props
    lines.forEach(m => m.addTo(leaflet.map))
  }

  componentWillUnmount() {
    const { leaflet, lines } = this.props
    lines.forEach(m => leaflet.map.removeLayer(m))
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(Polylines)
