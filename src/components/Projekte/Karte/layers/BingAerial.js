import React from 'react'
/**
 * loading BingLayer results in error
 * (but not always, only once on notebook)
 * Uncaught TypeError: Super expression must either be null or a function, not object
    at _inherits (react-leaflet-bing.js:106)
    at react-leaflet-bing.js:109
 */
import { BingLayer } from 'react-leaflet-bing-v2'

const bingKey =
  'AjGOtB_ygBplpxXtKiiHtm-GERjSg9TFEoCmuBI_Yz4VWy0unRGUDo9GOZHA46Pf'

const BingAerialLayer = () => (
  <BingLayer bingkey={bingKey} maxNativeZoom={18} minZoom={0} maxZoom={22} />
)

export default BingAerialLayer
