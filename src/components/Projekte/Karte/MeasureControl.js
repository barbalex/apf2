import React, { Component } from 'react'
import 'leaflet'
import { withLeaflet } from 'react-leaflet'
import compose from 'recompose/compose'
// regular import results in error,
// see: https://github.com/ljagis/leaflet-measure/issues/68
// import 'leaflet-measure'
import '../../../../node_modules/leaflet-measure/dist/leaflet-measure'

const enhance = compose(withLeaflet)

class MeasureControl extends Component {
  componentDidMount() {
    const { leaflet } = this.props
    const options = {
      primaryLengthUnit: 'meters',
      secondaryLengthUnit: 'kilometers',
      primaryAreaUnit: 'sqmeters',
      secondaryAreaUnit: 'hectares',
      localization: 'de_CH',
      activeColor: '#f45942',
      completedColor: '#b22c25',
      thousandsSep: `'`,
      decPoint: '.',
    }
    const measureControl = new window.L.Control.Measure(options)
    measureControl.addTo(leaflet.map)
  }

  render() {
    console.log('MeasureControl rendering')
    return <div style={{ display: 'none' }} />
  }
}

export default enhance(MeasureControl)
