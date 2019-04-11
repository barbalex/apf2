import React, { useEffect } from 'react'
import 'leaflet'
import { withLeaflet } from 'react-leaflet'
// regular import results in error,
// see: https://github.com/ljagis/leaflet-measure/issues/68
// import 'leaflet-measure'
import '../../../../node_modules/leaflet-measure/dist/leaflet-measure'

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
const style = { display: 'none' }

const MeasureControl = ({ leaflet }) => {
  useEffect(() => {
    const measureControl = new window.L.Control.Measure(options)
    measureControl.addTo(leaflet.map)
  }, [])

  return <div style={style} />
}

export default withLeaflet(MeasureControl)
