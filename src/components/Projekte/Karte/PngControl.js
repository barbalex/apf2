import React, { Component, PropTypes } from 'react'
import 'leaflet'
import leafletImage from 'leaflet-image'
import fileSaver from 'file-saver'

class PngControl extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    map: PropTypes.object,
  }

  componentDidMount() {
    const { map } = this.props
    leafletImage(map, function(error, canvas) {
      console.log(`canvas:`, canvas)
      canvas.toBlob(function (blob) {
        fileSaver.saveAs(blob, 'map.png');
      })
    })
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default PngControl
