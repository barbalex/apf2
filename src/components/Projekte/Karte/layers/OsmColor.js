import React from 'react'
import { TileLayer } from 'react-leaflet'

const OsmColorLayer = () => (
  <TileLayer
    //url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  // only loads sporadic, 2018.06.06
    //url="//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"  // did not work
    //url="//{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"  // did not work
    url="//tiles.wmflabs.org/osm/{z}/{x}/{y}.png"
    attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
    maxNativeZoom={19}
    minZoom={0}
    maxZoom={22}
  />
)

export default OsmColorLayer
