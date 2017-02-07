// @flow
import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const LichtwaldLayer = () =>
  <WMSTileLayer
    url="//agabriel:4zC6MgjM@maps.zh.ch/wms/FnsLWZH"
    layers="objekte-lichte-waelder-kanton-zuerich"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
  />

export default LichtwaldLayer
