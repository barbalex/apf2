// @flow
import React from 'react'
import { TileLayer } from 'react-leaflet'

const SwissTopoPixelFarbeLayer = () => (
  <TileLayer
    url="//wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg"
    attribution="&copy; <a href=&quot;//swisstopo.ch&quot;>Swisstopo</a>"
    maxNativeZoom="18"
    minZoom="0"
    maxZoom="22"
  />
)

export default SwissTopoPixelFarbeLayer
