import React, { Component } from 'react'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import 'leaflet'
import PropTypes from 'prop-types'

const enhance = compose(getContext({ map: PropTypes.object.isRequired }))

class Polylines extends Component {
  props: {
    lines: Array<Object>,
  }

  componentDidMount() {
    const { map, lines } = this.props
    lines.forEach(m => m.addTo(map))
  }

  componentWillReceiveProps(nextProps) {
    const { map, lines } = this.props
    if (lines && lines !== nextProps.lines) {
      lines.forEach(m => map.removeLayer(m))
    }
  }

  componentDidUpdate() {
    const { map, lines } = this.props
    lines.forEach(m => m.addTo(map))
  }

  componentWillUnmount() {
    const { map, lines } = this.props
    lines.forEach(m => map.removeLayer(m))
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(Polylines)
