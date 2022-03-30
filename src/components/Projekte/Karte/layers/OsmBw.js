import React from 'react'
import { TileLayer } from 'react-leaflet'
import styled from 'styled-components'

const StyledTileLayer = styled(TileLayer)`
  .leaflet-tile-container {
    filter: grayscale(100%) !important;
  }
`

const OsmBwLayer = () => (
  <StyledTileLayer
    url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
    maxNativeZoom={19}
    minZoom={0}
    maxZoom={22}
  />
)

export default OsmBwLayer
