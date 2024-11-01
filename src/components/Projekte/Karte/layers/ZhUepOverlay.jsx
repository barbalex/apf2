import { memo } from 'react'
import { WMSTileLayer } from 'react-leaflet'

export const ZhUepOverlay = memo(() => (
  <WMSTileLayer
    url="//wms.zh.ch/upwms"
    layers="Uebersichtsplan"
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
))
