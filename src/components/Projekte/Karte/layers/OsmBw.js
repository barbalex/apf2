import React from 'react'
import { TileLayer } from 'react-leaflet'

const OsmBwLayer = () =>
  <TileLayer
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
  />

export default OsmBwLayer
