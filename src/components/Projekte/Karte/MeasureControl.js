import React, { Component, PropTypes } from 'react'
import 'leaflet'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
// regular import results in error,
// see: https://github.com/ljagis/leaflet-measure/issues/68
// import 'leaflet-measure'
import '../../../../node_modules/leaflet-measure/dist/leaflet-measure'

const enhance = compose(
  getContext({ map: PropTypes.object.isRequired }),
)

class MeasureControl extends Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    const { map } = this.props
    const options = {
      primaryLengthUnit: `meters`,
      secondaryLengthUnit: `kilometers`,
      primaryAreaUnit: `sqmeters`,
      secondaryAreaUnit: `hectares`,
      localization: `de_CH`,
      activeColor: `#f45942`,
      completedColor: `#b22c25`,
      thousandsSep: `'`,
      decPoint: `.`,
    }
    const measureControl = new window.L.Control.Measure(options)
    measureControl.addTo(map)
  }

  render() {
    // console.log(`map:`, this.props.map)
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(MeasureControl)
