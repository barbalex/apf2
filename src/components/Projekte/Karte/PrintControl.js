import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'leaflet'
import 'leaflet-easyprint'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'

const enhance = compose(getContext({ map: PropTypes.object.isRequired }))

class PrintControl extends Component {
  componentDidMount() {
    const { map } = this.props
    const options = {
      title: 'drucken',
      position: 'topright',
    }
    window.L.easyPrint(options).addTo(map)
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(PrintControl)
