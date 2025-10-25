import { TileLayer, Pane } from 'react-leaflet'
import styled from '@emotion/styled'

const StyledTileLayer = styled(TileLayer)`
  .leaflet-tile-container {
    filter: grayscale(100%) !important;
  }
`

export const OsmBw = () => (
  <Pane
    className="OsmBw"
    name="OsmBw"
    style={{ zIndex: 100 }}
  >
    <StyledTileLayer
      url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
      maxNativeZoom={19}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)
