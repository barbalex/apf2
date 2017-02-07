import React, { Component, PropTypes } from 'react'
import 'leaflet'
import 'leaflet-easyprint'

class PrintControl extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    map: PropTypes.object,
  }

  componentDidMount() {
    const { map } = this.props
    const options = {
      title: `drucken`,
      position: `topright`,
    }
    window.L.easyPrint(options).addTo(map)
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default PrintControl
