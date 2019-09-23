import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const ZhPflegeplanLayer = () => (
  <WMSTileLayer
    url="//wms.zh.ch/FnsPflegeZHWMS"
    layers="pfpl-aktuell,ueberlagerung1-aktuell,ueberlagerung2-aktuell,pfpl-label-aktuell"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

export default ZhPflegeplanLayer
