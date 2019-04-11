import React from 'react'
import { TileLayer } from 'react-leaflet'

const OsmBwLayer = () => (
  <TileLayer
    url="//tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
    attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

export default OsmBwLayer
