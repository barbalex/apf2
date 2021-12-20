import 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
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

const MeasureControl = createControlComponent(
  () => new window.L.Control.Measure(options),
)

export default MeasureControl
