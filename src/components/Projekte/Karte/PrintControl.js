import React, { Component } from 'react'
import 'leaflet'
import 'leaflet-easyprint'
import compose from 'recompose/compose'
import { withLeaflet } from 'react-leaflet'

const enhance = compose(withLeaflet)

const options = {
  title: 'drucken',
  position: 'topright',
  filename: 'apfloraKarte',
  sizeModes: ['Current', 'A4Portrait', 'A4Landscape'],
  tileWait: 2000,
}

class PrintControl extends Component {
  componentDidMount() {
    const { leaflet } = this.props
    window.L.easyPrint(options).addTo(leaflet.map)
  }

  render() {
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(PrintControl)
