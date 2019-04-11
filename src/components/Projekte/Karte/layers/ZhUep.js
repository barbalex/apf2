import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const UepLayer = () => (
  <WMSTileLayer
    url="//wms.zh.ch/upwms"
    layers="Uebersichtsplan"
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

export default UepLayer
