import React, { Component, PropTypes } from 'react'
import 'leaflet'
// regular import results in error,
// see: https://github.com/ljagis/leaflet-measure/issues/68
// import 'leaflet-measure'
import '../../../../node_modules/leaflet-measure/dist/leaflet-measure'

class MeasureControl extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    map: PropTypes.object,
  }

  componentDidMount() {
    const { map } = this.props
    const options = {
      primaryLengthUnit: `meters`,
      secondaryLengthUnit: `kilometers`,
      primaryAreaUnit: `sqmeters`,
      secondaryAreaUnit: `hectares`,
      localization: `de`,
      activeColor: `#f45942`,
      completedColor: `#b22c25`,
      thousandsSep: `'`,
      decPoint: `.`,
    }
    const measureControl = new window.L.Control.Measure(options)
    measureControl.addTo(map)
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default MeasureControl
