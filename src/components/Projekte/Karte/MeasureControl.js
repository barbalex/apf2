import React, { useEffect } from 'react'
import 'leaflet'
import { useLeaflet } from 'react-leaflet'
import 'leaflet-measure'

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

const MeasureControl = () => {
  const { map } = useLeaflet()
  useEffect(() => {
    if (typeof window === 'undefined') return
    const measureControl = new window.L.Control.Measure(options)
    measureControl.addTo(map)
  }, [map])

  return <div style={style} />
}

export default MeasureControl
