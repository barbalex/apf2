import { WMSTileLayer } from 'react-leaflet'

// //wms.zh.ch/FnsLRKZH?SERVICE=WMS&Request=GetCapabilities
export const ZhLrVegKartierungen = () => (
  <WMSTileLayer
    url="//wms.zh.ch/FnsLRKZH"
    layers="FnsLRKZH,uebersicht,wiesen12,trocken11,trocken01-10,trocken00,moore,feucht-11,feucht-01-10,feucht-81-00,feucht-71-80,feucht-61,auen-93"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)
