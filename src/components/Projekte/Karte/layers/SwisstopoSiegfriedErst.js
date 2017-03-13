// @flow
/**
 * unfortunately, this did not work, neither dufour
 */
import React from 'react'
import { TileLayer } from 'react-leaflet'

const SwissTopoSiegfriedErstLayer = () =>
  <TileLayer
    url="//wmts10.geo.admin.ch/1.0.0/ch.swisstopo.hiks-siegfried/default/current/3857/{z}/{x}/{y}.png"
    attribution='&copy; <a href="//swisstopo.ch">Swisstopo</a>'
  />

export default SwissTopoSiegfriedErstLayer
