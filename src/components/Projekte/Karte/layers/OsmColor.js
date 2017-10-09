// @flow
import React from 'react'
import { TileLayer } from 'react-leaflet'

const OsmColorLayer = () => (
  <TileLayer
    url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="&copy; <a href=&quot;//osm.org/copyright&quot;>OpenStreetMap</a>"
    maxNativeZoom="19"
    minZoom="0"
    maxZoom="22"
  />
)

export default OsmColorLayer
