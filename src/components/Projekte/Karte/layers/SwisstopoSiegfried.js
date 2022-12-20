import React from 'react'
import { TileLayer, Pane } from 'react-leaflet'

// https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml

const SwissTopoSiegfriedLayer = () => (
  <Pane
    className="SwisstopoSiegfried"
    name="SwisstopoSiegfried"
    style={{ zIndex: 100 }}
  >
    <TileLayer
      url="//wmts.geo.admin.ch/1.0.0/ch.swisstopo.hiks-siegfried/default/current/3857/{z}/{x}/{y}.png"
      attribution='&copy; <a href="//swisstopo.ch">Swisstopo</a>'
      maxNativeZoom={18}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)

export default SwissTopoSiegfriedLayer
