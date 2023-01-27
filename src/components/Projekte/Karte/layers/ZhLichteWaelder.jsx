import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const LichtwaldObjekteLayer = () => (
  <WMSTileLayer
    url="//wms.zh.ch/FnsLWZHWMS"
    layers="objekte-lichte-waelder-kanton-zuerich"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

export default LichtwaldObjekteLayer
