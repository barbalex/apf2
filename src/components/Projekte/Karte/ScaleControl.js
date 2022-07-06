// https://github.com/Flexberry/leaflet-switch-scale-control
// but due to semantic ui requirement using this instead:
// https://github.com/victorzinho/leaflet-switch-scale-control
import 'leaflet'
// eslint-disable-next-line no-unused-vars
import SwitchScaleControl from 'leaflet-switch-scale-control'
import { createControlComponent } from '@react-leaflet/core'

const options = {
  position: 'bottomleft', // Leaflet control position.
  dropdownDirection: 'upward', // Specifies direction of dropdown's openning.
  className: 'map-control-scalebar', // Control's wrapper class.
  updateWhenIdle: false, // Control's wrapper class.
  ratio: true, // Flag: whether to display ratio prefix.
  ratioPrefix: '1:', // Ratio prefix text.
  ratioCustomItemText: '1: Massstab tippen...', // Custom ratio text.
  customScaleTitle: 'Задайте свой масштаб и нажмите Enter', // Custom scale title text.
  recalcOnPositionChange: false, // Flag: whether to recalc scale on map position change.
  recalcOnZoomChange: false, // Flag: whether to recalc scale on map zoom change.
  scales: [500, 1000, 2000, 5000, 10000, 25000, 50000, 100000, 200000, 500000], // Array of selectable scales
  roundScales: undefined, // Array of available to display rounded scales
  adjustScales: false, // Flag: whether to adjust custom scale to max of scales
  pixelsInMeterWidth: function () {
    var div = document.createElement('div')
    div.style.cssText =
      'position: absolute;  left: -100%;  top: -100%;  width: 100cm;'
    document.body.appendChild(div)
    var px = div.offsetWidth
    document.body.removeChild(div)
    return px
  },
  getMapWidthForLanInMeters: function (currentLan) {
    return 6378137 * 2 * Math.PI * Math.cos((currentLan * Math.PI) / 180)
  },
  render: function (ratio) {
    return '1 : ' + ratio?.toLocaleString('de-ch')
  },
}

const ScaleControl = createControlComponent(
  () => new window.L.Control.SwitchScaleControl(options),
)

export default ScaleControl
