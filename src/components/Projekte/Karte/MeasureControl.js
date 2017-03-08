import React, { Component, PropTypes } from 'react'
import 'leaflet'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'
// regular import results in error,
// see: https://github.com/ljagis/leaflet-measure/issues/68
// import 'leaflet-measure'
import '../../../../node_modules/leaflet-measure/dist/leaflet-measure'

const enhance = compose(
  inject(`store`),
  observer
)

class MeasureControl extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { map } = this.props.store
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

export default enhance(MeasureControl)
