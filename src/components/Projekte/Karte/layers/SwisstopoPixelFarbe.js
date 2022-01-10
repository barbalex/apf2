import React from 'react'
import { TileLayer } from 'react-leaflet'

const SwissTopoPixelFarbeLayer = () => (
  <TileLayer
    url="//wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg"
    attribution='&copy; <a href="//swisstopo.ch">Swisstopo</a>'
    maxNativeZoom={19}
    minZoom={0}
    maxZoom={22}
  />
)

export default SwissTopoPixelFarbeLayer
