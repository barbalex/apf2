import { TileLayer, Pane } from 'react-leaflet'

// Pane and TileLayer seem not to accept className from css module, so using global css for OsmBw (inside app.css)
export const OsmBw = () => (
  <Pane
    className="OsmBw"
    name="OsmBw"
    style={{ zIndex: 100 }}
  >
    <TileLayer
      url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
      maxNativeZoom={19}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)
