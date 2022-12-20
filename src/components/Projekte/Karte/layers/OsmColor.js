import React from 'react'
import { TileLayer, Pane } from 'react-leaflet'

const OsmColorLayer = () => (
  <Pane className="OsmColor" name="OsmColor" style={{ zIndex: 100 }}>
    <TileLayer
      url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // only loads sporadic, 2018.06.06. Reinstated 2019.09.14 because supports cors
      //url="//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"  // did not work
      //url="//{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"  // did not work
      //url="//tiles.wmflabs.org/osm/{z}/{x}/{y}.png"
      attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
      maxNativeZoom={19}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)

export default OsmColorLayer
