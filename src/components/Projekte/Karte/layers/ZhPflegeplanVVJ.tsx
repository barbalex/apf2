import { WMSTileLayer } from 'react-leaflet'

// https://wms.zh.ch/FnsPflegevvjZH?SERVICE=WMS&Request=GetCapabilities vor-vergangenes Jahr
// https://wms.zh.ch/FnsPflegevjZH?SERVICE=WMS&Request=GetCapabilities vergangenes Jahr
// https://wms.zh.ch/FnsPflegeajZH?SERVICE=WMS&Request=GetCapabilities aktuelles Jahr
export const ZhPflegeplanVVJ = () => (
  <WMSTileLayer
    url="//wms.zh.ch/FnsPflegevvjZH"
    layers="FnsPflegevvjZH,teilflaechenumrisse-vor-vergangenes,pfpl-vor-vergangenes,ueberlagerung1-vor-vergangenes,ueberlagerung2-vor-vergangenes,umgeb-vor-vergangenes,pfpl-label-vor-vergangenes"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)
