import { memo } from 'react'
import { WMSTileLayer } from 'react-leaflet'

export const ZhPflegeplan = memo(() => (
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
))
