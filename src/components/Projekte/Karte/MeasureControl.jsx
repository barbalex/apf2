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

// see: https://github.com/ljagis/leaflet-measure/issues/171#issuecomment-1137483548
window.L.Control.Measure.include({
  // set icon on the capture marker
  _setCaptureMarkerIcon: function () {
    // disable autopan
    this._captureMarker.options.autoPanOnFocus = false

    // default function
    this._captureMarker.setIcon(
      window.L.divIcon({
        iconSize: this._map.getSize().multiplyBy(2),
      }),
    )
  },
})

const MeasureControl = createControlComponent(
  () => new window.L.Control.Measure(options),
)

export default MeasureControl
