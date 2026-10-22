import { WMSTileLayer } from 'react-leaflet'

// //wms.zh.ch/FnsLWZHWMS
// before 2026.10.22 (OGD*ZH services were renamed to *ZHWMS): //wms.zh.ch/FnsLWZH
export const ZhLichteWaelder = () => (
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
