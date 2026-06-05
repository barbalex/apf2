import { WMSTileLayer } from 'react-leaflet'

// https://wms.zh.ch/FnsPflegevvjZH?SERVICE=WMS&Request=GetCapabilities vor-vergangenes Jahr
// https://wms.zh.ch/FnsPflegevjZH?SERVICE=WMS&Request=GetCapabilities vergangenes Jahr
// https://wms.zh.ch/FnsPflegeajZH?SERVICE=WMS&Request=GetCapabilities aktuelles Jahr
export const ZhPflegeplanAJ = () => (
  <WMSTileLayer
    url="//wms.zh.ch/FnsPflegeajZH"
    layers="FnsPflegeajZH,pflegeplan_uebersicht,pfpl-aktuell,ueberlagerung1-aktuell,ueberlagerung2-aktuell"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)
