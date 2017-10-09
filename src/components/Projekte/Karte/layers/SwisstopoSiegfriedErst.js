// @flow
/**
 * unfortunately, this did not work, neither dufour
 */
import React from 'react'
import { TileLayer } from 'react-leaflet'

const SwissTopoSiegfriedErstLayer = () => (
  <TileLayer
    url="//wmts20.geo.admin.ch/1.0.0/ch.swisstopo.hiks-siegfried/default/19260101/3857/{z}/{x}/{y}.png"
    attribution="&copy; <a href=&quot;//swisstopo.ch&quot;>Swisstopo</a>"
  />
)

export default SwissTopoSiegfriedErstLayer
