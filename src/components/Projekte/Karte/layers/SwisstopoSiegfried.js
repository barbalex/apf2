import React from 'react'
import { TileLayer } from 'react-leaflet'

const SwissTopoSiegfriedLayer = () => (
  <TileLayer
    url="//wmts20.geo.admin.ch/1.0.0/ch.swisstopo.hiks-siegfried/default/19260101/3857/{z}/{x}/{y}.png"
    attribution='&copy; <a href="//swisstopo.ch">Swisstopo</a>'
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

export default SwissTopoSiegfriedLayer
