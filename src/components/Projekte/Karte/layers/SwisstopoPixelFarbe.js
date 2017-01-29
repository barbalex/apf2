// @flow
import React from 'react'
import { TileLayer } from 'react-leaflet'

const SwissTopoPixelFarbeLayer = () =>
  <TileLayer
    url="http://wmts10.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg"
    attribution='&copy; <a href="http://swisstopo.ch">Swisstopo</a>'
  />

export default SwissTopoPixelFarbeLayer
