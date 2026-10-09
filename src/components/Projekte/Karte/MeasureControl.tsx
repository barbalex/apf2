import 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-measure'
import type {
  Control as LeafletControl,
  Map as LeafletMap,
  Marker as LeafletMarker,
} from 'leaflet'

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

interface MeasureControlMixin {
  _captureMarker: LeafletMarker
  _map: LeafletMap
}

// the leaflet-measure plugin registers L.Control.Measure without typings
interface MeasurePlugin {
  include: (mixin: Record<string, unknown>) => void
  new (measureOptions: typeof options): LeafletControl
}

// see: https://github.com/ljagis/leaflet-measure/issues/171#issuecomment-1137483548
;(window.L.Control as unknown as { Measure: MeasurePlugin }).Measure.include({
  // set icon on the capture marker
  _setCaptureMarkerIcon: function (this: MeasureControlMixin) {
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

export const MeasureControl = createControlComponent(
  () =>
    new (window.L.Control as unknown as { Measure: MeasurePlugin }).Measure(
      options,
    ),
)
